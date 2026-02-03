import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Pencil, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function PersonalData() {
  const navigate = useNavigate();
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [contactEditOpen, setContactEditOpen] = useState(false);
  const [contactEditField, setContactEditField] = useState(null);
  const [contactEditValue, setContactEditValue] = useState('');
  const [userData, setUserData] = useState({
    name: 'Claudia Alvarez Martinez',
    email: 'clau200103am@gmail.com',
    secondaryEmail: '',
    phone: ''
  });
  const [draftUserData, setDraftUserData] = useState({
    name: 'Claudia Alvarez Martinez',
    email: 'clau200103am@gmail.com',
    password: ''
  });
  const [language, setLanguage] = useState('auto');
  const [isGoogleConnected, setIsGoogleConnected] = useState(true);
  const [sessions, setSessions] = useState([
    {
      location: 'United States (FL)',
      device: 'Chrome • Apple Macintosh - Mac OS',
      ip: '129.222.0.152',
      time: 'hace 1 hora',
      current: true
    }
  ]);
  const [hasSavedLanguage, setHasSavedLanguage] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('antillapay.personalData');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return;

      setUserData((prev) => ({
        ...prev,
        name: typeof parsed.name === 'string' ? parsed.name : prev.name,
        email: typeof parsed.email === 'string' ? parsed.email : prev.email,
        secondaryEmail: typeof parsed.secondaryEmail === 'string' ? parsed.secondaryEmail : prev.secondaryEmail,
        phone: typeof parsed.phone === 'string' ? parsed.phone : prev.phone
      }));

      setDraftUserData((prev) => ({
        ...prev,
        name: typeof parsed.name === 'string' ? parsed.name : prev.name,
        email: typeof parsed.email === 'string' ? parsed.email : prev.email
      }));

      if (typeof parsed.language === 'string') {
        setLanguage(parsed.language);
      }

      if (typeof parsed.isGoogleConnected === 'boolean') {
        setIsGoogleConnected(parsed.isGoogleConnected);
      }

      if (Array.isArray(parsed.sessions)) {
        const normalized = parsed.sessions
          .filter((s) => s && typeof s === 'object')
          .map((s) => ({
            location: typeof s.location === 'string' ? s.location : '—',
            device: typeof s.device === 'string' ? s.device : '—',
            ip: typeof s.ip === 'string' ? s.ip : '—',
            time: typeof s.time === 'string' ? s.time : '—',
            current: Boolean(s.current)
          }));

        if (normalized.length) setSessions(normalized);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        'antillapay.personalData',
        JSON.stringify({
          name: userData.name,
          email: userData.email,
          secondaryEmail: userData.secondaryEmail,
          phone: userData.phone,
          language,
          isGoogleConnected,
          sessions
        })
      );
    } catch {
      // ignore
    }
  }, [userData.secondaryEmail, userData.phone, language, isGoogleConnected, sessions]);

  const openContactEdit = (field) => {
    setContactEditField(field);
    setContactEditValue(field === 'secondaryEmail' ? userData.secondaryEmail : userData.phone);
    setContactEditOpen(true);
  };

  const handleSaveContactEdit = () => {
    if (!contactEditField) return;
    const trimmed = contactEditValue.trim();

    if (contactEditField === 'secondaryEmail') {
      setUserData((prev) => ({ ...prev, secondaryEmail: trimmed }));
    }
    if (contactEditField === 'phone') {
      setUserData((prev) => ({ ...prev, phone: trimmed }));
    }

    setContactEditOpen(false);
    setContactEditField(null);
  };

  const handleEditUser = () => {
    setDraftUserData({
      name: userData.name,
      email: userData.email,
      password: ''
    });
    setIsEditingUser(true);
  };

  const handleCancelEditUser = () => {
    setDraftUserData({
      name: userData.name,
      email: userData.email,
      password: ''
    });
    setIsEditingUser(false);
  };

  const handleSaveEditUser = () => {
    setUserData((prev) => ({
      ...prev,
      name: draftUserData.name.trim() || prev.name,
      email: draftUserData.email.trim() || prev.email
    }));
    setIsEditingUser(false);
  };

  const handleCloseContactEdit = (nextOpen) => {
    setContactEditOpen(nextOpen);
    if (!nextOpen) {
      setContactEditField(null);
      setContactEditValue('');
    }
  };

  const handleToggleGoogle = () => {
    setIsGoogleConnected((prev) => !prev);
  };

  const handleSaveLanguage = () => {
    setHasSavedLanguage(true);
    window.setTimeout(() => setHasSavedLanguage(false), 1500);
  };

  const handleCloseOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.current));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <button
            onClick={() => navigate('/dashboard/settings')}
            className="text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Configuración
          </button>
          <ChevronRight className="h-4 w-4 mx-2" />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-gray-900">Datos personales</h1>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              <Info className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600">Configuración global</p>
        </div>

        <div className="space-y-12">
          {/* Usuario */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Usuario</h2>
              {isEditingUser ? (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancelEditUser}>
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={handleSaveEditUser}
                  >
                    Guardar
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditUser}
                  className="text-sm"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-[200px_1fr] gap-4 items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-700">Nombre</span>
                {isEditingUser ? (
                  <Input
                    value={draftUserData.name}
                    onChange={(e) => setDraftUserData((prev) => ({ ...prev, name: e.target.value }))}
                    className="text-sm max-w-md"
                  />
                ) : (
                  <span className="text-sm text-gray-900">{userData.name}</span>
                )}
              </div>

              <div className="grid grid-cols-[200px_1fr] gap-4 items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-700">Contraseña</span>
                {isEditingUser ? (
                  <Input
                    type="password"
                    value={draftUserData.password}
                    onChange={(e) => setDraftUserData((prev) => ({ ...prev, password: e.target.value }))}
                    className="text-sm max-w-md"
                    placeholder="(opcional)"
                  />
                ) : (
                  <span className="text-sm text-gray-500">(No se definió la contraseña)</span>
                )}
              </div>

              <div className="grid grid-cols-[200px_1fr] gap-4 items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-700">Correo electrónico</span>
                {isEditingUser ? (
                  <Input
                    value={draftUserData.email}
                    onChange={(e) => setDraftUserData((prev) => ({ ...prev, email: e.target.value }))}
                    className="text-sm max-w-md"
                  />
                ) : (
                  <span className="text-sm text-gray-900">{userData.email}</span>
                )}
              </div>

              <div className="grid grid-cols-[200px_1fr] gap-4 items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-700">Correo electrónico secundario</span>
                {userData.secondaryEmail ? (
                  <button
                    type="button"
                    onClick={() => openContactEdit('secondaryEmail')}
                    className="text-sm text-indigo-600 hover:text-indigo-700 text-left"
                  >
                    {userData.secondaryEmail}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => openContactEdit('secondaryEmail')}
                    className="text-sm text-indigo-600 hover:text-indigo-700 text-left"
                  >
                    <span className="inline-flex items-center gap-1">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs font-medium">Nuevo</span>
                      Añadir correo electrónico secundario
                    </span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-[200px_1fr] gap-4 items-center py-3">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-700">Teléfono de contacto</span>
                  <Info className="h-3.5 w-3.5 text-gray-400" />
                </div>
                {userData.phone ? (
                  <button
                    type="button"
                    onClick={() => openContactEdit('phone')}
                    className="text-sm text-indigo-600 hover:text-indigo-700 text-left"
                  >
                    {userData.phone}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => openContactEdit('phone')}
                    className="text-sm text-indigo-600 hover:text-indigo-700 text-left"
                  >
                    Agregar número de teléfono de contacto
                  </button>
                )}
              </div>
            </div>
          </section>

          <Dialog open={contactEditOpen} onOpenChange={handleCloseContactEdit}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {contactEditField === 'secondaryEmail'
                    ? 'Añadir correo electrónico secundario'
                    : 'Añadir número de teléfono'}
                </DialogTitle>
                <DialogDescription>
                  {contactEditField === 'secondaryEmail'
                    ? 'Este correo se usará como opción de recuperación.'
                    : 'Este número se usará como contacto adicional.'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2">
                <Input
                  value={contactEditValue}
                  onChange={(e) => setContactEditValue(e.target.value)}
                  placeholder={contactEditField === 'secondaryEmail' ? 'correo@ejemplo.com' : '+53 5 1234 5678'}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => handleCloseContactEdit(false)}>
                  Cancelar
                </Button>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={handleSaveContactEdit}
                >
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Cuenta de Google */}
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Cuenta de Google</h2>
            <p className="text-sm text-gray-600 mb-4">Inicia sesión en AntillaPay con tu cuenta de Google.</p>
            
            {isGoogleConnected ? (
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold">
                    C
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Claudia Alvarez Martinez</p>
                    <p className="text-sm text-gray-600">{userData.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleToggleGoogle}
                >
                  Desconectar cuenta de Google
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Cuenta desconectada</p>
                  <p className="text-sm text-gray-600">Conecta Google para iniciar sesión más rápido.</p>
                </div>
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={handleToggleGoogle}
                >
                  Conectar
                </Button>
              </div>
            )}
          </section>

          {/* Asegura tu cuenta */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Asegura tu cuenta</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/activate-account', { state: { targetStep: 7 } })}
              >
                Configurar
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              AntillaPay utiliza un token de autenticación enviado a tu correo electrónico para verificar tu identidad y mantener tu cuenta segura.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Cada vez que inicies sesión desde un dispositivo nuevo, te enviaremos un código único. También podrás descargar códigos de recuperación.
            </p>
          </section>

          {/* Idioma */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Idioma</h2>
              <Button variant="outline" size="sm" onClick={handleSaveLanguage}>
                <span className={hasSavedLanguage ? 'text-green-700' : undefined}>
                  {hasSavedLanguage ? 'Guardado' : 'Guardar'}
                </span>
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Selecciona el idioma preferido para el Dashboard e incluye el formato de fecha, hora y número.
            </p>
            
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Detección automática</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
            
            <p className="text-sm text-gray-600 mt-3">
              Por definir.
            </p>
          </section>

          {/* Sesiones de inicio de sesión */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Sesiones de inicio de sesión</h2>
              <Button variant="outline" size="sm" onClick={handleCloseOtherSessions}>
                Cerrar el resto de las sesiones
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Lugares donde has iniciado sesión en AntillaPay.
            </p>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Ubicación</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Dispositivo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Dirección IP</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Hora</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-3 text-sm text-gray-900">{session.location}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{session.device}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{session.ip}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{session.time}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        {session.current && (
                          <span className="text-gray-600">Sesión actual</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
