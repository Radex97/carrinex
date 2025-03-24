import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const protectedRoutes: Routes = {
    '/dashboard': {
        key: 'dashboard',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: {
                title: 'Dashboard',
                description: 'Willkommen bei Carrinex',
                contained: true,
            },
        },
    },
    '/versender/dashboard': {
        key: 'versender.dashboard',
        authority: ['versender'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: {
                title: 'Versender Dashboard',
                description: 'Verwalten Sie Ihre Aufträge',
                contained: true,
            },
        },
    },
    '/versender/auftraege': {
        key: 'versender.auftraege',
        authority: ['versender'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: {
                title: 'Aufträge',
                description: 'Auftragsübersicht und -verwaltung',
                contained: true,
            },
        },
    },
    '/versender/fahrer': {
        key: 'versender.fahrer',
        authority: ['versender'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: {
                title: 'Fahrer',
                description: 'Fahrerverwaltung',
                contained: true,
            },
        },
    },
    '/subunternehmer/dashboard': {
        key: 'subunternehmer.dashboard',
        authority: ['subunternehmer'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: {
                title: 'Subunternehmer Dashboard',
                description: 'Verwalten Sie Ihre Fahrer und Aufträge',
                contained: true,
            },
        },
    },
    '/subunternehmer/auftraege': {
        key: 'subunternehmer.auftraege',
        authority: ['subunternehmer'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: {
                title: 'Aufträge',
                description: 'Auftragsübersicht und -verwaltung',
                contained: true,
            },
        },
    },
    '/subunternehmer/fahrer': {
        key: 'subunternehmer.fahrer',
        authority: ['subunternehmer'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: {
                title: 'Fahrer',
                description: 'Fahrerverwaltung',
                contained: true,
            },
        },
    },
    '/admin/dashboard': {
        key: 'admin.dashboard',
        authority: ['admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: {
                title: 'Admin Dashboard',
                description: 'Plattformverwaltung',
                contained: true,
            },
        },
    },
    '/admin/unternehmen': {
        key: 'admin.unternehmen',
        authority: ['admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: {
                title: 'Unternehmen',
                description: 'Unternehmensverwaltung',
                contained: true,
            },
        },
    },
    '/admin/benutzer': {
        key: 'admin.benutzer',
        authority: ['admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: {
                title: 'Benutzer',
                description: 'Benutzerverwaltung',
                contained: true,
            },
        },
    },
    '/admin/einstellungen': {
        key: 'admin.einstellungen',
        authority: ['admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: {
                title: 'Einstellungen',
                description: 'Systemeinstellungen',
                contained: true,
            },
        },
    },
    '/profil': {
        key: 'profil',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: {
                title: 'Profil',
                description: 'Ihr Benutzerprofil',
                contained: true,
            },
        },
    },
    '/einstellungen': {
        key: 'einstellungen',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: {
                title: 'Einstellungen',
                description: 'Ihr persönliches Einstellungen',
                contained: true,
            },
        },
    },
}

export const publicRoutes: Routes = {
    '/': {
        key: 'landing',
        authority: [],
        meta: {
            pageBackgroundType: 'default',
            pageContainerType: 'gutterless',
            layout: 'blank',
            header: {
                title: 'Carrinex - Die Plattform für Versender und Subunternehmer',
                description: 'Willkommen bei Carrinex - Ihrer Logistikplattform',
                contained: false,
            },
        },
    },
    '/access-denied': {
        key: 'accessDenied',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
            header: {
                title: 'Zugriff verweigert',
                description: 'Sie haben keine Berechtigung, auf diese Seite zuzugreifen',
                contained: true,
            },
        },
    },
}

export const authRoutes = authRoute
