import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, ChevronDown, ChevronUp, Briefcase, Users, Globe, Home, Heart, Store, ArrowRight, ChevronRight } from 'lucide-react';

// Gradientes para los botones de categoría
const categoryGradients = {
  'Tipos de Entidades en Cuba': 'from-blue-100 to-yellow-50',
  'Actores Internacionales': 'from-blue-100 to-yellow-50',
  'Corporativas y Sociales': 'from-blue-100 to-yellow-50'
};

// Colores de fondo para las tarjetas - Todos en azul
const cardBgColors = {
  'Inversión Extranjera': 'bg-gradient-to-br from-indigo-50 to-blue-50',
  'Empresas Estatales': 'bg-gradient-to-br from-indigo-50 to-blue-50',
  'FGNE': 'bg-gradient-to-br from-indigo-50 to-blue-50',
  'Cooperativas Agropecuarias': 'bg-gradient-to-br from-indigo-50 to-blue-50',
  'S.A. de Capital 100% Cubano': 'bg-gradient-to-br from-indigo-50 to-blue-50',
  'Empresas Extranjeras Radicadas en Cuba': 'bg-gradient-to-br from-indigo-50 to-blue-50',
  'Organismos Internacionales y Embajadas': 'bg-gradient-to-br from-indigo-50 to-blue-50',
  'Empresas Extranjeras o Empresarios Individuales Radicados en el Exterior': 'bg-gradient-to-br from-indigo-50 to-blue-50',
  'Franquicia': 'bg-gradient-to-br from-indigo-50 to-blue-50',
  'Subsidiarias': 'bg-gradient-to-br from-indigo-50 to-blue-50',
  'Filiales': 'bg-gradient-to-br from-indigo-50 to-blue-50',
  'ONG': 'bg-gradient-to-br from-indigo-50 to-blue-50'
};

// Colores de borde para las tarjetas - Todos en azul
const borderColors = {
  'Tipos de Entidades en Cuba': 'border-indigo-100',
  'Actores Internacionales': 'border-indigo-100',
  'Corporativas y Sociales': 'border-indigo-100'
};

const sectors = {
  'Inversión Extranjera': ['Empresa Mixta', 'Empresa de Capital 100% Extranjero', 'AEI'],
  'Empresas Estatales': [],
  'FGNE': ['Cooperativas no Agropecuarias', 'MIPYMES', 'TCP'],
  'Cooperativas Agropecuarias': [],
  'S.A. de Capital 100% Cubano': [],
  'Empresas Extranjeras Radicadas en Cuba': ['Sucursales Extranjeras', 'Oficina de Representación', 'Promotoras del Comercio y las Inversiones'],
  'Franquicia': [],
  'Subsidiarias': [],
  'Filiales': [],
  'ONG': [],
  'Organismos Internacionales y Embajadas': [],
  'Empresas Extranjeras o Empresarios Individuales Radicados en el Exterior': [],
};

const iconMap = {
  'Inversión Extranjera': <Globe className="w-6 h-6 text-indigo-600" />,
  'Empresas Estatales': <Building className="w-6 h-6 text-indigo-600" />,
  'FGNE': <Users className="w-6 h-6 text-indigo-600" />,
  'Cooperativas Agropecuarias': <Home className="w-6 h-6 text-indigo-600" />,
  'S.A. de Capital 100% Cubano': <Briefcase className="w-6 h-6 text-indigo-600" />,
  'Empresas Extranjeras Radicadas en Cuba': <Globe className="w-6 h-6 text-indigo-600" />,
  'Franquicia': <Store className="w-6 h-6 text-indigo-600" />,
  'Subsidiarias': <Briefcase className="w-6 h-6 text-indigo-600" />,
  'Filiales': <Users className="w-6 h-6 text-indigo-600" />,
  'ONG': <Heart className="w-6 h-6 text-indigo-600" />,
  'Organismos Internacionales y Embajadas': <Globe className="w-6 h-6 text-indigo-600" />,
  'Empresas Extranjeras o Empresarios Individuales Radicados en el Exterior': <Globe className="w-6 h-6 text-indigo-600" />
};

