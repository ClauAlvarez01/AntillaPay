// Validation schemas for business verification flow

export const validateTaxData = (data) => {
    const errors = {};

    // NIT validation
    if (!data.nit || data.nit.trim() === '') {
        errors.nit = 'El NIT es requerido';
    } else if (!/^\d{2}-\d{7}$/.test(data.nit)) {
        errors.nit = 'Formato de NIT inválido (ejemplo: 00-0000000)';
    }

    // Legal business name validation
    if (!data.razonSocial || data.razonSocial.trim() === '') {
        errors.razonSocial = 'La razón social es requerida';
    }

    // Business structure validation
    if (!data.estructuraEmpresa || data.estructuraEmpresa === '') {
        errors.estructuraEmpresa = 'Selecciona la estructura de la empresa';
    }

    return errors;
};

export const validateCompanyData = (data) => {
    const errors = {};

    // Company address validation
    if (!data.pais || data.pais === '') {
        errors.pais = 'El país es requerido';
    }

    if (!data.provincia || data.provincia.trim() === '') {
        errors.provincia = 'La provincia es requerida';
    }

    if (!data.municipio || data.municipio.trim() === '') {
        errors.municipio = 'El municipio es requerido';
    }

    if (!data.direccion || data.direccion.trim() === '') {
        errors.direccion = 'La dirección es requerida';
    }

    // Website validation (optional but must be valid if provided)
    if (data.sitioWeb && data.sitioWeb.trim() !== '') {
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlPattern.test(data.sitioWeb)) {
            errors.sitioWeb = 'URL inválida';
        }
    }

    return errors;
};

export const validateRepresentativeData = (data) => {
    const errors = {};

    // Legal name validation
    if (!data.nombreLegal || data.nombreLegal.trim() === '') {
        errors.nombreLegal = 'El nombre legal es requerido';
    }

    if (!data.apellidoLegal || data.apellidoLegal.trim() === '') {
        errors.apellidoLegal = 'El apellido legal es requerido';
    }

    // Email validation
    if (!data.email || data.email.trim() === '') {
        errors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Correo electrónico inválido';
    }

    // Date of birth validation
    if (!data.fechaNacimiento || data.fechaNacimiento.trim() === '') {
        errors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    } else {
        const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!datePattern.test(data.fechaNacimiento)) {
            errors.fechaNacimiento = 'Formato inválido (DD/MM/AAAA)';
        } else {
            const [day, month, year] = data.fechaNacimiento.split('/').map(Number);
            const date = new Date(year, month - 1, day);
            const today = new Date();
            const age = today.getFullYear() - date.getFullYear();

            if (age < 18) {
                errors.fechaNacimiento = 'Debes ser mayor de 18 años';
            }
        }
    }

    // Home address validation
    if (!data.paisDomicilio || data.paisDomicilio === '') {
        errors.paisDomicilio = 'El país es requerido';
    }

    if (!data.provinciaDomicilio || data.provinciaDomicilio.trim() === '') {
        errors.provinciaDomicilio = 'La provincia es requerida';
    }

    if (!data.municipioDomicilio || data.municipioDomicilio.trim() === '') {
        errors.municipioDomicilio = 'El municipio es requerido';
    }

    if (!data.direccionDomicilio || data.direccionDomicilio.trim() === '') {
        errors.direccionDomicilio = 'La dirección es requerida';
    }

    // Phone number validation
    if (!data.telefono || data.telefono.trim() === '') {
        errors.telefono = 'El número de teléfono es requerido';
    } else if (!/^\+?\d{10,15}$/.test(data.telefono.replace(/\s/g, ''))) {
        errors.telefono = 'Número de teléfono inválido';
    }

    return errors;
};

export const BUSINESS_STRUCTURES = [
    { value: 'empresa_estatal', label: 'Empresa estatal' },
    { value: 'cooperativa', label: 'Cooperativa' },
    { value: 'tcp', label: 'Trabajador por cuenta propia' },
    { value: 'mipyme', label: 'MIPYME' },
    { value: 'empresa_mixta', label: 'Empresa mixta' }
];

export const COUNTRIES = [
    { value: 'CU', label: 'Cuba' },
    { value: 'US', label: 'Estados Unidos' },
    { value: 'MX', label: 'México' },
    { value: 'ES', label: 'España' }
];

export const CUBAN_PROVINCES = [
    'Pinar del Río',
    'Artemisa',
    'La Habana',
    'Mayabeque',
    'Matanzas',
    'Cienfuegos',
    'Villa Clara',
    'Sancti Spíritus',
    'Ciego de Ávila',
    'Camagüey',
    'Las Tunas',
    'Holguín',
    'Granma',
    'Santiago de Cuba',
    'Guantánamo',
    'Isla de la Juventud'
];

