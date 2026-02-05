import { useState, useEffect } from 'react';
import {
  Building2,
  User,
  FileText,
  ShoppingBag,
  Globe,
  Landmark,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Hash,
  Tag,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  BUSINESS_STRUCTURES,
  COUNTRIES,
  PRODUCT_CATEGORIES,
  STATEMENT_DESCRIPTOR_OPTIONS
} from '@/utils/businessVerificationSchema';

const VERIFIED_KEY = 'antillapay_business_verified';
const PROGRESS_KEY = 'antillapay_business_verification';

function getVerificationData() {
  if (typeof window === 'undefined') return null;
  const verified = window.localStorage.getItem(VERIFIED_KEY);
  if (verified) {
    try { return JSON.parse(verified); } catch { return null; }
  }
  const progress = window.localStorage.getItem(PROGRESS_KEY);
  if (progress) {
    try { return JSON.parse(progress); } catch { return null; }
  }
  return null;
}

function resolveLabel(value, list) {
  if (!value) return null;
  const found = list.find(i => i.value === value);
  return found ? found.label : value;
}

function resolveCategoryLabel(value) {
  if (!value) return null;
  const option = PRODUCT_CATEGORIES.flatMap(g => g.options).find(o => o.value === value);
  return option ? option.label : value;
}

const InfoItem = ({ icon: Icon, label, value, muted }) => {
  if (!value && !muted) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-4 h-4 text-[#8792a2] mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[12px] text-[#8792a2] leading-none mb-1">{label}</p>
        <p className="text-[14px] text-[#32325d] font-medium break-words">
          {value || <span className="text-[#c1c9d2] italic font-normal">No proporcionado</span>}
        </p>
      </div>
    </div>
  );
};

const SectionCard = ({ icon: Icon, title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#f6f9fc] flex items-center justify-center group-hover:bg-[#635bff]/10 transition-colors">
            <Icon className="w-[18px] h-[18px] text-[#635bff]" />
          </div>
          <h3 className="text-[16px] font-semibold text-[#32325d]">{title}</h3>
        </div>
        {open
          ? <ChevronUp className="w-5 h-5 text-[#8792a2]" />
          : <ChevronDown className="w-5 h-5 text-[#8792a2]" />
        }
      </button>
      {open && (
        <div className="px-6 pb-6 pt-0 border-t border-gray-100">
          <div className="pt-4">{children}</div>
        </div>
      )}
    </div>
  );
};


function formatAddress(parts) {
  return parts.filter(Boolean).join(', ') || null;
}

