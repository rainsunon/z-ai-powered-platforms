import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create a demo user
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@novastone.com" },
    update: {},
    create: {
      email: "demo@novastone.com",
      name: "Demo User",
      emailVerified: true,
      preferences: {
        theme: "light",
        currency: "USD",
        dateFormat: "MM/DD/YYYY"
      },
      metadata: {
        onboardingCompleted: true
      }
    }
  });

  console.log("✅ Created demo user:", demoUser.email);

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        userId: demoUser.id,
        name: "Acme Corporation",
        email: "billing@acme.com",
        phone: "+1 (555) 123-4567",
        balance: 5000,
        overdue: 0,
        address: {
          street: "123 Business Ave",
          city: "San Francisco",
          state: "CA",
          zip: "94102",
          country: "USA"
        },
        contacts: [
          {
            name: "John Doe",
            email: "john@acme.com",
            phone: "+1 (555) 123-4567",
            role: "Finance Manager"
          }
        ],
        customFields: {
          taxId: "12-3456789",
          industry: "Technology"
        }
      }
    }),
    prisma.customer.create({
      data: {
        userId: demoUser.id,
        name: "Global Tech Solutions",
        email: "accounts@globaltech.io",
        phone: "+1 (555) 987-6543",
        balance: 0,
        overdue: 0,
        address: {
          street: "456 Tech Park",
          city: "Austin",
          state: "TX",
          zip: "78701",
          country: "USA"
        }
      }
    })
  ]);

  console.log(`✅ Created ${customers.length} customers`);

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        userId: demoUser.id,
        name: "IT Consulting Services",
        description: "Professional IT consulting and strategic planning",
        price: 150,
        sellThis: true,
        buyThis: false,
        pricing: {
          hourlyRate: 150,
          minHours: 4,
          currency: "USD"
        },
        categories: ["Services", "Consulting", "IT"]
      }
    }),
    prisma.product.create({
      data: {
        userId: demoUser.id,
        name: "Web Development",
        description: "Custom web application development",
        price: 100,
        sellThis: true,
        buyThis: false,
        pricing: {
          hourlyRate: 100,
          projectRate: 5000,
          currency: "USD"
        },
        categories: ["Services", "Development"]
      }
    }),
    prisma.product.create({
      data: {
        userId: demoUser.id,
        name: "Software License",
        description: "Annual software license subscription",
        price: 999,
        sellThis: true,
        buyThis: true,
        pricing: {
          monthly: 99,
          annual: 999,
          currency: "USD"
        },
        categories: ["Software", "Subscription"]
      }
    })
  ]);

  console.log(`✅ Created ${products.length} products`);

  // Create sample invoices
  const invoices = await Promise.all([
    prisma.invoice.create({
      data: {
        userId: demoUser.id,
        customerId: customers[0].id,
        invoiceNumber: "INV-2026-0001",
        status: "unpaid",
        date: new Date("2026-04-01"),
        dueDate: new Date("2026-05-01"),
        total: 5000,
        amountDue: 5000,
        currency: "USD",
        lineItems: [
          {
            id: "1",
            description: "IT Consulting - April 2026",
            quantity: 20,
            price: 150,
            tax: 0,
            total: 3000
          },
          {
            id: "2",
            description: "Web Development Services",
            quantity: 20,
            price: 100,
            tax: 0,
            total: 2000
          }
        ],
        taxDetails: {
          subtotal: 5000,
          taxRate: 0,
          taxAmount: 0,
          total: 5000
        },
        notes: {
          customerNote: "Thank you for your business!",
          internalNote: "Priority client - follow up in 2 weeks"
        }
      }
    }),
    prisma.invoice.create({
      data: {
        userId: demoUser.id,
        customerId: customers[1].id,
        invoiceNumber: "INV-2026-0002",
        status: "paid",
        date: new Date("2026-03-15"),
        dueDate: new Date("2026-04-15"),
        total: 999,
        amountDue: 0,
        currency: "USD",
        lineItems: [
          {
            id: "1",
            description: "Software License - Annual",
            quantity: 1,
            price: 999,
            tax: 0,
            total: 999
          }
        ],
        payments: [
          {
            date: "2026-03-20",
            amount: 999,
            method: "credit_card",
            transactionId: "txn_abc123"
          }
        ]
      }
    })
  ]);

  console.log(`✅ Created ${invoices.length} invoices`);

  // Create sample sales
  const salesRecords = await Promise.all([
    prisma.sale.create({
      data: {
        userId: demoUser.id,
        customerId: customers[0].id,
        reference: "SLE-001",
        category: "Services",
        status: "unpaid",
        date: new Date("2026-04-10"),
        dueDate: new Date("2026-05-10"),
        amount: 3000,
        currency: "USD",
        lineItems: [
          {
            id: "1",
            description: "Consulting Services - Q2",
            quantity: 20,
            unitPrice: 150
          }
        ],
        paymentTerms: {
          terms: "Net 30",
          lateFee: "1.5% per month"
        }
      }
    })
  ]);

  console.log(`✅ Created ${salesRecords.length} sales`);

  // Create sample transactions
  const transactionsData = await Promise.all([
    prisma.transaction.create({
      data: {
        userId: demoUser.id,
        type: "income",
        category: "Sales Revenue",
        amount: 999,
        currency: "USD",
        date: new Date("2026-03-20"),
        description: "Payment received from Global Tech Solutions",
        relatedTo: {
          type: "invoice",
          id: invoices[1].id,
          reference: invoices[1].invoiceNumber
        },
        tags: ["paid", "software", "license"]
      }
    }),
    prisma.transaction.create({
      data: {
        userId: demoUser.id,
        type: "expense",
        category: "Office Supplies",
        amount: 250,
        currency: "USD",
        date: new Date("2026-04-05"),
        description: "Office equipment and supplies",
        tags: ["expense", "office"]
      }
    })
  ]);

  console.log(`✅ Created ${transactionsData.length} transactions`);

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
