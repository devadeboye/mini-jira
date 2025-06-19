import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that should be accessible without authentication
const publicPaths = ["/auth/login", "/auth/register"];
// Add paths that require authentication but don't need project creation check
const onboardingPaths = ["/onboarding/create-project"];

export function middleware(request: NextRequest) {
	// Temporarily allow all requests
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
