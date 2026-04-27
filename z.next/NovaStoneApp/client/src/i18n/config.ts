import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          dashboard: "Dashboard",
          sales: "Sales & Payments",
          purchases: "Purchases",
          receipts: "Receipts",
          accounting: "Accounting",
          banking: "Banking",
          payroll: "Payroll",
          reports: "Reports",
          advisors: "Advisors",
          welcome: "Welcome back",
          netProfit: "Net Profit",
          invoicesDue: "Invoices due to you",
          shortcuts: "Shortcuts",
          cashFlow: "Cash Flow",
          expenses: "Expenses",
        },
      },
      es: {
        translation: {
          dashboard: "Tablero",
          sales: "Ventas y Pagos",
          purchases: "Compras",
          receipts: "Recibos",
          accounting: "Contabilidad",
          banking: "Banca",
          payroll: "Nómina",
          reports: "Informes",
          advisors: "Asesores",
          welcome: "Bienvenido de nuevo",
          netProfit: "Beneficio Neto",
          invoicesDue: "Facturas pendientes",
          shortcuts: "Atajos",
          cashFlow: "Flujo de Caja",
          expenses: "Gastos",
        },
      },
    },
  });

export default i18n;
