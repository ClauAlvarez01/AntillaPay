import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Book,
    Code2,
    Terminal,
    Copy,
    ChevronRight,
    ExternalLink
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const DOCUMENTS = [
    {
        id: "intro",
        title: "Introducción",
        content: (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#32325d] mb-4">Introducción a la API</h2>
                    <p className="text-[#4f5b76] leading-relaxed">
                        AntillaPay se centra en cobros mediante Payment Links. La API está organizada alrededor de REST,
                        usa JSON y devuelve respuestas con códigos HTTP estándar. En el MVP, la integración principal es
                        crear enlaces de pago y monitorear eventos.
                    </p>
                </div>
                <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800">
                        <span className="text-xs font-mono text-slate-400">Base URL</span>
                    </div>
                    <div className="p-4 font-mono text-sm text-slate-300">
                        https://api.antillapay.com/v1
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "auth",
        title: "Autenticación",
        content: (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#32325d] mb-4">Autenticación</h2>
                    <p className="text-[#4f5b76] leading-relaxed mb-4">
                        Autentica tus solicitudes mediante Basic Auth con tu clave secreta de API como nombre de usuario y sin contraseña.
                        En el MVP se utiliza la clave de prueba.
                    </p>
                </div>
                <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800">
                        <div className="flex gap-4">
                            <span className="text-xs font-bold text-slate-200 border-b-2 border-slate-200 pb-2 -mb-2.5">cURL</span>
                            <span className="text-xs font-bold text-slate-500 cursor-pointer hover:text-slate-300">Node.js</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-slate-200">
                            <Copy className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <code className="font-mono text-sm text-slate-300">
                            <span className="text-purple-400">curl</span> https://api.antillapay.com/v1/payment_links \\ <br />
                            &nbsp;&nbsp;<span className="text-blue-400">-u</span> sk_test_51...:
                        </code>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "payment_links",
        title: "Payment Links",
        content: (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#32325d] mb-4">Payment Links API</h2>
                    <p className="text-[#4f5b76] leading-relaxed mb-4">
                        Crea enlaces de pago para cobrar a tus clientes de manera sencilla.
                    </p>
                </div>
                {/* Method & Endpoint */}
                <div className="flex items-center gap-3 font-mono text-sm border border-gray-200 rounded-md p-2 bg-white">
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 shadow-none rounded">POST</Badge>
                    <span className="text-[#32325d]">/v1/payment_links</span>
                </div>

                <h3 className="text-lg font-bold text-[#32325d] mt-6 mb-2">Parámetros</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[200px]">Parámetro</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Descripción</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-mono text-sm font-medium text-[#32325d]">line_items</TableCell>
                                <TableCell className="text-xs text-[#697386]">array</TableCell>
                                <TableCell className="text-sm text-[#4f5b76]">Lista de ítems para el cobro (nombre, monto, moneda).</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-mono text-sm font-medium text-[#32325d]">metadata</TableCell>
                                <TableCell className="text-xs text-[#697386]">object</TableCell>
                                <TableCell className="text-sm text-[#4f5b76]">Set de pares clave-valor adicionales.</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-mono text-sm font-medium text-[#32325d]">currency</TableCell>
                                <TableCell className="text-xs text-[#697386]">string</TableCell>
                                <TableCell className="text-sm text-[#4f5b76]">Moneda del cobro (CUP).</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    },
    {
        id: "products",
        title: "Products",
        content: (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#32325d] mb-4">Products</h2>
                    <p className="text-[#4f5b76] leading-relaxed">
                        En el MVP, los productos se gestionan desde el panel de AntillaPay y se usan para crear Payment Links con múltiples ítems.
                        No hay endpoints públicos para productos en esta fase.
                    </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-[13px] text-[#697386]">
                    Puedes crear productos en el catálogo y luego seleccionarlos al crear un Payment Link.
                </div>
            </div>
        )
    },
    {
        id: "customers",
        title: "Customers",
        content: (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#32325d] mb-4">Customers</h2>
                    <p className="text-[#4f5b76] leading-relaxed">
                        En el MVP, los clientes se registran automáticamente al completar un pago. Puedes consultarlos en el panel.
                        No existe API pública de clientes por ahora.
                    </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-[13px] text-[#697386]">
                    Usa esta sección para auditar cobros y mantener historial básico de clientes.
                </div>
            </div>
        )
    },
    {
        id: "events",
        title: "Events",
        content: (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#32325d] mb-4">Events</h2>
                    <p className="text-[#4f5b76] leading-relaxed">
                        Los eventos registran lo que ocurre en tu cuenta (por ejemplo: <span className="font-mono">payment_link.created</span>,
                        <span className="font-mono"> payment_link.updated</span>, <span className="font-mono">payment.failed</span>).
                        Puedes verlos en la vista de Eventos.
                    </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-[13px] text-[#697386]">
                    Usa los eventos para monitorear el estado de cobros y diagnósticos.
                </div>
            </div>
        )
    },
    {
        id: "webhooks",
        title: "Webhooks",
        content: (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#32325d] mb-4">Webhooks</h2>
                    <p className="text-[#4f5b76] leading-relaxed">
                        En el MVP, AntillaPay administra el endpoint de webhooks. Solo necesitas elegir qué eventos deseas recibir.
                    </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-[13px] text-[#697386]">
                    Endpoint administrado: <span className="font-mono text-[#32325d]">https://hooks.antillapay.com/webhooks</span>
                </div>
            </div>
        )
    }
];

const MENU_ITEMS = [
    { title: "Primeros pasos", items: ["intro", "auth"] },
    { title: "Core Resources", items: ["payment_links", "products", "customers"] },
    { title: "Webhooks & Events", items: ["events", "webhooks"] },
];

export default function DevelopersDocs() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeDoc, setActiveDoc] = useState("intro");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const docFromUrl = params.get('doc');
        if (docFromUrl && DOCUMENTS.some(d => d.id === docFromUrl)) {
            setActiveDoc(docFromUrl);
        }
    }, [location.search]);

    const currentDoc = DOCUMENTS.find(d => d.id === activeDoc) || DOCUMENTS[0];

    return (
        <div className="flex h-auto min-h-[600px] gap-8 max-w-7xl mx-auto p-6 bg-white rounded-lg">
            {/* Sidebar Navigation */}
            <div className="w-64 shrink-0 hidden md:block border-r border-gray-100 pr-4">
                <div className="space-y-6">
                    {MENU_ITEMS.map((section, idx) => (
                        <div key={idx}>
                            <h4 className="text-[12px] font-bold text-[#8898aa] uppercase tracking-wider mb-3 px-2">
                                {section.title}
                            </h4>
                            <div className="space-y-1">
                                {section.items.map((itemKey) => {
                                    // Normally we'd look up the title for each key, keeping it simple for mock
                                    const title = DOCUMENTS.find(d => d.id === itemKey)?.title ||
                                        itemKey.charAt(0).toUpperCase() + itemKey.slice(1).replace('_', ' ');
                                    return (
                                        <button
                                            key={itemKey}
                                            onClick={() => {
                                                setActiveDoc(itemKey);
                                                const params = new URLSearchParams(location.search);
                                                params.set('doc', itemKey);
                                                navigate(`${location.pathname}?${params.toString()}`);
                                            }}
                                            className={cn(
                                                "w-full text-left px-2 py-1.5 rounded-md text-[14px] font-medium transition-colors",
                                                activeDoc === itemKey
                                                    ? "bg-[#635bff]/10 text-[#635bff]"
                                                    : "text-[#4f5b76] hover:bg-gray-50 hover:text-[#32325d]"
                                            )}
                                        >
                                            {title}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 pb-20">
                <div className="flex items-center gap-2 mb-6">
                    <Badge variant="outline" className="text-[#635bff] border-[#635bff]/20 bg-[#635bff]/5">
                        v1.0.0
                    </Badge>
                    <span className="text-[14px] text-[#697386]">Última actualización: hace 2 días</span>
                </div>

                {currentDoc.content}

                <div className="mt-12 pt-8 border-t border-gray-100" />
            </div>
        </div>
    );
}
