import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CropAdvisorTab } from "@/components/tabs/CropAdvisorTab";
import { ImageScannerTab } from "@/components/tabs/ImageScannerTab";
import { FinancialPlannerTab } from "@/components/tabs/FinancialPlannerTab";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sprout, ImageIcon, Calculator } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t.appName}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t.appName === "AgriSmart Assistant"
              ? "Your smart companion for better farming decisions."
              : "उत्तम शेती निर्णयांसाठी तुमचा स्मार्ट साथीदार."}
          </p>
        </div>

        <Tabs defaultValue="advisor" className="w-full">
          <TabsList className="w-full h-auto p-1 bg-muted grid grid-cols-3 rounded-xl mb-8">
            <TabsTrigger
              value="advisor"
              className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
            >
              <div className="flex flex-col items-center gap-1.5 md:flex-row md:gap-2">
                <Sprout className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-xs md:text-sm font-semibold">{t.cropAdvisorTab}</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="scanner"
              className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
            >
              <div className="flex flex-col items-center gap-1.5 md:flex-row md:gap-2">
                <ImageIcon className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-xs md:text-sm font-semibold">{t.imageScannerTab}</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="planner"
              className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
            >
              <div className="flex flex-col items-center gap-1.5 md:flex-row md:gap-2">
                <Calculator className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-xs md:text-sm font-semibold">{t.financialPlannerTab}</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="advisor" className="mt-0 focus-visible:outline-none">
            <CropAdvisorTab />
          </TabsContent>

          <TabsContent value="scanner" className="mt-0 focus-visible:outline-none">
            <ImageScannerTab />
          </TabsContent>

          <TabsContent value="planner" className="mt-0 focus-visible:outline-none">
            <FinancialPlannerTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
