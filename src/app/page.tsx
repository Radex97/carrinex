// Statische Konfiguration für optimale Performance
export const dynamic = 'force-static';
export const revalidate = false;

// Direkt die Landing-Komponente importieren
import Landing from "./(public-pages)/landing/components/Landing"

const Page = () => {
    // Direkt die Landing-Komponente rendern, ohne Weiterleitung
    return <Landing />
}

export default Page
