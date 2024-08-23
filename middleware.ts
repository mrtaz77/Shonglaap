import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, redirectToHome, redirectToLogin } from "next-firebase-auth-edge";
import { clientConfig, serverConfig } from "./config";

const PUBLIC_PATHS = ['/register', '/login'];

export async function middleware(request: NextRequest) {
	return authMiddleware(request, {
		loginPath: "/api/login",
		logoutPath: "/api/logout",
		apiKey: clientConfig.apiKey,
		cookieName: serverConfig.cookieName,
		cookieSignatureKeys: serverConfig.cookieSignatureKeys,
		cookieSerializeOptions: serverConfig.cookieSerializeOptions,
		serviceAccount: serverConfig.serviceAccount,
		handleValidToken: async () => {
			if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
				return redirectToHome(request);
			}

			// Create a new NextResponse and clone the headers from the request
			const response = NextResponse.next();
			request.headers.forEach((value, key) => {
				response.headers.set(key, value);
			});

			return response;
		},
		handleInvalidToken: async (reason) => {
			console.info('Missing or malformed credentials', { reason });

			return redirectToLogin(request, {
				path: '/login',
				publicPaths: PUBLIC_PATHS
			});
		},
		handleError: async (error) => {
			console.error('Unhandled authentication error', { error });

			return redirectToLogin(request, {
				path: '/login',
				publicPaths: PUBLIC_PATHS
			});
		}
	});
}

export const config = {
	matcher: [
		"/",
		"/((?!_next|api|.*\\.).*)",
		"/api/login",
		"/api/logout",
	],
};