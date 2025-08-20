import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
      stripeSubscriptionId?: string | null;
      stripeCustomerId?: string | null;
      subscriptionStatus?: string | null;
      subscriptionPlanId?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "USER" | "ADMIN";
    stripeSubscriptionId?: string | null;
    stripeCustomerId?: string | null;
    subscriptionStatus?: string | null;
    subscriptionPlanId?: string | null;
  }
}
