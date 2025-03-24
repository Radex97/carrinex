import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getUserById, getCompanyById } from '@/firebase/firestore'
import AdminDashboardClient from './_components/AdminDashboardClient'

const AdminDashboardPage = async () => {
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
    if (user.role !== 'admin') {
        // Wenn kein Admin, zum passenden Dashboard weiterleiten
        if (user.companyId) {
            const company = await getCompanyById(user.companyId)
            if (company) {
                redirect(company.type === 'versender' ? '/versender/dashboard' : '/subunternehmer/dashboard')
            }
        }
        redirect('/onboarding') // Fallback, wenn kein Unternehmen zugeordnet ist
    }

    return (
        <AdminDashboardClient 
            user={user}
        />
    )
}

export default AdminDashboardPage 