// Statische Konfiguration, um Middleware-Probleme zu vermeiden
export const dynamic = 'force-static';
export const revalidate = false;

import { redirect } from 'next/navigation'

const Page = () => {
    // Server-seitige Weiterleitung zur Landing Page
    redirect('/')
}

export default Page
