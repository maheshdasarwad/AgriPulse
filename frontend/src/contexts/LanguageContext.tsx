import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "mr";

interface Translations {
  appName: string;
  cropAdvisorTab: string;
  imageScannerTab: string;
  financialPlannerTab: string;
  languageToggle: string;
  cropNameInput: string;
  seasonOptions: {
    kharif: string;
    rabi: string;
    zaid: string;
    allYear: string;
  };
  getAdviceBtn: string;
  uploadImage: string;
  analyzeBtn: string;
  cropType: string;
  landArea: string;
  budget: string;
  getPlanBtn: string;
  errorGeneric: string;
  loading: string;
}

const translations: Record<Language, Translations> = {
  en: {
    appName: "AgriSmart Assistant",
    cropAdvisorTab: "Crop Advisor",
    imageScannerTab: "Crop Health Scanner",
    financialPlannerTab: "Financial Planner",
    languageToggle: "Language",
    cropNameInput: "What crop are you growing?",
    seasonOptions: {
      kharif: "Kharif",
      rabi: "Rabi",
      zaid: "Zaid",
      allYear: "All Year",
    },
    getAdviceBtn: "Get Crop Advice",
    uploadImage: "Upload Crop Image",
    analyzeBtn: "Analyze Image",
    cropType: "Crop Type",
    landArea: "Land Area (acres)",
    budget: "Budget (₹)",
    getPlanBtn: "Get Financial Plan",
    errorGeneric: "An error occurred. Please try again.",
    loading: "Generating...",
  },
  mr: {
    appName: "एग्रीस्मार्ट सहाय्यक",
    cropAdvisorTab: "पीक सल्लागार",
    imageScannerTab: "पीक आरोग्य स्कॅनर",
    financialPlannerTab: "आर्थिक नियोजक",
    languageToggle: "भाषा",
    cropNameInput: "तुम्ही कोणते पीक घेत आहात?",
    seasonOptions: {
      kharif: "खरीप",
      rabi: "रब्बी",
      zaid: "झैद",
      allYear: "संपूर्ण वर्ष",
    },
    getAdviceBtn: "पीक सल्ला मिळवा",
    uploadImage: "पीक प्रतिमा अपलोड करा",
    analyzeBtn: "प्रतिमा तपासा",
    cropType: "पिकाचा प्रकार",
    landArea: "जमीन क्षेत्रफळ (एकर)",
    budget: "बजेट (₹)",
    getPlanBtn: "आर्थिक योजना मिळवा",
    errorGeneric: "एक त्रुटी आली. कृपया पुन्हा प्रयत्न करा.",
    loading: "तयार करत आहे...",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("agrismart-lang") as Language;
    if (savedLang === "en" || savedLang === "mr") {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("agrismart-lang", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
