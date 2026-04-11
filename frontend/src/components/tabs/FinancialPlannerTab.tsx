import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { getFinancialPlan } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Loader2, Calculator } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function FinancialPlannerTab() {
  const { t, language } = useLanguage();
  const [crop, setCrop] = useState("");
  const [land, setLand] = useState("");
  const [budget, setBudget] = useState("");

  const { mutate: getPlan, isPending, data, isError, error } = useMutation({
    mutationFn: getFinancialPlan,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop.trim() || !land || !budget) return;
    getPlan({
      crop: crop.trim(),
      land: parseFloat(land),
      budget: parseFloat(budget),
      language,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="crop" className="text-base">{t.cropType}</Label>
              <Input
                id="crop"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder={language === "en" ? "e.g., Wheat, Cotton, Rice" : "उदा. गहू, कापूस, तांदूळ"}
                className="h-12 text-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="land" className="text-base">{t.landArea}</Label>
              <Input
                id="land"
                type="number"
                min="0.1"
                step="0.1"
                value={land}
                onChange={(e) => setLand(e.target.value)}
                placeholder="2.5"
                className="h-12 text-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget" className="text-base">{t.budget}</Label>
              <Input
                id="budget"
                type="number"
                min="1"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="50000"
                className="h-12 text-lg"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg font-semibold shadow-md active:scale-[0.98] transition-transform"
            disabled={isPending || !crop || !land || !budget}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t.loading}
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-5 w-5" />
                {t.getPlanBtn}
              </>
            )}
          </Button>
        </form>
      </div>

      {isError && (
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
          <AlertDescription className="text-base font-medium">
            {(error as Error)?.message || t.errorGeneric}
          </AlertDescription>
        </Alert>
      )}

      {data && (
        <div className="bg-card rounded-xl p-6 shadow-sm border border-primary/20 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 mb-4 text-primary">
            <Calculator className="h-6 w-6" />
            <h3 className="font-semibold text-lg">
              {language === "en" ? "Financial Plan" : "आर्थिक योजना"}
            </h3>
          </div>
          <div className="bg-muted/30 p-6 rounded-lg">
            <MarkdownRenderer content={data.plan} />
          </div>
        </div>
      )}
    </div>
  );
}
