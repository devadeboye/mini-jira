import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that should be accessible without authentication
const publicPaths = ["/auth/login", "/auth/register"];
// Add paths that require authentication but don't need project creation check
const onboardingPaths = ["/onboarding/create-project"];

export function middleware(request: NextRequest) {
	const token = request.cookies.get("token");
	const { pathname } = request.nextUrl;

	console.log("Middleware - pathname:", pathname, "token:", !!token);

	// Allow access to public paths
	if (publicPaths.includes(pathname)) {
		// If user is already logged in, redirect to home page (which will handle proper routing)
		if (token) {
			console.log("Redirecting logged-in user from auth page to home");
			return NextResponse.redirect(new URL("/", request.url));
		}
		return NextResponse.next();
	}

	// Allow access to onboarding paths if authenticated
	if (onboardingPaths.includes(pathname)) {
		if (!token) {
			console.log("No token found for onboarding, redirecting to login");
			const loginUrl = new URL("/auth/login", request.url);
			loginUrl.searchParams.set("redirect", pathname);
			return NextResponse.redirect(loginUrl);
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
