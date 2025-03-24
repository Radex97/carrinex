import NextAuth from 'next-auth'

import authConfig from '@/configs/auth.config'
import {
    authRoutes as _authRoutes,
    publicRoutes as _publicRoutes,
    protectedRoutes,
} from '@/configs/routes.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import appConfig from '@/configs/app.config'

const { auth } = NextAuth(authConfig)

const publicRoutes = Object.entries(_publicRoutes).map(([key]) => key)
const authRoutes = Object.entries(_authRoutes).map(([key]) => key)

const apiAuthPrefix = `${appConfig.apiPrefix}/auth`

export default auth((req) => {
    const { nextUrl } = req
    const pathname = nextUrl.pathname
    
    // Schnelle Prüfung für Root-Pfad (Landing Page)
    if (pathname === '/') {
        return; // Erlaube direkten Zugriff ohne weitere Prüfungen
    }
    
    const isSignedIn = !!req.auth
    const isApiAuthRoute = pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(pathname)
    const isAuthRoute = authRoutes.includes(pathname)

    /** Skip auth middleware for api routes */
    if (isApiAuthRoute) return

    if (isAuthRoute) {
        if (isSignedIn) {
            /** Redirect to authenticated entry path if signed in & path is auth route */
            return Response.redirect(
                new URL(appConfig.authenticatedEntryPath, nextUrl),
            )
        }
        return
    }

    /** Redirect to sign-in if not signed in & path is not public route */
    if (!isSignedIn && !isPublicRoute) {
        let callbackUrl = pathname
        if (nextUrl.search) {
            callbackUrl += nextUrl.search
        }

        return Response.redirect(
            new URL(
                `${appConfig.unAuthenticatedEntryPath}?${REDIRECT_URL_KEY}=${callbackUrl}`,
                nextUrl,
            ),
        )
    }

    /** Role based access control - nur für geschützte Routen */
    if (isSignedIn && !isPublicRoute && pathname !== '/access-denied') {
        const routeMeta = protectedRoutes[pathname]
        
        // Wenn die Route Berechtigungen hat und diese nicht leer sind
        if (routeMeta?.authority && routeMeta.authority.length > 0) {
            // Prüfen, ob der Benutzer die erforderliche Rolle hat
            const userRoles = req.auth?.user?.authority || []
            const hasRequiredRole = routeMeta.authority.some(role => 
                userRoles.includes(role)
            )
            
            if (!hasRequiredRole) {
                return Response.redirect(
                    new URL('/access-denied', nextUrl),
                )
            }
        }
    }
})

export const config = {
    // Optimierter Matcher: Ignoriert mehr statische Assets und verbessert die Leistung
    matcher: [
        // Alle Pfade außer:
        "/((?!api|_next/static|_next/image|favicon.ico|images|img|fonts|assets|public).*)", 
        // Aber API-Routen einschließen
        "/api/(.*)"
    ],
}
