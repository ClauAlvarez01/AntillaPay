import React, { useState } from 'react';
import {
    Key,
    Eye,
    EyeOff,
    Copy,
    RefreshCw,
    Shield,
    AlertTriangle,
    MoreHorizontal
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DevelopersApiKeys() {
    const [showSecretKey, setShowSecretKey] = useState(false);

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6 bg-white min-h-[400px] rounded-lg">
            {/* Header */}
            <div>
                <h1 className="text-[24px] font-bold text-[#32325d] mb-2">Claves de API</h1>
                <p className="text-[14px] text-[#697386]">
                    Usa estas claves para autenticar tus solicitudes a la API. Aprende más sobre la <a href="#" className="text-[#635bff] hover:text-[#32325d]">autenticación</a>.
                </p>
            </div>

            {/* Standard Keys Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-[16px] font-bold text-[#32325d]">Claves estándar</h2>
                    <Button variant="outline" className="border-gray-200 text-[#32325d]">
                        <Key className="w-4 h-4 mr-2 text-gray-500" />
                        Crear clave restringida
                    </Button>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[180px]">Nombre</TableHead>
                                <TableHead>Token</TableHead>
                                <TableHead>Creada</TableHead>
                                <TableHead>Último uso</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="group">
                                <TableCell>
                                    <div className="font-medium text-[#32325d]">Clave publicable</div>
                                    <Badge variant="secondary" className="mt-1 font-normal text-[10px] bg-gray-100 text-gray-500">pk_test</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            readOnly
                                            value="pk_test_51Qj2sDs2a8s7d6f5g4h3j2k1l0..."
                                            className="font-mono text-[13px] bg-gray-50 border-gray-200 h-9 w-[300px]"
                                        />
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-[#635bff]">
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="text-[13px] text-[#697386]">
                                    2 de Feb, 2024
                                </TableCell>
                                <TableCell className="text-[13px] text-[#697386]">
                                    Ahora
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Ver logs</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>

                            <TableRow className="group bg-yellow-50/30">
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="font-medium text-[#32325d]">Clave secreta</div>
                                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200 shadow-none text-[10px]">
                                            SENSIBLE
                                        </Badge>
                                    </div>
                                    <Badge variant="secondary" className="mt-1 font-normal text-[10px] bg-gray-100 text-gray-500">sk_test</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <Input
                                                readOnly
                                                type={showSecretKey ? "text" : "password"}
                                                value="sk_test_4eC39HqLyjWDarjtT1zdp7dc"
                                                className="font-mono text-[13px] bg-white border-gray-200 h-9 w-[300px] pr-10"
                                            />
                                            <button
                                                onClick={() => setShowSecretKey(!showSecretKey)}
                                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
                                            >
                                                {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-[#635bff]">
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-yellow-700">
                                        <AlertTriangle className="w-3 h-3" />
                                        <span>Solo visible para administradores. No compartas esta clave.</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-[13px] text-[#697386]">
                                    2 de Feb, 2024
                                </TableCell>
                                <TableCell className="text-[13px] text-[#697386]">
                                    Hace 5 min
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="text-red-600">
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Rotar clave...
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Secret Management Info */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex gap-4">
                <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm h-fit">
                    <Shield className="w-5 h-5 text-[#635bff]" />
                </div>
                <div>
                    <h3 className="text-[#32325d] font-bold text-[14px]">Seguridad de claves</h3>
                    <p className="text-[#4f5b76] text-[13px] mt-1 leading-relaxed max-w-2xl">
                        Tus claves de API llevan muchos privilegios, así que asegúrate de mantenerlas seguras.
                        No compartas tus claves secretas en áreas públicamente accesibles como GitHub, código del lado del cliente,
                        y demás.
                    </p>
                    <Button variant="link" className="text-[#635bff] p-0 h-auto text-[13px] mt-2">
                        Ver mejores prácticas de seguridad
                    </Button>
                </div>
            </div>
        </div>
    );
}
