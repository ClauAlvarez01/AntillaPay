import React, { useState } from 'react';
import { ArrowLeft, Check, ChevronsUpDown, Info, Loader2, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import AntillaPayLogo from "@/components/brand/AntillaPayLogo";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const countries = [
    { label: "Alemania", value: "de", flag: "🇩🇪" },
    { label: "Australia", value: "au", flag: "🇦🇺" },
    { label: "Austria", value: "at", flag: "🇦🇹" },
    { label: "Bélgica", value: "be", flag: "🇧🇪" },
    { label: "Brasil", value: "br", flag: "🇧🇷" },
    { label: "Bulgaria", value: "bg", flag: "🇧🇬" },
    { label: "Cuba", value: "cu", flag: "🇨🇺" },
    { label: "Estados Unidos", value: "us", flag: "🇺🇸" },
    { label: "España", value: "es", flag: "🇪🇸" },
    { label: "México", value: "mx", flag: "🇲🇽" },
    { label: "Colombia", value: "co", flag: "🇨🇴" },
    { label: "Argentina", value: "ar", flag: "🇦🇷" },
];

const Feature = ({ title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="mb-10 relative pl-6 border-l-2 border-[#635bff]"
    >
        <h3 className="text-[#32325d] font-bold mb-2 text-lg">{title}</h3>
        <p className="text-[#697386] leading-relaxed text-[15px] max-w-sm">
            {description}
        </p>
    </motion.div>
);

export default function RegisterPage() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("us");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate('/dashboard');
        }, 1500);
    };

    const selectedCountry = countries.find((country) => country.value === value);

    return (
        <div className="min-h-screen w-full flex flex-col relative overflow-hidden font-sans">

            {/* Gradient Background (Synchronized with Login.jsx) */}
            <div className="absolute inset-0 -z-10">
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(135deg, 
              #fdf4ff 0%,
              #fae8ff 10%,
              #e0e7ff 25%,
              #dbeafe 40%,
              #cffafe 55%,
              #d1fae5 70%,
              #fef3c7 85%,
              #ffedd5 100%
            )`
                    }}
                />
                <div className="absolute top-0 right-0 w-[60%] h-[70%]" style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(167, 139, 250, 0.3) 0%, transparent 50%)' }} />
                <div className="absolute bottom-0 left-0 w-[50%] h-[60%]" style={{ background: 'radial-gradient(ellipse at 20% 80%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)' }} />
            </div>

            <div className="flex-1 w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-center p-6 lg:p-20 relative z-10">

                {/* Left Column: Branding & Features */}
                <div className="lg:w-[45%] flex flex-col lg:pr-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 text-[32px] font-bold text-[#32325d]"
                    >
                        AntillaPay
                    </motion.div>

                    <div className="space-y-2">
                        <Feature
                            title="Empieza de inmediato"
                            description="Haz la integración con las API pensadas para desarrolladores o elige las soluciones que requieren poca programación o están prediseñadas."
                            delay={0.2}
                        />
                        <Feature
                            title="Acepta cualquier modelo de negocio"
                            description="E-commerce, suscripciones, plataformas de SaaS, marketplaces y mucho más, todo ello dentro de una plataforma unificada."
                            delay={0.3}
                        />
                        <Feature
                            title="Únete a millones de empresas"
                            description="Startups y empresas ambiciosas de todos los tamaños confían en AntillaPay."
                            delay={0.4}
                        />
                    </div>
                </div>

                {/* Right Column: Registration Card */}
                <div className="lg:w-[45%] flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-[440px] bg-white rounded-xl shadow-[0_50px_100px_-20px_rgba(50,50,93,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3)] overflow-hidden"
                    >
                        <div className="p-7 lg:p-9">
                            <h1 className="text-[22px] font-bold text-[#32325d] mb-5">
                                Crea tu cuenta de AntillaPay
                            </h1>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-[#32325d] mb-1">
                                        Correo electrónico
                                    </label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-10 rounded-md border-gray-200 focus:border-violet-500 focus:ring-violet-500 bg-white"
                                        placeholder="email@example.com"
                                        required
                                    />
                                </div>

                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-[#32325d] mb-1">
                                        Nombre completo
                                    </label>
                                    <Input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="h-10 rounded-md border-gray-200 focus:border-violet-500 focus:ring-violet-500 bg-white"
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-[#32325d] mb-1">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-10 rounded-md border-gray-200 focus:border-violet-500 focus:ring-violet-500 bg-white pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Country Selector */}
                                <div>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <label className="text-sm font-semibold text-[#32325d]">
                                            País
                                        </label>
                                        <Info className="w-3.5 h-3.5 text-gray-400" />
                                    </div>

                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className={cn(
                                                    "w-full h-10 justify-between rounded-md border-gray-200 bg-white hover:bg-white text-gray-700 px-3 font-normal",
                                                    open && "border-violet-500 ring-1 ring-violet-500"
                                                )}
                                            >
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <span className="text-lg leading-none shrink-0">{selectedCountry?.flag}</span>
                                                    <span className="truncate">{selectedCountry?.label}</span>
                                                </div>
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40 text-[#32325d]" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white border-gray-200 shadow-2xl rounded-lg" align="start">
                                            <Command className="w-full">
                                                <CommandInput placeholder="Buscar..." className="h-10 border-none focus:ring-0 text-gray-800" />
                                                <CommandList className="max-h-[300px] overflow-y-auto">
                                                    <CommandEmpty>No se encontró el país.</CommandEmpty>
                                                    <CommandGroup className="p-1">
                                                        {countries.map((country) => (
                                                            <CommandItem
                                                                key={country.value}
                                                                value={country.label}
                                                                onSelect={() => {
                                                                    setValue(country.value);
                                                                    setOpen(false);
                                                                }}
                                                                className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#f6f9fc] data-[selected=true]:bg-[#f6f9fc] rounded-md transition-colors"
                                                            >
                                                                <span className="text-lg leading-none shrink-0">{country.flag}</span>
                                                                <span className="text-[14px] font-medium text-[#32325d] truncate">{country.label}</span>
                                                                <Check className={cn(
                                                                    "ml-auto h-4 w-4 text-[#635bff] transition-opacity shrink-0",
                                                                    value === country.value ? "opacity-100" : "opacity-0"
                                                                )} />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-10 bg-[#635bff] hover:bg-[#5851e0] text-white rounded-md font-bold text-[14px] shadow-sm transition-all active:scale-[0.98] mt-2"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Crear cuenta'}
                                </Button>

                                {/* Divider */}
                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-gray-100" />
                                    </div>
                                    <div className="relative flex justify-center text-[11px] uppercase">
                                        <span className="bg-white px-2 text-[#697386] font-medium">o</span>
                                    </div>
                                </div>

                                {/* Google Button */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-10 rounded-md border-gray-200 text-[#32325d] font-semibold hover:bg-gray-50 flex items-center justify-center gap-2 text-[14px]"
                                >
                                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Crea tu cuenta con Google
                                </Button>
                            </form>
                        </div>

                        {/* Sub-footer inside card */}
                        <div className="bg-[#f6f9fc] p-4 text-center border-t border-gray-100">
                            <p className="text-sm text-[#697386]">
                                ¿Ya tienes una cuenta?{' '}
                                <Link to="/login" className="text-[#635bff] hover:text-[#5851e0] font-semibold transition-colors">
                                    Inicia sesión
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full p-8 lg:px-20 relative z-20 flex flex-col md:flex-row items-center gap-6">
                <span className="text-sm text-[#697386] font-medium">© AntillaPay</span>
                <div className="flex gap-6">
                    <Link to="#" className="text-sm text-[#697386] hover:text-[#32325d] font-medium transition-colors">
                        Privacidad y condiciones
                    </Link>
                </div>
            </footer>
        </div>
    );
}
