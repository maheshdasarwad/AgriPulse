import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCropAdvice } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Loader2, Sprout } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function CropAdvisorTab() {
  const { t, language } = useLanguage();
  const [cropName, setCropName] = useState("");
  const [season, setSeason] = useState<string>("");

  const { mutate: getAdvice, isPending, data, isError, error } = useMutation({
    mutationFn: getCropAdvice,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) return;
    getAdvice({
      crop_name: cropName.trim(),
      language,
      season: season || undefined,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cropName" className="text-base">{t.cropNameInput}</Label>
              <Input
                id="cropName"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder={language === "en" ? "e.g., Wheat, Cotton, Rice" : "उदा. गहू, कापूस, तांदूळ"}
                className="h-12 text-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="season" className="text-base">
                {language === "en" ? "Season (Optional)" : "हंगाम (पर्यायी)"}
              </Label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder={language === "en" ? "Select a season" : "हंगाम निवडा"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={language === "en" ? "Kharif" : "खरीप"}>{t.seasonOptions.kharif}</SelectItem>
                  <SelectItem value={language === "en" ? "Rabi" : "रब्बी"}>{t.seasonOptions.rabi}</SelectItem>
                  <SelectItem value={language === "en" ? "Zaid" : "झैद"}>{t.seasonOptions.zaid}</SelectItem>
                  <SelectItem value={language === "en" ? "All Year" : "संपूर्ण वर्ष"}>{t.seasonOptions.allYear}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg font-semibold shadow-md active:scale-[0.98] transition-transform"
            disabled={isPending || !cropName}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t.loading}
              </>
            ) : (
              <>
                <Sprout className="mr-2 h-5 w-5" />
                {t.getAdviceBtn}
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
            <Sprout className="h-6 w-6" />
            <h3 className="font-semibold text-lg">
              {language === "en" ? "Crop Advice" : "पीक सल्ला"}
            </h3>
          </div>
          <div className="bg-muted/30 p-6 rounded-lg">
            <MarkdownRenderer content={data.advice} />
          </div>
        </div>
      )}
    </div>
  );
}
