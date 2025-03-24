import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import DashboardClient from './_components/DashboardClient'
import { getUserById, getCompanyById, getCompanyLocations } from '@/firebase/firestore'

const DashboardPage = async () => {
    // Session prüfen mit der neuen auth()-Funktion aus NextAuth
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

    // Standorte aus der Subkollektion abrufen
    const locations = await getCompanyLocations(user.companyId)

    return (
        <DashboardClient 
            user={user} 
            company={company}
            locations={locations} 
        />
    )
}

export default DashboardPage 