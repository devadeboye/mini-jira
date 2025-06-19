import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default async function middleware(request: NextRequest) {
	const session = await auth();
	
	// Check if user is authenticated
	const isAuthenticated = !!session?.user;
	
	// Get the pathname
	const { pathname } = request.nextUrl;
	
	// Public paths that don't require authentication
	const isPublicPath = pathname.startsWith("/auth") || pathname === "/";
	
	// If user is not authenticated and trying to access protected route
	if (!isAuthenticated && !isPublicPath) {
		const loginUrl = new URL("/auth/login", request.url);
		loginUrl.searchParams.set("callbackUrl", pathname);
		return NextResponse.redirect(loginUrl);
	}
	
	// If user is authenticated and trying to access auth pages, redirect to projects
	if (isAuthenticated && pathname.startsWith("/auth")) {
		return NextResponse.redirect(new URL("/projects", request.url));
	}
	
	return NextResponse.next();
}

// Specify which paths should be processed by the middleware
export const config = {
	// https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api/auth (auth API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
	],
};
