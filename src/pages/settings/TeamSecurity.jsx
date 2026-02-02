import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, Shield, Key, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TeamSecurity() {
  const navigate = useNavigate();
  const [teamMembers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@antillapay.com', role: 'Administrador', status: 'active' },
    { id: 2, name: 'John Doe', email: 'john@antillapay.com', role: 'Desarrollador', status: 'active' },
    { id: 3, name: 'Jane Smith', email: 'jane@antillapay.com', role: 'Soporte', status: 'pending' }
  ]);

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

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Equipo y seguridad</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Invitar miembro
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-indigo-600" />
                Miembros del equipo
              </CardTitle>
              <CardDescription>
                Gestiona quién tiene acceso a tu cuenta de AntillaPay
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium text-sm">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                      {member.status === 'pending' && (
                        <Badge variant="outline">Pendiente</Badge>
                      )}
                      <Button variant="ghost" size="sm">Editar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-indigo-600" />
                Seguridad de la cuenta
              </CardTitle>
              <CardDescription>
                Configuración de seguridad y permisos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Autenticación de dos factores</p>
                  <p className="text-xs text-gray-500">Requiere 2FA para todos los miembros del equipo</p>
                </div>
                <Badge variant="default" className="bg-green-600">Habilitado</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Inicio de sesión único (SSO)</p>
                  <p className="text-xs text-gray-500">Integración con proveedores de identidad</p>
                </div>
                <Button variant="outline" size="sm">Configurar</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Restricciones de IP</p>
                  <p className="text-xs text-gray-500">Limita el acceso a direcciones IP específicas</p>
                </div>
                <Button variant="outline" size="sm">Configurar</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2 text-indigo-600" />
                Claves API
              </CardTitle>
              <CardDescription>
                Gestiona las claves API para integraciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Clave de producción</p>
                    <p className="text-xs text-gray-500 font-mono">pk_live_••••••••••••••••</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Ver</Button>
                    <Button variant="outline" size="sm">Rotar</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Clave de prueba</p>
                    <p className="text-xs text-gray-500 font-mono">pk_test_••••••••••••••••</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Ver</Button>
                    <Button variant="outline" size="sm">Rotar</Button>
                  </div>
                </div>
              </div>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Crear nueva clave
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
