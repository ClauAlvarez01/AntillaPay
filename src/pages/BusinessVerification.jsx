/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
        }
    ];

    const getStepStatus = (stepId) => {
        if (completedSteps.includes(stepId)) return 'completed'; // Only show check if actually completed
        if (currentStep === stepId) return 'current'; // Current step highlight
        return 'pending';
    };

    const canNavigateToStep = (stepId) => {
        return true; // Always allow navigation regardless of completion status
    };

    return (
        <div className="w-[280px] bg-white border-r border-gray-200 h-screen flex flex-col">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-[18px] font-semibold text-[#32325d]">Activa tu cuenta</h2>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
                {steps.map((step) => (
                    <div key={step.id}>
                        {step.expandable ? (
                            <>
                                <div
                                    onClick={() => toggleSection(step.id)}
                                    className="flex items-center gap-2 px-3 py-2 text-[13px] font-semibold text-[#32325d] cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    <ChevronRight
                                        className={cn(
                                            "w-4 h-4 transition-transform text-[#8792a2]",
                                            expandedSections.includes(step.id) ? "rotate-90" : ""
                                        )}
                                    />
                                    {step.label}
                                </div>
                                {expandedSections.includes(step.id) && (
                                    <div className="ml-6 mt-1 space-y-1">
                                        {step.substeps.map((substep) => {
                                            const status = getStepStatus(substep.id);
                                            const canNavigate = canNavigateToStep(substep.id);
                                            return (
                                                <div
                                                    key={substep.id}
                                                    onClick={() => canNavigate && onStepClick(substep.id)}
                                                    className={cn(
                                                        "flex items-center gap-3 px-3 py-2 text-[13px] rounded-md transition-colors",
                                                        canNavigate ? "cursor-pointer hover:bg-gray-50" : "cursor-not-allowed opacity-50",
                                                        status === 'current' && "bg-[#f6f9fc]"
                                                    )}
                                                >
                                                    {status === 'completed' && (
                                                        <div className="w-4 h-4 rounded-full bg-[#635bff] flex items-center justify-center flex-shrink-0">
                                                            <Check className="w-3 h-3 text-white" />
                                                        </div>
                                                    )}
                                                    {status === 'current' && (
                                                        <div className="w-4 h-4 rounded-full border-2 border-[#635bff] flex-shrink-0" />
                                                    )}
                                                    {status === 'pending' && (
                                                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                                                    )}
                                                    <span className={cn(
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
                                onClick={() => canNavigateToStep(step.id) && onStepClick(step.id)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 text-[13px] rounded-md transition-colors mt-1",
                                    canNavigateToStep(step.id) ? "cursor-pointer hover:bg-gray-50" : "cursor-not-allowed opacity-50",
                                    getStepStatus(step.id) === 'current' && "bg-[#f6f9fc]"
                                )}
                            >
                                {getStepStatus(step.id) === 'completed' && (
                                    <div className="w-4 h-4 rounded-full bg-[#635bff] flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                                {getStepStatus(step.id) === 'current' && (
                                    <div className="w-4 h-4 rounded-full border-2 border-[#635bff] flex-shrink-0" />
                                )}
                                {getStepStatus(step.id) === 'pending' && (
                                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                                )}
                                <span className={cn(
                                    getStepStatus(step.id) === 'current' ? "text-[#635bff] font-bold" : "text-[#4f5b76]"
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
    const {
        currentStep,
        taxData,
        companyData,
        representativeData,
        productsData,
        publicData,
        errors,
        updateTaxData,
        updateCompanyData,
        updateRepresentativeData,
        updateProductsData,
        updatePublicData,
        nextStep,
        goToStep,
        submitVerification
    } = useBusinessVerification();

    const [completedSteps, setCompletedSteps] = useState([]);
    const [maxReachedStep, setMaxReachedStep] = useState(1);

    // Update maxReachedStep when currentStep increases or loads from storage
    useEffect(() => {
        if (currentStep > maxReachedStep) {
            setMaxReachedStep(currentStep);
        }
    }, [currentStep]);

    const handleContinue = () => {
        if (currentStep === 5) {
            if (submitVerification()) {
                // Mark task as complete and navigate back to dashboard
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
        if (window.confirm('¿Estás seguro de que quieres salir? Tu progreso se guardará.')) {
            navigate('/dashboard');
        }
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
                    </div>
                </div>

                {/* Footer with Continue button */}
                <div className="px-8 py-6 border-t border-gray-100">
                    <div className="max-w-[680px] mx-auto flex justify-end">
                        <button
                            onClick={handleContinue}
                            className="rounded-md bg-[#635bff] px-6 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:bg-[#5851e0] transition-colors"
                        >
                            {currentStep === 5 ? 'Activar cuenta' : 'Continuar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
