import { NetworkManager } from './components/NetworkManager'
import { AudioManager } from './components/AudioManager'
import { BatteryManager } from './components/BatteryManager'
import { DisplayManager } from './components/DisplayManager'
import { Header } from './components/Header/Header'
import { WelcomeModal } from './components/WelcomeModal'
import { Toaster } from 'sonner'
import wallpaper from './assets/wallpapers/default.png'
import { UserManager } from './components/UserManager'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    const savedColor = localStorage.getItem('edenland-accent-color');
    if (savedColor) {
      document.documentElement.style.setProperty('--color-glory-gold', savedColor);
    }
  }, []);

  return (
    <div 
      className="relative min-h-screen w-full font-sans bg-cover bg-center bg-no-repeat transition-all duration-700 overflow-hidden"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      {/* Header Unificado (justify-between: Workspaces e Data) - Floating */}
      <Header />
      
      <WelcomeModal />

      {/* Overlay leve para contraste (Flutuante) */}
      <div className="absolute inset-0 bg-black/15 pointer-events-none" />

      {/* Vertical Side Dock (Right) - Floating Style - Abaixo do Header */}
      <aside className="fixed top-10 right-0 bottom-0 w-max flex flex-col items-end py-4 pr-3 z-50 pointer-events-none">
        <div className="flex flex-col items-end gap-1 w-full pointer-events-auto h-full">
          
          {/* Top Icons Section (Stacks vertically) */}
          <div className="flex flex-col items-center gap-2">
            <NetworkManager />
            <AudioManager />
            <BatteryManager />
            <DisplayManager />
          </div>

          {/* Bottom User Section */}
          <div className="mt-auto">
            <UserManager />
          </div>
        </div>
      </aside>

      {/* Desktop Area (Tiling windows space) */}
      <main className="w-full h-screen relative z-0">
        {/* Aqui as janelas do compositor aparecem */}
      </main>

      <Toaster richColors position="top-right" closeButton />
    </div>
  )
}

export default App
