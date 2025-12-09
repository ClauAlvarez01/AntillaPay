import React, { useState } from 'react';
import HeroGradient from '../components/home/HeroGradient';
import ModularProducts from '../components/home/ModularProducts';
import ProductsCarousel from '../components/home/ProductsCarousel';
import PaymentsShowcase from '../components/home/PaymentsShowcase';
import BillingShowcase from '../components/home/BillingShowcase';
import ConnectShowcase from '../components/home/ConnectShowcase';
import IssuingShowcase from '../components/home/IssuingShowcase';
import GlobalScale from '../components/home/GlobalScale';
import UseCasesCarousel from '../components/home/UseCasesCarousel';
import DeveloperAPISection from '../components/home/DeveloperAPISection';
import DevelopersSection from '../components/home/DevelopersSection';
import LowCodeSection from '../components/home/LowCodeSection';
import FinalCTA from '../components/home/FinalCTA';
import LoginModal from '../components/header/LoginModal';

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200/60 via-blue-200/50 to-cyan-100/60">
      <div className="section-spacing">
        <HeroGradient onLoginClick={() => setShowLoginModal(true)} />
      </div>
      <div className="section-spacing">
        <ModularProducts />
      </div>
      <div className="section-spacing">
        <ProductsCarousel />
      </div>
      <div className="section-spacing">
        <PaymentsShowcase onLoginClick={() => setShowLoginModal(true)} />
      </div>
      {/* <div className="section-spacing">
        <BillingShowcase onLoginClick={() => setShowLoginModal(true)} />
      </div> */}
      <div className="section-spacing">
        <ConnectShowcase onLoginClick={() => setShowLoginModal(true)} />
      </div>
      <div className="section-spacing">
        <IssuingShowcase onLoginClick={() => setShowLoginModal(true)} />
      </div>
      <div className="section-spacing">
        <GlobalScale />
      </div>
      <div className="section-spacing">
        <UseCasesCarousel />
      </div>
      <div className="section-spacing">
        <DeveloperAPISection />
      </div>
      <div className="section-spacing">
        <LowCodeSection />
      </div>
      <div className="section-spacing">
        <FinalCTA onLoginClick={() => setShowLoginModal(true)} />
      </div>
      
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}
