import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EnvironmentBanner({ environment, onRequestLive }) {
    if (environment !== "test") {
        return null;
    }

    return (
        <div className="sticky top-0 inset-x-0 z-50 w-screen bg-[#e96b34] text-white">
            <div className="h-10 px-6 flex items-center justify-between gap-4">
                <span className="text-[13px] font-semibold">
                    Estás usando datos de prueba
                </span>
                <button
                    type="button"
                    onClick={onRequestLive}
                    aria-label="Cambiar a cuenta live"
                    className={cn(
                        "flex items-center gap-2 px-2 py-1 text-[12px] font-semibold text-white/95",
                        "hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    )}
                >
                    Cambiar a cuenta live
                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
