\import os
import json
from dataclasses import dataclass
from typing import Optional
import google.generativeai as genai

# Schema
ANALYSIS_SCHEMA = genai.protos.Schema(
    type=genai.protos.Type.OBJECT,
    required=["crop_name", "growth_stage", "observed_symptoms",
              "diagnoses", "immediate_actions", "further_testing_needed", "is_crop"],
    properties={
        "is_crop": genai.protos.Schema(
            type=genai.protos.Type.BOOLEAN,
            description="Whether the image contains an agricultural crop"
        ),
        "crop_name": genai.protos.Schema(
            type=genai.protos.Type.STRING,
            description="Identified crop name, or 'unknown' if not a crop image"
        ),
        "growth_stage": genai.protos.Schema(
            type=genai.protos.Type.STRING,
            enum=["seedling", "vegetative", "flowering", "fruiting", "mature", "unknown"]
        ),
        "observed_symptoms": genai.protos.Schema(
            type=genai.protos.Type.ARRAY,
            items=genai.protos.Schema(
                type=genai.protos.Type.STRING,
                description="A visible symptom such as discoloration, spots, wilting"
            )
        ),
        "diagnoses": genai.protos.Schema(
            type=genai.protos.Type.ARRAY,
            items=genai.protos.Schema(
                type=genai.protos.Type.OBJECT,
                required=["condition", "confidence", "reasoning"],
                properties={
                    "condition": genai.protos.Schema(type=genai.protos.Type.STRING),
                    "confidence": genai.protos.Schema(
                        type=genai.protos.Type.NUMBER,
                        description="Confidence score between 0.0 and 0.85"
                    ),
                    "reasoning": genai.protos.Schema(
                        type=genai.protos.Type.STRING,
                        description="One sentence grounded only in observed symptoms"
                    ),
                }
            )
        ),
        "immediate_actions": genai.protos.Schema(
            type=genai.protos.Type.ARRAY,
            items=genai.protos.Schema(type=genai.protos.Type.STRING)
        ),
        "further_testing_needed": genai.protos.Schema(
            type=genai.protos.Type.BOOLEAN,
            description="True if lab testing or expert consultation is recommended"
        ),
    }
)

# Dataclasses 

@dataclass
class Diagnosis:
    condition: str
    confidence: float
    reasoning: str


@dataclass
class AnalysisResult:
    is_crop: bool
    crop_name: str
    growth_stage: str
    observed_symptoms: list[str]
    diagnoses: list[Diagnosis]
    immediate_actions: list[str]
    further_testing_needed: bool
    disclaimer: str

# Markdown serializer 

def result_to_markdown(result: AnalysisResult, language: str = "en") -> str:
    if not result.is_crop:
        return (
            "दिलेली प्रतिमा शेतीशी संबंधित दिसत नाही. कृपया वैध पिकाची प्रतिमा अपलोड करा."
            if language == "mr" else
            "The image does not appear to be an agricultural crop. Please upload a valid crop image."
        )

    is_mr = language == "mr"
    lines: list[str] = []

    # Header
    if is_mr:
        lines.append(f"## 🌱 पीक: {result.crop_name}  |  अवस्था: {result.growth_stage}\n")
    else:
        lines.append(f"## 🌱 Crop: {result.crop_name}  |  Stage: {result.growth_stage}\n")

    # Symptoms
    if result.observed_symptoms:
        lines.append("### 🔍 " + ("दिसणारी लक्षणे" if is_mr else "Observed Symptoms"))
        for s in result.observed_symptoms:
            lines.append(f"- {s}")
        lines.append("")

    # Diagnoses
    if result.diagnoses:
        lines.append("### 🩺 " + ("निदान" if is_mr else "Diagnoses"))
        for d in result.diagnoses:
            pct = int(d.confidence * 100)
            lines.append(f"**{d.condition}** — {pct}% {'शक्यता' if is_mr else 'confidence'}")
            lines.append(f"> {d.reasoning}\n")

    # Immediate actions
    if result.immediate_actions:
        lines.append("### ✅ " + ("तात्काळ उपाय" if is_mr else "Immediate Actions"))
        for a in result.immediate_actions:
            lines.append(f"- {a}")
        lines.append("")

    # Further testing
    if result.further_testing_needed:
        lines.append("### 🔬 " + ("पुढील तपासणी" if is_mr else "Further Testing"))
        lines.append(
            "तज्ञ कृषी सल्लागाराशी संपर्क साधण्याची शिफारस केली जाते."
            if is_mr else
            "Lab testing or consultation with a certified agronomist is recommended."
        )
        lines.append("")

    # Disclaimer
    lines.append(f"---\n*{result.disclaimer}*")

    return "\n".join(lines)