const SectorCard = ({ title, subSectors, index, categoryTitle }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const gradient = categoryGradients[categoryTitle] || 'from-gray-500 to-gray-600';
  const bgColor = cardBgColors[title] || 'bg-gray-50';
  const borderColor = borderColors[categoryTitle] || 'border-gray-100';
  const hasSubsectors = subSectors.length > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
      className={`relative rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border ${borderColor} overflow-hidden group ${bgColor} h-full flex flex-col`}
    >
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient}`}></div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div 
          className={`flex ${hasSubsectors ? 'cursor-pointer' : ''} group`}
          onClick={() => hasSubsectors && setIsExpanded(!isExpanded)}
        >
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-white shadow-sm group-hover:shadow-md transition-all duration-300">
                {iconMap[title] || <Briefcase className="w-6 h-6" />}
              </div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                {title}
              </h3>
            </div>
            
            {hasSubsectors && (
              <AnimatePresence>
                {isExpanded && (
                  <motion.ul 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2 mt-2 pl-2 overflow-hidden"
                  >
                    {subSectors.map((sub, i) => (
                      <motion.li 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors group/item"
                      >
                        <ChevronRight className="w-4 h-4 mr-2 text-gray-400 group-hover/item:text-current transition-colors" />
                        <span>{sub}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            )}
          </div>
          
          {hasSubsectors && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.3 }}
              className="ml-2 text-gray-400 group-hover:text-gray-600 transition-colors self-start mt-1"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          )}
        </div>
        
        <div className="mt-auto pt-4">
          <button 
            onClick={() => hasSubsectors && setIsExpanded(!isExpanded)}
            className={`text-sm font-medium flex items-center group/button ${hasSubsectors ? 'text-indigo-600 hover:text-indigo-800' : 'text-gray-400 cursor-default'}`}
          >
            {hasSubsectors ? (
              <>
                <span>{isExpanded ? 'Ver menos' : 'Ver opciones'}</span>
                <ArrowRight className="w-4 h-4 ml-1 transform group-hover/button:translate-x-1 transition-transform" />
              </>
            ) : (
              <span>Sin opciones adicionales</span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const sectorCategories = [
  {
    title: 'Tipos de Entidades en Cuba',
    sectors: ['Inversión Extranjera', 'Empresas Estatales', 'FGNE', 'Cooperativas Agropecuarias', 'S.A. de Capital 100% Cubano']
  },
  {
    title: 'Actores Internacionales',
    sectors: ['Empresas Extranjeras Radicadas en Cuba', 'Organismos Internacionales y Embajadas', 'Empresas Extranjeras o Empresarios Individuales Radicados en el Exterior']
  },
  {
    title: 'Corporativas y Sociales',
    sectors: ['Franquicia', 'Subsidiarias', 'Filiales', 'ONG']
  }
];

export default function Companies() {
  const [activeCategory, setActiveCategory] = useState(0);
  const activeGradient = categoryGradients[sectorCategories[activeCategory]?.title] || 'from-gray-500 to-gray-600';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-25 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className={`inline-block px-4 py-1.5 text-sm font-medium text-black rounded-full mb-6 bg-gradient-to-r ${activeGradient} shadow-md`}
          >
            Nuestro Alcance
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight"
          >
            <span className="text-gray-900">Ecosistema Empresarial</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Soluciones financieras adaptadas a cada tipo de entidad en Cuba, diseñadas para impulsar el crecimiento y la eficiencia operativa.
          </motion.p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {sectorCategories.map((category, index) => {
            const isActive = activeCategory === index;
            const gradient = categoryGradients[category.title] || 'from-gray-500 to-gray-600';
            
            return (
              <motion.button
                key={category.title}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveCategory(index)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? `text-gray-800 bg-gradient-to-r ${gradient} border border-gray-200 shadow-md hover:shadow-lg`
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {category.title}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Grid of Cards */}
        <motion.div 
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sectorCategories[activeCategory].sectors.map((sector, index) => {
            const subSectors = sectors[sector] || [];
            return (
              <SectorCard 
                key={sector} 
                title={sector} 
                subSectors={subSectors} 
                index={index}
                categoryTitle={sectorCategories[activeCategory].title}
              />
            );
          })}
        </motion.div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -z-10">
          <div className="bg-gradient-to-br from-indigo-100 to-blue-50 rounded-full w-96 h-96 opacity-50 blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 -z-10">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full w-96 h-96 opacity-50 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