export const validateProductsData = (data) => {
    const errors = {};

    // Category validation
    if (!data.categoria || data.categoria === '') {
        errors.categoria = 'La categoría es requerida';
    }

    // Description validation
    if (!data.descripcion || data.descripcion.trim() === '') {
        errors.descripcion = 'La descripción es requerida';
    } else if (data.descripcion.trim().length < 10) {
        errors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    return errors;
};

export const PRODUCT_CATEGORIES = [
    {
        group: 'Más popular',
        options: [
            { value: 'software', label: 'Software' },
            { value: 'ropa_accesorios', label: 'Ropa y accesorios' },
            { value: 'servicios_asesoramiento', label: 'Servicios de asesoramiento' }
        ]
    },
    {
        group: 'Productos digitales',
        options: [
            { value: 'saas', label: 'Software como servicio (SaaS)' },
            { value: 'aplicaciones', label: 'Aplicaciones' },
            { value: 'libros', label: 'Libros' },
            { value: 'musica_medios', label: 'Música u otros medios' },
            { value: 'juegos', label: 'Juegos' },
            { value: 'blogs_contenido', label: 'Blogs y contenido escrito' },
            { value: 'otros_digitales', label: 'Otros artículos digitales' }
        ]
    },
    {
        group: 'Alimentos y bebidas',
        options: [
            { value: 'restaurantes', label: 'Restaurantes y vida nocturna' },
            { value: 'tiendas_alimentacion', label: 'Tiendas de alimentación' },
            { value: 'catering', label: 'Servicios de catering' },
            { value: 'otros_alimentos', label: 'Otros servicios de alimentación y restauración' }
        ]
    },
    {
        group: 'Comercio minorista',
        options: [
            { value: 'software_retail', label: 'Software' },
            { value: 'ropa_accesorios_retail', label: 'Ropa y accesorios' },
            { value: 'tiendas_multiservicio', label: 'Tiendas multiservicio' },
            { value: 'productos_belleza', label: 'Productos de belleza' },
            { value: 'mobiliario_hogar', label: 'Mobiliario y menaje para el hogar' },
            { value: 'electrodomesticos', label: 'Electrodomésticos' },
            { value: 'repuestos_automovil', label: 'Repuestos y accesorios de automóvil' },
            { value: 'joyerias', label: 'Joyerías, relojerías y tiendas de platería' },
            { value: 'piedras_metales', label: 'Piedras y metales preciosos, relojes y joyas' },
            { value: 'otras_mercancias', label: 'Otras mercancías' }
        ]
    },
    {
        group: 'Servicios profesionales',
        options: [
            { value: 'servicios_asesoramiento', label: 'Servicios de asesoramiento' },
            { value: 'servicios_editoriales', label: 'Servicios editoriales y de imprenta' },
            { value: 'abogados_procuradores', label: 'Abogados y procuradores' },
            { value: 'servicios_quiebra', label: 'Servicios de quiebra' },
            { value: 'bonos_fianza', label: 'Bonos de fianza' },
            { value: 'contabilidad', label: 'Contabilidad, auditoría o asesoría fiscal' },
            { value: 'reparacion_ordenadores', label: 'Reparación de ordenadores' },
            { value: 'laboratorios_pruebas', label: 'Laboratorios de pruebas' },
            { value: 'autoservicios', label: 'Autoservicios' },
            { value: 'alquiler_automoviles', label: 'Alquiler de automóviles' },
            { value: 'venta_automoviles', label: 'Venta de automóviles' },
            { value: 'generacion_clientes', label: 'Generación de clientes' },
            { value: 'marketing_directo', label: 'Marketing directo' },
            { value: 'servicios_publicos', label: 'Servicios públicos' },
            { value: 'servicios_gubernamentales', label: 'Servicios gubernamentales' },
            { value: 'telemarketing', label: 'Telemarketing' },
            { value: 'asesoramiento_credito', label: 'Asesoramiento o reparación de crédito' },
            { value: 'asesoramiento_hipotecario', label: 'Servicios de asesoramiento hipotecario' },
            { value: 'reduccion_deuda', label: 'Servicios de reducción de deuda' },
            { value: 'servicios_garantia', label: 'Servicios de garantía' },
            { value: 'otros_marketing', label: 'Otros servicios de marketing' },
            { value: 'otros_servicios_empresariales', label: 'Otros servicios empresariales' }
        ]
    },
    {
        group: 'Asociaciones',
        options: [
            { value: 'fraternidades', label: 'Fraternidades y asociaciones de participación social y ciudadana' },
            { value: 'organizaciones_beneficas', label: 'Organizaciones benéficas y de servicios sociales' },
            { value: 'organizaciones_religiosas', label: 'Organizaciones religiosas' },
            { value: 'clubes_privados', label: 'Clubes privados' },
            { value: 'organizaciones_politicas', label: 'Organizaciones políticas' },
            { value: 'otras_asociaciones', label: 'Otras asociaciones' }
        ]
    },
    {
        group: 'Servicios personales',
        options: [
            { value: 'estudios_fotograficos', label: 'Estudios fotográficos' },
            { value: 'spa_belleza', label: 'Centros de spa de salud y belleza' },
            { value: 'peluquerias', label: 'Peluquerías y barberías' },
            { value: 'paisajismo', label: 'Servicios de paisajismo' },
            { value: 'salones_masajes', label: 'Salones de masajes' },
            { value: 'psicoterapia', label: 'Servicios de psicoterapia' },
            { value: 'asesoramiento_salud', label: 'Asesoramiento sobre salud y bienestar' },
            { value: 'limpieza_tintoreria', label: 'Servicios de limpieza y tintorería' },
            { value: 'servicios_citas', label: 'Servicios de citas' },
            { value: 'otros_personales', label: 'Otros servicios personales' }
        ]
    },
    {
        group: 'Transporte',
        options: [
            { value: 'transporte_compartido', label: 'Servicios de transporte compartido' },
            { value: 'taxis_limusinas', label: 'Taxis y limusinas' },
            { value: 'servicios_mensajeria', label: 'Servicios de mensajería' },
            { value: 'garajes', label: 'Garajes' },
            { value: 'agencias_viajes', label: 'Agencias de viajes' },
            { value: 'transportistas', label: 'Transportistas' },
            { value: 'transportes_despachos', label: 'Transportes o despachos' },
            { value: 'transporte_urbano', label: 'Transporte urbano y suburbano' },
            { value: 'companias_cruceros', label: 'Compañías de cruceros' },
            { value: 'lineas_aereas', label: 'Líneas aéreas y compañías de transporte aéreo' },
            { value: 'recarga_vehiculos', label: 'Recarga de vehículos eléctricos' },
            { value: 'otros_transporte', label: 'Otros servicios de transporte' }
        ]
    },
    {
        group: 'Viajes y alojamiento',
        options: [
            { value: 'alquiler_propiedades', label: 'Alquiler de propiedades' },
            { value: 'hoteles_moteles', label: 'Hoteles, moteles y posadas' },
            { value: 'servicios_tiempo_compartido', label: 'Servicios a tiempo compartido' },
            { value: 'otros_viajes', label: 'Otros servicios de viaje y alojamiento' }
        ]
    },
    {
        group: 'Educación',
        options: [
            { value: 'cuidado_infantil', label: 'Servicios de cuidado infantil' },
            { value: 'institutos_universidades', label: 'Institutos terciarios o universidades' },
            { value: 'centros_formacion', label: 'Centros de enseñanza de oficios o formación vocacional' },
            { value: 'escuelas_primarias_secundarias', label: 'Escuelas primarias o secundarias' },
            { value: 'otros_educativos', label: 'Otros servicios educativos' }
        ]
    },
    {
        group: 'Servicios de construcción',
        options: [
            { value: 'contratistas_generales', label: 'Contratistas generales' },
            { value: 'electricistas', label: 'Electricistas' },
            { value: 'carpinteros', label: 'Carpinteros' },
            { value: 'contratistas_especializados', label: 'Contratistas especializados' },
            { value: 'servicios_telecomunicaciones', label: 'Servicios de telecomunicaciones' },
            { value: 'equipamiento_telecomunicaciones', label: 'Equipamiento de telecomunicaciones' },
            { value: 'aire_calefaccion', label: 'Empresas de aire acondicionado y calefacción' },
            { value: 'otros_construccion', label: 'Otros servicios de construcción' }
        ]
    },
    {
        group: 'Actividades recreativas y de entretenimiento',
        options: [
            { value: 'venta_entradas', label: 'Agencias de venta de entradas para espectáculos' },
            { value: 'atracciones_turisticas', label: 'Atracciones turísticas' },
            { value: 'campamentos_recreativos', label: 'Campamentos recreativos' },
            { value: 'musicos_grupos', label: 'Músicos, grupos y orquestas' },
            { value: 'parques_atracciones', label: 'Parques de atracciones, ferias y circos' },
            { value: 'futurologos', label: 'Futurólogos' },
            { value: 'cines', label: 'Cines' },
            { value: 'apuestas_deportes', label: 'Apuestas y deportes de fantasía' },
            { value: 'loterias', label: 'Loterías' },
            { value: 'servicios_pronostico', label: 'Servicios de pronóstico o predicción' },
            { value: 'apuestas_linea', label: 'Apuestas en línea' },
            { value: 'otros_recreativos', label: 'Otros servicios recreativos y de entretenimiento' }
        ]
    },
    {
        group: 'Servicios médicos',
        options: [
            { value: 'aparatos_medicos', label: 'Aparatos médicos' },
            { value: 'medicos_personal', label: 'Médicos y personal sanitario' },
            { value: 'opticas_gafas', label: 'Ópticas, gafas y artículos relacionados' },
            { value: 'odontologos_ortodoncistas', label: 'Odontólogos y ortodoncistas' },
            { value: 'quiropracticos', label: 'Quiroprácticos' },
            { value: 'residencias_cuidado', label: 'Residencias y centros de cuidado asistencial' },
            { value: 'hospitales', label: 'Hospitales' },
            { value: 'recaudacion_fondos', label: 'Recaudación de fondos personales o micromecenazgo' },
            { value: 'psicologia_psiquiatria', label: 'Servicios de psicología y psiquiatría' },
            { value: 'vida_cotidiana', label: 'Vida cotidiana asistida' },
            { value: 'veterinarios', label: 'Servicios veterinarios' },
            { value: 'organizaciones_medicas', label: 'Organizaciones médicas' },
            { value: 'telemedicina', label: 'Telemedicina y telesalud' },
            { value: 'otros_medicos', label: 'Otros servicios médicos' }
        ]
    },
    {
        group: 'Servicios financieros',
        options: [
            { value: 'seguro', label: 'Seguro' },
            { value: 'agentes_valores', label: 'Agentes de valores y corredores de bolsa' },
            { value: 'giros_postales', label: 'Giros postales' },
            { value: 'cambio_divisas', label: 'Cambio de divisas' },
            { value: 'transferencias_bancarias', label: 'Transferencias bancarias' },
            { value: 'cobro_cheques', label: 'Cobro de cheques' },
            { value: 'prestamos_credito', label: 'Préstamos y otros instrumentos de crédito' },
            { value: 'agencias_cobro', label: 'Agencias de cobro' },
            { value: 'servicios_transferencias', label: 'Servicios o transferencias de dinero' },
            { value: 'servicios_inversion', label: 'Servicios de inversión' },
            { value: 'divisas_virtuales', label: 'Divisas virtuales' },
            { value: 'monederos_digitales', label: 'Monederos digitales' },
            { value: 'criptomonedas', label: 'Criptomonedas' },
            { value: 'otras_financieras', label: 'Otras entidades financieras' },
            { value: 'info_financiera', label: 'Información e investigación financieras' }
        ]
    },
    {
        group: 'Productos regulados y con restricción de edad',
        options: [
            { value: 'farmacias_productos', label: 'Farmacias y productos farmacéuticos' },
            { value: 'tabaco_puros', label: 'Tabaco y puros' },
            { value: 'contenido_adultos', label: 'Contenidos y servicios para adultos' },
            { value: 'vapeadores', label: 'Vapeadores, cigarrillos electrónicos, líquidos de recarga o productos relacionados' },
            { value: 'armas_municiones', label: 'Armas y municiones' },
            { value: 'suplementos', label: 'Suplementos o nutracéuticos' },
            { value: 'distribuidores_marihuana', label: 'Distribuidores de marihuana' },
            { value: 'productos_marihuana', label: 'Productos relacionados con la marihuana' },
            { value: 'accesorios_tabaco', label: 'Accesorios para tabaco y marihuana' },
            { value: 'alcohol', label: 'Alcohol' },
            { value: 'otros_regulados', label: 'Otros productos regulados o con restricción de edad' }
        ]
    }
];

export const STATEMENT_DESCRIPTOR_OPTIONS = [
    { value: 'personalizada', label: 'Descripción personalizada' },
    { value: 'nombre_empresa', label: 'Nombre de la empresa' },
    { value: 'url', label: 'URL del sitio web' }
];

export const validatePublicData = (data) => {
    const errors = {};

    // Statement descriptor validation
    if (data.descripcionCargo === 'personalizada') {
        if (!data.descripcionCargoPersonalizada || data.descripcionCargoPersonalizada.trim() === '') {
            errors.descripcionCargoPersonalizada = 'La descripción personalizada es requerida';
        } else if (data.descripcionCargoPersonalizada.length < 2 || data.descripcionCargoPersonalizada.length > 10) {
            errors.descripcionCargoPersonalizada = 'Debe tener entre 2 y 10 caracteres';
        }
    }

    // Phone validation
    if (!data.telefonoSoporte || data.telefonoSoporte.trim() === '') {
        errors.telefonoSoporte = 'El número de teléfono es requerido';
    }

    // Address validation
    if (!data.paisSoporte) {
        errors.paisSoporte = 'El país es requerido';
    }
    if (!data.provinciaSoporte) {
        errors.provinciaSoporte = 'La provincia es requerida';
    }
    if (!data.municipioSoporte) {
        errors.municipioSoporte = 'El municipio es requerido';
    }
    if (!data.direccionSoporte || data.direccionSoporte.trim() === '') {
        errors.direccionSoporte = 'La dirección es requerida';
    }

    return errors;
};
