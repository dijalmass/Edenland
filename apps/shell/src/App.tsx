import { useTranslation } from 'react-i18next'
import { NetworkManager } from './components/NetworkManager'
import { BatteryManager } from './components/BatteryManager'
import { Toaster } from 'sonner'

function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-transparent w-full font-sans">
      {/* Invisible Header Container */}
      <header className="fixed top-0 left-0 right-0 h-12 flex justify-end items-center px-4 z-50">
        <div className="flex items-center gap-2">
          <NetworkManager />
          <BatteryManager />
        </div>
      </header>

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
