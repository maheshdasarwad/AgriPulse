const BASE_URL = "";

export async function getCropAdvice(params: {
  crop_name: string;
  language: string;
  season?: string;
}): Promise<{ advice: string }> {
  const res = await fetch(`${BASE_URL}/api/crop-advice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export async function analyzeImage(params: {
  image: File;
  language: string;
}): Promise<{ analysis: string }> {
  const formData = new FormData();
  formData.append("image", params.image);
  formData.append("language", params.language);
  const res = await fetch(`${BASE_URL}/api/analyze-image`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export async function getFinancialPlan(params: {
  crop: string;
  land: number;
  budget: number;
  language: string;
}): Promise<{ plan: string }> {
  const res = await fetch(`${BASE_URL}/api/financial-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}
