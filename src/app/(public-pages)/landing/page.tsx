export const dynamic = 'force-static';
export const revalidate = false; // Nie neu validieren, komplett statisch
export const generateStaticParams = () => [];

import Landing from "./components/Landing"

const Page = () => {
    
    return (
        <Landing />
    )
}

export default Page