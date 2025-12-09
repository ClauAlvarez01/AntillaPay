
import React from 'react';
import { LanguageProvider, useLanguage } from '../components/i18n/LanguageContext';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Toaster } from 'sonner';
import { useLocation } from 'react-router-dom';

function LayoutContent({ children }) {
  const { language } = useLanguage();
  const location = useLocation();

  React.useEffect(() => {
    document.body.setAttribute('lang', language);
  }, [language]);

  // Scroll to top on page navigation
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Scroll to hash targets (e.g. #soluciones-modulares)
  React.useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default function Layout({ children }) {
  return (
    <LanguageProvider>
      <LayoutContent>{children}</LayoutContent>
    </LanguageProvider>
  );
}
