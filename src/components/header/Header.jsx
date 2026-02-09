import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, Globe, CreditCard, Receipt, Users, Calculator, Shield, Wallet, Building2, Coins, Zap, Link2, Layers, FileText, Terminal, Smartphone, BookOpen, Code, Package, Lightbulb, FileCode, Headphones, Tag, UserCheck, Mail, Newspaper, Users2, BookMarked, Calendar, Briefcase, Building, Award, ExternalLink, Activity, Flame, BarChart3, Database, Store, Cpu, Palette, Globe2, Plane, Heart, ShoppingBag, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AntillaPayLogo from '../brand/AntillaPayLogo';
import { useLanguage } from '../i18n/LanguageContext';
import { createPageUrl } from '@/utils';

const languageNames = {
  es: 'Español',
  en: 'English',
  'zh-Hans': '简体中文'
};

// Products menu structure like AntillaPay
const productsMenu = {
  sections: [
    {
      title: 'PAGOS INTERNACIONALES',
      items: [
        { name: 'Payments', desc: 'Pagos electrónicos', icon: CreditCard, href: createPageUrl('Payments'), color: 'text-blue-500' },
        { name: 'Terminal', desc: 'Pagos en persona', icon: Smartphone, href: createPageUrl('Terminal'), color: 'text-purple-400' }
      ],
      subItems: [
        { name: 'Payment Links', desc: 'Pagos sin necesidad de programar', href: createPageUrl('PaymentLinks') },
        { name: 'Checkout', desc: 'Formulario de pago prediseñado', href: createPageUrl('Checkout') },
        { name: 'Elements', desc: 'Componentes flexibles de IU', href: createPageUrl('Elements') },
      ]
    },
    {
      title: 'GESTIÓN DEL DINERO',
      items: [
        { name: 'Connect', desc: 'Pagos para plataformas', icon: Users, href: createPageUrl('Connect'), color: 'text-cyan-500' },
        { name: 'Global Payouts', desc: 'Envía dinero a terceros', icon: Globe2, href: createPageUrl('GlobalPayouts'), color: 'text-blue-400' },
        { name: 'Cuentas financieras', desc: 'Gestiona las finanzas empresariales', icon: Building2, href: createPageUrl('FinancialAccounts'), color: 'text-green-500' },
        { name: 'Capital', desc: 'Financiación empresarial', icon: Coins, href: createPageUrl('Capital'), color: 'text-green-400' },
        { name: 'Issuing', desc: 'Tarjetas clásicas y tropicales', icon: Wallet, href: createPageUrl('Issuing'), color: 'text-blue-500' },
      ]
    },
    {
      title: 'PAQUETE DE AUTOMATIZACIÓN CONTABLE',
      items: [
        { name: 'Billing', desc: 'Gestión de suscripciones', icon: Receipt, href: createPageUrl('Billing'), color: 'text-green-500' },
        { name: 'Revenue Recognition', desc: 'Automatización contable', icon: BarChart3, href: createPageUrl('RevenueRecognition'), color: 'text-purple-500' },
        { name: 'AntillaPay Sigma', desc: 'Informes personalizados', icon: Database, href: createPageUrl('Sigma'), color: 'text-purple-400' },
        { name: 'Data Pipeline', desc: 'Sincronización de datos', icon: Layers, href: createPageUrl('DataPipeline'), color: 'text-purple-500' },
        { name: 'Tax', desc: 'Automatiza el imp. sobre las ventas', icon: Calculator, href: createPageUrl('Tax'), color: 'text-orange-500' },
      ],
      subItems: [
        { name: 'Usage-based', desc: 'Facturación por uso', href: createPageUrl('UsageBased') },
        { name: 'Invoicing', desc: 'Únicas o recurrentes', href: createPageUrl('Invoicing') },
      ]
    }
  ],
  sidebar: {
    title: 'MÁS',
    items: [
      { name: 'Métodos de pago', href: createPageUrl('PaymentMethods') },
      { name: 'Link', href: createPageUrl('Link') },
      { name: 'Financial Connections', href: createPageUrl('FinancialConnections') },
      { name: 'Identity', href: createPageUrl('Identity') },
      { name: 'Atlas', href: createPageUrl('Atlas') },
      { name: 'Climate', href: createPageUrl('Climate') },
    ]
  }
};

