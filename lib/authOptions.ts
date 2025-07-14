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
    callbacks:{
        async jwt({token, user}){
            if (user) token.sub = user.id
            return token 
        },
        async session ({session , token}){
            
            if (session.user && token.sub) session.user.id = token.sub as string
            return session
        }
    }
}