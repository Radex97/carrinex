'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { 
  CompanyLocation, 
  Company, 
  User
} from '@/firebase/firestore'

interface DashboardClientProps {
  user: User
  company: Company
  locations: CompanyLocation[]
}

const DashboardClient = ({ 
  user, 
  company, 
  locations 
}: DashboardClientProps) => {
  const [activeTab, setActiveTab] = useState('übersicht')

  // Prüfen, ob das Unternehmen bereits genehmigt wurde
  const isApproved = company.isApproved

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {!isApproved && (
        <Card className="mb-6 border-l-4 border-yellow-400">
          <div className="p-4">
            <div className="flex items-center">
              <span className="mr-3 text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </span>
              <div>
                <h5 className="font-medium">Genehmigung ausstehend</h5>
                <p className="text-sm text-gray-500">
                  Dein Unternehmen wird derzeit überprüft. Einige Funktionen stehen dir erst nach Genehmigung zur Verfügung.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <Avatar 
                size={60} 
                shape="circle" 
                className="mr-4" 
              />
              <div>
                <h5 className="font-medium">{user.displayName}</h5>
                <p className="text-sm text-gray-500">{user.email}</p>
                <Badge 
                  className="mt-1" 
                  innerClass={isApproved ? "bg-success" : "bg-warning"}
                  content={isApproved ? 'Genehmigt' : 'Ausstehend'}
                />
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h5 className="font-medium mb-4">Unternehmensinformationen</h5>
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{company.name}</p>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-500">Typ</p>
              <p className="font-medium">
                {company.type === 'subunternehmer' ? 'Subunternehmer' : 'Versender'}
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h5 className="font-medium mb-4">Kontaktinformationen</h5>
            <div>
              <p className="text-sm text-gray-500">USt-IdNr.</p>
              <p className="font-medium">{company.contactInfo.vatId}</p>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-500">Telefon</p>
              <p className="font-medium">{company.contactInfo.phoneNumber}</p>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-500">E-Mail</p>
              <p className="font-medium">{company.contactInfo.email}</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="mb-6">
        <Card>
          <div className="p-6">
            <h5 className="font-medium mb-4">Standorte</h5>
            
            {locations.length === 0 ? (
              <p className="text-gray-500">Keine Standorte gefunden.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {locations.map((location) => (
                  <div 
                    key={location.id} 
                    className="border rounded-lg p-4 relative"
                  >
                    <div className="flex items-center mb-2">
                      <h6 className="font-medium">{location.name}</h6>
                      {location.isMain && (
                        <span className="ml-2 px-2 py-0.5 bg-primary-500/10 text-primary-600 text-xs rounded-full">
                          Hauptstandort
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Adresse</p>
                      <p className="font-medium">
                        {location.address.street}, {location.address.zip} {location.address.city}, {location.address.country}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
      
      {company.type === 'subunternehmer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <div className="p-6">
              <h5 className="font-medium mb-4">Fahrzeugtypen</h5>
              <div className="flex flex-wrap gap-2">
                {'vehicleTypes' in company ? company.vehicleTypes.map((type, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                  >
                    {type}
                  </span>
                )) : <p className="text-gray-500">Keine Fahrzeugtypen definiert</p>}
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-6">
              <h5 className="font-medium mb-4">Servicegebiete</h5>
              <div className="flex flex-wrap gap-2">
                {'serviceAreas' in company ? company.serviceAreas.map((area, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                  >
                    {area}
                  </span>
                )) : <p className="text-gray-500">Keine Servicegebiete definiert</p>}
              </div>
            </div>
          </Card>
        </div>
      )}
      
      {company.type === 'versender' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <div className="p-6">
              <h5 className="font-medium mb-4">Branche</h5>
              <p className="font-medium">
                {'industry' in company ? company.industry : 'Keine Branche definiert'}
              </p>
            </div>
          </Card>
          
          <Card>
            <div className="p-6">
              <h5 className="font-medium mb-4">Bevorzugte Frachtarten</h5>
              <div className="flex flex-wrap gap-2">
                {'preferredCargoTypes' in company ? company.preferredCargoTypes.map((type, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                  >
                    {type}
                  </span>
                )) : <p className="text-gray-500">Keine bevorzugten Frachtarten definiert</p>}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default DashboardClient 