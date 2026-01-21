import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AlertCircle,
    Building2,
    Check,
    ChevronDown,
    Info,
    Mail,
    Monitor,
    Smartphone,
    Upload,
    User,
    X
} from "lucide-react";

const CURRENCIES = [
    { code: "USD", name: "dólar estadounidense" },
    { code: "EUR", name: "euro" },
    { code: "GBP", name: "libra esterlina" },
    { code: "CAD", name: "dólar canadiense" },
    { code: "AUD", name: "dólar australiano" },
    { code: "NZD", name: "dólar neozelandés" },
    { code: "CHF", name: "franco suizo" },
    { code: "SEK", name: "corona sueca" },
    { code: "NOK", name: "corona noruega" },
    { code: "DKK", name: "corona danesa" },
    { code: "ISK", name: "corona islandesa" },
    { code: "JPY", name: "yen japonés" },
    { code: "CNY", name: "yuan chino" },
    { code: "HKD", name: "dólar hongkonés" },
    { code: "SGD", name: "dólar singapurense" },
    { code: "KRW", name: "won surcoreano" },
    { code: "INR", name: "rupia india" },
    { code: "IDR", name: "rupia indonesia" },
    { code: "MYR", name: "ringgit malasio" },
    { code: "PHP", name: "peso filipino" },
    { code: "THB", name: "baht tailandés" },
    { code: "VND", name: "dong vietnamita" },
    { code: "TWD", name: "dólar taiwanés" },
    { code: "PKR", name: "rupia pakistaní" },
    { code: "BDT", name: "taka bangladesí" },
    { code: "LKR", name: "rupia de Sri Lanka" },
    { code: "AED", name: "dírham de los Emiratos Árabes Unidos" },
    { code: "SAR", name: "riyal saudí" },
    { code: "KWD", name: "dinar kuwaití" },
    { code: "QAR", name: "riyal catarí" },
    { code: "BHD", name: "dinar bareiní" },
    { code: "OMR", name: "rial omaní" },
    { code: "JOD", name: "dinar jordano" },
    { code: "ILS", name: "nuevo shekel israelí" },
    { code: "TRY", name: "lira turca" },
    { code: "RUB", name: "rublo ruso" },
    { code: "UAH", name: "grivna ucraniana" },
    { code: "PLN", name: "zloty polaco" },
    { code: "CZK", name: "corona checa" },
    { code: "HUF", name: "forinto húngaro" },
    { code: "RON", name: "leu rumano" },
    { code: "BGN", name: "lev búlgaro" },
    { code: "HRK", name: "kuna croata" },
    { code: "RSD", name: "dinar serbio" },
    { code: "GEL", name: "lari georgiano" },
    { code: "KZT", name: "tenge kazajo" },
    { code: "AZN", name: "manat azerí" },
    { code: "AMD", name: "dram armenio" },
    { code: "MNT", name: "tugrik mongol" },
    { code: "ZAR", name: "rand sudafricano" },
    { code: "NGN", name: "naira nigeriana" },
    { code: "GHS", name: "cedi ghanés" },
    { code: "KES", name: "chelín keniano" },
    { code: "UGX", name: "chelín ugandés" },
    { code: "TZS", name: "chelín tanzano" },
    { code: "EGP", name: "libra egipcia" },
    { code: "MAD", name: "dírham marroquí" },
    { code: "TND", name: "dinar tunecino" },
    { code: "DZD", name: "dinar argelino" },
    { code: "BRL", name: "real brasileño" },
    { code: "ARS", name: "peso argentino" },
    { code: "CLP", name: "peso chileno" },
    { code: "COP", name: "peso colombiano" },
    { code: "PEN", name: "sol peruano" },
    { code: "MXN", name: "peso mexicano" },
    { code: "UYU", name: "peso uruguayo" },
    { code: "BOB", name: "boliviano" },
    { code: "PYG", name: "guaraní paraguayo" },
    { code: "CRC", name: "colón costarricense" },
    { code: "GTQ", name: "quetzal guatemalteco" },
    { code: "HNL", name: "lempira hondureño" },
    { code: "NIO", name: "córdoba nicaragüense" },
    { code: "DOP", name: "peso dominicano" },
    { code: "JMD", name: "dólar jamaicano" },
    { code: "TTD", name: "dólar trinitense" },
    { code: "XCD", name: "dólar del Caribe Oriental" },
    { code: "BBD", name: "dólar barbadense" },
    { code: "BMD", name: "dólar bermudeño" },
    { code: "BSD", name: "dólar bahameño" },
    { code: "XCG", name: "florín caribeño" },
    { code: "XOF", name: "franco CFA de África Occidental" },
    { code: "XAF", name: "franco CFA de África Central" },
    { code: "XPF", name: "franco CFP" },
    { code: "MZN", name: "metical mozambiqueño" },
    { code: "ETB", name: "birr etíope" },
    { code: "MUR", name: "rupia mauriciana" },
    { code: "NPR", name: "rupia nepalesa" },
    { code: "LAK", name: "kip laosiano" },
    { code: "KHR", name: "riel camboyano" },
    { code: "MMK", name: "kyat birmano" },
    { code: "MOP", name: "pataca macaense" },
    { code: "ALL", name: "lek albanés" },
    { code: "MKD", name: "denar macedonio" },
    { code: "BAM", name: "marco convertible" },
    { code: "MDL", name: "leu moldavo" },
    { code: "BYN", name: "rublo bielorruso" },
    { code: "BWP", name: "pula botsuano" },
    { code: "WST", name: "tala samoano" },
    { code: "FJD", name: "dólar fiyiano" },
    { code: "PGK", name: "kina de Papúa Nueva Guinea" },
    { code: "SBD", name: "dólar de las Islas Salomón" },
    { code: "TOP", name: "paʻanga tongano" },
    { code: "VUV", name: "vatu vanuatuense" },
    { code: "BTN", name: "ngultrum butanés" },
    { code: "MVR", name: "rufiyaa maldiva" },
    { code: "KGS", name: "som kirguís" },
    { code: "UZS", name: "som uzbeko" },
    { code: "TJS", name: "somoni tayiko" },
    { code: "SDG", name: "libra sudanesa" },
    { code: "SOS", name: "chelín somalí" },
    { code: "AOA", name: "kwanza angoleño" }
];

