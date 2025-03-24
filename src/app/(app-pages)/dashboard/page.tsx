import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import DashboardClient from './_components/DashboardClient'
import { getUserById, getCompanyById, getCompanyLocations } from '@/firebase/firestore'

const DashboardPage = async () => {
    // Session prüfen
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect('/sign-in')
    }

    // Benutzer aus Firestore abrufen
    const userEmail = session.user?.email
    if (!userEmail) {
        console.error('Keine Benutzer-Email in der Session gefunden')
        redirect('/sign-in')
    }
    
    // Benutzer nach ID oder Email abrufen (je nach implementierten Funktionen)
    const user = await getUserById(session.user.id)
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