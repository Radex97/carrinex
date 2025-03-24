import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getUserById, getCompanyById } from '@/firebase/firestore'

const DashboardPage = async () => {
    // Session prüfen
    const session = await auth()
    if (!session || !session.user) {
        redirect('/sign-in')
    }

    // Benutzer aus Firestore abrufen
    const userId = session.user.id
    if (!userId) {
        console.error('Keine Benutzer-ID in der Session gefunden')
        redirect('/sign-in')
    }
    
    // Benutzer nach ID abrufen
    const user = await getUserById(userId)
    if (!user) {
        console.error('Benutzer nicht gefunden')
        redirect('/sign-in')
    }

    // Prüfen, ob Benutzer ein Admin ist
    if (user.role === 'admin') {
        redirect('/admin/dashboard')
    }

    // Prüfen, ob Benutzer Onboarding abgeschlossen hat
    if (!user.isOnboarded || !user.companyId) {
        redirect('/onboarding')
    }

    // Unternehmensdaten abrufen
    const company = await getCompanyById(user.companyId)
    if (!company) {
        console.error('Unternehmen nicht gefunden')
        redirect('/error?code=company-not-found')
    }

    // Weiterleitung basierend auf dem Unternehmenstyp
    if (company.type === 'versender') {
        redirect('/versender/dashboard')
    } else if (company.type === 'subunternehmer') {
        redirect('/subunternehmer/dashboard')
    } else {
        // Fallback, falls der Typ unbekannt ist
        redirect('/error?code=unknown-company-type')
    }
}

export default DashboardPage 