const getCurrencySymbol = (code) => {
    try {
        const parts = new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: code,
            currencyDisplay: "narrowSymbol",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).formatToParts(0);
        const currencyPart = parts.find((part) => part.type === "currency");
        return currencyPart ? currencyPart.value : code;
    } catch (error) {
        return code;
    }
};

export default function PaymentLinksCreate() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [previewMode, setPreviewMode] = useState("monitor");
    const [activeSection, setActiveSection] = useState("after_payment");
    const [replaceConfirmationMessage, setReplaceConfirmationMessage] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [createPdfInvoice, setCreatePdfInvoice] = useState(false);
    const [currencyCode, setCurrencyCode] = useState("USD");
    const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
    const [currencyQuery, setCurrencyQuery] = useState("");
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [callToAction, setCallToAction] = useState("Pagar");
    const [collectCustomerName, setCollectCustomerName] = useState(false);
    const [customerNameOptional, setCustomerNameOptional] = useState(false);
    const [collectCompanyName, setCollectCompanyName] = useState(false);
    const [companyNameOptional, setCompanyNameOptional] = useState(false);
    const [limitPayments, setLimitPayments] = useState(false);
    const [paymentsTotal, setPaymentsTotal] = useState("1");
    const [customMessage, setCustomMessage] = useState(false);
    const [customMessageText, setCustomMessageText] = useState("");
    const [previewTab, setPreviewTab] = useState("checkout");
    const [customFieldsEnabled, setCustomFieldsEnabled] = useState(false);
    const [customFields, setCustomFields] = useState([]);
    const [suggestPresetAmount, setSuggestPresetAmount] = useState(false);
    const [presetAmount, setPresetAmount] = useState("");
    const [useLimits, setUseLimits] = useState(false);
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    const fileInputRef = useRef(null);
    const customFieldCounter = useRef(0);
    const currencyMenuRef = useRef(null);
    const currencySearchRef = useRef(null);
    const selectedCurrency = CURRENCIES.find((currency) => currency.code === currencyCode) || CURRENCIES[0];
    const isUsd = selectedCurrency.code === "USD";
    const currencySymbol = getCurrencySymbol(selectedCurrency.code);
    const currencyPreview = currencySymbol;
    const previewAmount = suggestPresetAmount && presetAmount.trim() ? presetAmount.trim() : "0,00";
    const normalizeText = (value) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedQuery = normalizeText(currencyQuery.trim());
    const filteredCurrencies = normalizedQuery
        ? CURRENCIES.filter((currency) => normalizeText(`${currency.code} ${currency.name}`).includes(normalizedQuery))
        : CURRENCIES;
    const isInactivePreview = customMessage && previewTab === "inactive";
    const isAfterPayment = activeSection === "after_payment";
    const confirmationPreviewTitle = replaceConfirmationMessage && confirmationMessage.trim()
        ? confirmationMessage.trim()
        : "Gracias por el pago";
    const previewDomain = isAfterPayment ? "book.antillapay.com" : "buy.antillapay.com";
    const createCustomField = () => ({
        id: `custom-field-${customFieldCounter.current++}`,
        type: "Texto",
        label: "",
        isOptional: false,
        hasDefault: false,
        defaultValue: "",
        hasLimit: false,
        limitType: "Como maximo",
        limitValue: "255"
    });
    const addCustomField = () => {
        setCustomFields((prev) => [...prev, createCustomField()]);
    };
    const updateCustomField = (id, updates) => {
        setCustomFields((prev) =>
            prev.map((field) => (field.id === id ? { ...field, ...updates } : field))
        );
    };
    const renderContactInfoSection = (showTitle = true) => (
        <div className="space-y-3">
            {showTitle && (
                <div className="text-[15px] font-semibold text-[#1a1f36]">Información de contacto</div>
            )}
            <div className="text-[13px] text-[#4f5b76]">Datos de contacto</div>
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className={`flex items-center gap-2 px-3 py-2.5 ${collectCustomerName || collectCompanyName ? "border-b border-gray-100" : ""}`}>
                    <Mail className="w-4 h-4 text-[#9ca3af]" />
                    <input
                        type="text"
                        placeholder="correoelectrónico@ejemplo.com"
                        className="flex-1 bg-transparent text-[14px] text-[#1a1f36] placeholder:text-[#aab2c4] focus:outline-none"
                    />
                </div>
                {collectCustomerName && (
                    <div className={`flex items-center justify-between gap-2 px-3 py-2.5 ${collectCompanyName ? "border-b border-gray-100" : ""}`}>
                        <div className="flex items-center gap-2 flex-1">
                            <User className="w-4 h-4 text-[#9ca3af]" />
                            <input
                                type="text"
                                placeholder="Nombre completo"
                                className="flex-1 bg-transparent text-[14px] text-[#1a1f36] placeholder:text-[#aab2c4] focus:outline-none"
                            />
                        </div>
                        {customerNameOptional && (
                            <span className="text-[11px] text-[#6b7280] border border-gray-200 rounded-full px-2 py-0.5">
                                Opcional
                            </span>
                        )}
                    </div>
                )}
                {collectCompanyName && (
                    <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                        <div className="flex items-center gap-2 flex-1">
                            <Building2 className="w-4 h-4 text-[#9ca3af]" />
                            <input
                                type="text"
                                placeholder="Nombre de la empresa"
                                className="flex-1 bg-transparent text-[14px] text-[#1a1f36] placeholder:text-[#aab2c4] focus:outline-none"
                            />
                        </div>
                        {companyNameOptional && (
                            <span className="text-[11px] text-[#6b7280] border border-gray-200 rounded-full px-2 py-0.5">
                                Opcional
                            </span>
                        )}
                    </div>
                )}
            </div>
            {customFieldsEnabled && customFields.length > 0 && (
                <div className="space-y-3 pt-2">
                    {customFields.map((field) => {
                        const labelText = field.label.trim() || "Nombre de la etiqueta";
                        const limitValue = Number(field.limitValue);
                        const maxLength = field.hasLimit && field.limitType === "Como maximo" && Number.isFinite(limitValue)
                            ? limitValue
                            : undefined;
                        return (
                            <div key={field.id} className="space-y-2">
                                <div className="flex items-center justify-between text-[13px] text-[#4f5b76]">
                                    <span>{labelText}</span>
                                    {field.isOptional && (
                                        <span className="text-[11px] text-[#6b7280] border border-gray-200 rounded-full px-2 py-0.5">
                                            Opcional
                                        </span>
                                    )}
                                </div>
                                {field.type === "Desplegable" ? (
                                    <div className="relative">
                                        <select
                                            defaultValue=""
                                            className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2 text-[14px] text-[#32325d] focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
                                        >
                                            <option>
                                                {field.hasDefault && field.defaultValue.trim()
                                                    ? field.defaultValue
                                                    : "Selecciona una opción"}
                                            </option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-400" />
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        inputMode={field.type === "Solo números" ? "numeric" : "text"}
                                        defaultValue={field.hasDefault ? field.defaultValue : ""}
                                        maxLength={maxLength}
                                        placeholder={
                                            field.hasDefault
                                                ? ""
                                                : field.type === "Solo números"
                                                    ? "Solo números"
                                                    : ""
                                        }
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[14px] text-[#32325d] placeholder:text-[#aab2c4] focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    useEffect(() => {
        if (currencyMenuOpen) {
            currencySearchRef.current?.focus();
        }
    }, [currencyMenuOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!currencyMenuOpen) return;
            if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target)) {
                setCurrencyMenuOpen(false);
            }
        };
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setCurrencyMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [currencyMenuOpen]);

    useEffect(() => {
        if (!customMessage && previewTab !== "checkout") {
            setPreviewTab("checkout");
        }
    }, [customMessage, previewTab]);

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            setImageUrl("");
            return;
        }
        const nextUrl = URL.createObjectURL(file);
        setImageUrl((prev) => {
            if (prev) {
                URL.revokeObjectURL(prev);
            }
            return nextUrl;
        });
    };

    return (
        <div className="w-full min-h-screen bg-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard/payment-links")}
                        className="text-[#8792a2] hover:text-[#32325d] transition-colors"
                        aria-label="Cerrar creación de enlace"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-gray-200" />
                    <span className="text-[15px] font-semibold text-[#32325d]">Crear enlace de pago</span>
                </div>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-md bg-[#a7a5ff] px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#8f8dff]"
                >
                    Crear enlace
                    <Check className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[520px_1fr] min-h-[calc(100vh-72px)]">
                <div className="p-8 space-y-6">
                    <div className="space-y-3">
                        <h2 className="text-[18px] font-semibold text-[#32325d]">Elegir tipo</h2>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-[#32325d] shadow-sm"
                        >
                            Los clientes deciden qué pagar
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>

                    <div className="flex items-center gap-6 border-b border-gray-200">
                        <button
                            type="button"
                            onClick={() => setActiveSection("payment")}
                            className={`text-[14px] font-semibold pb-3 border-b-2 transition-colors ${activeSection === "payment"
                                ? "text-[#635bff] border-[#635bff]"
                                : "text-[#8792a2] border-transparent hover:text-[#32325d]"
                                }`}
                        >
                            Página de pagos
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveSection("after_payment")}
                            className={`text-[14px] font-semibold pb-3 border-b-2 transition-colors ${activeSection === "after_payment"
                                ? "text-[#635bff] border-[#635bff]"
                                : "text-[#8792a2] border-transparent hover:text-[#32325d]"
                                }`}
                        >
                            Después del pago
                        </button>
                    </div>

                    {activeSection === "payment" ? (
                        <>
                    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[13px] font-semibold text-[#32325d]">Título</label>
                                <input
                                    type="text"
                                    placeholder="Nombre del motivo o del servicio"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    className="w-full h-10 rounded-md border border-gray-200 px-3 text-[13px] text-[#4f5b76] placeholder:text-[#aab2c4] focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <label className="text-[13px] font-semibold text-[#32325d]">Descripción</label>
                                    <span className="text-[11px] text-[#8792a2] border border-gray-200 rounded-full px-2 py-0.5">
                                        Opcional
                                    </span>
                                </div>
                                <textarea
                                    rows={4}
                                    placeholder="Dales a los clientes más información sobre lo que están pagando."
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-[13px] text-[#4f5b76] placeholder:text-[#aab2c4] focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <label className="text-[13px] font-semibold text-[#32325d]">Imagen</label>
                                <span className="text-[11px] text-[#8792a2] border border-gray-200 rounded-full px-2 py-0.5">
                                    Opcional
                                </span>
                            </div>
                            <div className="h-[150px] w-full border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-[13px] text-[#635bff] font-semibold overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-full flex items-center justify-center gap-2"
                                >
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt="Vista previa de la imagen"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            Cargar
                                        </>
                                    )}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[13px] font-semibold text-[#32325d]">Divisa</label>
                        <div className="relative" ref={currencyMenuRef}>
                            <button
                                type="button"
                                aria-expanded={currencyMenuOpen}
                                aria-controls="currency-menu"
                                onClick={() => setCurrencyMenuOpen((prev) => !prev)}
                                className="w-full flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[14px] text-[#32325d] shadow-sm"
                            >
                                <span className="truncate">
                                    {selectedCurrency.code} - {selectedCurrency.name}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${currencyMenuOpen ? "rotate-180" : ""}`} />
                            </button>
                            {currencyMenuOpen && (
                                <div
                                    id="currency-menu"
                                    className="absolute left-0 right-0 z-20 mt-2 rounded-xl border border-gray-200 bg-white shadow-[0_20px_35px_-20px_rgba(15,23,42,0.45)]"
                                >
                                    <div className="border-b border-gray-100 px-4 py-2.5">
                                        <input
                                            ref={currencySearchRef}
                                            value={currencyQuery}
                                            onChange={(event) => setCurrencyQuery(event.target.value)}
                                            placeholder="Busca..."
                                            className="w-full text-[16px] text-[#32325d] placeholder:text-[#aab2c4] focus:outline-none"
                                        />
                                    </div>
                                    <div className="max-h-72 overflow-auto py-1">
                                        {filteredCurrencies.length === 0 ? (
                                            <div className="px-4 py-3 text-[13px] text-[#8792a2]">Sin resultados</div>
                                        ) : (
                                            filteredCurrencies.map((currency) => {
                                                const isSelected = currency.code === currencyCode;
                                                return (
                                                    <button
                                                        key={currency.code}
                                                        type="button"
                                                        onClick={() => {
                                                            setCurrencyCode(currency.code);
                                                            setCurrencyMenuOpen(false);
                                                            setCurrencyQuery("");
                                                        }}
                                                        className={`w-full text-left px-4 py-2.5 text-[15px] text-[#32325d] transition-colors ${isSelected
                                                            ? "bg-[#f5f6ff] text-[#2f2c73]"
                                                            : "hover:bg-[#f7f7f9]"
                                                            }`}
                                                    >
                                                        {currency.code} - {currency.name}
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[13px] text-[#4f5b76]">
                            <input
                                type="checkbox"
                                checked={suggestPresetAmount}
                                onChange={(event) => setSuggestPresetAmount(event.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <span>Sugerir un importe predefinido</span>
                            <Info className="w-3.5 h-3.5 text-gray-300" />
                        </label>
                        {suggestPresetAmount && (
                            <div className="pl-7">
                                <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-[15px] text-[#32325d] shadow-sm">
                                    <span className="text-[#6b7280]">{currencySymbol}</span>
                                    <input
                                        type="text"
                                        value={presetAmount}
                                        onChange={(event) => setPresetAmount(event.target.value)}
                                        placeholder="10,00"
                                        className="flex-1 bg-transparent text-[15px] text-[#32325d] placeholder:text-[#aab2c4] focus:outline-none"
                                    />
                                </div>
                            </div>
                        )}
                        <label className="flex items-center gap-2 text-[13px] text-[#4f5b76]">
                            <input
                                type="checkbox"
                                checked={useLimits}
                                onChange={(event) => setUseLimits(event.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <span>Establecer límites</span>
                            <Info className="w-3.5 h-3.5 text-gray-300" />
                        </label>
                        {useLimits && (
                            <div className="grid grid-cols-1 gap-3 pl-7 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="text-[13px] text-[#4f5b76]">Importe mínimo</div>
                                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-[15px] text-[#32325d] shadow-sm">
                                        <span className="text-[#6b7280]">{currencySymbol}</span>
                                        <input
                                            type="text"
                                            value={minAmount}
                                            onChange={(event) => setMinAmount(event.target.value)}
                                            placeholder="0,5"
                                            className="flex-1 bg-transparent text-[15px] text-[#32325d] placeholder:text-[#aab2c4] focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[13px] text-[#4f5b76]">Importe máximo</div>
                                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-[15px] text-[#32325d] shadow-sm">
                                        <span className="text-[#6b7280]">{currencySymbol}</span>
                                        <input
                                            type="text"
                                            value={maxAmount}
                                            onChange={(event) => setMaxAmount(event.target.value)}
                                            placeholder="10.000"
                                            className="flex-1 bg-transparent text-[15px] text-[#32325d] placeholder:text-[#aab2c4] focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <button
                            type="button"
                            onClick={() => setAdvancedOpen((prev) => !prev)}
                            className="inline-flex items-center gap-2 text-[16px] font-semibold text-[#32325d]"
                        >
                            Opciones avanzadas
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
                        </button>
                        {advancedOpen && (
                            <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-4">
                                <div className="flex flex-wrap items-center gap-3 text-[14px] text-[#4f5b76]">
                                    <div className="relative">
                                        <select
                                            value={callToAction}
                                            onChange={(event) => setCallToAction(event.target.value)}
                                            className="w-[150px] appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-[14px] text-[#32325d] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
                                        >
                                            <option>Pagar</option>
                                            <option>Reservar</option>
                                            <option>Donar</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-400" />
                                    </div>
                                    <span>como la llamada a la acción</span>
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[14px] text-[#4f5b76]">
                                        <input
                                            type="checkbox"
                                            checked={collectCustomerName}
                                            onChange={(event) => {
                                                const nextValue = event.target.checked;
                                                setCollectCustomerName(nextValue);
                                                if (!nextValue) {
                                                    setCustomerNameOptional(false);
                                                }
                                            }}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <span>Recopilar los nombres de los clientes</span>
                                    </label>
                                    {collectCustomerName && (
                                        <label className="flex items-center gap-2 pl-7 text-[13px] text-[#4f5b76]">
                                            <input
                                                type="checkbox"
                                                checked={customerNameOptional}
                                                onChange={(event) => setCustomerNameOptional(event.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300"
                                            />
                                            <span>Marcar como opcional</span>
                                        </label>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[14px] text-[#4f5b76]">
                                        <input
                                            type="checkbox"
                                            checked={collectCompanyName}
                                            onChange={(event) => {
                                                const nextValue = event.target.checked;
                                                setCollectCompanyName(nextValue);
                                                if (!nextValue) {
                                                    setCompanyNameOptional(false);
                                                }
                                            }}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <span>Recopilar los nombres de las empresas</span>
                                    </label>
                                    {collectCompanyName && (
                                        <label className="flex items-center gap-2 pl-7 text-[13px] text-[#4f5b76]">
                                            <input
                                                type="checkbox"
                                                checked={companyNameOptional}
                                                onChange={(event) => setCompanyNameOptional(event.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300"
                                            />
                                            <span>Marcar como opcional</span>
                                        </label>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[14px] text-[#4f5b76]">
                                        <input
                                            type="checkbox"
                                            checked={customFieldsEnabled}
                                            onChange={(event) => {
                                                const nextValue = event.target.checked;
                                                setCustomFieldsEnabled(nextValue);
                                                if (nextValue && customFields.length === 0) {
                                                    addCustomField();
                                                }
                                            }}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <span>Añadir campos personalizados</span>
                                        <Info className="w-3.5 h-3.5 text-gray-300" />
                                    </label>
                                    {customFieldsEnabled && (
                                        <div className="space-y-4 pl-7">
                                            {customFields.map((field) => (
                                                <div key={field.id} className="space-y-3 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[150px_1fr]">
                                                        <div className="relative">
                                                            <select
                                                                value={field.type}
                                                                onChange={(event) => updateCustomField(field.id, { type: event.target.value })}
                                                                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-[14px] text-[#32325d] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
                                                            >
                                                                <option>Texto</option>
                                                                <option>Solo números</option>
                                                                <option>Desplegable</option>
                                                            </select>
                                                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={field.label}
                                                            onChange={(event) => updateCustomField(field.id, { label: event.target.value })}
                                                            placeholder="Nombre de la etiqueta"
                                                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[14px] text-[#32325d] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
                                                        />
                                                    </div>

                                                    <label className="flex items-center gap-2 text-[13px] text-[#4f5b76]">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.hasDefault}
                                                            onChange={(event) => {
                                                                const nextValue = event.target.checked;
                                                                updateCustomField(field.id, {
                                                                    hasDefault: nextValue,
                                                                    defaultValue: nextValue ? field.defaultValue : ""
                                                                });
                                                            }}
                                                            className="h-4 w-4 rounded border-gray-300"
                                                        />
                                                        <span>Establece un valor predeterminado</span>
                                                        <Info className="w-3.5 h-3.5 text-gray-300" />
                                                    </label>
                                                    {field.hasDefault && (
                                                        <div className="pl-7">
                                                            <input
                                                                type="text"
                                                                value={field.defaultValue}
                                                                onChange={(event) => updateCustomField(field.id, { defaultValue: event.target.value })}
                                                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[14px] text-[#32325d] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
                                                            />
                                                        </div>
                                                    )}

                                                    <label className="flex items-center gap-2 text-[13px] text-[#4f5b76]">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.hasLimit}
                                                            onChange={(event) => {
                                                                const nextValue = event.target.checked;
                                                                updateCustomField(field.id, {
                                                                    hasLimit: nextValue,
                                                                    limitValue: nextValue ? field.limitValue : ""
                                                                });
                                                            }}
                                                            className="h-4 w-4 rounded border-gray-300"
                                                        />
                                                        <span>Establecer límites</span>
                                                    </label>
                                                    {field.hasLimit && (
                                                        <div className="flex flex-wrap items-center gap-3 pl-7 text-[13px] text-[#4f5b76]">
                                                            <div className="relative">
                                                                <select
                                                                    value={field.limitType}
                                                                    onChange={(event) => updateCustomField(field.id, { limitType: event.target.value })}
                                                                    className="appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-[14px] text-[#32325d] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
                                                                >
                                                                    <option>Como maximo</option>
                                                                    <option>Como minimo</option>
                                                                </select>
                                                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-400" />
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={field.limitValue}
                                                                onChange={(event) => updateCustomField(field.id, { limitValue: event.target.value })}
                                                                className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-[14px] text-[#32325d] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
                                                            />
                                                            <span>caracteres</span>
                                                        </div>
                                                    )}

                                                    <label className="flex items-center gap-2 text-[13px] text-[#4f5b76]">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.isOptional}
                                                            onChange={(event) => updateCustomField(field.id, { isOptional: event.target.checked })}
                                                            className="h-4 w-4 rounded border-gray-300"
                                                        />
                                                        <span>Marcar como opcional</span>
                                                    </label>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={addCustomField}
                                                className="text-[14px] font-medium text-[#635bff] hover:text-[#4f46e5]"
                                            >
                                                Añadir otro campo
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[14px] text-[#4f5b76]">
                                        <input
                                            type="checkbox"
                                            checked={limitPayments}
                                            onChange={(event) => setLimitPayments(event.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <span>Limitar la cantidad de pagos</span>
                                        <Info className="w-3.5 h-3.5 text-gray-300" />
                                    </label>
                                    {limitPayments && (
                                        <div className="flex items-center gap-3 pl-7 text-[14px] text-[#4f5b76]">
                                            <input
                                                type="text"
                                                value={paymentsTotal}
                                                onChange={(event) => setPaymentsTotal(event.target.value)}
                                                className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-[14px] text-[#32325d] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
                                            />
                                            <span>Pagos totales</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[14px] text-[#4f5b76]">
                                        <input
                                            type="checkbox"
                                            checked={customMessage}
                                            onChange={(event) => {
                                                const nextValue = event.target.checked;
                                                setCustomMessage(nextValue);
                                                if (!nextValue) {
                                                    setCustomMessageText("");
                                                    setPreviewTab("checkout");
                                                } else {
                                                    setPreviewTab("inactive");
                                                }
                                            }}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <span>Cambiar mensaje predeterminado</span>
                                    </label>
                                    {customMessage && (
                                        <div className="pl-7">
                                            <textarea
                                                rows={3}
                                                value={customMessageText}
                                                onChange={(event) => setCustomMessageText(event.target.value)}
                                                placeholder="Añade tu mensaje personalizado"
                                                className="w-full resize-none rounded-xl border border-gray-200 px-3 py-3 text-[14px] text-[#32325d] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                        </>
                    ) : (
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-[18px] font-semibold text-[#32325d]">Página de confirmación</h3>
                                <label className="flex items-center gap-2 text-[14px] text-[#4f5b76]">
                                    <input type="radio" checked readOnly className="h-4 w-4 text-[#635bff]" />
                                    <span>Mostrar la página de confirmación</span>
                                </label>
                                <label className="flex items-center gap-2 text-[14px] text-[#4f5b76]">
                                    <input
                                        type="checkbox"
                                        checked={replaceConfirmationMessage}
                                        onChange={(event) => setReplaceConfirmationMessage(event.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <span>Reemplaza el mensaje predeterminado por uno personalizado</span>
                                </label>
                                {replaceConfirmationMessage && (
                                    <textarea
                                        rows={3}
                                        value={confirmationMessage}
                                        onChange={(event) => setConfirmationMessage(event.target.value)}
                                        placeholder="Añade tu mensaje personalizado"
                                        className="w-full resize-none rounded-xl border border-gray-200 px-3 py-3 text-[14px] text-[#32325d] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
                                    />
                                )}
                            </div>

                            <div className="space-y-4 border-t border-gray-200 pt-6">
                                <h3 className="text-[18px] font-semibold text-[#32325d]">Factura posterior al pago</h3>
                                <label className="flex items-center gap-2 text-[14px] text-[#4f5b76]">
                                    <input
                                        type="checkbox"
                                        checked={createPdfInvoice}
                                        onChange={(event) => setCreatePdfInvoice(event.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <span>Crear una factura en PDF</span>
                                </label>
                                <p className="text-[12px] text-[#8792a2]">
                                    Stripe cobra 0,4 % del total de la transacción, hasta un máximo de 2,00 US$ por factura.
                                    <span className="text-[#635bff]"> Más información.</span>
                                </p>
                                <p className="text-[12px] text-[#8792a2] leading-relaxed">
                                    Las facturas posteriores al pago brindan más información que un recibo normal. Si quieres enviar un recibo normal,
                                    puedes optar por enviar un correo electrónico a los clientes sobre pagos efectuados con éxito en la configuración de
                                    correo electrónico.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-[#f6f7f9] p-8 flex flex-col">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[16px] font-semibold text-[#32325d]">Vista previa</h2>
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                            <button
                                type="button"
                                onClick={() => setPreviewMode("mobile")}
                                className={`p-1 rounded transition-colors ${previewMode === "mobile"
                                    ? "bg-[#eef0ff] text-[#635bff]"
                                    : "text-[#8792a2] hover:text-[#32325d]"
                                    }`}
                                title="Vista móvil"
                            >
                                <Smartphone className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreviewMode("monitor")}
                                className={`p-1 rounded transition-colors ${previewMode === "monitor"
                                    ? "bg-[#eef0ff] text-[#635bff]"
                                    : "text-[#8792a2] hover:text-[#32325d]"
                                    }`}
                                title="Vista de monitor"
                            >
                                <Monitor className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    {customMessage && !isAfterPayment && (
                        <div className="mt-4 flex items-center gap-6 text-[14px]">
                            <button
                                type="button"
                                onClick={() => setPreviewTab("checkout")}
                                className={`pb-1 border-b-2 transition-colors ${previewTab === "checkout"
                                    ? "border-[#635bff] text-[#635bff] font-semibold"
                                    : "border-transparent text-[#8792a2] hover:text-[#32325d]"
                                    }`}
                            >
                                Checkout
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreviewTab("inactive")}
                                className={`pb-1 border-b-2 transition-colors ${previewTab === "inactive"
                                    ? "border-[#635bff] text-[#635bff] font-semibold"
                                    : "border-transparent text-[#8792a2] hover:text-[#32325d]"
                                    }`}
                            >
                                Desactivado
                            </button>
                        </div>
                    )}
                    {isAfterPayment && (
                        <div className="mt-4 text-[14px] font-semibold text-[#635bff]">Página de confirmación</div>
                    )}

                    <div className="mt-6 flex-1 flex items-start justify-center overflow-auto pb-8">
                        <div
                            className={`w-full transition-all duration-300 bg-white shadow-[0_18px_40px_-20px_rgba(15,23,42,0.3)] border border-gray-100 ${previewMode === "mobile"
                                ? "max-w-[340px] rounded-[32px] border-[8px] border-gray-800 h-[600px] overflow-y-auto custom-scrollbar"
                                : "max-w-[780px] max-h-[640px] overflow-y-auto rounded-2xl p-4"
                                }`}
                        >
                            {previewMode === "mobile" && (
                                <div className="w-full h-6 bg-gray-800 flex items-center justify-center">
                                    <div className="w-12 h-1 bg-gray-700 rounded-full" />
                                </div>
                            )}
                            <div className={`${previewMode === "mobile" ? "p-6" : ""}`}>
                                <div className="flex items-center justify-between text-[10px] text-[#aab2c4] mb-6">
                                    <div className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-[#e2e8f0]" />
                                        <span className="w-2 h-2 rounded-full bg-[#e2e8f0]" />
                                        <span className="w-2 h-2 rounded-full bg-[#e2e8f0]" />
                                    </div>
                                    <div className="flex items-center gap-2 text-[#8792a2]">
                                        <span className="font-semibold">{previewDomain}</span>
                                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px]">Utiliza tu dominio</span>
                                    </div>
                                    <div className="w-6" />
                                </div>

                                {isAfterPayment ? (
                                    <div className={`grid gap-10 ${previewMode === "mobile" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
                                        <div className="space-y-4">
                                            <span className="inline-flex items-center gap-2 text-[10px] font-semibold text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded-full">
                                                TEST MODE
                                            </span>
                                            <div>
                                                <div className="text-[11px] text-[#697386]">Título</div>
                                                <div className="mt-1 text-[13px] font-semibold text-[#32325d]">
                                                    {title.trim() || "Nombre del motivo o del servicio"}
                                                </div>
                                                <div className="mt-2 h-10 border border-gray-200 rounded-md px-3 flex items-center text-[#697386] text-[13px]">
                                                    {previewAmount} {currencyPreview}
                                                </div>
                                            </div>
                                            {description.trim() && (
                                                <div className="text-[12px] text-[#697386] leading-relaxed">
                                                    {description}
                                                </div>
                                            )}
                                            {imageUrl && (
                                                <img
                                                    src={imageUrl}
                                                    alt="Imagen del enlace"
                                                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                                />
                                            )}
                                        </div>

                                        <div className="flex flex-col items-center text-center gap-3">
                                            <div className="w-12 h-12 rounded-full border border-[#bbf7d0] bg-[#ecfdf3] flex items-center justify-center">
                                                <Check className="w-6 h-6 text-[#22c55e]" />
                                            </div>
                                            <div className="text-[16px] font-semibold text-[#1a1f36]">
                                                {confirmationPreviewTitle}
                                            </div>
                                            <div className="text-[12px] text-[#8792a2]">
                                                Aparecerá un pago a AntillaPay en tu extracto.
                                            </div>
                                            <div className="mt-3 w-full max-w-[280px] border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-[#6b7280] flex items-center justify-between bg-[#f9fafb]">
                                                <span className="font-semibold tracking-[0.2em] text-[#6b7280]">ANTILLAPAY</span>
                                                <span>{previewAmount} {currencyPreview}</span>
                                            </div>
                                            <div className="pt-4 flex items-center gap-3 text-[11px] text-[#aab2c4]">
                                                <div className="flex items-center gap-1.5">
                                                    <span>Powered by</span>
                                                    <span className="font-semibold text-[#4f5b76]">AntillaPay</span>
                                                </div>
                                                <div className="h-3 w-px bg-gray-200" />
                                                <div className="flex items-center gap-3">
                                                    <span className="hover:text-[#4f5b76] cursor-pointer">Condiciones</span>
                                                    <span className="hover:text-[#4f5b76] cursor-pointer">Privacidad</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : isInactivePreview ? (
                                    <div className="min-h-[420px] flex flex-col items-center justify-center text-center gap-3 text-[#6b7280]">
                                        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center">
                                            <AlertCircle className="w-5 h-5 text-[#6b7280]" />
                                        </div>
                                        <div className="text-[16px] font-semibold text-[#32325d] whitespace-pre-line">
                                            {customMessageText.trim() || "The link is no longer active."}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`grid gap-10 ${previewMode === "mobile" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
                                    {/* Product Section */}
                                    <div className="space-y-4">
                                        <span className="inline-flex items-center gap-2 text-[10px] font-semibold text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded-full">
                                            TEST MODE
                                        </span>
                                        <div>
                                            <div className="text-[11px] text-[#697386]">Título</div>
                                            <div className="mt-1 text-[13px] font-semibold text-[#32325d]">
                                                {title.trim() || "Nombre del motivo o del servicio"}
                                            </div>
                                            <div className="mt-2 h-10 border border-gray-200 rounded-md px-3 flex items-center text-[#697386] text-[13px]">
                                                {previewAmount} {currencyPreview}
                                            </div>
                                        </div>
                                        {description.trim() && (
                                            <div className="text-[12px] text-[#697386] leading-relaxed">
                                                {description}
                                            </div>
                                        )}
                                        {imageUrl && (
                                            <img
                                                src={imageUrl}
                                                alt="Imagen del enlace"
                                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                            />
                                        )}
                                    </div>

                                    {/* Payment Section */}
                                    {isUsd ? (
                                        <div className="space-y-6">
                                            {/* Apple Pay Button */}
                                            <button className="w-full h-[44px] bg-black rounded-md flex items-center justify-center transition-opacity hover:opacity-90">
                                                <div className="flex items-center gap-1.5 text-white">
                                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                        <path d="M17.057 10.78c.045.068.513.784 1.151 1.72.336.495.632.936.883 1.32.743 1.135.918 2.053.493 2.767-.37.621-1.127 1.09-2.022 1.115-.96.027-1.353-.198-2.315-.198-.958 0-1.442.203-2.35.215-.98.013-1.841-.532-2.227-1.177-.852-1.424-.654-3.56.402-4.994.498-.675 1.25-.992 1.956-.992.68 0 1.235.211 1.722.457.195.1.378.204.55.3.14-.085.318-.184.5-.285.503-.274 1.1-.6 1.751-.564.264.014.851.05 1.506.471l-.106.182c.114.124.167.247.106.386zm-1.855-3.045c-.015.044-.2.522-.72 1-.41.376-.874.629-1.218.736-.084.026-.145-.022-.12-.089.167-.704.582-1.393 1.192-1.921.468-.406 1.055-.654 1.255-.548.064.034.026-.1.026-.1.011 0-.301 1.015-.415.922z" />
                                                    </svg>
                                                    <span className="text-[17px] font-semibold tracking-tight">Pay</span>
                                                </div>
                                            </button>

                                            {/* OR Separator */}
                                            <div className="relative flex items-center justify-center">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t border-gray-100"></div>
                                                </div>
                                                <div className="relative bg-white px-3">
                                                    <div className="w-5 h-5 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-sm">
                                                        <span className="text-[10px] text-gray-300 font-medium italic">o</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-5">
                                            {/* Contact Info */}
                                            {renderContactInfoSection()}

                                                {/* Payment Methods */}
                                                <div className="space-y-3">
                                                    <div className="text-[15px] font-semibold text-[#1a1f36]">Método de pago</div>
                                                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                                        {/* Card */}
                                                        <div className="flex items-center justify-between px-4 py-3.5 bg-white hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-4 h-4 rounded-full border-2 border-[#635bff] flex items-center justify-center p-0.5">
                                                                    <div className="w-full h-full rounded-full bg-[#635bff]" />
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <svg className="w-5 h-5 text-[#4f5b76]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                                    </svg>
                                                                    <span className="text-[14px] font-medium text-[#1a1f36]">Tarjeta</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="w-6 h-4 bg-gray-100 rounded-sm" />
                                                                <div className="w-6 h-4 bg-gray-100 rounded-sm" />
                                                                <div className="w-6 h-4 bg-gray-100 rounded-sm" />
                                                                <div className="w-6 h-4 bg-gray-100 rounded-sm" />
                                                            </div>
                                                        </div>
                                                        {/* Klarna */}
                                                        <div className="flex items-center gap-3 px-4 py-3.5 bg-white hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100">
                                                            <div className="w-4 h-4 rounded-full border border-gray-300" />
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-5 h-5 rounded bg-[#ffb3c7] flex items-center justify-center text-[10px] font-bold text-white uppercase italic">K</div>
                                                                <span className="text-[14px] font-medium text-[#1a1f36]">Klarna</span>
                                                            </div>
                                                        </div>
                                                        {/* Affirm */}
                                                        <div className="flex items-center gap-3 px-4 py-3.5 bg-white hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100">
                                                            <div className="w-4 h-4 rounded-full border border-gray-300" />
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-5 h-5 rounded bg-[#4a1fb8] flex items-center justify-center text-[10px] font-bold text-white italic">a</div>
                                                                <span className="text-[14px] font-medium text-[#1a1f36]">Affirm</span>
                                                            </div>
                                                        </div>
                                                        {/* Cash App */}
                                                        <div className="flex items-center gap-3 px-4 py-3.5 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                                                            <div className="w-4 h-4 rounded-full border border-gray-300" />
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-5 h-5 rounded bg-[#00d632] flex items-center justify-center text-[10px] font-bold text-white">$</div>
                                                                <span className="text-[14px] font-medium text-[#1a1f36]">Cash App Pay</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Other methods */}
                                                    <div className="pt-2">
                                                        <div className="flex items-center justify-between text-[13px] text-[#4f5b76] hover:text-[#1a1f36] cursor-pointer transition-colors px-1">
                                                            <div className="flex items-center gap-3">
                                                                <span>Otros métodos de pago</span>
                                                                <div className="flex items-center gap-1.5 grayscale opacity-60">
                                                                    <div className="w-6 h-4 bg-gray-100 rounded-sm" />
                                                                    <div className="w-4 h-4 rounded-full bg-gray-200" />
                                                                </div>
                                                            </div>
                                                            <ChevronDown className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Pay Button */}
                                                <button
                                                    type="button"
                                                    className="w-full bg-[#0070f3] hover:bg-[#0060d3] text-white text-[16px] font-semibold rounded-lg py-3 shadow-md transition-all active:scale-[0.99] mt-2"
                                                >
                                                    {callToAction}
                                                </button>

                                                {/* Footer with AntillaPay */}
                                                <div className="pt-6 flex flex-col items-center gap-4">
                                                    <div className="flex items-center gap-3 text-[12px] text-[#aab2c4]">
                                                        <div className="flex items-center gap-1.5">
                                                            <span>Powered by</span>
                                                            <span className="font-bold text-[#4f5b76] tracking-tight">AntillaPay</span>
                                                        </div>
                                                        <div className="h-3 w-px bg-gray-200" />
                                                        <div className="flex items-center gap-3">
                                                            <span className="hover:text-[#4f5b76] cursor-pointer">Condiciones</span>
                                                            <span className="hover:text-[#4f5b76] cursor-pointer">Privacidad</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <button className="w-full h-[44px] bg-black rounded-md flex items-center justify-center transition-opacity hover:opacity-90">
                                                <div className="flex items-center gap-1.5 text-white">
                                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                        <path d="M17.057 10.78c.045.068.513.784 1.151 1.72.336.495.632.936.883 1.32.743 1.135.918 2.053.493 2.767-.37.621-1.127 1.09-2.022 1.115-.96.027-1.353-.198-2.315-.198-.958 0-1.442.203-2.35.215-.98.013-1.841-.532-2.227-1.177-.852-1.424-.654-3.56.402-4.994.498-.675 1.25-.992 1.956-.992.68 0 1.235.211 1.722.457.195.1.378.204.55.3.14-.085.318-.184.5-.285.503-.274 1.1-.6 1.751-.564.264.014.851.05 1.506.471l-.106.182c.114.124.167.247.106.386zm-1.855-3.045c-.015.044-.2.522-.72 1-.41.376-.874.629-1.218.736-.084.026-.145-.022-.12-.089.167-.704.582-1.393 1.192-1.921.468-.406 1.055-.654 1.255-.548.064.034.026-.1.026-.1.011 0-.301 1.015-.415.922z" />
                                                    </svg>
                                                    <span className="text-[17px] font-semibold tracking-tight">Pay</span>
                                                </div>
                                            </button>

                                            <div className="relative flex items-center justify-center">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t border-gray-100"></div>
                                                </div>
                                                <div className="relative bg-white px-3">
                                                    <div className="w-5 h-5 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-sm">
                                                        <span className="text-[10px] text-gray-300 font-medium italic">o</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="text-[18px] font-semibold text-[#1a1f36]">Pago con tarjeta</div>

                                                {renderContactInfoSection(false)}

                                                <div className="space-y-3">
                                                    <div className="text-[15px] font-semibold text-[#1a1f36]">Método de pago</div>
                                                    <div className="space-y-2">
                                                        <div className="text-[13px] text-[#4f5b76]">Información de la tarjeta</div>
                                                        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                                            <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
                                                                <span className="text-[14px] text-[#aab2c4]">1234 1234 1234 1234</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <div className="w-8 h-5 bg-gray-100 rounded-sm" />
                                                                    <div className="w-8 h-5 bg-gray-100 rounded-sm" />
                                                                    <div className="w-8 h-5 bg-gray-100 rounded-sm" />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2">
                                                                <div className="px-3 py-2.5 text-[14px] text-[#aab2c4] border-r border-gray-100">
                                                                    MM / AA
                                                                </div>
                                                                <div className="px-3 py-2.5 text-[14px] text-[#aab2c4]">
                                                                    CVC
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <div className="text-[13px] text-[#4f5b76]">Nombre del titular de la tarjeta</div>
                                                    <input
                                                        type="text"
                                                        placeholder="Nombre completo"
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] text-[#1a1f36] placeholder:text-[#aab2c4] focus:outline-none focus:ring-2 focus:ring-[#635bff20] focus:border-[#635bff] transition-all"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="text-[13px] text-[#4f5b76]">País o región</div>
                                                    <div className="space-y-2">
                                                        <div className="relative">
                                                            <select
                                                                className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] text-[#1a1f36] focus:outline-none focus:ring-2 focus:ring-[#635bff20] focus:border-[#635bff] transition-all"
                                                                defaultValue="Estados Unidos"
                                                            >
                                                                <option>Estados Unidos</option>
                                                                <option>México</option>
                                                                <option>España</option>
                                                                <option>Colombia</option>
                                                                <option>Argentina</option>
                                                            </select>
                                                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Código postal"
                                                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] text-[#1a1f36] placeholder:text-[#aab2c4] focus:outline-none focus:ring-2 focus:ring-[#635bff20] focus:border-[#635bff] transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="w-full bg-[#0070f3] hover:bg-[#0060d3] text-white text-[16px] font-semibold rounded-lg py-3 shadow-md transition-all active:scale-[0.99] mt-2"
                                                >
                                                    {callToAction}
                                                </button>

                                                <div className="pt-4 flex items-center justify-center gap-3 text-[11px] text-[#aab2c4]">
                                                    <div className="flex items-center gap-1.5">
                                                        <span>Powered by</span>
                                                        <span className="font-semibold text-[#4f5b76]">antillapay</span>
                                                    </div>
                                                    <div className="h-3 w-px bg-gray-200" />
                                                    <div className="flex items-center gap-3">
                                                        <span className="hover:text-[#4f5b76] cursor-pointer">Condiciones</span>
                                                        <span className="hover:text-[#4f5b76] cursor-pointer">Privacidad</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                )}
                                {previewMode === "mobile" && (
                                    <div className="mt-8 flex justify-center pb-4">
                                        <div className="w-10 h-10 rounded-full border-4 border-gray-100" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <p className="mt-6 text-[12px] text-[#8792a2] text-center">
                        Puedes habilitar <span className="text-[#635bff]">más métodos de pago</span> y{" "}
                        <span className="text-[#635bff]">cambiar la apariencia de esta página</span> en la configuración de tu cuenta.
                    </p>
                </div>
            </div>
        </div>
    );
}
