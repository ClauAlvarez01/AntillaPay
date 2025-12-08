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
    <div className="min-h-screen bg-white">
      <HeroGradient onLoginClick={() => setShowLoginModal(true)} />
      <ModularProducts />
      <ProductsCarousel />
      <PaymentsShowcase onLoginClick={() => setShowLoginModal(true)} />
      {/* <BillingShowcase onLoginClick={() => setShowLoginModal(true)} /> */}
      <ConnectShowcase onLoginClick={() => setShowLoginModal(true)} />
      <IssuingShowcase onLoginClick={() => setShowLoginModal(true)} />
      <GlobalScale />
      <UseCasesCarousel />
      <DeveloperAPISection />
      <LowCodeSection />
      <FinalCTA onLoginClick={() => setShowLoginModal(true)} />
      
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}