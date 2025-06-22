import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session extends DefaultSession {
        accessToken: string;
        refreshToken: string;
        error?: string;
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
        refreshToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        email: string;
        name: string;
        accessToken: string;
        refreshToken: string;
        accessTokenExpires: number;
        refreshRetryCount?: number;
        error?: string;
    }
} 