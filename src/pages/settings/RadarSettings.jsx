import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, AlertTriangle, TrendingUp, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

export default function RadarSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    radarEnabled: true,
    autoBlock: true,
    reviewSuspicious: true,
    machineLearnin: true
  });
  const [riskLevel, setRiskLevel] = useState([50]);

  const handleToggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

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

        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Radar</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-indigo-600" />
                Protección antifraude
              </CardTitle>
              <CardDescription>
                Configuración principal de Radar para prevenir fraude
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="radarEnabled">Habilitar Radar</Label>
                  <p className="text-sm text-gray-500">Protección antifraude con machine learning</p>
                </div>
                <Switch
                  id="radarEnabled"
                  checked={settings.radarEnabled}
                  onCheckedChange={() => handleToggle('radarEnabled')}
                />
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm text-green-900">Estado de protección</p>
                  <Badge variant="default" className="bg-green-600">Activo</Badge>
                </div>
                <p className="text-xs text-green-700">
                  Radar está protegiendo activamente tus transacciones
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-indigo-600" />
                Nivel de riesgo
              </CardTitle>
              <CardDescription>
                Ajusta qué tan estricta es la protección antifraude
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Umbral de riesgo</Label>
                  <span className="text-sm font-medium text-indigo-600">{riskLevel[0]}%</span>
                </div>
                <Slider
                  value={riskLevel}
                  onValueChange={setRiskLevel}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Más permisivo</span>
                  <span>Más estricto</span>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-900">
                  <strong>Recomendación:</strong> Un nivel de 50% balancea protección y conversión.
                  Niveles más altos pueden bloquear transacciones legítimas.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-indigo-600" />
                Acciones automáticas
              </CardTitle>
              <CardDescription>
                Configura cómo Radar responde a transacciones sospechosas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoBlock">Bloqueo automático</Label>
                  <p className="text-sm text-gray-500">Bloquea automáticamente transacciones de alto riesgo</p>
                </div>
                <Switch
                  id="autoBlock"
                  checked={settings.autoBlock}
                  onCheckedChange={() => handleToggle('autoBlock')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reviewSuspicious">Revisión manual</Label>
                  <p className="text-sm text-gray-500">Marca transacciones sospechosas para revisión</p>
                </div>
                <Switch
                  id="reviewSuspicious"
                  checked={settings.reviewSuspicious}
                  onCheckedChange={() => handleToggle('reviewSuspicious')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="machineLearnin">Machine Learning adaptativo</Label>
                  <p className="text-sm text-gray-500">Aprende de tus decisiones para mejorar la detección</p>
                </div>
                <Switch
                  id="machineLearnin"
                  checked={settings.machineLearnin}
                  onCheckedChange={() => handleToggle('machineLearnin')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                Estadísticas de fraude
              </CardTitle>
              <CardDescription>
                Resumen de actividad de Radar en los últimos 30 días
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Transacciones bloqueadas</p>
                  <p className="text-2xl font-semibold text-gray-900">23</p>
                  <p className="text-xs text-green-600 mt-1">↓ 15% vs mes anterior</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">En revisión</p>
                  <p className="text-2xl font-semibold text-gray-900">7</p>
                  <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Tasa de fraude</p>
                  <p className="text-2xl font-semibold text-gray-900">0.12%</p>
                  <p className="text-xs text-green-600 mt-1">Dentro del promedio</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reglas personalizadas</CardTitle>
              <CardDescription>
                Crea reglas específicas para tu negocio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Bloquear países de alto riesgo</p>
                    <p className="text-xs text-gray-500">Lista personalizada de países bloqueados</p>
                  </div>
                  <Badge variant="default">Activa</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Límite de monto por transacción</p>
                    <p className="text-xs text-gray-500">Revisar transacciones mayores a $10,000</p>
                  </div>
                  <Badge variant="default">Activa</Badge>
                </div>
              </div>
              <Button variant="outline">Crear nueva regla</Button>
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