// Solutions menu
const solutionsMenu = {
  sections: [
    {
      title: 'POR ETAPA',
      items: [
        { name: 'Empresas', icon: Building, href: createPageUrl('Companies'), color: 'text-blue-500' },
        { name: 'Startups', icon: Lightbulb, href: createPageUrl('Solutions'), color: 'text-green-500' },
      ]
    },
    {
      title: 'POR CASO DE USO',
      items: [
        { name: 'Criptomoneda', icon: Coins, href: '#', color: 'text-orange-500' },
        { name: 'E-commerce', icon: ShoppingBag, href: '#', color: 'text-blue-500' },
        { name: 'Finanzas integradas', icon: Building2, href: '#', color: 'text-cyan-500' },
        { name: 'Automatización de finanzas', icon: BarChart3, href: '#', color: 'text-purple-500' },
        { name: 'Empresas internacionales', icon: Globe2, href: '#', color: 'text-indigo-500' },
        { name: 'Pagos en la aplicación', icon: Smartphone, href: '#', color: 'text-pink-500' },
        { name: 'Marketplaces', icon: Store, href: '#', color: 'text-green-500' },
        { name: 'Plataformas', icon: Layers, href: '#', color: 'text-violet-500' },
        { name: 'SaaS', icon: Cpu, href: '#', color: 'text-blue-400' },
      ]
    },
    {
      title: 'POR SECTOR',
      items: [
        { name: 'Empresas de IA', icon: Cpu, href: '#', color: 'text-emerald-500' },
        { name: 'Economía de los creadores', icon: Palette, href: '#', color: 'text-pink-500' },
        { name: 'Hostelería, viajes y ocio', icon: Plane, href: '#', color: 'text-sky-500' },
        { name: 'Seguros', icon: Shield, href: '#', color: 'text-blue-500' },
        { name: 'Medios y entretenimiento', icon: PlayCircle, href: '#', color: 'text-red-500' },
        { name: 'Organizaciones sin fines de lucro', icon: Heart, href: '#', color: 'text-rose-500' },
        { name: 'Minorista', icon: ShoppingBag, href: '#', color: 'text-amber-500' },
      ]
    },
    {
      title: 'ECOSISTEMA',
      items: [
        { name: 'AntillaPay App Marketplace', icon: Store, href: '#', color: 'text-violet-500', external: true },
        { name: 'Socios', icon: Users2, href: '#', color: 'text-blue-500' },
      ]
    }
  ]
};

// Developers menu
const developersMenu = {
  header: {
    title: 'Documentación',
    desc: 'Comienza a integrar los productos y las herramientas de AntillaPay.',
    icon: BookOpen,
    href: createPageUrl('Developers')
  },
  sections: [
    {
      title: 'RECURSOS',
      items: [
        { name: 'Referencia de la API', href: '#' },
        { name: 'Librerías y SDK', href: '#' },
        { name: 'Integraciones de aplicaciones', href: '#' },
        { name: 'Ejemplos de código', href: '#' },
        { name: 'AntillaPay Apps', href: '#' },
      ]
    },
    {
      title: 'GUÍAS',
      items: [
        { name: 'Aceptar pagos electrónicos', href: '#' },
        { name: 'Implementar un proceso de compra prediseñado', href: '#' },
        { name: 'Configurar pagos en persona', href: '#' },
        { name: 'Crear una plataforma o un Marketplace', href: '#' },
        { name: 'Gestionar suscripciones', href: '#' },
        { name: 'Ofrecer cobro por consumo', href: '#' },
      ]
    }
  ],
  footer: [
    { name: 'Estado de la API', icon: Activity, href: '#' },
    { name: 'Blog para desarrolladores', icon: Flame, href: '#' },
  ]
};

