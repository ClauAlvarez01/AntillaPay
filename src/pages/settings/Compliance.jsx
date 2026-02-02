import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, Download, Shield, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Compliance() {
  const navigate = useNavigate();

  const documents = [
    { id: 1, name: 'Certificado PCI DSS', date: '2024-01-15', status: 'valid' },
    { id: 2, name: 'Política de privacidad', date: '2024-02-01', status: 'valid' },
    { id: 3, name: 'Términos y condiciones', date: '2024-02-01', status: 'valid' },
    { id: 4, name: 'Informe de auditoría', date: '2023-12-20', status: 'valid' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/dashboard/settings')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Volver a Configuración
        </Button>

        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Cumplimiento de la normativa y documentos</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-indigo-600" />
                Estado de cumplimiento PCI DSS
              </CardTitle>
              <CardDescription>
                Estándar de seguridad de datos para la industria de tarjetas de pago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium text-sm text-green-900">Certificación PCI DSS Nivel 1</p>
                    <p className="text-xs text-green-700">Tu cuenta cumple con todos los requisitos de seguridad</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-600">Válido</Badge>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">Próxima auditoría: 15 de julio de 2026</p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar certificado
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                Documentos legales
              </CardTitle>
              <CardDescription>
                Documentos y políticas de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-500">Última actualización: {doc.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="default" className="bg-green-600">Válido</Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="h-5 w-5 mr-2 text-indigo-600" />
                Exportaciones de datos
              </CardTitle>
              <CardDescription>
                Solicita exportaciones de tus datos según GDPR
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Puedes solicitar una exportación completa de todos los datos asociados con tu cuenta. 
                El proceso puede tardar hasta 48 horas.
              </p>
              <Button variant="outline">Solicitar exportación de datos</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración de retención de datos</CardTitle>
              <CardDescription>
                Define cuánto tiempo se conservan tus datos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Datos de transacciones</p>
                    <p className="text-xs text-gray-500">Conservar durante 7 años (requerido por ley)</p>
                  </div>
                  <span className="text-xs text-gray-600">7 años</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Registros de actividad</p>
                    <p className="text-xs text-gray-500">Logs de acceso y cambios</p>
                  </div>
                  <span className="text-xs text-gray-600">1 año</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
