import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Link2, Eye, Database, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function FinancialConnectionsSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    enableConnections: true,
    dataSharing: true,
    autoSync: true,
    encryptedStorage: true
  });

  const handleToggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const connectedInstitutions = [
    { name: 'Bank of America', status: 'active', lastSync: '2 horas' },
    { name: 'Chase', status: 'active', lastSync: '5 horas' },
    { name: 'Wells Fargo', status: 'pending', lastSync: 'Pendiente' }
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

        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Financial Connections</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Link2 className="h-5 w-5 mr-2 text-indigo-600" />
                Conexiones bancarias
              </CardTitle>
              <CardDescription>
                Gestiona las conexiones con instituciones financieras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {connectedInstitutions.map((institution, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Link2 className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{institution.name}</p>
                        <p className="text-xs text-gray-500">Última sincronización: {institution.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={institution.status === 'active' ? 'default' : 'secondary'}>
                        {institution.status === 'active' ? 'Activa' : 'Pendiente'}
                      </Badge>
                      <Button variant="ghost" size="sm">Gestionar</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button>
                <Link2 className="h-4 w-4 mr-2" />
                Conectar nueva institución
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-indigo-600" />
                Aspecto y experiencia
              </CardTitle>
              <CardDescription>
                Personaliza cómo se ve el flujo de conexión para tus clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm mb-2">Marca personalizada</p>
                <p className="text-xs text-gray-500 mb-3">
                  Añade tu logo y colores al flujo de conexión bancaria
                </p>
                <Button variant="outline" size="sm">Personalizar marca</Button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm mb-2">Instituciones destacadas</p>
                <p className="text-xs text-gray-500 mb-3">
                  Selecciona qué bancos mostrar primero a tus clientes
                </p>
                <Button variant="outline" size="sm">Configurar</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-indigo-600" />
                Datos y sincronización
              </CardTitle>
              <CardDescription>
                Configuración de datos de consumo y sincronización
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dataSharing">Compartir datos de transacciones</Label>
                  <p className="text-sm text-gray-500">Permite acceso a datos de transacciones bancarias</p>
                </div>
                <Switch
                  id="dataSharing"
                  checked={settings.dataSharing}
                  onCheckedChange={() => handleToggle('dataSharing')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoSync">Sincronización automática</Label>
                  <p className="text-sm text-gray-500">Actualiza datos automáticamente cada 24 horas</p>
                </div>
                <Switch
                  id="autoSync"
                  checked={settings.autoSync}
                  onCheckedChange={() => handleToggle('autoSync')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="encryptedStorage">Almacenamiento encriptado</Label>
                  <p className="text-sm text-gray-500">Todos los datos se almacenan con encriptación de extremo a extremo</p>
                </div>
                <Switch
                  id="encryptedStorage"
                  checked={settings.encryptedStorage}
                  onCheckedChange={() => handleToggle('encryptedStorage')}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-indigo-600" />
                Optimizaciones
              </CardTitle>
              <CardDescription>
                Mejora el rendimiento y la experiencia de conexión
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm mb-2">Caché de instituciones</p>
                  <p className="text-xs text-gray-500 mb-3">
                    Mejora los tiempos de carga almacenando datos de instituciones
                  </p>
                  <Badge variant="default" className="bg-green-600">Habilitado</Badge>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm mb-2">Reconexión automática</p>
                  <p className="text-xs text-gray-500 mb-3">
                    Intenta reconectar automáticamente cuando una conexión falla
                  </p>
                  <Badge variant="default" className="bg-green-600">Habilitado</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Límites de uso</CardTitle>
              <CardDescription>
                Monitorea el uso de Financial Connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Conexiones activas</p>
                    <p className="text-xs text-gray-500">Este mes</p>
                  </div>
                  <span className="text-lg font-semibold text-indigo-600">156</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Sincronizaciones</p>
                    <p className="text-xs text-gray-500">Últimas 24 horas</p>
                  </div>
                  <span className="text-lg font-semibold text-indigo-600">42</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>Guardar configuración</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