// Resources menu
const resourcesMenu = {
  sections: [
    {
      items: [
        { name: 'Centro de soporte', icon: Headphones, href: '#', color: 'text-blue-500' },
        { name: 'Planes de soporte gestionado', icon: Tag, href: '#', color: 'text-blue-400' },
        { name: 'Servicios profesionales', icon: Users2, href: '#', color: 'text-blue-500' },
        { name: 'Contacta con ventas', icon: Mail, href: createPageUrl('Contact'), color: 'text-blue-400' },
      ]
    },
    {
      items: [
        { name: 'Blog', icon: Flame, href: '#', color: 'text-orange-500' },
        { name: 'Historias de clientes', icon: Users2, href: '#', color: 'text-purple-500' },
        { name: 'Guías', icon: BookMarked, href: createPageUrl('Resources'), color: 'text-green-500' },
        { name: 'Conferencia de Sessions', icon: Calendar, href: '#', color: 'text-blue-500' },
      ]
    }
  ],
  footer: [
    { name: 'Empleos', icon: Briefcase, href: createPageUrl('Company') },
    { name: 'Sala de prensa', icon: Newspaper, href: '#' },
    { name: 'AntillaPay Press', icon: BookOpen, href: '#' },
    { name: 'Conviértete en socio', icon: Award, href: '#' },
  ]
};

