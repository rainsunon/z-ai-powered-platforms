import { FastifyInstance } from "fastify";
import { Discount } from "../models/Discount.js";
import {
  ValidateDiscountRequest,
  ValidateDiscountResponse,
  CalculateDiscountRequest,
  CalculateDiscountResponse,
  CreateDiscountRequest,
  UpdateDiscountStatusRequest,
} from "@repo/types";
import { isAfter, isBefore } from "date-fns";

export const discountRoute = async (fastify: FastifyInstance) => {
  // POST /create - Create a new discount (Admin only)
  fastify.post("/create", async (request, reply) => {
    const body = request.body as CreateDiscountRequest;

    if(!body) {
      return reply.status(400).send({ error: "Invalid request body" });
    }

    // validate required fields
    if (!body.code || !body.type || body.value === undefined) {
      return reply
        .status(400)
        .send({ error: "code, type, and value are required fields" });
    }

    console.log("Create Discount Request Body:", body);

    try {
      const existingDiscount = await Discount.findOne({ code: body.code });
      if (existingDiscount) {
        return reply.status(400).send({ error: "Discount code already exists" });
      }

      const discount = new Discount({
        code: body.code,
        type: body.type,
        value: body.value,
        isActive: body.isActive ?? true,
        startDate: body.startDate,
        endDate: body.endDate,
        usageLimit: body.usageLimit,
        usedCount: 0,
        minOrderValue: body.minOrderValue,
        applicableProducts: body.applicableProducts,
        applicableUsers: body.applicableUsers,
      });

      await discount.save();
      return reply.status(201).send(discount);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to create discount" });
    }
  });

  // POST /validate - Validate a discount code
  fastify.post("/validate", async (request, reply) => {
    const body = request.body as ValidateDiscountRequest;

    try {
      const discount = await Discount.findOne({ code: body.code });

      if (!discount) {
        return reply.send({
          valid: false,
          message: "Discount code not found",
        } as ValidateDiscountResponse);
      }

      if (!discount.isActive) {
        return reply.send({
          valid: false,
          message: "Discount code is inactive",
        } as ValidateDiscountResponse);
      }

      const now = new Date();
      if (discount.startDate && isBefore(now, discount.startDate)) {
        return reply.send({
          valid: false,
          message: "Discount code is not yet active",
        } as ValidateDiscountResponse);
      }

      if (discount.endDate && isAfter(now, discount.endDate)) {
        return reply.send({
          valid: false,
          message: "Discount code has expired",
        } as ValidateDiscountResponse);
      }

      if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
        return reply.send({
          valid: false,
          message: "Discount code usage limit reached",
        } as ValidateDiscountResponse);
      }

      if (discount.minOrderValue && body.cartTotal < discount.minOrderValue) {
        return reply.send({
          valid: false,
          message: `Minimum order value of ${discount.minOrderValue} required`,
        } as ValidateDiscountResponse);
      }

      if (
        discount.applicableUsers &&
        discount.applicableUsers.length > 0 &&
        body.userId
      ) {
        if (!discount.applicableUsers.includes(body.userId)) {
          return reply.send({
            valid: false,
            message: "Discount code not applicable to this user",
          } as ValidateDiscountResponse);
        }
      }

      if (
        discount.applicableProducts &&
        discount.applicableProducts.length > 0 &&
        body.productIds
      ) {
        const hasApplicableProduct = body.productIds.some((id) =>
          discount.applicableProducts!.includes(id)
        );
        if (!hasApplicableProduct) {
          return reply.send({
            valid: false,
            message: "Discount code not applicable to cart items",
          } as ValidateDiscountResponse);
        }
      }

      return reply.send({
        valid: true,
        discount: discount.toObject(),
      } as ValidateDiscountResponse);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to validate discount" });
    }
  });

  // POST /calculate - Calculate discount for a cart
  fastify.post("/calculate", async (request, reply) => {
    const body = request.body as CalculateDiscountRequest;

    try {
      const discount = await Discount.findOne({ code: body.code });

      if (!discount || !discount.isActive) {
        return reply.status(400).send({ error: "Invalid discount code" });
      }

      const originalTotal = body.cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      let discountAmount = 0;
      const discountedItems = body.cart.map((item) => {
        let itemDiscountAmount = 0;

        // Check if discount applies to this product
        const appliesToProduct =
          !discount.applicableProducts ||
          discount.applicableProducts.length === 0 ||
          discount.applicableProducts.includes(item.id);

        if (appliesToProduct) {
          if (discount.type === "PERCENTAGE") {
            itemDiscountAmount = (item.price * discount.value) / 100;
          } else if (discount.type === "FIXED") {
            // For fixed discounts, distribute proportionally across applicable items
            const applicableItemsTotal = body.cart
              .filter(
                (i) =>
                  !discount.applicableProducts ||
                  discount.applicableProducts.length === 0 ||
                  discount.applicableProducts.includes(i.id)
              )
              .reduce((sum, i) => sum + i.price * i.quantity, 0);

            const itemProportion =
              (item.price * item.quantity) / applicableItemsTotal;
            itemDiscountAmount = (discount.value * itemProportion) / item.quantity;
          }
        }

        const discountedPrice = Math.max(0, item.price - itemDiscountAmount);
        discountAmount += itemDiscountAmount * item.quantity;

        return {
          id: item.id,
          originalPrice: item.price,
          discountedPrice,
          quantity: item.quantity,
        };
      });

      const finalTotal = Math.max(0, originalTotal - discountAmount);

      return reply.send({
        originalTotal,
        discountAmount,
        finalTotal,
        discountedItems,
      } as CalculateDiscountResponse);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to calculate discount" });
    }
  });

  // PATCH /status - Update discount status (Admin only)
  fastify.patch("/status", async (request, reply) => {
    const body = request.body as UpdateDiscountStatusRequest;

    try {
      const discount = await Discount.findOne({ code: body.code });

      if (!discount) {
        return reply.status(404).send({ error: "Discount code not found" });
      }

      discount.isActive = body.isActive;
      await discount.save();

      return reply.send({
        message: "Discount status updated successfully",
        discount: discount.toObject(),
      });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to update discount status" });
    }
  });

  // DELETE /code - Delete a discount (Admin only)
  fastify.delete("/:code", async (request, reply) => {
    const { code } = request.params as { code: string };

    try {
      const discount = await Discount.findOneAndDelete({ code });

      if (!discount) {
        return reply.status(404).send({ error: "Discount code not found" });
      }

      return reply.send({
        message: "Discount deleted successfully",
        code,
      });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to delete discount" });
    }
  });

  // GET /list - List all discounts (Admin only)
  fastify.get("/list", async (request, reply) => {
    try {
      const discounts = await Discount.find().sort({ createdAt: -1 });
      return reply.send(discounts);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to fetch discounts" });
    }
  });
};
