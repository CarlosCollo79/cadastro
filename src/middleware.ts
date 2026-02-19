import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/cadastro(.*)', '/meus-dados(.*)']);

export default clerkMiddleware(async (auth, req) => {
    const { sessionClaims } = await auth();
    const url = new URL(req.url);

    if (isProtectedRoute(req)) {
        await auth.protect();
    }

    // Admin protection (authorization)
    if (url.pathname.startsWith('/admin')) {
        const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'default';
        const metadata = sessionClaims?.metadata as { admin_clients?: string[]; role?: string } | undefined;
        const adminClients = metadata?.admin_clients || [];
        const isGlobalAdmin = metadata?.role === 'admin';
        const isTenantAdmin = adminClients.includes(tenantId);

        if (!isGlobalAdmin && !isTenantAdmin) {
            // Redirect unauthorized users away from admin
            return Response.redirect(new URL('/', req.url));
        }
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
