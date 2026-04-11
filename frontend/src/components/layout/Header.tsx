import { Leaf } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-4xl">
        <div className="flex items-center gap-2 text-primary">
          <Leaf className="h-6 w-6" />
          <span className="font-bold text-lg tracking-tight">{t.appName}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
            {t.languageToggle}
          </span>
          <ToggleGroup
            type="single"
            value={language}
            onValueChange={(val) => val && setLanguage(val as "en" | "mr")}
            className="bg-muted p-1 rounded-lg"
          >
            <ToggleGroupItem
              value="en"
              className="px-3 py-1 h-8 text-xs font-semibold data-[state=on]:bg-white data-[state=on]:text-primary data-[state=on]:shadow-sm rounded-md transition-all"
            >
              EN
            </ToggleGroupItem>
            <ToggleGroupItem
              value="mr"
              className="px-3 py-1 h-8 text-xs font-semibold data-[state=on]:bg-white data-[state=on]:text-primary data-[state=on]:shadow-sm rounded-md transition-all"
            >
              मराठी
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </header>
  );
}
