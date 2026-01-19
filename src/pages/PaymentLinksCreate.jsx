import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Check,
    ChevronDown,
    Info,
    Monitor,
    Smartphone,
    Upload,
    X
} from "lucide-react";

export default function PaymentLinksCreate() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [previewMode, setPreviewMode] = useState("monitor");
    const fileInputRef = useRef(null);

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

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
                            className="text-[14px] font-semibold text-[#635bff] pb-3 border-b-2 border-[#635bff]"
                        >
                            Página de pagos
                        </button>
                        <button type="button" className="text-[14px] font-semibold text-[#8792a2] pb-3">
                            Después del pago
                        </button>
                    </div>

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
                        <button
                            type="button"
                            className="w-full flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-[#32325d]"
                        >
                            USD - dólar estadounidense
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[13px] text-[#4f5b76]">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                            <span>Sugerir un importe predefinido</span>
                            <Info className="w-3.5 h-3.5 text-gray-300" />
                        </label>
                        <label className="flex items-center gap-2 text-[13px] text-[#4f5b76]">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                            <span>Establecer límites</span>
                            <Info className="w-3.5 h-3.5 text-gray-300" />
                        </label>
                    </div>

                    <button type="button" className="inline-flex items-center gap-2 text-[16px] font-semibold text-[#32325d]">
                        Opciones avanzadas
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
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

                    <div className="mt-6 flex-1 flex items-start justify-center overflow-auto pb-8">
                        <div
                            className={`w-full transition-all duration-300 bg-white shadow-[0_18px_40px_-20px_rgba(15,23,42,0.3)] border border-gray-100 ${previewMode === "mobile"
                                ? "max-w-[375px] rounded-[32px] border-[8px] border-gray-800 h-[667px] overflow-y-auto custom-scrollbar"
                                : "max-w-[1000px] rounded-2xl p-6"
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
                                        <span className="font-semibold">buy.antillapay.com</span>
                                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px]">Utiliza tu dominio</span>
                                    </div>
                                    <div className="w-6" />
                                </div>

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
                                                0,00 US$
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

                                    {/* Payment Section - Replicated from User Image */}
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
                                            <div className="space-y-3">
                                                <div className="text-[15px] font-semibold text-[#1a1f36]">Información de contacto</div>
                                                <div className="space-y-1.5">
                                                    <div className="text-[13px] text-[#4f5b76]">Correo electrónico</div>
                                                    <input
                                                        type="text"
                                                        placeholder="correo electrónico@ejemplo.com"
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] text-[#1a1f36] placeholder:text-[#aab2c4] focus:outline-none focus:ring-2 focus:ring-[#635bff20] focus:border-[#635bff] transition-all"
                                                    />
                                                </div>
                                            </div>

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
                                                Pagar
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
                                </div>
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
