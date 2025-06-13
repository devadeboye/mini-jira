import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that should be accessible without authentication
const publicPaths = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
	const token = request.cookies.get("token");
	const { pathname } = request.nextUrl;

	// Allow access to public paths
	if (publicPaths.includes(pathname)) {
		// If user is already logged in, redirect to projects page
		if (token) {
			return NextResponse.redirect(new URL("/projects", request.url));
		}
		return NextResponse.next();
	}

	// Check if user is authenticated for protected routes
	if (!token) {
		const loginUrl = new URL("/auth/login", request.url);
		loginUrl.searchParams.set("redirect", pathname);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

// Configure which routes should be handled by the middleware
export const config = {
	matcher: ["/projects/:path*", "/auth/:path*"],
};