function MobileMenu({ navItems, productsMenu, solutionsMenu, developersMenu, resourcesMenu, language, languageNames, changeLanguage, navigate, t }) {
  const [expandedSection, setExpandedSection] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    // Use a small timeout to allow the menu to close before navigation
    setTimeout(() => {
      navigate(href);
    }, 100);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="icon" className="rounded-lg">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96 p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <AntillaPayLogo size="default" />
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            {/* Products Section */}
            <div className="mb-3">
              <button
                onClick={() => toggleSection('products')}
                className="w-full flex items-center justify-between px-3 py-2 text-lg font-medium text-gray-900 hover:text-violet-600 rounded-lg transition-colors"
              >
                <span>{t('nav.products')}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === 'products' ? 'rotate-180' : ''}`} />
              </button>
              {expandedSection === 'products' && (
                <div className="mt-2 pl-4 space-y-2">
                  {productsMenu.sections.map((section) => (
                    <div key={section.title} className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">{section.title}</h4>
                      {section.items.map((item) => (
                        item.name === 'Payments' ? (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={(e) => handleLinkClick(e, item.href)}
                            className="flex items-center gap-2 py-2 text-sm text-gray-700 hover:text-violet-600"
                          >
                            {item.icon && <item.icon className={`w-4 h-4 ${item.color}`} />}
                            <span>{item.name}</span>
                          </Link>
                        ) : (
                          <div key={item.name} className="flex items-center gap-2 py-2 text-sm text-gray-500">
                            {item.icon && <item.icon className={`w-4 h-4 ${item.color}`} />}
                            <span>{item.name}</span>
                          </div>
                        )
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Solutions Section */}
            <div className="mb-3">
              <button
                onClick={() => toggleSection('solutions')}
                className="w-full flex items-center justify-between px-3 py-2 text-lg font-medium text-gray-900 hover:text-violet-600 rounded-lg transition-colors"
              >
                <span>{t('nav.solutions')}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === 'solutions' ? 'rotate-180' : ''}`} />
              </button>
              {expandedSection === 'solutions' && (
                <div className="mt-2 pl-4 space-y-2">
                  {solutionsMenu.sections.map((section) => (
                    <div key={section.title} className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">{section.title}</h4>
                      {section.items.map((item) => (
                        item.name === 'Empresas' ? (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={(e) => handleLinkClick(e, item.href)}
                            className="flex items-center gap-2 py-2 text-sm text-gray-700 hover:text-violet-600"
                          >
                            {item.icon && <item.icon className={`w-4 h-4 ${item.color}`} />}
                            <span>{item.name}</span>
                          </Link>
                        ) : (
                          <div key={item.name} className="flex items-center gap-2 py-2 text-sm text-gray-500">
                            {item.icon && <item.icon className={`w-4 h-4 ${item.color}`} />}
                            <span>{item.name}</span>
                          </div>
                        )
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Developers Section */}
            <div className="mb-3">
              <button
                onClick={() => toggleSection('developers')}
                className="w-full flex items-center justify-between px-3 py-2 text-lg font-medium text-gray-900 hover:text-violet-600 rounded-lg transition-colors"
              >
                <span>{t('nav.developers')}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === 'developers' ? 'rotate-180' : ''}`} />
              </button>
              {expandedSection === 'developers' && (
                <div className="mt-2 pl-4 space-y-2">
                  <Link
                    to={developersMenu.header.href}
                    onClick={(e) => handleLinkClick(e, developersMenu.header.href)}
                    className="flex items-center gap-2 py-2 text-sm font-medium text-gray-700 hover:text-violet-600"
                  >
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span>{developersMenu.header.title}</span>
                  </Link>
                  {developersMenu.sections.map((section) => (
                    <div key={section.title} className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">{section.title}</h4>
                      {section.items.map((item) => (
                        item.name === 'Documentación' ? (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={(e) => handleLinkClick(e, item.href)}
                            className="py-1.5 text-sm text-gray-700 hover:text-violet-600 block pl-2"
                          >
                            {item.name}
                          </Link>
                        ) : (
                          <div key={item.name} className="py-1.5 text-sm text-gray-500 pl-2">
                            {item.name}
                          </div>
                        )
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resources Section */}
            <div className="mb-3">
              <button
                onClick={() => toggleSection('resources')}
                className="w-full flex items-center justify-between px-3 py-2 text-lg font-medium text-gray-900 hover:text-violet-600 rounded-lg transition-colors"
              >
                <span>{t('nav.resources')}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              {expandedSection === 'resources' && (
                <div className="mt-2 pl-4 space-y-2">
                  {resourcesMenu.sections.map((section, idx) => (
                    <div key={idx} className="mb-3">
                      {section.items.map((item) => {
                        const isClickable = item.name === 'Guías' || item.name === 'Contacta con ventas';
                        return isClickable ? (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={(e) => handleLinkClick(e, item.href)}
                            className="flex items-center gap-2 py-2 text-sm text-gray-700 hover:text-violet-600"
                          >
                            {item.icon && <item.icon className={`w-4 h-4 ${item.color}`} />}
                            <span>{item.name}</span>
                          </Link>
                        ) : (
                          <div key={item.name} className="flex items-center gap-2 py-2 text-sm text-gray-500">
                            {item.icon && <item.icon className={`w-4 h-4 ${item.color}`} />}
                            <span>{item.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="mb-3">
              <Link
                to={createPageUrl('Pricing')}
                onClick={(e) => handleLinkClick(e, createPageUrl('Pricing'))}
                className="block px-3 py-2 text-lg font-medium text-gray-900 hover:text-violet-600 rounded-lg transition-colors"
              >
                {t('nav.pricing')}
              </Link>
            </div>
          </nav>
          <div className="p-4 border-t space-y-3">
            <div className="flex gap-2 justify-center">
              {Object.entries(languageNames).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => changeLanguage(code)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    language === code 
                      ? 'bg-violet-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            <Button 
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => navigate(createPageUrl('Contact')), 100);
              }}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
            >
              {t('nav.contactSales')}
            </Button>
            <Button 
              onClick={() => navigate('/login')}
              variant="outline" 
              className="w-full rounded-lg"
            >
              {t('nav.login')}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MegaMenu({ isOpen, menuType, onClose }) {
  if (!isOpen) return null;

  const renderProductsMenu = () => (
          <div className="flex">
            {/* Main content */}
            <div className="flex-1 p-6">
              {/* First row - Pagos internacionales */}
              <div className="mb-5">
                <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">{productsMenu.sections[0].title}</h4>
                <div className="grid grid-cols-2 gap-x-8">
                  <div className="space-y-1">
                    {productsMenu.sections[0].items.map((item) => (
                      <div 
                        key={item.name}
                        className={`flex items-start gap-3 py-2 rounded transition-colors ${item.name === 'Payments' ? 'hover:bg-gray-50' : ''}`}
                      >
                        {item.icon && <item.icon className={`w-5 h-5 mt-0.5 ${item.color}`} />}
                        <div>
                          {item.name === 'Payments' ? (
                            <Link
                              to={item.href}
                              onClick={onClose}
                              className="text-sm font-medium text-gray-900 hover:text-violet-600"
                            >
                              {item.name}
                            </Link>
                          ) : (
                            <span className="text-sm font-medium text-gray-900">{item.name}</span>
                          )}
                          {item.desc && <p className="text-xs text-gray-500">{item.desc}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-0.5 pt-2">
                    {productsMenu.sections[0].subItems?.map((sub) => (
                      <div key={sub.name} className="block py-1 text-sm text-gray-600">
                        <span className="text-gray-400 mr-1.5">•</span>
                        {sub.name} 
                        <span className="text-gray-400 text-xs"> · {sub.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Second row - Gestión del dinero */}
              <div className="mb-5 pt-4 border-t border-gray-100">
                <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">{productsMenu.sections[1].title}</h4>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                  {productsMenu.sections[1].items.map((item) => (
                    <div 
                      key={item.name}
                      className="flex items-start gap-3 py-2 rounded"
                    >
                      {item.icon && <item.icon className={`w-5 h-5 mt-0.5 ${item.color}`} />}
                      <div>
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                        {item.desc && <p className="text-xs text-gray-500">{item.desc}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Third row - Automatización contable */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">{productsMenu.sections[2].title}</h4>
                <div className="grid grid-cols-2 gap-x-8">
                  <div className="space-y-1">
                    {productsMenu.sections[2].items.map((item) => (
                      <div 
                        key={item.name}
                        className="flex items-start gap-3 py-2 rounded"
                      >
                        {item.icon && <item.icon className={`w-5 h-5 mt-0.5 ${item.color}`} />}
                        <div>
                          <span className="text-sm font-medium text-gray-900">{item.name}</span>
                          {item.desc && <p className="text-xs text-gray-500">{item.desc}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-0.5 pt-2">
                    {productsMenu.sections[2].subItems?.map((sub) => (
                      <div key={sub.name} className="block py-1 text-sm text-gray-600">
                        <span className="text-gray-400 mr-1.5">•</span>
                        {sub.name} 
                        <span className="text-gray-400 text-xs"> · {sub.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="bg-gray-50 p-5 border-l border-gray-100 w-[180px]">
              <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">{productsMenu.sidebar.title}</h4>
              <div className="space-y-1">
                {productsMenu.sidebar.items.map((item) => (
                  <div
                    key={item.name}
                    className="block py-1.5 text-sm text-gray-600"
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

  const renderSolutionsMenu = () => {
    // Función para manejar el clic solo en el ítem 'Empresas'
    const handleItemClick = (item, e) => {
      if (item.name !== 'Empresas') {
        e.preventDefault();
        return;
      }
      onClose();
    };

    return (
      <div className="p-6">
        {/* Por etapa */}
        <div className="mb-5">
          <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {solutionsMenu.sections[0].title}
          </h4>
          <div className="grid grid-cols-2 gap-x-12">
            {solutionsMenu.sections[0].items.map((item) => (
              <div key={item.name} className="relative">
                {item.name === 'Empresas' ? (
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className="flex items-center gap-2.5 py-1.5 group"
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className="text-sm font-medium text-gray-800 group-hover:text-violet-600">
                      {item.name}
                    </span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2.5 py-1.5">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className="text-sm font-medium text-gray-800">
                      {item.name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Por caso de uso */}
        <div className="mb-5 pt-4 border-t border-gray-100">
          <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {solutionsMenu.sections[1].title}
          </h4>
          <div className="grid grid-cols-2 gap-x-12 gap-y-1">
            {solutionsMenu.sections[1].items.map((item) => (
              <div key={item.name} className="flex items-center gap-2.5 py-1.5">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm text-gray-700">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Por sector */}
        <div className="mb-5 pt-4 border-t border-gray-100">
          <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {solutionsMenu.sections[2].title}
          </h4>
          <div className="grid grid-cols-2 gap-x-12 gap-y-1">
            {solutionsMenu.sections[2].items.map((item) => (
              <div key={item.name} className="flex items-center gap-2.5 py-1.5">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm text-gray-700">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Ecosistema */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {solutionsMenu.sections[3].title}
          </h4>
          <div className="grid grid-cols-2 gap-x-12">
            {solutionsMenu.sections[3].items.map((item) => (
              <div key={item.name} className="flex items-center gap-2.5 py-1.5">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm text-gray-700">
                  {item.name}
                </span>
                {item.external && <ExternalLink className="w-3 h-3 text-gray-400" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDevelopersMenu = () => {
    // Función para manejar clics solo en la documentación
    const handleLinkClick = (e, isDocumentation) => {
      if (!isDocumentation) {
        e.preventDefault();
      } else {
        onClose();
      }
    };

    return (
      <div>
        {/* Header - Documentación (clickeable) */}
        <div 
          className="flex items-start gap-3 p-6 border-b border-gray-100 group cursor-pointer"
          onClick={(e) => handleLinkClick(e, true)}
        >
          <BookOpen className="w-6 h-6 text-blue-500 mt-0.5" />
          <div>
            <Link 
              to={developersMenu.header.href}
              className="font-semibold text-gray-900 hover:text-violet-600"
              onClick={onClose}
            >
              {developersMenu.header.title}
            </Link>
            <p className="text-sm text-gray-500">{developersMenu.header.desc}</p>
          </div>
        </div>
        
        {/* Sections - No clickeables */}
        <div className="grid grid-cols-2 gap-8 p-6">
          {developersMenu.sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <div 
                    key={item.name} 
                    className="block py-1.5 text-sm text-gray-700 cursor-default"
                    onClick={(e) => e.preventDefault()}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer - No clickeable */}
        <div className="flex gap-6 p-4 bg-gray-50 border-t border-gray-100">
          {developersMenu.footer.map((item) => (
            <div 
              key={item.name} 
              className="flex items-center gap-2 text-sm text-gray-600 cursor-default"
              onClick={(e) => e.preventDefault()}
            >
              <item.icon className="w-4 h-4 text-gray-400" />
              {item.name}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderResourcesMenu = () => {
    // Función para determinar si un ítem debe ser clickeable
    const isClickable = (itemName) => {
      return itemName === 'Guías' || itemName === 'Contacta con ventas';
    };

    // Función para manejar clics en los ítems
    const handleItemClick = (e, item) => {
      if (!isClickable(item.name)) {
        e.preventDefault();
      } else {
        onClose();
      }
    };

    return (
      <div>
        <div className="grid grid-cols-2 gap-8 p-6">
          {resourcesMenu.sections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.items.map((item) => {
                const clickable = isClickable(item.name);
                return (
                  <Link
                    key={item.name}
                    to={clickable ? item.href : '#'}
                    onClick={(e) => handleItemClick(e, item)}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${clickable ? 'hover:bg-gray-50 group' : 'cursor-default'}`}
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className={`font-medium ${clickable ? 'text-gray-700 group-hover:text-violet-600' : 'text-gray-700'}`}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-t border-gray-100">
          {resourcesMenu.footer.map((item) => {
            const clickable = isClickable(item.name);
            return clickable ? (
              <Link 
                key={item.name}
                to={item.href}
                onClick={onClose}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-violet-600 transition-colors"
              >
                <item.icon className="w-4 h-4 text-gray-400" />
                {item.name}
              </Link>
            ) : (
              <div 
                key={item.name} 
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <item.icon className="w-4 h-4 text-gray-400" />
                {item.name}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 rounded-b-2xl overflow-hidden"
      style={{ 
        maxWidth: menuType === 'products' ? '820px' : menuType === 'solutions' ? '520px' : '500px', 
        margin: '0 auto',
        maxHeight: menuType === 'products' ? '600px' : 'none'
      }}
    >
      {/* Arrow */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100" />
      
      <div className={menuType === 'products' ? 'overflow-y-auto max-h-[600px]' : ''}>
        {menuType === 'products' && renderProductsMenu()}
        {menuType === 'solutions' && renderSolutionsMenu()}
        {menuType === 'developers' && renderDevelopersMenu()}
        {menuType === 'resources' && renderResourcesMenu()}
      </div>
    </div>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { t, language, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveMenu(null);
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'products', label: t('nav.products'), hasDropdown: true },
    { id: 'solutions', label: t('nav.solutions'), hasDropdown: true },
    { id: 'developers', label: t('nav.developers'), hasDropdown: true },
    { id: 'resources', label: t('nav.resources'), hasDropdown: true },
    { id: 'pricing', label: t('nav.pricing'), hasDropdown: false, href: createPageUrl('Pricing') },
  ];

  const handleNavClick = (item) => {
    if (item.hasDropdown) {
      setActiveMenu(activeMenu === item.id ? null : item.id);
    } else if (item.href) {
      navigate(item.href);
      setActiveMenu(null);
    }
  };

  return (
    <header 
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || activeMenu
          ? 'bg-white/98 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex-shrink-0" onClick={() => setActiveMenu(null)}>
            <AntillaPayLogo size="default" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`flex items-center gap-1 px-4 py-2 text-[15px] font-medium rounded-lg transition-all duration-200
                  ${activeMenu === item.id 
                    ? 'text-violet-600 bg-violet-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/60'
                  }
                  focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                  active:scale-[0.98]
                `}
              >
                {item.label}
                {item.hasDropdown && (
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeMenu === item.id ? 'rotate-180' : ''}`} />
                )}
              </button>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100/60 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden xl:inline">{languageNames[language]}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {showLangMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[140px]">
                  {Object.entries(languageNames).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => { changeLanguage(code); setShowLangMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${language === code ? 'text-violet-600 font-medium bg-violet-50' : 'text-gray-700'}`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors rounded-lg hover:bg-gray-100/60 focus:outline-none focus:ring-2 focus:ring-violet-500 flex items-center gap-1"
            >
              {t('nav.login')}
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <Button 
              onClick={() => navigate(createPageUrl('Contact'))}
              className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-5 py-2 text-sm font-medium shadow-md shadow-violet-600/20 transition-all hover:shadow-lg hover:shadow-violet-600/30 active:scale-[0.98]"
            >
              {t('nav.contactSales')}
            </Button>
          </div>

          {/* Mobile Menu */}
          <MobileMenu 
            navItems={navItems}
            productsMenu={productsMenu}
            solutionsMenu={solutionsMenu}
            developersMenu={developersMenu}
            resourcesMenu={resourcesMenu}
            language={language}
            languageNames={languageNames}
            changeLanguage={changeLanguage}
            navigate={navigate}
            t={t}
          />
        </div>
      </div>

      {/* Mega Menu */}
      <MegaMenu 
        isOpen={!!activeMenu && activeMenu !== 'pricing'} 
        menuType={activeMenu} 
        onClose={() => setActiveMenu(null)} 
      />

    </header>
  );
}