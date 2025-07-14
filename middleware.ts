import {getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedPaths =["/"]

export async function middleware(req: NextRequest){
    const {pathname}= req.nextUrl
    //if not a protected path, continue
    if(!protectedPaths.some((path)=>pathname.startsWith(path)))
        return NextResponse.next()
    //Get JWT token from NextAuth 

    const token = await getToken({req, secret:process.env.NEXTAUTH_SECRET})


    if(!token){
        const loginUrl = new URL("/login", req.url)
        loginUrl.searchParams.set("callbackUrl", req.url)
        return NextResponse.redirect(loginUrl)
    }

    //User is authenticated - continue
    return NextResponse.next()
}

// Specify which paths to run middleware on
export const config = {
  matcher: ["/"],
}