export default function Settings() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(getVerificationData());

    const handleChange = () => setData(getVerificationData());
    window.addEventListener('storage', handleChange);
    window.addEventListener('verificationStateChanged', handleChange);
    return () => {
      window.removeEventListener('storage', handleChange);
      window.removeEventListener('verificationStateChanged', handleChange);
    };
  }, []);

  const tax = data?.taxData || {};
  const company = data?.companyData || {};
  const rep = data?.representativeData || {};
  const products = data?.productsData || {};
  const pub = data?.publicData || {};
  const bank = data?.bankData || {};
  const security = data?.securityData || {};

  const hasTax = !!(tax.nit || tax.razonSocial || tax.estructuraEmpresa);
  const hasCompany = !!(company.direccion || company.provincia || company.municipio);
  const hasRep = !!(rep.nombreLegal || rep.apellidoLegal || rep.email);
  const hasProducts = !!(products.categoria || products.descripcion);
  const hasPublic = !!(pub.telefonoSoporte || pub.direccionSoporte);
  const completedSections = [hasTax, hasCompany, hasRep, hasProducts, hasPublic].filter(Boolean).length;
  const totalSections = 5;
  const progressPercent = Math.round((completedSections / totalSections) * 100);

  const noData = !data || completedSections === 0;

  return (
    <div className="min-h-screen bg-[#f6f9fc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-[#32325d] mb-1">Información de mi cuenta</h1>
          <p className="text-[14px] text-[#4f5b76]">
            Información registrada durante la activación de tu cuenta de AntillaPay.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#635bff]" />
              <span className="text-[14px] font-semibold text-[#32325d]">Estado de verificación</span>
            </div>
            <span className="text-[13px] font-semibold text-[#32325d]">
              {completedSections}/{totalSections} secciones
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPercent}%`,
                background: progressPercent === 100
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : 'linear-gradient(90deg, #635bff, #8b83ff)'
              }}
            />
          </div>
          {progressPercent === 100 && (
            <p className="text-[13px] text-green-600 font-medium mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Todas las secciones han sido completadas
            </p>
          )}
          {data?.completedAt && (
            <p className="text-[12px] text-[#8792a2] mt-2">
              Verificación completada el {new Date(data.completedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>

        {noData && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
            <div className="w-16 h-16 bg-[#f6f9fc] rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-[#8792a2]" />
            </div>
            <h3 className="text-[18px] font-semibold text-[#32325d] mb-2">No hay datos de verificación</h3>
            <p className="text-[14px] text-[#4f5b76] max-w-md mx-auto">
              Aún no has completado el proceso de activación de cuenta. Una vez que lo hagas, toda tu información aparecerá aquí.
            </p>
          </div>
        )}

        {!noData && (
          <div className="space-y-4">
            {/* Datos Fiscales */}
            <SectionCard
              icon={FileText}
              title="Datos fiscales"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                <InfoItem icon={Hash} label="NIT" value={tax.nit} muted />
                <InfoItem icon={Building2} label="Razón social" value={tax.razonSocial} muted />
                <InfoItem icon={Tag} label="Estructura de la empresa" value={resolveLabel(tax.estructuraEmpresa, BUSINESS_STRUCTURES)} muted />
              </div>
            </SectionCard>

            {/* Datos de la Empresa */}
            <SectionCard
              icon={Building2}
              title="Datos de la empresa"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                <InfoItem icon={Tag} label="Nombre comercial (DBA)" value={company.nombreComercial} muted />
                <InfoItem icon={Globe} label="País" value={resolveLabel(company.pais, COUNTRIES)} muted />
                <InfoItem icon={MapPin} label="Provincia" value={company.provincia} muted />
                <InfoItem icon={MapPin} label="Municipio" value={company.municipio} muted />
                <InfoItem
                  icon={MapPin}
                  label="Dirección"
                  value={formatAddress([company.direccion, company.apartamento ? `Apt. ${company.apartamento}` : null])}
                  muted
                />
                <InfoItem icon={Hash} label="Código postal" value={company.codigoPostal} muted />
                <InfoItem icon={ExternalLink} label="Sitio web" value={company.sitioWeb} muted />
              </div>
            </SectionCard>

            {/* Representante */}
            <SectionCard
              icon={User}
              title="Representante de la empresa"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                <InfoItem icon={User} label="Nombre completo" value={formatAddress([rep.nombreLegal, rep.apellidoLegal])} muted />
                <InfoItem icon={Mail} label="Correo electrónico" value={rep.email} muted />
                <InfoItem icon={Calendar} label="Fecha de nacimiento" value={rep.fechaNacimiento} muted />
                <InfoItem icon={Phone} label="Teléfono" value={rep.telefono ? `${rep.codigoPais || '+53'} ${rep.telefono}` : null} muted />
                <InfoItem icon={Globe} label="País de domicilio" value={resolveLabel(rep.paisDomicilio, COUNTRIES)} muted />
                <InfoItem icon={MapPin} label="Provincia" value={rep.provinciaDomicilio} muted />
                <InfoItem icon={MapPin} label="Municipio" value={rep.municipioDomicilio} muted />
                <InfoItem
                  icon={MapPin}
                  label="Dirección personal"
                  value={formatAddress([rep.direccionDomicilio, rep.apartamentoDomicilio ? `Apt. ${rep.apartamentoDomicilio}` : null])}
                  muted
                />
                <InfoItem icon={Hash} label="Código postal" value={rep.codigoPostalDomicilio} muted />
              </div>
            </SectionCard>

            {/* Productos y Servicios */}
            <SectionCard
              icon={ShoppingBag}
              title="Productos y servicios"
            >
              <div className="space-y-1">
                <InfoItem icon={Tag} label="Categoría" value={resolveCategoryLabel(products.categoria)} muted />
                <div className="py-2">
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-[#8792a2] mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[12px] text-[#8792a2] leading-none mb-1">Descripción</p>
                      <p className="text-[14px] text-[#32325d] font-medium break-words whitespace-pre-wrap">
                        {products.descripcion || <span className="text-[#c1c9d2] italic font-normal">No proporcionado</span>}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Datos Públicos */}
            <SectionCard
              icon={Globe}
              title="Datos públicos para clientes"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                <InfoItem
                  icon={Tag}
                  label="Descriptor de extracto bancario"
                  value={
                    pub.descripcionCargo === 'personalizada'
                      ? pub.descripcionCargoPersonalizada
                      : resolveLabel(pub.descripcionCargo, STATEMENT_DESCRIPTOR_OPTIONS)
                  }
                  muted
                />
                <InfoItem icon={Phone} label="Teléfono de soporte" value={pub.telefonoSoporte ? `+53 ${pub.telefonoSoporte}` : null} muted />
                <InfoItem
                  icon={CheckCircle2}
                  label="Mostrar teléfono en recibos"
                  value={pub.mostrarTelefonoRecibos ? 'Sí' : 'No'}
                  muted
                />
                <InfoItem icon={Globe} label="País de soporte" value={resolveLabel(pub.paisSoporte, COUNTRIES)} muted />
                <InfoItem icon={MapPin} label="Provincia de soporte" value={pub.provinciaSoporte} muted />
                <InfoItem icon={MapPin} label="Municipio de soporte" value={pub.municipioSoporte} muted />
                <InfoItem
                  icon={MapPin}
                  label="Dirección de soporte"
                  value={formatAddress([pub.direccionSoporte, pub.apartamentoSoporte ? `Apt. ${pub.apartamentoSoporte}` : null])}
                  muted
                />
                <InfoItem icon={Hash} label="Código postal de soporte" value={pub.codigoPostalSoporte} muted />
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}
