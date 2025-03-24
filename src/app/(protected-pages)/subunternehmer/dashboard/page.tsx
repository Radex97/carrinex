import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getUserById, getCompanyById, getCompanyLocations } from '@/firebase/firestore'
import SubunternehmerDashboardClient from './_components/SubunternehmerDashboardClient'

const SubunternehmerDashboardPage = async () => {
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

    // Prüfen, ob der Benutzer ein Subunternehmer ist
    if (company.type !== 'subunternehmer') {
        // Weiterleitung zum richtigen Dashboard basierend auf dem Unternehmenstyp
        redirect(company.type === 'versender' ? '/versender/dashboard' : '/admin/dashboard')
    }

    // Standorte aus der Subkollektion abrufen
    const locations = await getCompanyLocations(user.companyId)

    return (
        <SubunternehmerDashboardClient 
            user={user} 
            company={company}
            locations={locations} 
        />
    )
}

export default SubunternehmerDashboardPage 