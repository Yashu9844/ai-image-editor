import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { env } from "~/env";
import { db } from "~/server/db";

const polarClient = new Polar({
    accessToken: env.POLAR_ACCESS_TOKEN, // Use env object instead of process.env
    server: 'sandbox'
});


export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [
        "http://localhost:3000",
        "https://localhost:3000",
        process.env.BETTER_AUTH_URL,
        process.env.TUNNEL_URL,
        process.env.PUBLIC_URL,
        "https://2b0a32628d1c3b86f0de77e994253e60.serveo.net", // Your current Serveo URL
    ].filter(Boolean),
    emailAndPassword: {
    enabled: true, 
  }, 
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string, 
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    }, 
  }, 
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "905bddb0-aa28-41aa-9527-1eeb4171baa2",
              slug: "small",
            },
            {
              productId: "1e7cc0ca-9a73-454b-812e-cfe29ef296ff",
              slug: "medium",
            },
            {
              productId: "905bddb0-aa28-41aa-9527-1eeb4171baa2",
              slug: "large",
            },
          ],
          successUrl: "/dashboard",
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
          onOrderPaid: async (order) => {
            const externalCustomerId = order.data.customer.externalId;

            if (!externalCustomerId) {
              console.error("No external customer ID found.");
              throw new Error("No external customer id found.");
            }

            const productId = order.data.productId;

            let creditsToAdd = 0;

            switch (productId) {
              case "905bddb0-aa28-41aa-9527-1eeb4171baa2":
                creditsToAdd = 50;
                break;
              case "1e7cc0ca-9a73-454b-812e-cfe29ef296ff":
                creditsToAdd = 200;
                break;
              case "905bddb0-aa28-41aa-9527-1eeb4171baa2":
                creditsToAdd = 400;
                break;
            }

            await db.user.update({
              where: { id: externalCustomerId },
              data: {
                credits: {
                  increment: creditsToAdd,
                },
              },
            });
          },
        }),
      ],
    }),
  ],
});