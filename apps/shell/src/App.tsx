import { useTranslation } from 'react-i18next'
import { NetworkManager } from './components/NetworkManager'
import { BatteryManager } from './components/BatteryManager'
import { DateTimeManager } from './components/DateTimeManager'
import { UserManager } from './components/UserManager'
import { Toaster } from 'sonner'
import wallpaper from './assets/wallpapers/default.png'

function App() {
  const { t } = useTranslation();

  return (
    <div 
      className="relative min-h-screen w-full font-sans bg-cover bg-center bg-no-repeat transition-all duration-700"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      {/* Overlay leve para garantir contraste se necessário */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      {/* Vertical Side Dock (Right) */}
      <aside className="fixed top-0 right-0 bottom-0 w-max flex flex-col items-end py-2 pr-2 z-50 pointer-events-none">
        <div className="flex flex-col items-end gap-2 w-full pointer-events-auto h-full">
          <DateTimeManager />
          
          <div className="flex flex-col items-stretch gap-3 flex-1">
            <NetworkManager />
            <BatteryManager />
          </div>

          <div className="mt-auto pt-2">
            <UserManager />
          </div>
        </div>
      </aside>

      {/* Conteúdo Central do Desktop (Wallpapers, Widgets, etc) */}
      <main className="pt-16 px-8 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-foreground/50 mb-4 select-none">{t('desktop.title')}</h1>
        <p className="text-muted-foreground text-sm select-none">{t('desktop.subtitle')}</p>
      </main>
      <Toaster richColors position="top-right" closeButton />
    </div>
  )
}

export default App
