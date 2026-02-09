import React from "react";
import { Button } from "@/components/ui/button";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
        this.handleReset = this.handleReset.bind(this);
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        if (this.props.onError) {
            this.props.onError(error, info);
        }
    }

    handleReset() {
        this.setState({ hasError: false, error: null });
        if (this.props.onReset) {
            this.props.onReset();
        }
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-[18px] font-semibold text-[#1f2a44]">
                    {this.props.title || "Se produjo un error"}
                </h2>
                <p className="mt-2 text-[13px] text-[#6b7280]">
                    {this.props.description || "No pudimos cargar este módulo. Puedes reintentar o reiniciar los datos locales."}
                </p>
                {this.state.error?.message && (
                    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
                        {this.state.error.message}
                    </div>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                    <Button
                        variant="outline"
                        className="border-gray-200 text-[#32325d]"
                        onClick={this.handleReset}
                    >
                        Reintentar
                    </Button>
                    {this.props.resetLabel && (
                        <Button
                            className="bg-[#635bff] hover:bg-[#5851e0] text-white"
                            onClick={this.props.onReset}
                        >
                            {this.props.resetLabel}
                        </Button>
                    )}
                </div>
            </div>
        );
    }
}
