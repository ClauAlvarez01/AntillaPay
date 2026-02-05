import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AlertCircle,
    Building2,
    Check,
    ChevronDown,
    Info,
    Link,
    Lock,
    Mail,
    Monitor,
    Plus,
    Search,
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
    const [activeSection, setActiveSection] = useState("payment");
    const [replaceConfirmationMessage, setReplaceConfirmationMessage] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [createPdfInvoice, setCreatePdfInvoice] = useState(false);
    const [afterPaymentPreviewTab, setAfterPaymentPreviewTab] = useState("confirmation");
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
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [productSearchOpen, setProductSearchOpen] = useState(false);
    const [productSearchQuery, setProductSearchQuery] = useState("");
    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
    const [amount, setAmount] = useState("");
    const [paymentMethodAntilla, setPaymentMethodAntilla] = useState(false);
    const [paymentMethodBank, setPaymentMethodBank] = useState(false);
    const [selectedCheckoutPaymentMethod, setSelectedCheckoutPaymentMethod] = useState(null);
    const [paymentMethodsError, setPaymentMethodsError] = useState("");
    const fileInputRef = useRef(null);
    const productSearchRef = useRef(null);
    const productSearchInputRef = useRef(null);
    const customFieldCounter = useRef(0);
    const currencyMenuRef = useRef(null);
    const currencySearchRef = useRef(null);
    const selectedCurrency = CURRENCIES.find((currency) => currency.code === currencyCode) || CURRENCIES[0];
    const isUsd = selectedCurrency.code === "USD";
    const currencySymbol = getCurrencySymbol(selectedCurrency.code);
    const currencyPreview = selectedCurrency.code === "USD" ? "US$" : currencySymbol;

    const hasAnyPaymentMethodSelected = paymentMethodBank || paymentMethodAntilla;
    
    const totalFromProducts = selectedProducts.reduce((sum, product) => {
        return sum + (product.amount || 0);
    }, 0);
    const displayTotal = totalFromProducts > 0 ? totalFromProducts : (parseFloat(amount) || 0);
    const formattedTotal = displayTotal.toFixed(2);
    
    const previewAmount = suggestPresetAmount && presetAmount.trim() ? presetAmount.trim() : formattedTotal;
    const previewAmountDisplay = `${currencyPreview}${displayTotal.toFixed(2)}`;
    const previewAmountDisplaySuffix = `${displayTotal.toFixed(2)} ${currencyPreview}`;
    const isDirty = Boolean(
        title ||
        description ||
        imageUrl ||
        replaceConfirmationMessage ||
        confirmationMessage ||
        createPdfInvoice ||
        currencyCode !== "USD" ||
        callToAction !== "Pagar" ||
        collectCustomerName ||
        customerNameOptional ||
        collectCompanyName ||
        companyNameOptional ||
        limitPayments ||
        paymentsTotal !== "1" ||
        customMessage ||
        customMessageText ||
        customFieldsEnabled ||
        customFields.length > 0 ||
        suggestPresetAmount ||
        presetAmount ||
        useLimits ||
        minAmount ||
        maxAmount
    );
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
    const previewDomain = "buy.antillapay.com";
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
                <div className="text-[14px] font-semibold text-[#1a1f36]">Información de contacto</div>
            )}
            <div className="text-[12px] text-[#4f5b76]">Correo electrónico</div>
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className={`flex items-center gap-2 px-3 py-2 ${collectCustomerName || collectCompanyName ? "border-b border-gray-100" : ""}`}>
                    <Mail className="w-3.5 h-3.5 text-[#9ca3af]" />
                    <input
                        type="text"
                        placeholder="correoelectrónico@ejemplo.com"
                        className="flex-1 bg-transparent text-[13px] text-[#1a1f36] placeholder:text-[#aab2c4] focus:outline-none"
                    />
                </div>
                {collectCustomerName && (
                    <div className={`flex items-center justify-between gap-2 px-3 py-2 ${collectCompanyName ? "border-b border-gray-100" : ""}`}>
                        <div className="flex items-center gap-2 flex-1">
                            <User className="w-3.5 h-3.5 text-[#9ca3af]" />
                            <input
                                type="text"
                                placeholder="Nombre completo"
                                className="flex-1 bg-transparent text-[13px] text-[#1a1f36] placeholder:text-[#aab2c4] focus:outline-none"
                            />
                        </div>
                        {customerNameOptional && (
                            <span className="text-[10px] text-[#6b7280] border border-gray-200 rounded-full px-2 py-0.5">
                                Opcional
                            </span>
                        )}
                    </div>
                )}
                {collectCompanyName && (
                    <div className="flex items-center justify-between gap-2 px-3 py-2">
                        <div className="flex items-center gap-2 flex-1">
                            <Building2 className="w-3.5 h-3.5 text-[#9ca3af]" />
                            <input
                                type="text"
                                placeholder="Nombre de la empresa"
                                className="flex-1 bg-transparent text-[13px] text-[#1a1f36] placeholder:text-[#aab2c4] focus:outline-none"
                            />
                        </div>
                        {companyNameOptional && (
                            <span className="text-[10px] text-[#6b7280] border border-gray-200 rounded-full px-2 py-0.5">
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
                                <div className="flex items-center justify-between text-[12px] text-[#4f5b76]">
                                    <span>{labelText}</span>
                                    {field.isOptional && (
                                        <span className="text-[10px] text-[#6b7280] border border-gray-200 rounded-full px-2 py-0.5">
                                            Opcional
                                        </span>
                                    )}
                                </div>
                                {field.type === "Desplegable" ? (
                                    <div className="relative">
                                        <select
                                            defaultValue=""
                                            className="w-full appearance-none rounded-lg border border-gray-200 px-2.5 py-1.5 text-[13px] text-[#32325d] focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
                                        >
                                            <option>
                                                {field.hasDefault && field.defaultValue.trim()
                                                    ? field.defaultValue
                                                    : "Selecciona una opción"}
                                            </option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 w-3.5 h-3.5 -translate-y-1/2 text-gray-400" />
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
                                        className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-[13px] text-[#32325d] placeholder:text-[#aab2c4] focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
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

    useEffect(() => {
        if (!createPdfInvoice && afterPaymentPreviewTab !== "confirmation") {
            setAfterPaymentPreviewTab("confirmation");
        }
    }, [createPdfInvoice, afterPaymentPreviewTab]);

    useEffect(() => {
        if (productSearchOpen) {
            productSearchInputRef.current?.focus();
        }
    }, [productSearchOpen]);

    useEffect(() => {
        if (!hasAnyPaymentMethodSelected) {
            setSelectedCheckoutPaymentMethod(null);
        }
    }, [hasAnyPaymentMethodSelected]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!productSearchOpen) return;
            if (productSearchRef.current && !productSearchRef.current.contains(event.target)) {
                setProductSearchOpen(false);
            }
        };
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setProductSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [productSearchOpen]);

    const getStoredProducts = () => {
        const stored = window.localStorage.getItem("antillapay_products");
        if (!stored) return [];
        const products = JSON.parse(stored);
        return products.filter((p) => p.status === "Activo");
    };

    const handleSelectProduct = (product) => {
        setSelectedProducts((prev) => [...prev, product]);
        setProductSearchOpen(false);
        setProductSearchQuery("");
    };

    const handleRemoveProduct = (productId) => {
        setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
    };

    const handleCreateNewProduct = () => {
        navigate("/dashboard/products/create");
    };

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

    const handleCreateLink = () => {
        if (!hasAnyPaymentMethodSelected) {
            setPaymentMethodsError("Selecciona al menos un método de pago.");
            return;
        }
        const now = new Date();
        const id = `pl_${now.getTime()}_${Math.random().toString(36).slice(2, 8)}`;
        const newLink = {
            id,
            name: title.trim() || "Sin título",
            currencyCode: selectedCurrency.code,
            priceType: "customer_choice",
            status: "Desactivado",
            createdAt: now.toISOString(),
            paymentMethods: {
                bank: paymentMethodBank,
                antilla: paymentMethodAntilla
            }
        };
        navigate("/dashboard/payment-links", { state: { newPaymentLink: newLink } });
    };

    const handleCloseClick = () => {
        if (isDirty) {
            setShowExitConfirm(true);
            return;
        }
        navigate("/dashboard/payment-links");
    };

    return (
        <div className="w-full min-h-screen bg-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleCloseClick}
                        className="text-[#8792a2] hover:text-[#32325d] transition-colors"
                        aria-label="Cerrar creación de enlace"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-gray-200" />
                    <span className="text-[14px] font-semibold text-[#32325d]">Crear enlace de pago</span>
                </div>
                <button
                    type="button"
                    onClick={handleCreateLink}
                    disabled={!hasAnyPaymentMethodSelected}
                    className={`inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm transition-colors ${hasAnyPaymentMethodSelected
                        ? "bg-[#4c43e6] hover:bg-[#3f38c8]"
                        : "bg-[#aab2c4] cursor-not-allowed"
                        }`}
                >
                    Crear enlace
                    <Check className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[520px_1fr] min-h-[calc(100vh-72px)]">
                <div className="p-7 space-y-5">
                    <div className="mt-4 flex items-center gap-6 border-b border-gray-200">
                        <button
                            type="button"
                            onClick={() => setActiveSection("payment")}
                            className={`text-[13px] font-semibold pb-2.5 border-b-2 transition-colors ${activeSection === "payment"
                                ? "text-[#635bff] border-[#635bff]"
                                : "text-[#8792a2] border-transparent hover:text-[#32325d]"
                                }`}
                        >
                            Página de pagos
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveSection("after_payment")}
                            className={`text-[13px] font-semibold pb-2.5 border-b-2 transition-colors ${activeSection === "after_payment"
                                ? "text-[#635bff] border-[#635bff]"
                                : "text-[#8792a2] border-transparent hover:text-[#32325d]"
                                }`}
                        >
                            Después del pago
                        </button>
                    </div>

                    {activeSection === "payment" ? (
                        <>
                    <div className="space-y-5">
                        <h3 className="text-[14px] font-semibold text-[#4f5b76]">Producto</h3>
                        
                        <div className="space-y-2">
                            <label className="text-[12px] font-semibold text-[#32325d]">Título</label>
                            <input
                                type="text"
                                placeholder="Pago de Gasolina"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                className="w-full h-9 rounded-md border border-gray-200 px-3 text-[13px] text-[#4f5b76] placeholder:text-[#aab2c4] focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <label className="text-[12px] font-semibold text-[#32325d]">Descripción</label>
                                <span className="text-[10px] text-[#8792a2] border border-gray-200 rounded-full px-2 py-0.5">
                                    Opcional
                                </span>
                            </div>
                            <textarea
                                rows={4}
                                placeholder="Pago de suministro de gasolina a Gasolina S.R.L."
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                className="w-full rounded-md border border-gray-200 px-3 py-2 text-[13px] text-[#4f5b76] placeholder:text-[#aab2c4] focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="relative" ref={productSearchRef}>
                                <button
                                    type="button"
                                    onClick={() => setProductSearchOpen((prev) => !prev)}
                                    className="w-full flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] text-[#aab2c4] hover:border-gray-300 transition-colors"
                                >
                                    <span>Encuentra o agrega un producto de prueba...</span>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${productSearchOpen ? "rotate-180" : ""}`} />
                                </button>
                                {productSearchOpen && (() => {
                                    const availableProducts = getStoredProducts();
                                    const normalizeText = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                    const normalizedQuery = normalizeText(productSearchQuery.trim());
                                    const filteredProducts = normalizedQuery
                                        ? availableProducts.filter((product) => 
                                            normalizeText(product.name).includes(normalizedQuery) ||
                                            (product.description && normalizeText(product.description).includes(normalizedQuery))
                                        )
                                        : availableProducts;
                                    const selectedProductIds = selectedProducts.map((p) => p.id);
                                    const unselectedProducts = filteredProducts.filter((p) => !selectedProductIds.includes(p.id));
                                    
                                    return (
                                        <div className="absolute left-0 right-0 z-20 mt-2 rounded-xl border border-gray-200 bg-white shadow-[0_20px_35px_-20px_rgba(15,23,42,0.45)] overflow-hidden">
                                            <div className="border-b border-gray-100 px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Search className="w-4 h-4 text-[#9ca3af]" />
                                                    <input
                                                        ref={productSearchInputRef}
                                                        value={productSearchQuery}
                                                        onChange={(event) => setProductSearchQuery(event.target.value)}
                                                        placeholder="Encuentra o agrega un producto de prueba..."
                                                        className="flex-1 text-[13px] text-[#32325d] placeholder:text-[#aab2c4] focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleCreateNewProduct}
                                                className="w-full flex items-center justify-center gap-2 bg-[#635bff] text-white px-4 py-3 text-[13px] font-semibold hover:bg-[#5851e0] transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Agregar nuevo producto
                                            </button>
                                            {unselectedProducts.length > 0 && (
                                                <div className="max-h-64 overflow-auto py-1">
                                                    {unselectedProducts.map((product) => (
                                                        <button
                                                            key={product.id}
                                                            type="button"
                                                            onClick={() => handleSelectProduct(product)}
                                                            className="w-full text-left px-4 py-3 text-[13px] hover:bg-[#f7f7f9] transition-colors"
                                                        >
                                                            <div className="font-semibold text-[#32325d]">{product.name}</div>
                                                            {product.description && (
                                                                <div className="text-[12px] text-[#6b7280] mt-0.5 line-clamp-1">{product.description}</div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>

                            {selectedProducts.length > 0 && (
                                <div className="space-y-2">
                                    {selectedProducts.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2">
                                            <div className="flex-1">
                                                <div className="text-[13px] font-medium text-[#32325d]">{product.name}</div>
                                                <div className="text-[12px] text-[#6b7280]">
                                                    {product.currency} {product.amount?.toFixed(2) || "0.00"}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProduct(product.id)}
                                                className="text-[#8792a2] hover:text-[#ef4444] transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setProductSearchOpen(true)}
                                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#635bff] hover:text-[#5851e0] transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Agregar producto
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[12px] font-semibold text-[#32325d]">Divisa</label>
                        <div className="relative" ref={currencyMenuRef}>
                            <button
                                type="button"
                                aria-expanded={currencyMenuOpen}
                                aria-controls="currency-menu"
                                onClick={() => setCurrencyMenuOpen((prev) => !prev)}
                                className="w-full flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-[13px] text-[#32325d] shadow-sm"
                            >
                                <span className="truncate">
                                    {selectedCurrency.code} - {selectedCurrency.name}
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${currencyMenuOpen ? "rotate-180" : ""}`} />
                            </button>
                            {currencyMenuOpen && (
                                <div
                                    id="currency-menu"
                                    className="absolute left-0 right-0 z-20 mt-2 rounded-xl border border-gray-200 bg-white shadow-[0_20px_35px_-20px_rgba(15,23,42,0.45)]"
                                >
                                    <div className="border-b border-gray-100 px-4 py-2">
                                        <input
                                            ref={currencySearchRef}
                                            value={currencyQuery}
                                            onChange={(event) => setCurrencyQuery(event.target.value)}
                                            placeholder="Busca..."
                                            className="w-full text-[14px] text-[#32325d] placeholder:text-[#aab2c4] focus:outline-none"
                                        />
                                    </div>
                                    <div className="max-h-72 overflow-auto py-1">
                                        {filteredCurrencies.length === 0 ? (
                                            <div className="px-4 py-3 text-[12px] text-[#8792a2]">Sin resultados</div>
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
                                                        className={`w-full text-left px-4 py-2 text-[13px] text-[#32325d] transition-colors ${isSelected
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

                    <div className="space-y-2">
                        <label className="text-[12px] font-semibold text-[#32325d]">Importe (requerido)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={(event) => setAmount(event.target.value)}
                                placeholder="32"
                                className="w-full h-9 rounded-md border border-gray-200 px-3 pr-12 text-[13px] text-[#4f5b76] placeholder:text-[#aab2c4] focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                                <button type="button" className="text-[#9ca3af] hover:text-[#4f5b76]">
                                    <ChevronDown className="w-3 h-3 rotate-180" />
                                </button>
                                <button type="button" className="text-[#9ca3af] hover:text-[#4f5b76]">
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <label className="flex items-center gap-2 text-[13px] text-[#4f5b76] cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showAdditionalInfo}
                            onChange={(event) => setShowAdditionalInfo(event.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-[#635bff] focus:ring-[#635bff]"
                        />
                        <span>Agregar información adicional</span>
                    </label>

                    {showAdditionalInfo && (
                        <div className="rounded-lg border border-gray-200 bg-[#fafbfc] p-4 space-y-4">
                            <textarea
                                rows={3}
                                placeholder="Cobro sobre los meses Febrero y Marzo"
                                className="w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-[#4f5b76] placeholder:text-[#aab2c4] focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
                            />
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="text-[13px] font-semibold text-[#32325d]">Métodos de pago</div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[13px] text-[#4f5b76] cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={paymentMethodBank}
                                    onChange={(event) => {
                                        setPaymentMethodBank(event.target.checked);
                                        setPaymentMethodsError("");
                                    }}
                                    className="h-4 w-4 rounded border-gray-300 text-[#635bff] focus:ring-[#635bff]"
                                />
                                <span>Cuenta Bancaria</span>
                            </label>
                            {paymentMethodBank && (
                                <div className="ml-6 mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-[12px] text-amber-800">
                                        <span className="font-semibold">Pendiente de configuración:</span> La integración con cuenta bancaria está por definir con el PSP.
                                    </div>
                                </div>
                            )}
                            <label className="flex items-center gap-2 text-[13px] text-[#4f5b76] cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={paymentMethodAntilla}
                                    onChange={(event) => {
                                        setPaymentMethodAntilla(event.target.checked);
                                        setPaymentMethodsError("");
                                    }}
                                    className="h-4 w-4 rounded border-gray-300 text-[#635bff] focus:ring-[#635bff]"
                                />
                                <span>Saldo Antilla</span>
                            </label>

                            {(!hasAnyPaymentMethodSelected || paymentMethodsError) && (
                                <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-[12px] text-amber-800">
                                        {paymentMethodsError || "Selecciona al menos un método de pago para poder crear el enlace."}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                                            </>
                    ) : (
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-[16px] font-semibold text-[#32325d]">Página de confirmación</h3>
                                <label className="flex items-center gap-2 text-[13px] text-[#4f5b76]">
                                    <input type="radio" checked readOnly className="h-4 w-4 text-[#635bff]" />
                                    <span>Mostrar la página de confirmación</span>
                                </label>
                                <label className="flex items-center gap-2 text-[13px] text-[#4f5b76]">
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
                                        className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-[13px] text-[#32325d] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635bff20]"
                                    />
                                )}
                            </div>

                            <div className="space-y-4 border-t border-gray-200 pt-6">
                                <h3 className="text-[16px] font-semibold text-[#32325d]">Factura posterior al pago</h3>
                                <label className="flex items-center gap-2 text-[13px] text-[#4f5b76]">
                                    <input
                                        type="checkbox"
                                        checked={createPdfInvoice}
                                        onChange={(event) => setCreatePdfInvoice(event.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <span>Crear una factura en PDF</span>
                                </label>
                                <p className="text-[11px] text-[#8792a2]">
                                    AntillaPay cobra 0,4 % del total de la transacción, hasta un máximo de 2,00 US$ por factura.
                                    <span className="text-[#635bff]"> Más información.</span>
                                </p>
                                <p className="text-[11px] text-[#8792a2] leading-relaxed">
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
                        <h2 className="text-[18px] font-semibold text-[#32325d]">Vista previa</h2>
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
                                <Smartphone className="w-3.5 h-3.5" />
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
                                <Monitor className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                    {customMessage && !isAfterPayment && (
                        <div className="mt-4 flex items-center gap-6 text-[13px]">
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
                        <div className="mt-4 flex items-center gap-6 text-[13px]">
                            <button
                                type="button"
                                onClick={() => setAfterPaymentPreviewTab("confirmation")}
                                className={`pb-1 border-b-2 transition-colors ${afterPaymentPreviewTab === "confirmation"
                                    ? "border-[#635bff] text-[#635bff] font-semibold"
                                    : "border-transparent text-[#8792a2] hover:text-[#32325d]"
                                    }`}
                            >
                                Página de confirmación
                            </button>
                            {createPdfInvoice && (
                                <button
                                    type="button"
                                    onClick={() => setAfterPaymentPreviewTab("invoice")}
                                    className={`pb-1 border-b-2 transition-colors ${afterPaymentPreviewTab === "invoice"
                                        ? "border-[#635bff] text-[#635bff] font-semibold"
                                        : "border-transparent text-[#8792a2] hover:text-[#32325d]"
                                        }`}
                                >
                                    Factura posterior al pago
                                </button>
                            )}
                        </div>
                    )}

                    <div className="mt-6 flex-1 flex items-start justify-center overflow-auto pb-8">
                        <div
                            className={`w-full transition-all duration-300 bg-white shadow-[0_18px_40px_-20px_rgba(15,23,42,0.3)] border border-gray-100 ${previewMode === "mobile"
                                ? "max-w-[340px] rounded-[32px] border-[8px] border-gray-800 h-[600px] overflow-y-auto custom-scrollbar"
                                : "max-w-[860px] max-h-[680px] overflow-y-auto rounded-2xl p-6"
                                }`}
                        >
                            {previewMode === "mobile" && (
                                <div className="w-full h-6 bg-gray-800 flex items-center justify-center">
                                    <div className="w-12 h-1 bg-gray-700 rounded-full" />
                                </div>
                            )}
                            <div className={`${previewMode === "mobile" ? "p-6" : ""}`}>
                                <div className="mb-6 grid grid-cols-[1fr_auto_1fr] items-center text-[10px] text-[#94a3b8]">
                                    <div className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-[#e2e8f0]" />
                                        <span className="w-2 h-2 rounded-full bg-[#e2e8f0]" />
                                        <span className="w-2 h-2 rounded-full bg-[#e2e8f0]" />
                                    </div>
                                    <div className="flex items-center gap-2 text-[#64748b]">
                                        <div className="flex items-center gap-1 font-semibold">
                                            <Lock className="w-3 h-3 text-[#94a3b8]" />
                                            <span>{previewDomain}</span>
                                        </div>
                                    </div>
                                    <div />
                                </div>

                                {isAfterPayment ? (
                                    afterPaymentPreviewTab === "invoice" && createPdfInvoice ? (
                                        <div className="flex justify-center">
                                            <div className="w-full max-w-[560px] rounded-2xl border border-gray-200 bg-white shadow-sm p-6 text-[#1a1f36]">
                                                <div className="flex items-start justify-between">
                                                    <div className="text-[18px] font-semibold">Factura</div>
                                                    <div className="text-[12px] text-[#9ca3af] font-semibold">acct_1SrAY7P7MT2okK37</div>
                                                </div>

                                                <div className="mt-4 grid grid-cols-1 gap-4 text-[12px] text-[#4f5b76] md:grid-cols-2">
                                                    <div className="space-y-1">
                                                        <div>
                                                            <span className="font-semibold text-[#1a1f36]">Número de factura</span> EJEMPLO-0001
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-[#1a1f36]">Fecha de emisión</span> 20 de febrero de 2026
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-[#1a1f36]">Fecha de vencimiento</span> 20 de febrero de 2026
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="font-semibold text-[#1a1f36]">Facturar a</div>
                                                        <div>Cliente de ejemplo</div>
                                                        <div>cliente@ejemplo.com</div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 text-[14px] font-semibold">
                                                    {previewAmountDisplay} con vencimiento 20 de febrero de 2026
                                                </div>

                                                <div className="mt-4 border-t border-gray-200 pt-3">
                                                    <div className="grid grid-cols-[1fr_80px_100px_100px] text-[11px] uppercase tracking-wide text-[#9ca3af]">
                                                        <span>Descripción</span>
                                                        <span className="text-right">Cantidad</span>
                                                        <span className="text-right">Precio unitario</span>
                                                        <span className="text-right">Importe</span>
                                                    </div>
                                                    <div className="mt-2 grid grid-cols-[1fr_80px_100px_100px] text-[12px] text-[#4f5b76]">
                                                        <span>{title.trim() || "Título"}</span>
                                                        <span className="text-right">1</span>
                                                        <span className="text-right">{previewAmountDisplay}</span>
                                                        <span className="text-right">{previewAmountDisplay}</span>
                                                    </div>
                                                    <div className="mt-4 flex justify-end">
                                                        <div className="w-full max-w-[220px] text-[12px] text-[#4f5b76] space-y-1">
                                                            <div className="flex items-center justify-between">
                                                                <span>Subtotal</span>
                                                                <span>{previewAmountDisplay}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span>Total</span>
                                                                <span>{previewAmountDisplay}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between font-semibold text-[#1a1f36]">
                                                                <span>Total pendiente</span>
                                                                <span>{previewAmountDisplay}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-6 border-t border-gray-200 pt-3 text-[11px] text-[#9ca3af]">
                                                    EJEMPLO-0001 · {previewAmountDisplay} con vencimiento 20 de febrero de 2026
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`grid gap-8 ${previewMode === "mobile" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 md:gap-0 md:divide-x md:divide-gray-100"}`}>
                                        <div className="space-y-5 md:pl-6 md:pr-10">
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-gray-200 bg-white text-[#94a3b8]">
                                                    <Link className="w-3.5 h-3.5" />
                                                </span>
                                                <span className="inline-flex items-center gap-2 text-[10px] font-semibold text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded-full">
                                                    TEST MODE
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-[11px] text-[#697386]">Título</div>
                                                {title.trim() && (
                                                    <div className="mt-1 text-[12px] font-semibold text-[#32325d]">
                                                        {title.trim()}
                                                    </div>
                                                )}
                                                <div className="mt-2 h-11 border border-gray-200 rounded-lg px-3 flex items-center text-[#6b7280] text-[18px] shadow-sm">
                                                    {previewAmountDisplaySuffix}
                                                </div>
                                            </div>
                                            {description.trim() && (
                                                <div className="text-[11px] text-[#697386] leading-relaxed">
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

                                        <div className="flex flex-col items-center text-center gap-3 md:pl-10 md:pr-6">
                                            <div className="w-11 h-11 rounded-full border border-[#bbf7d0] bg-[#ecfdf3] flex items-center justify-center">
                                                <Check className="w-5 h-5 text-[#22c55e]" />
                                            </div>
                                            <div className="text-[15px] font-semibold text-[#1a1f36]">
                                                {confirmationPreviewTitle}
                                            </div>
                                            <div className="text-[11px] text-[#8792a2]">
                                                Aparecerá un pago a AntillaPay en tu extracto.
                                            </div>
                                            <div className="mt-3 w-full max-w-[280px] border border-gray-200 rounded-lg px-3 py-2 text-[11px] text-[#6b7280] flex items-center justify-between bg-[#f9fafb]">
                                                <span className="font-semibold tracking-[0.2em] text-[#6b7280]">ANTILLAPAY</span>
                                                <span>{previewAmountDisplay}</span>
                                            </div>
                                            <div className="pt-4 flex items-center gap-1.5 text-[10px] text-[#aab2c4]">
                                                <span>Powered by</span>
                                                <span className="font-semibold text-[#4f5b76]">antillapay</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : isInactivePreview ? (
                                    <div className="min-h-[420px] flex flex-col items-center justify-center text-center gap-3 text-[#6b7280]">
                                        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center">
                                            <AlertCircle className="w-5 h-5 text-[#6b7280]" />
                                        </div>
                                        <div className="text-[15px] font-semibold text-[#32325d] whitespace-pre-line">
                                            {customMessageText.trim() || "The link is no longer active."}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`grid gap-8 ${previewMode === "mobile" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 md:gap-0 md:divide-x md:divide-gray-100"}`}>
                                    {/* Product Section */}
                                    <div className="space-y-5 md:pl-6 md:pr-10">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-gray-200 bg-white text-[#94a3b8]">
                                                <Link className="w-3.5 h-3.5" />
                                            </span>
                                            <span className="inline-flex items-center gap-2 text-[10px] font-semibold text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded-full">
                                                TEST MODE
                                            </span>
                                        </div>
                                        
                                        {selectedProducts.length > 0 ? (
                                            <div className="space-y-4">
                                                <div className="text-[13px] font-semibold text-[#32325d]">
                                                    Link de pago
                                                </div>
                                                <div className="text-[12px] text-[#6b7280]">
                                                    {selectedProducts.length} producto{selectedProducts.length > 1 ? 's' : ''}
                                                </div>
                                                <div className="space-y-2">
                                                    {selectedProducts.map((product) => (
                                                        <div key={product.id} className="bg-[#f9fafb] rounded-lg p-3 border border-gray-200">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="text-[13px] font-semibold text-[#32325d]">
                                                                        {product.name}
                                                                    </div>
                                                                    <div className="text-[11px] text-[#6b7280] mt-0.5">
                                                                        1 × ${product.amount?.toFixed(2) || "0.00"}
                                                                    </div>
                                                                </div>
                                                                <div className="text-[13px] font-semibold text-[#32325d]">
                                                                    ${product.amount?.toFixed(2) || "0.00"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="bg-[#f3f4f6] rounded-lg p-3 border border-gray-200">
                                                    <div className="text-[14px] font-semibold text-[#32325d]">
                                                        ${displayTotal.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="text-[11px] text-[#697386]">Título</div>
                                                {title.trim() && (
                                                    <div className="mt-1 text-[12px] font-semibold text-[#32325d]">
                                                        {title.trim()}
                                                    </div>
                                                )}
                                                <div className="mt-2 h-11 border border-gray-200 rounded-lg px-3 flex items-center text-[#6b7280] text-[18px] shadow-sm">
                                                    {previewAmountDisplaySuffix}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {description.trim() && (
                                            <div className="text-[11px] text-[#697386] leading-relaxed">
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
                                        <div className="space-y-6 md:pl-10 md:pr-6 md:max-w-[360px] md:mx-auto">
                                            <div className="w-full flex justify-center py-4">
                                                <img src="/logo.png" alt="AntillaPay" className="h-32 w-auto" />
                                            </div>

                                            <div className="space-y-5">
                                                {/* Payment Methods */}
                                                <div className="space-y-3">
                                                    <div className="text-[16px] font-semibold text-[#1a1f36]">Método de pago</div>
                                                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                                        {paymentMethodBank && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setSelectedCheckoutPaymentMethod("bank")}
                                                                className={`w-full flex items-center gap-3 px-3.5 py-3 bg-white hover:bg-gray-50 transition-colors ${paymentMethodAntilla ? "border-b border-gray-100" : ""}`}
                                                            >
                                                                <div className={`w-4 h-4 rounded-full border ${selectedCheckoutPaymentMethod === "bank" ? "border-[#635bff]" : "border-gray-400"} flex items-center justify-center`}>
                                                                    {selectedCheckoutPaymentMethod === "bank" && (
                                                                        <div className="w-2 h-2 rounded-full bg-[#635bff]" />
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <svg className="w-5 h-5 text-[#4f5b76]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                                                    </svg>
                                                                    <span className="text-[14px] font-medium text-[#1a1f36]">Cuenta Bancaria</span>
                                                                </div>
                                                            </button>
                                                        )}
                                                        {paymentMethodAntilla && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setSelectedCheckoutPaymentMethod("antilla")}
                                                                className="w-full flex items-center gap-3 px-3.5 py-3 bg-white hover:bg-gray-50 transition-colors"
                                                            >
                                                                <div className={`w-4 h-4 rounded-full border ${selectedCheckoutPaymentMethod === "antilla" ? "border-[#635bff]" : "border-gray-400"} flex items-center justify-center`}>
                                                                    {selectedCheckoutPaymentMethod === "antilla" && (
                                                                        <div className="w-2 h-2 rounded-full bg-[#635bff]" />
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-5 h-5 rounded bg-[#635bff] flex items-center justify-center text-[10px] font-bold text-white">A</div>
                                                                    <span className="text-[14px] font-medium text-[#1a1f36]">Saldo Antilla</span>
                                                                </div>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {selectedCheckoutPaymentMethod === "bank" && renderContactInfoSection()}

                                                {/* Pay Button */}
                                                <button
                                                    type="button"
                                                    className="w-full bg-[#0070f3] hover:bg-[#0060d3] text-white text-[14px] font-semibold rounded-lg py-2.5 shadow-md transition-all active:scale-[0.99] mt-2"
                                                >
                                                    {callToAction}
                                                </button>

                                                <div className="pt-6" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="w-full flex justify-center py-4">
                                                <img src="/logo.png" alt="AntillaPay" className="h-32 w-auto" />
                                            </div>

                                            <div className="space-y-4">
                                                <div className="text-[16px] font-semibold text-[#1a1f36]">Pago con tarjeta</div>

                                                {renderContactInfoSection(false)}

                                                <div className="space-y-3">
                                                    <div className="text-[14px] font-semibold text-[#1a1f36]">Método de pago</div>
                                                    <div className="space-y-2">
                                                        <div className="text-[12px] text-[#4f5b76]">Información de la tarjeta</div>
                                                        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                                            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                                                                <span className="text-[13px] text-[#aab2c4]">1234 1234 1234 1234</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <div className="w-8 h-5 bg-gray-100 rounded-sm" />
                                                                    <div className="w-8 h-5 bg-gray-100 rounded-sm" />
                                                                    <div className="w-8 h-5 bg-gray-100 rounded-sm" />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2">
                                                                <div className="px-3 py-2 text-[13px] text-[#aab2c4] border-r border-gray-100">
                                                                    MM / AA
                                                                </div>
                                                                <div className="px-3 py-2 text-[13px] text-[#aab2c4]">
                                                                    CVC
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <div className="text-[12px] text-[#4f5b76]">Nombre del titular de la tarjeta</div>
                                                    <input
                                                        type="text"
                                                        placeholder="Nombre completo"
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#1a1f36] placeholder:text-[#aab2c4] focus:outline-none focus:ring-2 focus:ring-[#635bff20] focus:border-[#635bff] transition-all"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="text-[12px] text-[#4f5b76]">País o región</div>
                                                    <div className="space-y-2">
                                                        <div className="relative">
                                                            <select
                                                                className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#1a1f36] focus:outline-none focus:ring-2 focus:ring-[#635bff20] focus:border-[#635bff] transition-all"
                                                                defaultValue="Estados Unidos"
                                                            >
                                                                <option>Estados Unidos</option>
                                                                <option>México</option>
                                                                <option>España</option>
                                                                <option>Colombia</option>
                                                                <option>Argentina</option>
                                                            </select>
                                                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 w-3.5 h-3.5 -translate-y-1/2 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Código postal"
                                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#1a1f36] placeholder:text-[#aab2c4] focus:outline-none focus:ring-2 focus:ring-[#635bff20] focus:border-[#635bff] transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="w-full bg-[#0070f3] hover:bg-[#0060d3] text-white text-[14px] font-semibold rounded-lg py-2.5 shadow-md transition-all active:scale-[0.99] mt-2"
                                                >
                                                    {callToAction}
                                                </button>

                                                <div className="pt-4" />
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
            {showExitConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
                    <div className="w-full max-w-[520px] rounded-2xl bg-white shadow-2xl border border-gray-200">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-[18px] font-semibold text-[#1a1f36]">Confirmar salida</h3>
                        </div>
                        <div className="px-6 py-5 text-[14px] text-[#4f5b76] leading-relaxed">
                            ¿Seguro que quieres salir? No se guardarán los cambios del enlace para el pago.
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => setShowExitConfirm(false)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-[14px] font-semibold text-[#374151] hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard/payment-links")}
                                className="rounded-lg bg-[#e11d48] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#be123c]"
                            >
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
