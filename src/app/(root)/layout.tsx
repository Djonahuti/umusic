
import { PlayerProvider } from '@/lib/playerContext'
import ResponsiveLayout from '@/components/ResponsiveLayout'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/lib/AuthContext'


export default function RootLayout({
   children 
}: {
   children: React.ReactNode 
}) { 

  return (
          <AuthProvider>
            <PlayerProvider>
              <ResponsiveLayout>
                {children}
                <Toaster />
              </ResponsiveLayout>
            </PlayerProvider>
          </AuthProvider>
  )
}
