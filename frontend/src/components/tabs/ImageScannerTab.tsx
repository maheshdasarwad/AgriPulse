import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { analyzeImage } from "@/api/client";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Loader2, ImageIcon, Upload, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ImageScannerTab() {
  const { t, language } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: analyze, isPending, data, isError, error } = useMutation({
    mutationFn: analyzeImage,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!selectedFile) return;
    analyze({ image: selectedFile, language });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
        {!selectedFile ? (
          <div
            className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground mb-1">{t.uploadImage}</p>
            <p className="text-sm text-muted-foreground">
              {language === "en" ? "Click to upload or drag & drop" : "अपलोड करण्यासाठी क्लिक करा"}
            </p>
            <p className="text-xs text-muted-foreground mt-2">JPG, PNG, WEBP</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={previewUrl!}
                alt="Crop preview"
                className="w-full max-h-80 object-contain bg-muted/30 rounded-xl"
              />
              <button
                onClick={handleRemove}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-sm transition-colors"
                aria-label="Remove image"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full h-14 text-lg font-semibold shadow-md active:scale-[0.98] transition-transform"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t.loading}
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-5 w-5" />
                  {t.analyzeBtn}
                </>
              )}
            </Button>
          </div>
        )}
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
            <ImageIcon className="h-6 w-6" />
            <h3 className="font-semibold text-lg">
              {language === "en" ? "Health Analysis" : "आरोग्य विश्लेषण"}
            </h3>
          </div>
          <div className="bg-muted/30 p-6 rounded-lg">
            <MarkdownRenderer content={data.analysis} />
          </div>
        </div>
      )}
    </div>
  );
}
