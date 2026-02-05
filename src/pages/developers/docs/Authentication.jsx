import React from 'react';
import { Shield, Key, Lock, CheckCircle, AlertTriangle, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Authentication() {
  const curlExample = `curl -X POST https://api.antillapay.com/v1/payments \\
  -H 'Authorization: Bearer sk_test_4eC39HqLyjWDarjtT1zdp7dc' \\
  -H 'Content-Type: application/json' \\
  -d '{"amount": 2500, "currency": "CUP"}'`;

  const jsExample = `const response = await fetch('https://api.antillapay.com/v1/payments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'sk_test_4eC39HqLyjWDarjtT1zdp7dc'
  },
  body: JSON.stringify({ amount: 2500, currency: 'CUP' })
});`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 bg-white min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-bold text-[#32325d] mb-4">Autenticación</h1>
        <p className="text-[16px] text-[#697386] leading-relaxed">
          Aprende cómo autenticar tus solicitudes a la API de AntillaPay usando claves de API y otros métodos de seguridad.
        </p>
      </div>

      {/* API Keys Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Key className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-[24px] font-bold text-[#32325d]">Claves de API</h2>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <p className="text-[#4f5b76] text-[14px] leading-relaxed mb-4">
            Las claves de API son el método principal para autenticar tus solicitudes. Cada clave tiene permisos específicos y puede ser usada en diferentes entornos.
          </p>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-gray-100 text-gray-700">pk_test</Badge>
                <h3 className="font-semibold text-[#32325d]">Clave Publicable</h3>
              </div>
              <p className="text-[13px] text-[#697386] mb-3">
                Usada para crear tokens de pago y otras operaciones del lado del cliente. Puede ser compartida de forma segura.
              </p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-[12px]">
                pk_test_51Qj2sDs2a8s7d6f5g4h3j2k1l0...
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-yellow-100 text-yellow-800">sk_test</Badge>
                <h3 className="font-semibold text-[#32325d]">Clave Secreta</h3>
              </div>
              <p className="text-[13px] text-[#697386] mb-3">
                Usada para operaciones del lado del servidor. Nunca debe ser expuesta en código del lado del cliente.
              </p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-[12px]">
                sk_test_4eC39HqLyjWDarjtT1zdp7dc
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Methods */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-50 rounded-lg">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-[24px] font-bold text-[#32325d]">Métodos de Autenticación</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-[#32325d] mb-3">Bearer Token (Recomendado)</h3>
            <p className="text-[13px] text-[#697386] mb-4">
              Incluye tu clave secreta en el encabezado Authorization usando el esquema Bearer.
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-[12px] overflow-x-auto">
              <div className="text-green-400 mb-2"># Ejemplo con curl</div>
              <pre className="whitespace-pre-wrap"><code>{curlExample}</code></pre>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-[#32325d] mb-3">API Key en Encabezado</h3>
            <p className="text-[13px] text-[#697386] mb-4">
              Alternativamente, puedes enviar la clave en el encabezado X-API-Key.
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-[12px] overflow-x-auto">
              <div className="text-green-400 mb-2"># Ejemplo con JavaScript</div>
              <pre className="whitespace-pre-wrap"><code>{jsExample}</code></pre>
            </div>
          </div>
        </div>
      </div>

      {/* Security Best Practices */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-50 rounded-lg">
            <Lock className="w-6 h-6 text-yellow-600" />
          </div>
          <h2 className="text-[24px] font-bold text-[#32325d]">Mejores Prácticas de Seguridad</h2>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-800 mb-1">Usa claves de prueba en desarrollo</h4>
              <p className="text-[13px] text-green-700">
                Siempre usa claves de prueba (pk_test, sk_test) durante el desarrollo y testing.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-800 mb-1">Guarda claves secretas de forma segura</h4>
              <p className="text-[13px] text-green-700">
                Usa variables de entorno o servicios de secret management, nunca las hardcodees.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-800 mb-1">Nunca expongas claves secretas</h4>
              <p className="text-[13px] text-red-700">
                Las claves secretas nunca deben estar en código del lado del cliente, repositorios públicos o logs.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-800 mb-1">Implementa rotación de claves</h4>
              <p className="text-[13px] text-green-700">
                Rota tus claves periódicamente y usa claves diferentes para cada entorno.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Environment Variables */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Code className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-[24px] font-bold text-[#32325d]">Variables de Entorno</h2>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <p className="text-[#4f5b76] text-[14px] leading-relaxed mb-4">
            La forma recomendada de gestionar tus claves de API es usando variables de entorno.
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-[#32325d] mb-2">.env file</h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-[12px]">
                <div>ANTILLAPAY_SECRET_KEY=sk_test_4eC39HqLyjWDarjtT1zdp7dc</div>
                <div>ANTILLAPAY_PUBLIC_KEY=pk_test_51Qj2sDs2a8s7d6f5g4h3j2k1l0...</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-[#32325d] mb-2">Uso en código</h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-[12px]">
                <div>const antillapay = require('antillapay')(process.env.ANTILLAPAY_SECRET_KEY);</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-3">Próximos Pasos</h3>
        <div className="space-y-2">
          <p className="text-[13px] text-blue-700">
            • Lee nuestra <a href="#" className="underline hover:text-blue-800">Guía de Integración</a> para comenzar
          </p>
          <p className="text-[13px] text-blue-700">
            • Explora nuestra <a href="#" className="underline hover:text-blue-800">Referencia de API</a> completa
          </p>
          <p className="text-[13px] text-blue-700">
            • Revisa los <a href="#" className="underline hover:text-blue-800">Ejemplos de Código</a> para diferentes lenguajes
          </p>
        </div>
      </div>
    </div>
  );
}
