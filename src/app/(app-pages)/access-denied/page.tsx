'use client'

import { Button } from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const AccessDenied = () => {
    const router = useRouter()

    const handleBackToHome = () => {
        router.push('/dashboard')
    }

    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Card className="max-w-md mx-auto p-8 text-center">
                <div className="mb-6">
                    <Image
                        src="/img/others/access-denied.png" 
                        alt="Zugriff verweigert"
                        width={200}
                        height={200}
                        className="mx-auto"
                    />
                </div>
                <h3 className="mb-2">Zugriff verweigert</h3>
                <p className="text-gray-500 mb-6">
                    Sie haben nicht die erforderlichen Berechtigungen, um auf diese Seite zuzugreifen.
                </p>
                <div className="flex justify-center">
                    <Button
                        variant="solid"
                        onClick={handleBackToHome}
                    >
                        Zurück zum Dashboard
                    </Button>
                </div>
            </Card>
        </div>
    )
}

export default AccessDenied 