import { useTranslation } from 'react-i18next'
import { NetworkManager } from './components/NetworkManager'
import { BatteryManager } from './components/BatteryManager'
import { DateTimeManager } from './components/DateTimeManager'
import { Toaster } from 'sonner'

function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-transparent w-full font-sans">
      {/* Vertical Side Dock (Right) */}
      <aside className="fixed top-0 right-0 bottom-0 w-max flex flex-col items-end py-2 pr-2 z-50 pointer-events-none">
        <div className="flex flex-col items-end gap-2 w-full pointer-events-auto">
          <DateTimeManager />
          
          <div className="flex flex-col items-stretch gap-3">
            <NetworkManager />
            <BatteryManager />
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
