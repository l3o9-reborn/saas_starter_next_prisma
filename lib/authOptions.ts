import { NextAuthOptions} from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import Facebook from "next-auth/providers/facebook"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { compare } from "bcrypt"
import {prisma} from '@/lib/prisma'


export const authOptions: NextAuthOptions ={
    adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt"},
    pages:{
        signIn: "/login"
    },
    providers:[
        //local credentials
        Credentials({
            name: 'Credentials',
            credentials:{
                email: {label: 'Email', type:'Email'},
                password:{label: 'Password', type: 'Password'}
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password)
                    return null
                const user= await prisma.user.findUnique({
                    where:{email:credentials.email}
                })
                if(!user?.password) return null
                if (!user.emailVerified) {
                /* 👇 Custom error string we check on the client */
                throw new Error("EmailNotVerified")
                }
                const match = await compare(credentials.password, user.password)
                if(!match) return null

                return user

            }
        }),

        //Google 
        Google({
                 clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),

        //GitHub

        Github({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        }),

        //Facebook

        Facebook({
             clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!
        })


    ],
   callbacks: {
        async jwt({ token, user }) {
            if (user) {
            token.sub = user.id;
            token.role = user.role;
            token.stripeSubscriptionId = user.stripeSubscriptionId;
            token.stripeCustomerId = user.stripeCustomerId;
            token.subscriptionStatus = user.subscriptionStatus;
            token.subscriptionPlanId = user.subscriptionPlanId;
            }
            else{
                const dbUser = await prisma.user.findUnique({
                                    where: { id: token.sub as string },
                                })
                if (dbUser) {
                    token.role = dbUser.role;
                    token.stripeSubscriptionId = dbUser.stripeSubscriptionId;
                    token.stripeCustomerId = dbUser.stripeCustomerId;
                    token.subscriptionStatus = dbUser.subscriptionStatus;
                    token.subscriptionPlanId = dbUser.subscriptionPlanId;
                }
            }
            return token;
        },
        async session({ session, token }) {
            // console.log("session callback token:", token);
            if (session.user) {
            session.user.id = token.sub as string;
            session.user.role = token.role as "USER" | "ADMIN";
            session.user.stripeSubscriptionId = token.stripeSubscriptionId as string | null;
            session.user.stripeCustomerId = token.stripeCustomerId as string | null;
            session.user.subscriptionStatus = token.subscriptionStatus as string | null;
            session.user.subscriptionPlanId = token.subscriptionPlanId as string | null;
            }
            // console.log("session callback session.user:", session.user)
            return session;
        }
    }
}