export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate at most every hour

import Landing from "./components/Landing"

const Page = () => {
    
    return (
        <Landing />
    )
}

export default Page