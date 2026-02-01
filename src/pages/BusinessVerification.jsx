/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Search, Building2, ArrowRight, ShieldCheck, FileText, AlertCircle, Mail } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useBusinessVerification } from '@/hooks/useBusinessVerification';
import {
    BUSINESS_STRUCTURES,
    COUNTRIES,
    CUBAN_PROVINCES,
    PRODUCT_CATEGORIES,
    STATEMENT_DESCRIPTOR_OPTIONS
} from '@/utils/businessVerificationSchema';

// Reusable form components
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

// Step components (reused from modal)
const TaxDataStep = ({ taxData, updateTaxData, errors }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const selectedStructure = BUSINESS_STRUCTURES.find(s => s.value === taxData.estructuraEmpresa);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-[26px] font-semibold text-[#32325d] mb-2">
                    Introduce tus datos fiscales
                </h3>
                <p className="text-[14px] text-[#4f5b76] leading-relaxed">
                    Vamos a comprobar que coincida con la información que el registro tributario tiene registrada de tu empresa.
                </p>
            </div>

            <div className="relative">
                <label className="block text-[13px] font-semibold text-[#32325d] mb-2">
                    Estructura de la empresa
                </label>
                <div
                    className={cn(
                        "rounded-lg border bg-white px-3 py-2.5 cursor-pointer transition-all flex justify-between items-center",
                        errors.estructuraEmpresa
                            ? "border-red-300 shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                            : isDropdownOpen
                                ? "border-[#9ac6ff] shadow-[0_0_0_3px_rgba(99,91,255,0.15)]"
                                : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <span className={cn("text-[13px]", !selectedStructure && "text-[#4f5b76]")}>
                        {selectedStructure ? selectedStructure.label : 'Selecciona el tipo de empresa'}
                    </span>
                    <ChevronRight className={cn("w-4 h-4 text-[#8792a2] transition-transform", isDropdownOpen && "rotate-90")} />
                </div>

                {isDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden py-1">
                        <div className="px-4 py-2 text-[13px] text-[#8792a2] border-b border-gray-100">
                            Selecciona el tipo de empresa
                        </div>
                        {BUSINESS_STRUCTURES.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => {
                                    updateTaxData('estructuraEmpresa', option.value);
                                    setIsDropdownOpen(false);
                                }}
                                className="px-4 py-2.5 text-[13px] text-[#32325d] hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between group"
                            >
                                <span>{option.label}</span>
                                {taxData.estructuraEmpresa === option.value && (
                                    <Check className="w-4 h-4 text-[#635bff]" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {errors.estructuraEmpresa && <p className="text-[12px] text-red-600 mt-1">{errors.estructuraEmpresa}</p>}
            </div>

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
};

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
    const [expandedGroups, setExpandedGroups] = useState(['Más popular']);

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
        );
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

const PublicDataStep = ({ publicData, updatePublicData, errors }) => {
    const [isDescriptorDropdownOpen, setIsDescriptorDropdownOpen] = useState(false);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);

    const selectedDescriptor = STATEMENT_DESCRIPTOR_OPTIONS.find(opt => opt.value === publicData.descripcionCargo);
    const selectedCountry = COUNTRIES.find(c => c.value === publicData.paisSoporte);
    const selectedProvince = CUBAN_PROVINCES.find(p => p === publicData.provinciaSoporte);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-[26px] font-semibold text-[#32325d] mb-2">
                    Añade los datos públicos para los clientes
                </h3>
                <p className="text-[14px] text-[#4f5b76] leading-relaxed">
                    Esta información puede aparecer en extractos bancarios, facturas y recibos.
                </p>
            </div>

            {/* Statement Descriptor */}
            <div>
                <label className="block text-[13px] font-semibold text-[#32325d] mb-2">
                    Descripción del cargo en el extracto bancario
                    <span className="text-[#8792a2] font-normal ml-1">(opcional)</span>
                </label>
                <p className="text-[12px] text-[#8792a2] mb-2">
                    Esto aparece en los extractos bancarios de tus clientes cuando añades descripciones de productos particulares. Debe tener entre 2 y 10 caracteres.
                </p>
                <div className="relative">
                    <div
                        className={cn(
                            "rounded-lg border bg-white px-3 py-2.5 cursor-pointer transition-all flex justify-between items-center",
                            isDescriptorDropdownOpen
                                ? "border-[#9ac6ff] shadow-[0_0_0_3px_rgba(99,91,255,0.15)]"
                                : "border-gray-200 hover:border-gray-300"
                        )}
                        onClick={() => setIsDescriptorDropdownOpen(!isDescriptorDropdownOpen)}
                    >
                        <span className={cn("text-[13px]", !selectedDescriptor && "text-[#4f5b76]")}>
                            {selectedDescriptor ? selectedDescriptor.label : 'Elige una opción'}
                        </span>
                        <ChevronRight className={cn("w-4 h-4 text-[#8792a2] transition-transform", isDescriptorDropdownOpen && "rotate-90")} />
                    </div>

                    {isDescriptorDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden py-1">
                            {STATEMENT_DESCRIPTOR_OPTIONS.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        updatePublicData('descripcionCargo', option.value);
                                        setIsDescriptorDropdownOpen(false);
                                    }}
                                    className="px-4 py-2.5 text-[13px] text-[#32325d] hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                                >
                                    <span>{option.label}</span>
                                    {publicData.descripcionCargo === option.value && (
                                        <Check className="w-4 h-4 text-[#635bff]" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {publicData.descripcionCargo === 'personalizada' && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-1 duration-200">
                        <InputField
                            label="Tu descripción personalizada"
                            value={publicData.descripcionCargoPersonalizada}
                            onChange={(value) => updatePublicData('descripcionCargoPersonalizada', value)}
                            error={errors.descripcionCargoPersonalizada}
                            placeholder="Ej: ANTILLAPAY-PROD"
                            helpText="Esta es la descripción que verán tus clientes en sus extractos bancarios."
                        />
                    </div>
                )}
            </div>

            {/* Customer Support Section */}
            <div>
                <h4 className="text-[16px] font-semibold text-[#32325d] mb-3">
                    Soporte para clientes
                </h4>
                <p className="text-[12px] text-[#8792a2] mb-4">
                    Estos datos deben coincidir con lo que se muestra en tu sitio web o redes sociales.
                </p>

                {/* Support Phone */}
                <div className="mb-4">
                    <label className="block text-[13px] font-semibold text-[#32325d] mb-2">
                        Número de teléfono de soporte para cliente
                    </label>
                    <div className={cn(
                        "rounded-lg border bg-white px-3 py-2.5 transition-all flex items-center gap-2",
                        errors.telefonoSoporte ? "border-red-300 shadow-[0_0_0_3px_rgba(239,68,68,0.15)]" : "border-gray-200 focus-within:border-[#9ac6ff] focus-within:shadow-[0_0_0_3px_rgba(99,91,255,0.15)]"
                    )}>
                        <span className="text-[13px] text-[#32325d]">🇨🇺 +53</span>
                        <input
                            type="tel"
                            value={publicData.telefonoSoporte}
                            onChange={(e) => updatePublicData('telefonoSoporte', e.target.value)}
                            placeholder="5 555 0123"
                            className="flex-1 text-[13px] text-[#32325d] outline-none bg-transparent"
                        />
                    </div>
                    {errors.telefonoSoporte && <p className="text-[12px] text-red-600 mt-1">{errors.telefonoSoporte}</p>}
                </div>

                {/* Toggle for showing phone on receipts */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => updatePublicData('mostrarTelefonoRecibos', !publicData.mostrarTelefonoRecibos)}
                        className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                            publicData.mostrarTelefonoRecibos ? "bg-[#635bff]" : "bg-gray-200"
                        )}
                    >
                        <span
                            className={cn(
                                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                publicData.mostrarTelefonoRecibos ? "translate-x-6" : "translate-x-1"
                            )}
                        />
                    </button>
                    <span className="text-[13px] text-[#32325d]">
                        Mostrar el número de teléfono en los recibos y facturas
                    </span>
                </div>

                {/* Support Address */}
                <div>
                    <label className="block text-[13px] font-semibold text-[#32325d] mb-2">
                        Dirección de soporte para clientes
                    </label>
                    <div className="space-y-4">
                        {/* Country */}
                        <div className="relative">
                            <label className="block text-[13px] font-semibold text-[#32325d] mb-2">
                                País
                            </label>
                            <div
                                className={cn(
                                    "rounded-lg border bg-white px-3 py-2.5 cursor-pointer transition-all flex justify-between items-center",
                                    errors.paisSoporte
                                        ? "border-red-300 shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                                        : isCountryDropdownOpen
                                            ? "border-[#9ac6ff] shadow-[0_0_0_3px_rgba(99,91,255,0.15)]"
                                            : "border-gray-200 hover:border-gray-300"
                                )}
                                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                            >
                                <span className={cn("text-[13px]", !selectedCountry && "text-[#4f5b76]")}>
                                    {selectedCountry ? selectedCountry.label : 'Selecciona un país'}
                                </span>
                                <ChevronRight className={cn("w-4 h-4 text-[#8792a2] transition-transform", isCountryDropdownOpen && "rotate-90")} />
                            </div>

                            {isCountryDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden py-1">
                                    {COUNTRIES.map((country) => (
                                        <div
                                            key={country.value}
                                            onClick={() => {
                                                updatePublicData('paisSoporte', country.value);
                                                setIsCountryDropdownOpen(false);
                                            }}
                                            className="px-4 py-2.5 text-[13px] text-[#32325d] hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                                        >
                                            <span>{country.label}</span>
                                            {publicData.paisSoporte === country.value && (
                                                <Check className="w-4 h-4 text-[#635bff]" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {errors.paisSoporte && <p className="text-[12px] text-red-600 mt-1">{errors.paisSoporte}</p>}
                        </div>

                        {/* Province */}
                        <div className="relative">
                            <label className="block text-[13px] font-semibold text-[#32325d] mb-2">
                                Provincia
                            </label>
                            <div
                                className={cn(
                                    "rounded-lg border bg-white px-3 py-2.5 cursor-pointer transition-all flex justify-between items-center",
                                    errors.provinciaSoporte
                                        ? "border-red-300 shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                                        : isProvinceDropdownOpen
                                            ? "border-[#9ac6ff] shadow-[0_0_0_3px_rgba(99,91,255,0.15)]"
                                            : "border-gray-200 hover:border-gray-300"
                                )}
                                onClick={() => setIsProvinceDropdownOpen(!isProvinceDropdownOpen)}
                            >
                                <span className={cn("text-[13px]", !selectedProvince && "text-[#4f5b76]")}>
                                    {selectedProvince || 'Selecciona una provincia'}
                                </span>
                                <ChevronRight className={cn("w-4 h-4 text-[#8792a2] transition-transform", isProvinceDropdownOpen && "rotate-90")} />
                            </div>

                            {isProvinceDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden py-1 max-h-[200px] overflow-y-auto">
                                    {CUBAN_PROVINCES.map((province) => (
                                        <div
                                            key={province}
                                            onClick={() => {
                                                updatePublicData('provinciaSoporte', province);
                                                setIsProvinceDropdownOpen(false);
                                            }}
                                            className="px-4 py-2.5 text-[13px] text-[#32325d] hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                                        >
                                            <span>{province}</span>
                                            {publicData.provinciaSoporte === province && (
                                                <Check className="w-4 h-4 text-[#635bff]" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {errors.provinciaSoporte && <p className="text-[12px] text-red-600 mt-1">{errors.provinciaSoporte}</p>}
                        </div>

                        {/* Municipality */}
                        <InputField
                            label="Municipio"
                            value={publicData.municipioSoporte}
                            onChange={(value) => updatePublicData('municipioSoporte', value)}
                            error={errors.municipioSoporte}
                            placeholder="Municipio"
                        />

                        {/* Address */}
                        <InputField
                            label="Dirección"
                            value={publicData.direccionSoporte}
                            onChange={(value) => updatePublicData('direccionSoporte', value)}
                            error={errors.direccionSoporte}
                            placeholder="Calle y número"
                        />

                        {/* Apartment */}
                        <InputField
                            label="Apartamento, bloque u otro"
                            value={publicData.apartamentoSoporte}
                            onChange={(value) => updatePublicData('apartamentoSoporte', value)}
                            error={errors.apartamentoSoporte}
                            placeholder=""
                            optional
                        />

                        {/* Postal Code */}
                        <InputField
                            label="Código postal"
                            value={publicData.codigoPostalSoporte}
                            onChange={(value) => updatePublicData('codigoPostalSoporte', value)}
                            error={errors.codigoPostalSoporte}
                            placeholder=""
                            optional
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const BankDataStep = ({ bankData, updateBankData, onManualInput }) => (
    <div className="space-y-6">
        <div>
            <h3 className="text-[26px] font-semibold text-[#32325d] mb-2">
                Selecciona una cuenta para las transferencias
            </h3>
            <p className="text-[14px] text-[#4f5b76] leading-relaxed">
                Enviaremos las ganancias que recibas a esta cuenta.
            </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#8792a2]" />
            </div>
            <input
                type="text"
                placeholder="Busca tu banco"
                className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-gray-200 rounded-lg outline-none focus:border-[#9ac6ff] focus:shadow-[0_0_0_3px_rgba(99,91,255,0.15)] transition-all"
            />
        </div>

        {/* Bank Grid Placeholder with Alert */}
        <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                    <p className="text-[13px] font-medium text-amber-900">Configuración pendiente</p>
                    <p className="text-[13px] text-amber-700">La lista de bancos asociados aún no ha sido definida para esta región.</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {['CHASE', 'Bank of America', 'WELLS FARGO', 'Capital One', 'NAVY FEDERAL', 'us bank', 'PNC', 'USAA', 'TD Bank', 'TRUIST', 'Huntington', 'MERCURY'].map((bank) => (
                    <div
                        key={bank}
                        className="h-[60px] border border-gray-100 rounded-lg flex items-center justify-center grayscale opacity-50 cursor-not-allowed hover:bg-gray-50 transition-all"
                    >
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{bank}</span>
                    </div>
                ))}
            </div>
        </div>

        <p className="text-[12px] text-[#4f5b76] leading-relaxed">
            Vincular tu cuenta permitirá a AntillaPay recibir, almacenar y utilizar regularmente los datos de tu cuenta para evaluar su elegibilidad para recibir servicios financieros. Al seleccionar tu institución financiera, aceptas las <span className="text-[#635bff] cursor-pointer hover:underline">Condiciones</span> de y la <span className="text-[#635bff] cursor-pointer hover:underline">Política de privacidad</span> de AntillaPay. <span className="text-[#635bff] cursor-pointer hover:underline">Más información</span>
        </p>

        <button
            onClick={onManualInput}
            className="flex items-center gap-1 text-[13px] font-semibold text-[#635bff] hover:text-[#5851e0] transition-colors group"
        >
            Introduce manualmente los datos bancarios como alternativa
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
    </div>
);

const ManualBankModal = ({ isOpen, onClose, bankData, updateBankData, onSave }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a2540]/20 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-[440px] overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#635bff] rounded flex items-center justify-center text-white font-bold text-[14px]">
                            A
                        </div>
                        <span className="text-[15px] font-bold text-[#32325d]">AntillaPay</span>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-[#4f5b76]" />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div>
                        <h3 className="text-[18px] font-bold text-[#32325d] mb-2">
                            Introduce los datos bancarios
                        </h3>
                        <p className="text-[13px] text-[#4f5b76]">
                            Se admiten cuentas corrientes y de ahorro.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[12px] font-semibold text-[#32325d]">Número de ruta</label>
                            <input
                                type="text"
                                value={bankData.routingNumber}
                                onChange={(e) => updateBankData('routingNumber', e.target.value)}
                                className="w-full px-3 py-2.5 text-[14px] border border-gray-200 rounded-lg outline-none focus:border-[#d1d1f0] focus:shadow-[0_0_0_2px_rgba(99,91,255,0.1)] transition-all"
                                placeholder="Número de ruta"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[12px] font-semibold text-[#32325d]">Número de cuenta</label>
                            <input
                                type="text"
                                value={bankData.accountNumber}
                                onChange={(e) => updateBankData('accountNumber', e.target.value)}
                                className="w-full px-3 py-2.5 text-[14px] border border-gray-200 rounded-lg outline-none focus:border-[#d1d1f0] focus:shadow-[0_0_0_2px_rgba(99,91,255,0.1)] transition-all"
                                placeholder="Número de cuenta"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[12px] font-semibold text-[#32325d]">Confirmar número de cuenta</label>
                            <input
                                type="text"
                                value={bankData.confirmAccountNumber}
                                onChange={(e) => updateBankData('confirmAccountNumber', e.target.value)}
                                className="w-full px-3 py-2.5 text-[14px] border border-gray-200 rounded-lg outline-none focus:border-[#d1d1f0] focus:shadow-[0_0_0_2px_rgba(99,91,255,0.1)] transition-all"
                                placeholder="Confirmar número de cuenta"
                            />
                        </div>
                    </div>

                    <p className="text-[11px] text-[#697386] leading-relaxed text-center italic">
                        Al añadir tu cuenta bancaria a tu cuenta de AntillaPay y hacer clic más abajo, autorizas a AntillaPay a realizar adeudos en tu banco tal y como se describe en estas <span className="text-[#635bff] cursor-pointer hover:underline not-italic">condiciones</span>.
                    </p>

                    <button
                        onClick={onSave}
                        className="w-full py-2.5 bg-[#635bff] text-white rounded-lg font-semibold text-[14px] hover:bg-[#5851e0] transition-colors shadow-sm"
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
};

// Review Section Component
const ReviewSection = ({ title, isComplete, onEdit, children }) => (
    <div className="border border-gray-200 rounded-lg p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] font-semibold text-[#32325d]">{title}</h3>
            <div className="flex items-center gap-3">
                {!isComplete && (
                    <span className="text-red-600 text-[13px] font-semibold">Incompleta</span>
                )}
                <button
                    onClick={onEdit}
                    className="px-4 py-2 text-[13px] font-semibold text-[#635bff] border border-[#635bff] rounded-md hover:bg-[#f6f9fc] transition-colors"
                >
                    Editar
                </button>
            </div>
        </div>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

const DataRow = ({ label, value }) => (
    <div>
        <p className="text-[13px] text-[#8792a2] mb-1">{label}</p>
        <p className="text-[14px] text-[#32325d] font-medium">{value || 'No proporcionado'}</p>
    </div>
);

// Review and Submit Step
const ReviewAndSubmitStep = ({
    taxData,
    companyData,
    representativeData,
    productsData,
    publicData,
    bankData,
    securityData,
    onEdit
}) => {
    // Validation functions
    const isTaxDataComplete = () => {
        return taxData.nit && taxData.razonSocial && taxData.estructuraEmpresa;
    };

    const isCompanyDataComplete = () => {
        return companyData.nombreComercial && companyData.pais && companyData.provincia &&
            companyData.municipio && companyData.direccion && companyData.codigoPostal;
    };

    const isRepresentativeDataComplete = () => {
        return representativeData.nombreLegal && representativeData.apellidoLegal &&
            representativeData.email && representativeData.telefono &&
            representativeData.fechaNacimiento && representativeData.direccionDomicilio;
    };

    const isProductsDataComplete = () => {
        return productsData.categoria && productsData.descripcion;
    };

    const isPublicDataComplete = () => {
        return publicData.descripcionCargo && publicData.telefonoSoporte && publicData.direccionSoporte;
    };

    const isBankDataComplete = () => {
        return (bankData.method === 'selection' && bankData.bankId) ||
            (bankData.method === 'manual' && bankData.routingNumber && bankData.accountNumber);
    };

    const isSecurityDataComplete = () => {
        return securityData.isConfigured && securityData.recoveryCodesDownloaded;
    };

    const allSectionsComplete = isTaxDataComplete() && isCompanyDataComplete() &&
        isRepresentativeDataComplete() && isProductsDataComplete() &&
        isPublicDataComplete() && isBankDataComplete() && isSecurityDataComplete();

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-[26px] font-semibold text-[#32325d] mb-2">
                    Revisar y enviar
                </h3>
                <p className="text-[14px] text-[#4f5b76] leading-relaxed">
                    Dedica unos minutos a revisar tu información.
                </p>
            </div>

            {!allSectionsComplete && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-[13px] text-blue-900">
                        No podrás enviar hasta que completes todas las secciones.
                    </p>
                </div>
            )}

            {/* Tax Data Section */}
            <ReviewSection
                title="Datos fiscales"
                isComplete={isTaxDataComplete()}
                onEdit={() => onEdit(1)}
            >
                <DataRow label="NIT" value={taxData.nit} />
                <DataRow label="Razón Social" value={taxData.razonSocial} />
                <DataRow
                    label="Estructura de la empresa"
                    value={BUSINESS_STRUCTURES.find(s => s.value === taxData.estructuraEmpresa)?.label}
                />
            </ReviewSection>

            {/* Company Data Section */}
            <ReviewSection
                title="Datos de la empresa"
                isComplete={isCompanyDataComplete()}
                onEdit={() => onEdit(2)}
            >
                <DataRow label="Nombre Comercial" value={companyData.nombreComercial} />
                <DataRow label="País" value={COUNTRIES.find(c => c.value === companyData.pais)?.label} />
                <DataRow label="Provincia" value={CUBAN_PROVINCES.find(p => p.value === companyData.provincia)?.label} />
                <DataRow label="Municipio" value={companyData.municipio} />
                <DataRow label="Dirección" value={`${companyData.direccion}${companyData.apartamento ? ', Apt ' + companyData.apartamento : ''}`} />
                <DataRow label="Código Postal" value={companyData.codigoPostal} />
                {companyData.sitioWeb && <DataRow label="Sitio web" value={companyData.sitioWeb} />}
            </ReviewSection>

            {/* Representative Data Section */}
            <ReviewSection
                title="Representante de la empresa"
                isComplete={isRepresentativeDataComplete()}
                onEdit={() => onEdit(3)}
            >
                <DataRow label="Nombre completo" value={`${representativeData.nombreLegal} ${representativeData.apellidoLegal}`} />
                <DataRow label="Email" value={representativeData.email} />
                <DataRow label="Teléfono" value={`${representativeData.codigoPais} ${representativeData.telefono}`} />
                <DataRow label="Fecha de Nacimiento" value={representativeData.fechaNacimiento} />
                <DataRow label="Dirección Personal" value={`${representativeData.direccionDomicilio}, ${representativeData.municipioDomicilio}, ${representativeData.provinciaDomicilio}`} />
            </ReviewSection>

            {/* Products and Services Section */}
            <ReviewSection
                title="Productos o servicios"
                isComplete={isProductsDataComplete()}
                onEdit={() => onEdit(4)}
            >
                <DataRow
                    label="Categoría"
                    value={PRODUCT_CATEGORIES.flatMap(g => g.options).find(o => o.value === productsData.categoria)?.label}
                />
                <DataRow label="Descripción" value={productsData.descripcion} />
            </ReviewSection>

            {/* Public Data Section */}
            <ReviewSection
                title="Datos públicos"
                isComplete={isPublicDataComplete()}
                onEdit={() => onEdit(5)}
            >
                <DataRow
                    label="Descriptor de extracto"
                    value={publicData.descripcionCargo === 'personalizada'
                        ? publicData.descripcionCargoPersonalizada
                        : STATEMENT_DESCRIPTOR_OPTIONS.find(o => o.value === publicData.descripcionCargo)?.label}
                />
                <DataRow label="Teléfono de soporte" value={publicData.telefonoSoporte} />
                <DataRow label="Dirección de soporte" value={`${publicData.direccionSoporte}, ${publicData.municipioSoporte}, ${publicData.provinciaSoporte}`} />
                <DataRow label="Mostrar teléfono en recibos" value={publicData.mostrarTelefonoRecibos ? 'Sí' : 'No'} />
            </ReviewSection>

            {/* Bank Data Section */}
            <ReviewSection
                title="Añade tu banco"
                isComplete={isBankDataComplete()}
                onEdit={() => onEdit(6)}
            >
                {bankData.method === 'selection' && bankData.bankId ? (
                    <DataRow label="Banco seleccionado" value={bankData.bankId} />
                ) : bankData.method === 'manual' ? (
                    <>
                        <DataRow label="Número de ruta" value={bankData.routingNumber} />
                        <DataRow label="Número de cuenta" value={bankData.accountNumber ? '••••' + bankData.accountNumber.slice(-4) : ''} />
                    </>
                ) : (
                    <p className="text-[14px] text-[#32325d]">No proporcionado</p>
                )}
            </ReviewSection>

            {/* Security Data Section */}
            <ReviewSection
                title="Asegura tu cuenta"
                isComplete={isSecurityDataComplete()}
                onEdit={() => onEdit(7)}
            >
                <DataRow
                    label="Método de autenticación"
                    value={securityData.method === 'email' ? 'Autenticación por correo electrónico' : 'No configurado'}
                />
                {securityData.recoveryCodesDownloaded && (
                    <div className="flex items-center gap-2 text-[13px] text-green-600">
                        <Check className="w-4 h-4" />
                        <span>Códigos de recuperación descargados</span>
                    </div>
                )}
            </ReviewSection>
        </div>
    );
};

const SecureAccountStep = ({ securityData, updateSecurityData, onSetupMethod, email, errors }) => (
    <div className="space-y-6">
        <div>
            <h3 className="text-[26px] font-semibold text-[#32325d] mb-2">
                Mantén protegida tu cuenta
            </h3>
            <p className="text-[14px] text-[#4f5b76] leading-relaxed">
                AntillaPay utiliza un token de autenticación enviado a tu correo electrónico para verificar tu identidad y mantener tu cuenta segura.
            </p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-[13px] text-[#4f5b76] leading-relaxed">
                Esta configuración añade una capa extra de seguridad. Cada vez que inicies sesión desde un dispositivo nuevo, te enviaremos un código único.
            </p>
        </div>

        {/* Email Verification Card */}
        <div className="border border-gray-200 rounded-lg p-5 hover:border-[#635bff] transition-colors group">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 bg-[#f6f9fc] rounded-lg flex items-center justify-center group-hover:bg-[#635bff]/10 transition-colors">
                        <Mail className="w-5 h-5 text-[#635bff]" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-[14px] font-semibold text-[#32325d]">Autenticación por correo electrónico</h4>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[11px] font-semibold rounded">Recomendado</span>
                        </div>
                        <p className="text-[13px] text-[#4f5b76] leading-relaxed">
                            Recibirás un código de verificación en <strong>{email || 'tu correo electrónico'}</strong> para confirmar tu identidad.
                        </p>
                        {securityData.method === 'email' && securityData.isConfigured && (
                            <div className="mt-2 flex items-center gap-2 text-[13px] text-green-600">
                                <Check className="w-4 h-4" />
                                <span className="font-medium">Configurado</span>
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => onSetupMethod('email')}
                    className="ml-4 px-4 py-2 text-[13px] font-semibold text-[#635bff] hover:bg-[#f6f9fc] rounded-md transition-colors"
                >
                    {securityData.method === 'email' && securityData.isConfigured ? 'Reconfigurar' : 'Configurar'}
                </button>
            </div>
        </div>

        {/* Recovery Codes Info */}
        {securityData.isConfigured && (
            <div className="border-t border-gray-100 pt-6">
                <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-[#635bff] mt-0.5" />
                    <div>
                        <h4 className="text-[14px] font-semibold text-[#32325d] mb-1">Códigos de recuperación</h4>
                        <p className="text-[13px] text-[#4f5b76] mb-3">
                            Tus códigos de recuperación te permiten acceder a tu cuenta si pierdes el acceso a tu correo electrónico.
                        </p>
                        {securityData.recoveryCodesDownloaded && (
                            <div className="flex items-center gap-2 text-[13px] text-green-600">
                                <Check className="w-4 h-4" />
                                <span>Códigos descargados y guardados</span>
                            </div>
                        )}
                        {errors?.recoveryCodes && (
                            <div className="flex items-center gap-2 mt-2 text-[13px] text-red-600 bg-red-50 p-2 rounded">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.recoveryCodes}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* Global Method Error */}
        {errors?.method && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-[13px] mt-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.method}</span>
            </div>
        )}
    </div>
);

const ExitConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                        <h3 className="text-[16px] font-semibold text-[#32325d]">¿Salir de la verificación?</h3>
                    </div>
                </div>

                <p className="text-[14px] text-[#4f5b76] mb-6 leading-relaxed">
                    Tu progreso se guardará automáticamente. Puedes volver y terminar la verificación de tu empresa más tarde.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-[13px] font-semibold text-[#32325d] hover:bg-gray-50 rounded-md transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 text-[13px] font-semibold text-white bg-[#635bff] hover:bg-[#5851e0] rounded-md transition-colors shadow-sm"
                    >
                        Guardar y salir
                    </button>
                </div>
            </div>
        </div>
    );
};

const EmailVerificationModal = ({ isOpen, onClose, securityData, updateSecurityData, onComplete, email }) => {
    const [step, setStep] = useState(1); // 1: Send code, 2: Verify, 3: Recovery codes
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [codeSent, setCodeSent] = useState(false);

    const handleSendCode = () => {
        // Mock sending email - in real app, send via backend
        setCodeSent(true);
        setTimeout(() => setStep(2), 1000);
    };

    const handleVerify = () => {
        // Mock verification - in real app, verify server-side
        if (verificationCode.length === 6) {
            updateSecurityData('method', 'email');
            updateSecurityData('isConfigured', true);
            // Generate recovery codes
            const codes = Array.from({ length: 10 }, () =>
                Math.random().toString(36).substring(2, 10).toUpperCase()
            );
            updateSecurityData('recoveryCodes', codes);
            setStep(3);
            setError('');
        } else {
            setError('El código debe tener 6 dígitos');
        }
    };

    const handleDownloadCodes = () => {
        const codesText = securityData.recoveryCodes.join('\n');
        const blob = new Blob([`Códigos de recuperación de AntillaPay\n\nGuarda estos códigos en un lugar seguro:\n\n${codesText}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'antillapay-recovery-codes.txt';
        a.click();
        updateSecurityData('recoveryCodesDownloaded', true);
    };

    const handleComplete = () => {
        if (securityData.recoveryCodesDownloaded) {
            onComplete();
            onClose();
            setStep(1);
            setVerificationCode('');
            setCodeSent(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a2540]/20 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-[480px] overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-[18px] font-bold text-[#32325d]">
                        {step === 1 && 'Configurar autenticación'}
                        {step === 2 && 'Verificar token'}
                        {step === 3 && 'Códigos de recuperación'}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-[#4f5b76]" />
                    </button>
                </div>

                <div className="p-8">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <p className="text-[13px] text-[#4f5b76] mb-4">
                                    Enviaremos un token de verificación a tu correo electrónico:
                                </p>
                                <div className="p-4 bg-gray-50 rounded-lg text-center">
                                    <p className="text-[16px] font-semibold text-[#32325d]">{email || 'usuario@ejemplo.com'}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleSendCode}
                                disabled={codeSent}
                                className="w-full py-2.5 bg-[#635bff] text-white rounded-lg font-semibold text-[14px] hover:bg-[#5851e0] transition-colors disabled:opacity-50"
                            >
                                {codeSent ? 'Enviando token...' : 'Enviar token'}
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <p className="text-[13px] text-[#4f5b76]">
                                Introduce el token de 6 dígitos que recibiste por correo:
                            </p>

                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full px-4 py-3 text-[16px] text-center tracking-widest font-mono border border-gray-200 rounded-lg outline-none focus:border-[#635bff] focus:shadow-[0_0_0_3px_rgba(99,91,255,0.15)] transition-all"
                                    placeholder="000000"
                                    maxLength={6}
                                />
                                {error && <p className="text-[13px] text-red-600">{error}</p>}
                            </div>

                            <button
                                onClick={() => handleSendCode()}
                                className="text-[13px] text-[#635bff] hover:underline"
                            >
                                ¿No recibiste el token? Reenviar
                            </button>

                            <button
                                onClick={handleVerify}
                                disabled={verificationCode.length !== 6}
                                className="w-full py-2.5 bg-[#635bff] text-white rounded-lg font-semibold text-[14px] hover:bg-[#5851e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Verificar
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-[13px] text-amber-900 font-medium">
                                    ⚠️ Guarda estos códigos en un lugar seguro. Los necesitarás si pierdes el acceso a tu correo.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
                                {securityData.recoveryCodes.map((code, index) => (
                                    <div key={index} className="font-mono text-[13px] text-[#32325d] p-2 bg-white rounded border border-gray-200">
                                        {code}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleDownloadCodes}
                                className="w-full py-2.5 border border-[#635bff] text-[#635bff] rounded-lg font-semibold text-[14px] hover:bg-[#f6f9fc] transition-colors"
                            >
                                Descargar códigos
                            </button>

                            <button
                                onClick={handleComplete}
                                disabled={!securityData.recoveryCodesDownloaded}
                                className="w-full py-2.5 bg-[#635bff] text-white rounded-lg font-semibold text-[14px] hover:bg-[#5851e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Finalizar
                            </button>

                            {!securityData.recoveryCodesDownloaded && (
                                <p className="text-[12px] text-center text-[#8792a2]">
                                    Debes descargar los códigos antes de continuar
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// Sidebar navigation component
const SidebarNavigation = ({ currentStep, completedSteps, onStepClick, maxReachedStep }) => {
    const [expandedSections, setExpandedSections] = useState(['verify-business']);

    const toggleSection = (sectionId) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const steps = [
        {
            id: 'verify-business',
            label: 'Verifica tu empresa',
            expandable: true,
            substeps: [
                { id: 1, label: 'Datos fiscales' },
                { id: 2, label: 'Datos de la empresa' },
                { id: 3, label: 'Representante de la empresa' },
                { id: 4, label: 'Productos y servicios' },
                { id: 5, label: 'Datos públicos' }
            ]
        },
        {
            id: 'add-bank',
            label: 'Añade tu banco',
            expandable: false,
            stepId: 6
        },
        {
            id: 'secure-account',
            label: 'Asegura tu cuenta',
            expandable: false,
            stepId: 7
        },
        {
            id: 'review-send',
            label: 'Revisar y enviar',
            expandable: false,
            stepId: 8
        }
    ];

    const getStepStatus = (stepId) => {
        if (typeof stepId === 'string') {
            // Handle logical sections (like 'verify-business')
            if (stepId === 'verify-business') {
                const substeps = [1, 2, 3, 4, 5];
                if (substeps.includes(currentStep)) return 'current';
                if (substeps.every(id => completedSteps.includes(id))) return 'completed';
                return 'pending';
            }
            return 'pending';
        }
        if (completedSteps.includes(stepId)) return 'completed';
        if (currentStep === stepId) return 'current';
        return 'pending';
    };

    const canNavigateToStep = (stepId) => {
        if (typeof stepId === 'string') return true;
        if (stepId <= maxReachedStep + 1) return true;
        return true; // Per previous requirement: allow navigation regardless
    };

    return (
        <div className="w-[280px] bg-white border-r border-gray-200 h-screen flex flex-col">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-[18px] font-semibold text-[#32325d]">Activa tu cuenta</h2>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-0.5">
                {steps.map((step, index) => (
                    <div key={step.id} className="relative">
                        {/* Vertical line connecting to next main step */}
                        {index < steps.length - 1 && (
                            <div className="absolute left-[21px] top-[32px] bottom-[-4px] border-l-2 border-dashed border-gray-100 z-0" />
                        )}

                        {step.expandable ? (
                            <>
                                <div
                                    onClick={() => toggleSection(step.id)}
                                    className="flex items-center gap-3 px-3 py-2 text-[13px] text-[#32325d] cursor-pointer hover:bg-gray-50 rounded-md transition-colors relative z-10"
                                >
                                    <div className={cn(
                                        "w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 flex items-center justify-center bg-white",
                                        getStepStatus(step.id) === 'current' ? "border-[#635bff] border-t-transparent animate-spin duration-700" : (getStepStatus(step.id) === 'completed' ? "bg-[#635bff] border-[#635bff]" : "border-gray-200")
                                    )}>
                                        {getStepStatus(step.id) === 'completed' && <Check className="w-2.5 h-2.5 text-white" />}
                                        {getStepStatus(step.id) === 'current' && <div className="w-1 h-1 rounded-full bg-[#635bff] animate-none" />}
                                    </div>
                                    {/* Static progress ring for "current" state to avoid spinning the check icon if it was completed but still the "current" section */}
                                    {getStepStatus(step.id) === 'current' && (
                                        <div className="absolute left-[15px] w-[18px] h-[18px] rounded-full border-2 border-[#635bff] border-t-transparent animate-spin duration-1000 pointer-events-none" />
                                    )}

                                    <span className={cn("text-[14px]", getStepStatus(step.id) === 'current' ? "font-bold text-[#32325d]" : "font-semibold text-[#4f5b76]")}>
                                        {step.label}
                                    </span>
                                </div>
                                {expandedSections.includes(step.id) && (
                                    <div className="ml-[21px] mt-1 space-y-1 relative">
                                        {/* Light line for substeps */}
                                        <div className="absolute left-0 top-0 bottom-4 border-l border-gray-100" />

                                        {step.substeps.map((substep) => {
                                            const status = getStepStatus(substep.id);
                                            const canNavigate = canNavigateToStep(substep.id);
                                            return (
                                                <div
                                                    key={substep.id}
                                                    onClick={() => canNavigate && onStepClick(substep.id)}
                                                    className={cn(
                                                        "flex items-center gap-3 px-4 py-1.5 text-[13px] rounded-md transition-colors relative z-10",
                                                        canNavigate ? "cursor-pointer hover:bg-gray-50" : "cursor-not-allowed opacity-50",
                                                        status === 'current' && "bg-[#f6f9fc]"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-[14px] h-[14px] rounded-full flex-shrink-0 flex items-center justify-center",
                                                        status === 'completed' ? "bg-[#635bff]" : (status === 'current' ? "border-2 border-[#635bff]" : "border-2 border-gray-200")
                                                    )}>
                                                        {status === 'completed' && <Check className="w-2.5 h-2.5 text-white" />}
                                                    </div>
                                                    <span className={cn(
                                                        "text-[13px]",
                                                        status === 'current' ? "text-[#635bff] font-bold" : "text-[#4f5b76]"
                                                    )}>
                                                        {substep.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div
                                onClick={() => canNavigateToStep(step.stepId) && onStepClick(step.stepId)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 text-[13px] rounded-md transition-colors mt-1 relative z-10",
                                    canNavigateToStep(step.stepId) ? "cursor-pointer hover:bg-gray-50" : "cursor-not-allowed opacity-50",
                                    getStepStatus(step.stepId) === 'current' && "bg-[#f6f9fc]"
                                )}
                            >
                                <div className={cn(
                                    "w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 flex items-center justify-center bg-white",
                                    getStepStatus(step.stepId) === 'completed' ? "bg-[#635bff] border-[#635bff]" : (getStepStatus(step.stepId) === 'current' ? "border-[#635bff]" : "border-gray-200 border-dashed")
                                )}>
                                    {getStepStatus(step.stepId) === 'completed' && <Check className="w-2.5 h-2.5 text-white" />}
                                    {getStepStatus(step.stepId) === 'current' && <div className="w-1 h-1 rounded-full bg-[#635bff]" />}
                                </div>

                                <span className={cn(
                                    "text-[14px]",
                                    getStepStatus(step.stepId) === 'current' ? "text-[#635bff] font-bold" : "text-[#4f5b76] font-semibold"
                                )}>
                                    {step.label}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </div>
    );
};

// Main page component
export default function BusinessVerification() {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        currentStep,
        taxData,
        companyData,
        representativeData,
        productsData,
        publicData,
        bankData,
        securityData,
        errors,
        updateTaxData,
        updateCompanyData,
        updateRepresentativeData,
        updateProductsData,
        updatePublicData,
        updateBankData,
        updateSecurityData,
        nextStep,
        goToStep,
        submitVerification,
        validateAllSteps
    } = useBusinessVerification();

    const [completedSteps, setCompletedSteps] = useState([]);
    const [maxReachedStep, setMaxReachedStep] = useState(1);
    const [isManualBankModalOpen, setIsManualBankModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);

    // Update maxReachedStep when currentStep increases or loads from storage
    useEffect(() => {
        if (currentStep > maxReachedStep) {
            setMaxReachedStep(currentStep);
        }
    }, [currentStep]);

    // Handle direct navigation to specific steps from Dashboard
    useEffect(() => {
        if (location.state?.targetStep) {
            // Allow navigation to any step (or restrict if needed)
            // Since we validate access in Dashboard, we assume it's safe here
            goToStep(location.state.targetStep);

            // Clear the state to avoid repeated navigation on re-renders
            window.history.replaceState({}, document.title);
        }
    }, [location.state, goToStep]);

    const handleContinue = () => {
        if (currentStep === 8) {
            if (validateAllSteps() && submitVerification()) {
                // Mark task as complete and navigate back to dashboard
                // In a real app, this would trigger a backend process
                // For now, we'll simulate a successful submission
                alert('Tu solicitud ha sido enviada a revisión. Te notificaremos cuando tu cuenta esté activa.');

                const tasks = JSON.parse(localStorage.getItem('onboardingTasks') || '[]');
                const updatedTasks = tasks.map(task =>
                    task.id === 'activate-account' ? { ...task, completed: true } : task
                );
                localStorage.setItem('onboardingTasks', JSON.stringify(updatedTasks));
                navigate('/dashboard');
            }
        } else {
            // Mark current step as completed
            if (!completedSteps.includes(currentStep)) {
                setCompletedSteps([...completedSteps, currentStep]);
            }
            nextStep();
        }
    };

    const handleStepClick = (stepId) => {
        goToStep(stepId);
    };

    const handleClose = () => {
        setIsExitModalOpen(true);
    };

    const confirmExit = () => {
        setIsExitModalOpen(false);
        navigate('/dashboard');
    };

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <SidebarNavigation
                currentStep={currentStep}
                completedSteps={completedSteps}
                onStepClick={handleStepClick}
                maxReachedStep={maxReachedStep}
            />

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-end">
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-[680px] mx-auto px-8 py-8">
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
                        {currentStep === 5 && (
                            <PublicDataStep
                                publicData={publicData}
                                updatePublicData={updatePublicData}
                                errors={errors}
                            />
                        )}
                        {currentStep === 6 && (
                            <BankDataStep
                                bankData={bankData}
                                updateBankData={updateBankData}
                                onManualInput={() => setIsManualBankModalOpen(true)}
                            />
                        )}
                        {currentStep === 7 && (
                            <SecureAccountStep
                                securityData={securityData}
                                updateSecurityData={updateSecurityData}
                                onSetupMethod={(method) => {
                                    if (method === 'email') {
                                        setIsEmailModalOpen(true);
                                    }
                                }}
                                email={representativeData.email}
                                errors={errors}
                            />
                        )}
                        {currentStep === 8 && (
                            <ReviewAndSubmitStep
                                taxData={taxData}
                                companyData={companyData}
                                representativeData={representativeData}
                                productsData={productsData}
                                publicData={publicData}
                                bankData={bankData}
                                securityData={securityData}
                                onEdit={(stepNumber) => goToStep(stepNumber)}
                            />
                        )}
                    </div>
                </div>

                {/* Footer with Continue button */}
                <div className="px-8 py-6 border-t border-gray-100">
                    <div className="max-w-[680px] mx-auto flex justify-end">
                        <button
                            onClick={handleContinue}
                            disabled={currentStep === 8 && !validateAllSteps()}
                            className={cn(
                                "rounded-md px-6 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors",
                                (currentStep === 8 && !validateAllSteps())
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-[#635bff] hover:bg-[#5851e0]"
                            )}
                        >
                            {currentStep === 8 ? 'Activar cuenta' : 'Continuar'}
                        </button>
                    </div>
                </div>

                <ManualBankModal
                    isOpen={isManualBankModalOpen}
                    onClose={() => setIsManualBankModalOpen(false)}
                    bankData={bankData}
                    updateBankData={updateBankData}
                    onSave={() => {
                        setIsManualBankModalOpen(false);
                        handleContinue();
                    }}
                />

                <EmailVerificationModal
                    isOpen={isEmailModalOpen}
                    onClose={() => setIsEmailModalOpen(false)}
                    securityData={securityData}
                    updateSecurityData={updateSecurityData}
                    email={representativeData.email}
                    onComplete={() => {
                        console.log('Email auth setup completed');
                    }}
                />
            </div>

            <ExitConfirmationModal
                isOpen={isExitModalOpen}
                onClose={() => setIsExitModalOpen(false)}
                onConfirm={confirmExit}
            />
        </div>
    );
}
