import Layout from "./Layout.jsx";

import Home from "./Home";

import Products from "./Products";
import ProductCreate from "./ProductCreate";

import Pricing from "./Pricing";

import Developers from "./Developers";
import DevelopersApiKeys from "./developers/DevelopersApiKeys";
import Authentication from "./developers/docs/Authentication";

import Solutions from "./Solutions";

import Company from "./Company";

import Resources from "./Resources";

import Contact from "./Contact";

import Terminal from "./Terminal";

import PaymentLinks from "./PaymentLinks";

import Checkout from "./Checkout";

import Elements from "./Elements";

import Connect from "./Connect";
import Companies from "./Companies";


import GlobalPayouts from "./GlobalPayouts";

import FinancialAccounts from "./FinancialAccounts";

import Capital from "./Capital";

import Issuing from "./Issuing";

import Billing from "./Billing";

import RevenueRecognition from "./RevenueRecognition";

import Tax from "./Tax";

import Sigma from "./Sigma";

import DataPipeline from "./DataPipeline";

import UsageBased from "./UsageBased";

import Invoicing from "./Invoicing";


import PaymentMethods from "./PaymentMethods";

import Link from "./Link";

import FinancialConnections from "./FinancialConnections";

import Identity from "./Identity";

import Atlas from "./Atlas";

import Climate from "./Climate";

import Payments from "./Payments";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import PaymentLinksCreate from "./PaymentLinksCreate";
import BusinessVerification from "./BusinessVerification";

import Settings from "./Settings";
import PersonalData from "./settings/PersonalData";
import Communication from "./settings/Communication";
import Business from "./settings/Business";
import TeamSecurity from "./settings/TeamSecurity";
import Compliance from "./settings/Compliance";
import BillingSettings from "./settings/BillingSettings";
import PaymentsSettings from "./settings/PaymentsSettings";
import FinancialConnectionsSettings from "./settings/FinancialConnectionsSettings";
import RadarSettings from "./settings/RadarSettings";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { LanguageProvider } from '../components/i18n/LanguageContext';

const PAGES = {

    Home: Home,

    Products: Products,

    Pricing: Pricing,

    Developers: Developers,

    Solutions: Solutions,

    Company: Company,

    Resources: Resources,

    Contact: Contact,

    Terminal: Terminal,

    PaymentLinks: PaymentLinks,

    Checkout: Checkout,

    Elements: Elements,

    Connect: Connect,
    Companies: Companies,


    GlobalPayouts: GlobalPayouts,

    FinancialAccounts: FinancialAccounts,

    Capital: Capital,

    Issuing: Issuing,

    Billing: Billing,

    RevenueRecognition: RevenueRecognition,

    Tax: Tax,

    Sigma: Sigma,

    DataPipeline: DataPipeline,

    UsageBased: UsageBased,

    Invoicing: Invoicing,


    PaymentMethods: PaymentMethods,

    Link: Link,

    FinancialConnections: FinancialConnections,

    Identity: Identity,

    Atlas: Atlas,

    Climate: Climate,

    Payments: Payments,

}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/activate-account" element={<BusinessVerification />} />
            <Route path="/dashboard/payment-links/create" element={<PaymentLinksCreate />} />
            <Route path="/dashboard/products/create" element={<ProductCreate />} />
            <Route path="/developers/docs/authentication" element={<Authentication />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/customers" element={<Dashboard />} />
            <Route path="/*" element={
                <Layout currentPageName={currentPage}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/Home" element={<Home />} />
                        <Route path="/Products" element={<Products />} />
                        <Route path="/Pricing" element={<Pricing />} />
                        <Route path="/Developers" element={<Developers />} />
                        <Route path="/Solutions" element={<Solutions />} />
                        <Route path="/Company" element={<Company />} />
                        <Route path="/Resources" element={<Resources />} />
                        <Route path="/Contact" element={<Contact />} />
                        <Route path="/Terminal" element={<Terminal />} />
                        <Route path="/PaymentLinks" element={<PaymentLinks />} />
                        <Route path="/Checkout" element={<Checkout />} />
                        <Route path="/Elements" element={<Elements />} />
                        <Route path="/Connect" element={<Connect />} />
                        <Route path="/Companies" element={<Companies />} />
                        <Route path="/GlobalPayouts" element={<GlobalPayouts />} />
                        <Route path="/FinancialAccounts" element={<FinancialAccounts />} />
                        <Route path="/Capital" element={<Capital />} />
                        <Route path="/Issuing" element={<Issuing />} />
                        <Route path="/Billing" element={<Billing />} />
                        <Route path="/RevenueRecognition" element={<RevenueRecognition />} />
                        <Route path="/Tax" element={<Tax />} />
                        <Route path="/Sigma" element={<Sigma />} />
                        <Route path="/DataPipeline" element={<DataPipeline />} />
                        <Route path="/UsageBased" element={<UsageBased />} />
                        <Route path="/Invoicing" element={<Invoicing />} />
                        <Route path="/PaymentMethods" element={<PaymentMethods />} />
                        <Route path="/Link" element={<Link />} />
                        <Route path="/FinancialConnections" element={<FinancialConnections />} />
                        <Route path="/Identity" element={<Identity />} />
                        <Route path="/Atlas" element={<Atlas />} />
                        <Route path="/Climate" element={<Climate />} />
                        <Route path="/Payments" element={<Payments />} />
                    </Routes>
                </Layout>
            } />
        </Routes>
    );
}

export default function Pages() {
    return (
        <Router>
            <LanguageProvider>
                <PagesContent />
            </LanguageProvider>
        </Router>
    );
}
