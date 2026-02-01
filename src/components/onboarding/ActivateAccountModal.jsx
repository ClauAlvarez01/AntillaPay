/* eslint-disable react/prop-types */
import { useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useBusinessVerification } from '@/hooks/useBusinessVerification';
import {
    BUSINESS_STRUCTURES,
    COUNTRIES,
    CUBAN_PROVINCES,
    PRODUCT_CATEGORIES
} from '@/utils/businessVerificationSchema';

const InputField = ({ label, value, onChange, error, placeholder, optional, helpText, type = 'text' }) => (
    <div>
        <label className="block text-[13px] font-semibold text-[#32325d] mb-2">
            {label} {optional && <span className="text-[#8792a2] font-normal">(opcional)</span>}
        </label>
        {helpText && (
            <p className="text-[12px] text-[#8792a2] mb-2">{helpText}</p>
        )}
        <div className={cn(
            "rounded-lg border bg-white px-3 py-2.5 transition-all",
            error ? "border-red-300 shadow-[0_0_0_3px_rgba(239,68,68,0.15)]" : "border-gray-200 focus-within:border-[#9ac6ff] focus-within:shadow-[0_0_0_3px_rgba(99,91,255,0.15)]"
        )}>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full text-[13px] text-[#32325d] outline-none bg-transparent"
            />
        </div>
        {error && <p className="text-[12px] text-red-600 mt-1">{error}</p>}
    </div>
);

const SelectField = ({ label, value, onChange, error, options, placeholder }) => (
    <div>
        <label className="block text-[13px] font-semibold text-[#32325d] mb-2">
            {label}
        </label>
        <div className={cn(
            "rounded-lg border bg-white px-3 py-2.5 transition-all",
            error ? "border-red-300 shadow-[0_0_0_3px_rgba(239,68,68,0.15)]" : "border-gray-200 focus-within:border-[#9ac6ff] focus-within:shadow-[0_0_0_3px_rgba(99,91,255,0.15)]"
        )}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full text-[13px] text-[#32325d] outline-none bg-transparent"
            >
                <option value="">{placeholder || 'Selecciona una opción'}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
        {error && <p className="text-[12px] text-red-600 mt-1">{error}</p>}
    </div>
);

const StepIndicator = ({ currentStep, totalSteps }) => (
    <div className="flex items-center gap-2 mb-6">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div
                key={step}
                className={cn(
                    "h-1 flex-1 rounded-full transition-all",
                    step <= currentStep ? "bg-[#635bff]" : "bg-gray-200"
                )}
            />
        ))}
    </div>
);

const TaxDataStep = ({ taxData, updateTaxData, errors }) => (
    <div className="space-y-6">
        <div>
            <h3 className="text-[26px] font-semibold text-[#32325d] mb-2">
                Introduce tus datos fiscales
            </h3>
            <p className="text-[14px] text-[#4f5b76] leading-relaxed">
                Vamos a comprobar que coincida con la información que el registro tributario tiene registrada de tu empresa.
            </p>
        </div>

        <SelectField
            label="Estructura de la empresa"
            value={taxData.estructuraEmpresa}
            onChange={(value) => updateTaxData('estructuraEmpresa', value)}
            error={errors.estructuraEmpresa}
            options={BUSINESS_STRUCTURES}
            placeholder="Selecciona el tipo de empresa"
        />

        <InputField
            label="Número de identificación tributaria (NIT)"
            value={taxData.nit}
            onChange={(value) => updateTaxData('nit', value)}
            error={errors.nit}
            placeholder="00-0000000"
            helpText="Basado en tu registro tributario"
        />

        <InputField
            label="Razón social de la empresa"
            value={taxData.razonSocial}
            onChange={(value) => updateTaxData('razonSocial', value)}
            error={errors.razonSocial}
            placeholder="Nombre legal de la empresa"
            helpText="Recuerda respetar las mayúsculas y la puntuación que figuran en los documentos emitidos por el registro tributario. Esto puede coincidir con tu nombre personal."
        />
    </div>
);

const CompanyDataStep = ({ companyData, updateCompanyData, errors }) => (
    <div className="space-y-6">
        <div>
            <h3 className="text-[26px] font-semibold text-[#32325d] mb-2">
                Háblanos sobre tu empresa
            </h3>
            <p className="text-[14px] text-[#4f5b76] leading-relaxed">
                Esta información se recoge para prestar un mejor servicio a tu empresa y para ayudarte a cumplir con los requisitos de las autoridades reguladoras y los socios financieros.
            </p>
        </div>

        <InputField
            label="Nombre de la empresa o nombre comercial (DBA)"
            value={companyData.nombreComercial}
            onChange={(value) => updateCompanyData('nombreComercial', value)}
            error={errors.nombreComercial}
            placeholder=""
            optional
            helpText="El nombre comercial público de tu empresa, si es diferente del nombre legal."
        />

        <div>
            <label className="block text-[13px] font-semibold text-[#32325d] mb-2">
                Dirección de la empresa
            </label>
            <p className="text-[12px] text-[#8792a2] mb-3">
                Ubicación física donde diriges tu empresa. Puede ser la misma que la dirección registrada de la empresa o no.
            </p>

            <div className="space-y-4">
                <SelectField
                    label="País"
                    value={companyData.pais}
                    onChange={(value) => updateCompanyData('pais', value)}
                    error={errors.pais}
                    options={COUNTRIES}
                />

                <InputField
                    label="Provincia"
                    value={companyData.provincia}
                    onChange={(value) => updateCompanyData('provincia', value)}
                    error={errors.provincia}
                    placeholder="Provincia"
                />

                <InputField
                    label="Municipio"
                    value={companyData.municipio}
                    onChange={(value) => updateCompanyData('municipio', value)}
                    error={errors.municipio}
                    placeholder="Municipio"
                />

                <InputField
                    label="Dirección"
                    value={companyData.direccion}
                    onChange={(value) => updateCompanyData('direccion', value)}
                    error={errors.direccion}
                    placeholder="Calle y número"
                />

                <InputField
                    label="Apartamento, bloque u otro"
                    value={companyData.apartamento}
                    onChange={(value) => updateCompanyData('apartamento', value)}
                    error={errors.apartamento}
                    placeholder=""
                    optional
                />

                <InputField
                    label="Código postal"
                    value={companyData.codigoPostal}
                    onChange={(value) => updateCompanyData('codigoPostal', value)}
                    error={errors.codigoPostal}
                    placeholder=""
                    optional
                />
            </div>
        </div>

        <InputField
            label="Sitio web de la empresa"
            value={companyData.sitioWeb}
            onChange={(value) => updateCompanyData('sitioWeb', value)}
            error={errors.sitioWeb}
            placeholder="www.ejemplo.com"
            optional
        />
    </div>
);

const RepresentativeDataStep = ({ representativeData, updateRepresentativeData, errors }) => (
    <div className="space-y-6">
        <div>
            <h3 className="text-[26px] font-semibold text-[#32325d] mb-2">
                Verifica tus datos personales
            </h3>
            <p className="text-[14px] text-[#4f5b76] leading-relaxed">
                Utilizamos esta información para verificar tu identidad y para proteger tu cuenta.
            </p>
            <p className="text-[13px] text-[#4f5b76] leading-relaxed mt-2">
                Esta cuenta debe activarla una persona autorizada a firmar en nombre de tu organización. Si tú no tienes autorización, pídele a quien corresponda que rellene este formulario.
            </p>
        </div>

        <InputField
            label="Nombre legal"
            value={representativeData.nombreLegal}
            onChange={(value) => updateRepresentativeData('nombreLegal', value)}
            error={errors.nombreLegal}
            placeholder="Nombre legal"
            helpText="Introduce tu nombre tal y como aparece en los registros de las entidades reguladoras del gobierno."
        />

        <InputField
            label="Apellido legal"
            value={representativeData.apellidoLegal}
            onChange={(value) => updateRepresentativeData('apellidoLegal', value)}
            error={errors.apellidoLegal}
            placeholder="Apellido legal"
        />

        <InputField
            label="Dirección de correo electrónico"
            value={representativeData.email}
            onChange={(value) => updateRepresentativeData('email', value)}
            error={errors.email}
            placeholder="correo@ejemplo.com"
            type="email"
        />

        <InputField
            label="Fecha de nacimiento"
            value={representativeData.fechaNacimiento}
            onChange={(value) => updateRepresentativeData('fechaNacimiento', value)}
            error={errors.fechaNacimiento}
            placeholder="DD / MM / AAAA"
        />

        <div>
            <label className="block text-[13px] font-semibold text-[#32325d] mb-2">
                Domicilio particular
            </label>

            <div className="space-y-4">
                <SelectField
                    label="País"
                    value={representativeData.paisDomicilio}
                    onChange={(value) => updateRepresentativeData('paisDomicilio', value)}
                    error={errors.paisDomicilio}
                    options={COUNTRIES}
                />

                <InputField
                    label="Provincia"
                    value={representativeData.provinciaDomicilio}
                    onChange={(value) => updateRepresentativeData('provinciaDomicilio', value)}
                    error={errors.provinciaDomicilio}
                    placeholder="Provincia"
                />

                <InputField
                    label="Municipio"
                    value={representativeData.municipioDomicilio}
                    onChange={(value) => updateRepresentativeData('municipioDomicilio', value)}
                    error={errors.municipioDomicilio}
                    placeholder="Municipio"
                />

                <InputField
                    label="Dirección"
                    value={representativeData.direccionDomicilio}
                    onChange={(value) => updateRepresentativeData('direccionDomicilio', value)}
                    error={errors.direccionDomicilio}
                    placeholder="Calle y número"
                />

                <InputField
                    label="Apartamento, bloque u otro"
                    value={representativeData.apartamentoDomicilio}
                    onChange={(value) => updateRepresentativeData('apartamentoDomicilio', value)}
                    error={errors.apartamentoDomicilio}
                    placeholder=""
                    optional
                />

                <InputField
                    label="Código postal"
                    value={representativeData.codigoPostalDomicilio}
                    onChange={(value) => updateRepresentativeData('codigoPostalDomicilio', value)}
                    error={errors.codigoPostalDomicilio}
                    placeholder=""
                    optional
                />
            </div>
        </div>

        <div>
            <label className="block text-[13px] font-semibold text-[#32325d] mb-2">
                Número de teléfono
            </label>
            <div className="flex gap-2">
                <div className="w-24">
                    <select
                        value={representativeData.codigoPais}
                        onChange={(e) => updateRepresentativeData('codigoPais', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[13px] text-[#32325d] outline-none focus:border-[#9ac6ff] focus:shadow-[0_0_0_3px_rgba(99,91,255,0.15)]"
                    >
                        <option value="+53">🇨🇺 +53</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+52">🇲🇽 +52</option>
                        <option value="+34">🇪🇸 +34</option>
                    </select>
                </div>
                <div className="flex-1">
                    <InputField
                        label=""
                        value={representativeData.telefono}
                        onChange={(value) => updateRepresentativeData('telefono', value)}
                        error={errors.telefono}
                        placeholder="201 555 0123"
                    />
                </div>
            </div>
        </div>
    </div>
);

const ProductsServicesStep = ({ productsData, updateProductsData, errors }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState(['Más popular']); // Start with "Más popular" expanded

    const filteredCategories = PRODUCT_CATEGORIES.map(group => ({
        ...group,
        options: group.options.filter(option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.group.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(group => group.options.length > 0);

    const selectedCategory = PRODUCT_CATEGORIES
        .flatMap(group => group.options)
        .find(option => option.value === productsData.categoria);

    const toggleGroup = (groupName) => {
        setExpandedGroups(prev =>
            prev.includes(groupName)
                ? prev.filter(g => g !== groupName)
                : [...prev, groupName]
        )
            ;
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-[26px] font-semibold text-[#32325d] mb-2">
                    ¿Qué productos o servicios ofrecerás a través de AntillaPay?
                </h3>
                <p className="text-[14px] text-[#4f5b76] leading-relaxed">
                    Utilizamos esta información para garantizar que tus ofertas de productos o servicios cumplen los requisitos normativos y de los socios financieros.
                </p>
            </div>

            <div>
                <label className="block text-[13px] font-semibold text-[#32325d] mb-2">
                    Categoría
                </label>
                <p className="text-[12px] text-[#8792a2] mb-2">
                    Selecciona la opción que mejor se adapta a lo que ofrecerás a través de Stripe.
                </p>
                <div className="relative">
                    <div
                        className={cn(
                            "rounded-lg border bg-white px-3 py-2.5 cursor-pointer transition-all",
                            errors.categoria
                                ? "border-red-300 shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                                : isDropdownOpen
                                    ? "border-[#9ac6ff] shadow-[0_0_0_3px_rgba(99,91,255,0.15)]"
                                    : "border-gray-200 hover:border-gray-300"
                        )}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="text-[13px] text-[#32325d]">
                            {selectedCategory ? selectedCategory.label : 'Elige una opción'}
                        </div>
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-[400px] overflow-hidden">
                            <div className="p-3 border-b border-gray-100">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar..."
                                    className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-md outline-none focus:border-[#9ac6ff] focus:shadow-[0_0_0_3px_rgba(99,91,255,0.15)]"
                                />
                            </div>
                            <div className="overflow-y-auto max-h-[340px]">
                                {filteredCategories.map((group) => {
                                    const isExpanded = expandedGroups.includes(group.group);
                                    return (
                                        <div key={group.group}>
                                            <div
                                                onClick={() => toggleGroup(group.group)}
                                                className="px-4 py-2.5 text-[13px] font-semibold text-[#32325d] bg-white hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-2 border-b border-gray-100"
                                            >
                                                <ChevronLeft
                                                    className={cn(
                                                        "w-4 h-4 transition-transform text-[#8792a2]",
                                                        isExpanded ? "rotate-[-90deg]" : ""
                                                    )}
                                                />
                                                {group.group}
                                            </div>
                                            {isExpanded && group.options.map((option) => (
                                                <div
                                                    key={option.value}
                                                    onClick={() => {
                                                        updateProductsData('categoria', option.value);
                                                        setIsDropdownOpen(false);
                                                        setSearchTerm('');
                                                    }}
                                                    className="pl-10 pr-4 py-2.5 text-[13px] text-[#4f5b76] hover:bg-gray-50 cursor-pointer transition-colors"
                                                >
                                                    {option.label}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
                {errors.categoria && <p className="text-[12px] text-red-600 mt-1">{errors.categoria}</p>}
            </div>

            <div>
                <label className="block text-[13px] font-semibold text-[#32325d] mb-2">
                    Descripción
                </label>
                <p className="text-[12px] text-[#8792a2] mb-2">
                    Describe los tipos de productos o servicios que ofrecerás.
                </p>
                <div className={cn(
                    "rounded-lg border bg-white px-3 py-2.5 transition-all",
                    errors.descripcion ? "border-red-300 shadow-[0_0_0_3px_rgba(239,68,68,0.15)]" : "border-gray-200 focus-within:border-[#9ac6ff] focus-within:shadow-[0_0_0_3px_rgba(99,91,255,0.15)]"
                )}>
                    <textarea
                        value={productsData.descripcion}
                        onChange={(e) => updateProductsData('descripcion', e.target.value)}
                        placeholder="Describe tus productos o servicios..."
                        rows={4}
                        className="w-full text-[13px] text-[#32325d] outline-none bg-transparent resize-none"
                    />
                </div>
                {errors.descripcion && <p className="text-[12px] text-red-600 mt-1">{errors.descripcion}</p>}
            </div>
        </div>
    );
};

export default function ActivateAccountModal({ isOpen, onClose, onComplete }) {
    const {
        currentStep,
        taxData,
        companyData,
        representativeData,
        errors,
        updateTaxData,
        updateCompanyData,
        updateRepresentativeData,
        productsData,
        updateProductsData,
        nextStep,
        previousStep,
        submitVerification
    } = useBusinessVerification();

    const handleContinue = () => {
        if (currentStep === 4) {
            if (submitVerification()) {
                onComplete();
            }
        } else {
            nextStep();
        }
    };

    const handleClose = () => {
        if (window.confirm('¿Estás seguro de que quieres cerrar? Tu progreso se guardará.')) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-[#0f172a]/25 backdrop-blur-[1px] z-[124]"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.98 }}
                        className="fixed inset-0 z-[125] flex items-center justify-center px-6"
                    >
                        <div className="w-[680px] max-w-[92vw] max-h-[90vh] rounded-2xl bg-white shadow-[0_24px_70px_-24px_rgba(15,23,42,0.35)] overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="px-8 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                                <div className="flex-1">
                                    <h2 className="text-[18px] font-semibold text-[#32325d]">Activa tu cuenta</h2>
                                    <p className="text-[12px] text-[#8792a2] mt-1">Paso {currentStep} de 4</p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto px-8 py-6">
                                <StepIndicator currentStep={currentStep} totalSteps={4} />

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {currentStep === 1 && (
                                            <TaxDataStep
                                                taxData={taxData}
                                                updateTaxData={updateTaxData}
                                                errors={errors}
                                            />
                                        )}
                                        {currentStep === 2 && (
                                            <CompanyDataStep
                                                companyData={companyData}
                                                updateCompanyData={updateCompanyData}
                                                errors={errors}
                                            />
                                        )}
                                        {currentStep === 3 && (
                                            <RepresentativeDataStep
                                                representativeData={representativeData}
                                                updateRepresentativeData={updateRepresentativeData}
                                                errors={errors}
                                            />
                                        )}
                                        {currentStep === 4 && (
                                            <ProductsServicesStep
                                                productsData={productsData}
                                                updateProductsData={updateProductsData}
                                                errors={errors}
                                            />
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Footer */}
                            <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
                                {currentStep > 1 ? (
                                    <button
                                        onClick={previousStep}
                                        className="flex items-center gap-2 text-[13px] font-semibold text-[#635bff] hover:underline"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Atrás
                                    </button>
                                ) : (
                                    <div />
                                )}
                                <button
                                    onClick={handleContinue}
                                    className="rounded-md bg-[#635bff] px-6 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:bg-[#5851e0] transition-colors"
                                >
                                    {currentStep === 4 ? 'Activar cuenta' : 'Continuar'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
