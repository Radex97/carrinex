'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { User } from '@/firebase/firestore'

interface AdminDashboardClientProps {
  user: User
}

const AdminDashboardClient = ({ 
  user
}: AdminDashboardClientProps) => {
  const [activeTab, setActiveTab] = useState('übersicht')

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Plattform Administration</h1>
      
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
                  innerClass="bg-primary"
                  content="Administrator"
                />
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h5 className="font-medium mb-4">Systeminformationen</h5>
            <div>
              <p className="text-sm text-gray-500">Rolle</p>
              <p className="font-medium">{user.role}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h5 className="font-medium mb-4">Aktivität</h5>
            <div>
              <p className="text-sm text-gray-500">Letzte Anmeldung</p>
              <p className="font-medium">Heute</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="p-6">
            <h5 className="font-medium mb-4">Unternehmen</h5>
            <div className="flex justify-between items-center">
              <p className="text-3xl font-semibold">0</p>
              <button 
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Verwalten
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Unternehmen ausstehend</p>
              <p className="font-medium">0</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h5 className="font-medium mb-4">Benutzer</h5>
            <div className="flex justify-between items-center">
              <p className="text-3xl font-semibold">1</p>
              <button 
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Verwalten
              </button>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h5 className="font-medium mb-4">Aufträge</h5>
            <div className="flex justify-between items-center">
              <p className="text-3xl font-semibold">0</p>
              <button 
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Verwalten
              </button>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="mb-6">
        <Card>
          <div className="p-6">
            <h5 className="font-medium mb-4">Ausstehende Genehmigungen</h5>
            <p className="text-gray-500">Keine ausstehenden Genehmigungen.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboardClient 