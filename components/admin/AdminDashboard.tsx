'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { DashboardStats } from './DashboardStats'
import { GuestManager } from './GuestManager'
import { SettingsPanel } from './SettingsPanel'
import { QRScannerModal } from './QRScannerModal'

type Tab = 'dashboard' | 'guests' | 'settings' | 'scanner'

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [showScanner, setShowScanner] = useState(false)

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'guests', label: 'Tamu', icon: '👥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'scanner', label: 'QR Scan', icon: '📷' },
  ]

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header */}
      <header className="bg-netflix-dark border-b border-netflix-gray/30 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black text-netflix-red">N</h1>
          <span className="text-sm text-netflix-light/50">Admin Panel</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="text-sm text-netflix-light/50 hover:text-white transition-colors"
        >
          Logout
        </button>
      </header>

      {/* Navigation */}
      <nav className="bg-netflix-dark/50 border-b border-netflix-gray/20 px-4 md:px-8">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'scanner') {
                  setShowScanner(true)
                } else {
                  setActiveTab(tab.id)
                }
              }}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-netflix-red text-white'
                  : 'border-transparent text-netflix-light/50 hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="p-4 md:p-8">
        {activeTab === 'dashboard' && <DashboardStats />}
        {activeTab === 'guests' && <GuestManager />}
        {activeTab === 'settings' && <SettingsPanel />}
      </main>

      {/* QR Scanner Modal */}
      {showScanner && <QRScannerModal onClose={() => setShowScanner(false)} />}
    </div>
  )
}
