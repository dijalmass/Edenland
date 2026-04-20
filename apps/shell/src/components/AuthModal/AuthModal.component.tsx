import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, X } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useTranslation } from 'react-i18next';

export const AuthModal: React.FC = () => {
  const { isOpen, close, confirm } = useAuth();
  const { t } = useTranslation();
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      confirm(password);
      setPassword('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-eden-slate/80 backdrop-blur-xl border border-eden-mist/30 rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-glory-gold/10 rounded-lg border border-glory-gold/20">
                    <ShieldCheck className="w-5 h-5 text-glory-gold" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-eden-light">Autenticação Requerida</h2>
                    <p className="text-sm text-eden-mist">Privilégios de superusuário necessários</p>
                  </div>
                </div>
                <button 
                  onClick={close}
                  className="p-1.5 hover:bg-white/5 rounded-full transition-colors text-eden-mist hover:text-eden-light"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-eden-mist uppercase tracking-wider ml-1">
                    Senha do Administrador
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-eden-mist group-focus-within:text-glory-gold transition-colors" />
                    </div>
                    <input
                      type="password"
                      autoFocus
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-eden-dark/50 border border-eden-mist/20 rounded-xl py-3 pl-10 pr-4 text-eden-light focus:outline-none focus:border-glory-gold/50 focus:ring-4 focus:ring-glory-gold/5 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={close}
                    className="flex-1 py-3 px-4 rounded-xl border border-eden-mist/20 text-eden-light font-medium hover:bg-white/5 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!password}
                    className="flex-1 py-3 px-4 rounded-xl bg-glory-gold text-eden-dark font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all disabled:opacity-50 disabled:shadow-none"
                  >
                    Confirmar
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom Accent Line */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-glory-gold/40 to-transparent" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
