import { NetworkManager } from './components/NetworkManager'
import { AudioManager } from './components/AudioManager'
import { BatteryManager } from './components/BatteryManager'
import { DisplayManager } from './components/DisplayManager'
import { DateTimeManager } from './components/DateTimeManager'
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
      className="relative min-h-screen w-full font-sans bg-cover bg-center bg-no-repeat transition-all duration-700"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <WelcomeModal />
      {/* Overlay leve para garantir contraste se necessário */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      {/* Vertical Side Dock (Right) */}
      <aside className="fixed top-0 right-0 bottom-0 w-max flex flex-col items-end py-2 pr-2 z-50 pointer-events-none">
        <div className="flex flex-col items-end gap-2 w-full pointer-events-auto h-full">
          <DateTimeManager />
          
          <div className="flex flex-col items-stretch gap-3 flex-1">
            <NetworkManager />
            <AudioManager />
            <BatteryManager />
            <DisplayManager />
          </div>

          <div className="mt-auto pt-2">
            <UserManager />
          </div>
        </div>
      </aside>

      {/* Conteúdo Central do Desktop (Limpo) */}
      <main className="pt-16 px-8 flex flex-col items-center justify-center min-h-screen pointer-events-none">
        {/* Espaço reservado para widgets futuros ou apenas desktop limpo */}
      </main>
      <Toaster richColors position="top-right" closeButton />
    </div>
  )
}

export default App
