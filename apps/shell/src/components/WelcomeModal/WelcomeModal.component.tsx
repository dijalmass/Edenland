import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export const WelcomeModal = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('edenland_welcome_seen');
    if (!hasSeenWelcome) {
      // Pequeno delay para o sistema carregar visualmente antes do modal aparecer
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('edenland_welcome_seen', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-eden-slate/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl text-center"
          >
            <div className="mb-6">
              <div className="w-20 h-20 bg-glory-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-glory-gold/30">
                <span className="text-4xl">🌳</span>
              </div>
              <h2 className="text-3xl font-bold text-eden-light mb-2">
                {t('desktop.title')}
              </h2>
              <p className="text-eden-mist text-lg">
                {t('desktop.subtitle')}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-eden-light/60 text-sm leading-relaxed">
                {t('welcome.description', 'Bem-vindo à sua nova fundação nativa. Um sistema focado em performance, design minimalista e controle total.')}
              </p>
              
              <button
                onClick={handleClose}
                className="w-full py-3 px-6 bg-glory-gold text-eden-dark font-bold rounded-xl hover:bg-glory-gold/90 transition-colors shadow-lg shadow-glory-gold/20"
              >
                {t('welcome.button', 'Começar Jornada')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
