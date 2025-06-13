import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that should be accessible without authentication
const publicPaths = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
	const token = request.cookies.get("token");
	const { pathname } = request.nextUrl;

	console.log("Middleware - pathname:", pathname, "token:", !!token);

	// Allow access to public paths
	if (publicPaths.includes(pathname)) {
		// If user is already logged in, redirect to scrum projects page
		if (token) {
			console.log(
				"Redirecting logged-in user from auth page to scrum projects"
			);
			return NextResponse.redirect(new URL("/scrum/projects/1", request.url));
		}
		return NextResponse.next();
	}

	// Check if user is authenticated for protected routes
	if (!token) {
		console.log("No token found, redirecting to login");
		const loginUrl = new URL("/auth/login", request.url);
		loginUrl.searchParams.set("redirect", pathname);
		return NextResponse.redirect(loginUrl);
	}

	console.log("Token found, allowing access");
	return NextResponse.next();
}

// Configure which routes should be handled by the middleware
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
