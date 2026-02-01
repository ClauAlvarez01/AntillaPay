import { useState, useEffect } from 'react';
import {
    validateTaxData,
    validateCompanyData,
    validateRepresentativeData,
    validateProductsData,
    validatePublicData,
    validateBankData,
    validateSecurityData
} from '@/utils/businessVerificationSchema';

const STORAGE_KEY = 'antillapay_business_verification';

const initialTaxData = {
    nit: '',
    razonSocial: '',
    estructuraEmpresa: ''
};

const initialCompanyData = {
    nombreComercial: '',
    pais: 'CU',
    provincia: '',
    municipio: '',
    direccion: '',
    apartamento: '',
    codigoPostal: '',
    sitioWeb: ''
};

const initialRepresentativeData = {
    nombreLegal: '',
    apellidoLegal: '',
    email: '',
    fechaNacimiento: '',
    paisDomicilio: 'CU',
    provinciaDomicilio: '',
    municipioDomicilio: '',
    direccionDomicilio: '',
    apartamentoDomicilio: '',
    codigoPostalDomicilio: '',
    telefono: '',
    codigoPais: '+53'
};

const initialProductsData = {
    categoria: '',
    descripcion: ''
};

const initialPublicData = {
    descripcionCargo: '',
    descripcionCargoPersonalizada: '',
    telefonoSoporte: '',
    mostrarTelefonoRecibos: false,
    paisSoporte: 'CU',
    provinciaSoporte: '',
    municipioSoporte: '',
    direccionSoporte: '',
    apartamentoSoporte: '',
    codigoPostalSoporte: ''
};

const initialBankData = {
    method: 'selection', // 'selection' or 'manual'
    bankId: '',
    routingNumber: '',
    accountNumber: '',
    confirmAccountNumber: ''
};

const initialSecurityData = {
    method: '', // 'authenticator' or 'sms'
    isConfigured: false,
    phoneNumber: '',
    verificationCode: '',
    recoveryCodes: [],
    recoveryCodesDownloaded: false
};

export const useBusinessVerification = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [taxData, setTaxData] = useState(initialTaxData);
    const [companyData, setCompanyData] = useState(initialCompanyData);
    const [representativeData, setRepresentativeData] = useState(initialRepresentativeData);
    const [productsData, setProductsData] = useState(initialProductsData);
    const [publicData, setPublicData] = useState(initialPublicData);
    const [bankData, setBankData] = useState(initialBankData);
    const [securityData, setSecurityData] = useState(initialSecurityData);
    const [errors, setErrors] = useState({});

    // Load saved data from localStorage on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.taxData) setTaxData(parsed.taxData);
                if (parsed.companyData) setCompanyData(parsed.companyData);
                if (parsed.representativeData) setRepresentativeData(parsed.representativeData);
                if (parsed.productsData) setProductsData(parsed.productsData);
                if (parsed.publicData) setPublicData(parsed.publicData);
                if (parsed.bankData) setBankData(parsed.bankData);
                if (parsed.securityData) setSecurityData(parsed.securityData);
                if (parsed.currentStep) setCurrentStep(parsed.currentStep);
            } catch (error) {
                console.error('Error loading saved verification data:', error);
            }
        }
    }, []);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const dataToSave = {
            taxData,
            companyData,
            representativeData,
            productsData,
            publicData,
            bankData,
            securityData,
            currentStep
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }, [taxData, companyData, representativeData, productsData, publicData, bankData, securityData, currentStep]);

    const updateTaxData = (field, value) => {
        setTaxData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const updateCompanyData = (field, value) => {
        setCompanyData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const updateRepresentativeData = (field, value) => {
        setRepresentativeData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const updateProductsData = (field, value) => {
        setProductsData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const updatePublicData = (field, value) => {
        setPublicData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const updateBankData = (field, value) => {
        setBankData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const updateSecurityData = (field, value) => {
        setSecurityData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateCurrentStep = () => {
        let validationErrors = {};

        switch (currentStep) {
            case 1:
                validationErrors = validateTaxData(taxData);
                break;
            case 2:
                validationErrors = validateCompanyData(companyData);
                break;
            case 3:
                validationErrors = validateRepresentativeData(representativeData);
                break;
            case 4:
                validationErrors = validateProductsData(productsData);
                break;
            case 5:
                validationErrors = validatePublicData(publicData);
                break;
            case 6:
                validationErrors = validateBankData(bankData);
                break;
            case 7:
                validationErrors = validateSecurityData(securityData);
                break;
            default:
                break;
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const nextStep = () => {
        if (validateCurrentStep()) {
            setCurrentStep(prev => Math.min(prev + 1, 8));
            return true;
        }
        return false;
    };

    const previousStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        setErrors({});
    };

    const goToStep = (stepNumber) => {
        if (stepNumber >= 1 && stepNumber <= 8) {
            setCurrentStep(stepNumber);
            setErrors({});
        }
    };

    const resetVerification = () => {
        setCurrentStep(1);
        setTaxData(initialTaxData);
        setCompanyData(initialCompanyData);
        setRepresentativeData(initialRepresentativeData);
        setProductsData(initialProductsData);
        setPublicData(initialPublicData);
        setBankData(initialBankData);
        setSecurityData(initialSecurityData);
        setErrors({});
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(STORAGE_KEY);
        }
    };

    const submitVerification = () => {
        if (!validateCurrentStep()) {
            return false;
        }

        // Save complete verification data
        const completeData = {
            taxData,
            companyData,
            representativeData,
            productsData,
            publicData,
            bankData,
            securityData,
            completedAt: new Date().toISOString()
        };

        if (typeof window !== 'undefined') {
            window.localStorage.setItem('antillapay_business_verified', JSON.stringify(completeData));
            window.localStorage.removeItem(STORAGE_KEY);
        }

        return true;
    };

    const validateAllSteps = () => {
        const taxErrors = validateTaxData(taxData);
        const companyErrors = validateCompanyData(companyData);
        const repErrors = validateRepresentativeData(representativeData);
        const prodErrors = validateProductsData(productsData);
        const publicErrors = validatePublicData(publicData);
        const bankErrors = validateBankData(bankData);
        const secErrors = validateSecurityData(securityData);

        return Object.keys(taxErrors).length === 0 &&
            Object.keys(companyErrors).length === 0 &&
            Object.keys(repErrors).length === 0 &&
            Object.keys(prodErrors).length === 0 &&
            Object.keys(publicErrors).length === 0 &&
            Object.keys(bankErrors).length === 0 &&
            Object.keys(secErrors).length === 0;
    };

    return {
        currentStep,
        taxData,
        companyData,
        representativeData,
        errors,
        updateTaxData,
        updateCompanyData,
        updateRepresentativeData,
        productsData,
        updateProductsData,
        publicData,
        updatePublicData,
        bankData,
        updateBankData,
        securityData,
        updateSecurityData,
        nextStep,
        previousStep,
        goToStep,
        resetVerification,
        submitVerification,
        validateCurrentStep,
        validateAllSteps
    };
};
