import { Hono } from "hono";
import stripe from "../utils/stripe";
import { shouldBeUser } from "../middleware/authMiddleware";
import { CartItemsType } from "@repo/types";
import { getStripeProductPrice } from "../utils/stripeProduct";

const sessionRoute = new Hono();

sessionRoute.post("/create-checkout-session", shouldBeUser, async (c) => {
  const { cart, discountCode }: { cart: CartItemsType; discountCode?: string } = await c.req.json();
  const userId = c.get("userId");

  let lineItems = await Promise.all(
    cart.map(async (item) => {
      const unitAmount = await getStripeProductPrice(item.id);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: unitAmount as number,
        },
        quantity: item.quantity,
      };
    })
  );

  // Apply discount if code is provided
  if (discountCode) {
    try {
      const discountServiceUrl = process.env.DISCOUNT_SERVICE_URL || "http://localhost:3004";
      
      // Calculate discount
      const cartForDiscount = await Promise.all(
        cart.map(async (item) => {
          const unitAmount = await getStripeProductPrice(item.id);
          return {
            id: item.id,
            price: unitAmount as number,
            quantity: item.quantity,
          };
        })
      );

      const calculateResponse = await fetch(`${discountServiceUrl}/api/discount/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: discountCode,
          userId,
          cart: cartForDiscount,
        }),
      });

      if (calculateResponse.ok) {
        const discountData = await calculateResponse.json();
        
        // Update line items with discounted prices
        lineItems = lineItems.map((lineItem, index) => {
          const discountedItem = discountData.discountedItems[index];
          return {
            ...lineItem,
            price_data: {
              ...lineItem.price_data,
              unit_amount: Math.round(discountedItem.discountedPrice),
            },
          };
        });
      }
    } catch (error) {
      console.error("Failed to apply discount:", error);
      // Continue without discount if service fails
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      client_reference_id: userId,
      mode: "payment",
      ui_mode: "custom",
      return_url:
        "http://localhost:3002/return?session_id={CHECKOUT_SESSION_ID}",
    });

    // console.log(session);

    return c.json({ checkoutSessionClientSecret: session.client_secret });
  } catch (error) {
    console.log(error);
    return c.json({ error });
  }
});

sessionRoute.get("/:session_id", async (c) => {
  const { session_id } = c.req.param();
  const session = await stripe.checkout.sessions.retrieve(
    session_id as string,
    {
      expand: ["line_items"],
    }
  );

  // console.log(session);

  return c.json({
    status: session.status,
    paymentStatus: session.payment_status,
  });
});

export default sessionRoute;
