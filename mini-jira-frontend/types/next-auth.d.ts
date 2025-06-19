import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session extends DefaultSession {
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
        } & DefaultSession["user"]
    }

    interface User {
        id: string;
        email: string;
        name: string;
        accessToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        email: string;
        name: string;
        accessToken: string;
    }
} 