# Service 

class ImageAnalyzerService:

    _PROMPT_EN = (
        "You are an expert agricultural plant pathologist specializing in Indian farming conditions.\n\n"
        "Analyze the provided image carefully using this reasoning chain:\n"
        "1. OBSERVE — List every visible symptom: color changes, lesion shape/size, wilting pattern, pest evidence.\n"
        "2. HYPOTHESISE — For each symptom, list possible causes (disease, deficiency, pest, abiotic stress).\n"
        "3. DIAGNOSE — Rank hypotheses by likelihood. Assign confidence (0.0–0.85 max from a single image).\n"
        "   Cap confidence at 0.55 if fewer than 2 symptoms match. Cap at 0.60 if image quality is poor.\n"
        "4. RECOMMEND — Give specific, actionable immediate steps.\n\n"
        "If the image is not a crop, set is_crop=false and leave other fields as empty defaults."
    )

    _PROMPT_MR = (
        "तुम्ही भारतीय शेतीतील पिकांचे तज्ञ रोगशास्त्रज्ञ आहात.\n\n"
        "खालील टप्प्यांनुसार विश्लेषण करा:\n"
        "१. निरीक्षण — सर्व दृश्यमान लक्षणे नोंदवा: रंग बदल, डाग, मुरझाणे, कीड.\n"
        "२. गृहितके — प्रत्येक लक्षणासाठी संभाव्य कारणे द्या.\n"
        "३. निदान — संभाव्यतेनुसार क्रमवारी लावा. एकट्या प्रतिमेवर 0.85 पेक्षा जास्त विश्वास देऊ नका.\n"
        "४. शिफारस — तात्काळ उपाय सांगा.\n\n"
        "जर प्रतिमा पिकाची नसेल, तर is_crop=false ठेवा."
    )

    _DISCLAIMER = (
        "This analysis is AI-generated from a single image. "
        "For a definitive diagnosis, consult a certified agronomist or plant pathologist "
        "before applying any treatment."
    )

    def __init__(self, language: str = "en"):
        self.language = language
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY is not set")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("models/gemini-flash-latest")
        self._prompt = self._PROMPT_MR if language == "mr" else self._PROMPT_EN

    def analyze_crop_image(
        self,
        image_data: bytes,
        mime_type: str = "image/jpeg",
    ) -> tuple[Optional[str], Optional[str]]:
        """
        Returns (markdown_string, None) on success, or (None, error_message) on failure.
        The markdown string is ready to pass directly to <MarkdownRenderer content={data.analysis} />.
        """
        try:
            response = self.model.generate_content(
                contents=[
                    self._prompt,
                    {"mime_type": mime_type, "data": image_data},
                ],
                generation_config=genai.GenerationConfig(
                    temperature=0.1,
                    response_mime_type="application/json",
                    response_schema=ANALYSIS_SCHEMA,
                ),
            )
        except Exception as e:
            msg = str(e)
            if "API key" in msg:
                return None, "Invalid API key configuration."
            return None, f"Model call failed: {msg}"

        try:
            data: dict = json.loads(response.text)
        except Exception:
            return None, "Model returned malformed JSON."

        diagnoses = [
            Diagnosis(
                condition=d.get("condition", "Unknown"),
                confidence=min(float(d.get("confidence", 0.0)), 0.85),
                reasoning=d.get("reasoning", ""),
            )
            for d in data.get("diagnoses", [])
        ]

        result = AnalysisResult(
            is_crop=data.get("is_crop", False),
            crop_name=data.get("crop_name", "unknown"),
            growth_stage=data.get("growth_stage", "unknown"),
            observed_symptoms=data.get("observed_symptoms", []),
            diagnoses=diagnoses,
            immediate_actions=data.get("immediate_actions", []),
            further_testing_needed=data.get("further_testing_needed", True),
            disclaimer=self._DISCLAIMER,
        )

        return result_to_markdown(result, self.language), None
