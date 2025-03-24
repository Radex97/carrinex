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

// Erstellen expliziter Arrays für public/auth Routen für einfacheres Debugging
const publicRoutes = Object.entries(_publicRoutes).map(([key]) => key)
const authRoutes = Object.entries(_authRoutes).map(([key]) => key)

const apiAuthPrefix = `${appConfig.apiPrefix}/auth`

// Öffentliche Routen explizit definieren, um Weiterleitungsschleifen zu vermeiden
const ALWAYS_PUBLIC_ROUTES = ['/', '/access-denied']

export default auth((req) => {
    const { nextUrl } = req
    const pathname = nextUrl.pathname
    
    // Debug-Logging (nur für Entwicklung)
    console.log('Middleware check for path:', pathname)
    
    // Überprüfen, ob die Route immer öffentlich ist (inkl. Root-Pfad)
    if (ALWAYS_PUBLIC_ROUTES.includes(pathname)) {
        console.log('Always public route, skipping auth check:', pathname)
        return; // Erlaube direkten Zugriff ohne weitere Prüfungen
    }
    
    // Prüfen auf statische Ressourcen und Assets
    if (pathname.includes('/_next/') || 
        pathname.includes('/img/') || 
        pathname.includes('/images/') || 
        pathname.includes('/assets/') || 
        pathname.endsWith('.ico') || 
        pathname.endsWith('.png') || 
        pathname.endsWith('.jpg') || 
        pathname.endsWith('.svg')) {
        console.log('Static resource, skipping auth check:', pathname)
        return; // Statische Ressourcen immer zulassen
    }
    
    const isSignedIn = !!req.auth
    const isApiAuthRoute = pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(pathname)
    const isAuthRoute = authRoutes.includes(pathname)
    const isOnboardingRoute = pathname === '/onboarding' || pathname.startsWith('/onboarding/')
    
    console.log('Route checks:', {
        isSignedIn,
        isPublicRoute,
        isAuthRoute,
        isOnboardingRoute
    })

    /** Skip auth middleware for api routes */
    if (isApiAuthRoute) {
        console.log('API auth route, skipping checks')
        return
    }

    // Spezielle Behandlung für Onboarding - muss angemeldet sein, aber wird nicht weitergeleitet
    if (isOnboardingRoute) {
        if (!isSignedIn) {
            console.log('Unauthenticated user trying to access onboarding, redirecting to sign-in')
            return Response.redirect(
                new URL(
                    `${appConfig.unAuthenticatedEntryPath}?${REDIRECT_URL_KEY}=${pathname}`,
                    nextUrl,
                ),
            )
        }
        console.log('Authenticated user accessing onboarding, allowing')
        return
    }

    // Normale Auth-Routen Behandlung
    if (isAuthRoute) {
        if (isSignedIn) {
            /** Nicht weiterleiten, wenn der Benutzer zum Onboarding gehen möchte */
            console.log('Signed in user accessing auth route, redirecting to:', appConfig.authenticatedEntryPath)
            return Response.redirect(
                new URL(appConfig.authenticatedEntryPath, nextUrl),
            )
        }
        console.log('Unauthenticated user accessing auth route, allowing')
        return
    }

    /** Redirect to sign-in if not signed in & path is not public route */
    if (!isSignedIn && !isPublicRoute) {
        let callbackUrl = pathname
        if (nextUrl.search) {
            callbackUrl += nextUrl.search
        }

        console.log('Unauthenticated user accessing protected route, redirecting to sign-in')
        return Response.redirect(
            new URL(
                `${appConfig.unAuthenticatedEntryPath}?${REDIRECT_URL_KEY}=${callbackUrl}`,
                nextUrl,
            ),
        )
    }

    /** Role based access control - nur für geschützte Routen */
    if (isSignedIn && !isPublicRoute && !isOnboardingRoute && pathname !== '/access-denied') {
        const routeMeta = protectedRoutes[pathname]
        
        // Wenn die Route Berechtigungen hat und diese nicht leer sind
        if (routeMeta?.authority && routeMeta.authority.length > 0) {
            // Prüfen, ob der Benutzer die erforderliche Rolle hat
            const userRoles = req.auth?.user?.authority || []
            const hasRequiredRole = routeMeta.authority.some(role => 
                userRoles.includes(role)
            )
            
            if (!hasRequiredRole) {
                console.log('User lacks required role, redirecting to access-denied')
                return Response.redirect(
                    new URL('/access-denied', nextUrl),
                )
            }
        }
    }
    
    console.log('Middleware check complete, proceeding with request')
})

export const config = {
    // Optimierter Matcher: Ignoriert mehr statische Assets und verbessert die Leistung
    matcher: [
        // Alle Pfade außer statische Assets, die wir manuell in der Middleware behandeln werden
        "/((?!_next/static).*)",
    ],
}
