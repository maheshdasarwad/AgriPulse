import os
from typing import Optional, Tuple
import google.generativeai as genai

class CropAdvisorService:
    def __init__(self, language: str = "en"):
        self.language = language
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("models/gemini-flash-latest")

        if self.language == "mr":
            self.base_prompt = (
                "तुम्ही भारतीय शेतीत तज्ञ आहात आणि शेतकऱ्यांना पिकांच्या आरोग्य, रोग ओळख आणि सर्वोत्तम शेतीच्या पद्धतींबाबत सल्ला देण्यात माहिर आहात. "
                "खालील पिकासाठी विस्तृत, सखोल आणि पुराव्यानुसार आधारभूत योजना द्या. "
                "तुमच्या विश्लेषणात खालील बाबींचा समावेश असावा:\n"
                "1. पिकाची निवड आणि बियांची गुणवत्ता तपासणी.\n"
                "2. जमीन तयार करणे, मातीची तपासणी आणि सुधारणा यासाठी शिफारसी.\n"
                "3. स्थानिक हवामानानुसार पेरणी व लागवडीच्या पद्धती.\n"
                "4. पाण्याच्या उपलब्धतेनुसार सिंचनाची गरज.\n"
                "5. खत आणि पोषक तत्व व्यवस्थापन, सेंद्रिय आणि रासायनिक दोन्ही पर्याय.\n"
                "6. कीटक व रोग नियंत्रणासाठी एकात्मिक पद्धती आणि शिफारसी.\n"
                "7. वाढीची निगराणी आणि कापणीची योग्य वेळ.\n"
                "8. कापणी नंतरची प्रक्रिया, साठवण आणि विक्रीसंबंधी योजना.\n"
                "9. पिक, जमीन आणि बजेटच्या आधारे आर्थिक नियोजन टिप्स.\n"
                "जर इनपुट वैध नसेल किंवा शेतीशी संबंधित नसेल, तर उत्तर द्या: 'दिलेला इनपुट शेतीशी संबंधित दिसत नाही. कृपया वैध पिकाचे नाव भरा.'\n\n"
                "पिकाचे नाव: "
            )
        else:
            self.base_prompt = (
                "You are an expert agricultural assistant specialized in providing advice to farmers about crop health, disease identification, and best farming practices. "
                "Provide a comprehensive, detailed, and evidence-based plan for cultivating the specified crop. "
                "Your analysis should include the following aspects:\n"
                "1. Crop selection and seed quality considerations.\n"
                "2. Land preparation including soil testing and amendment recommendations.\n"
                "3. Sowing and planting methods suitable for the region's climate.\n"
                "4. Irrigation requirements based on local water availability.\n"
                "5. Fertilization and nutrient management, including organic and inorganic options.\n"
                "6. Pest and disease management strategies, including integrated pest management practices.\n"
                "7. Growth monitoring and timing for harvest.\n"
                "8. Post-harvest processing, storage, and market strategies.\n"
                "9. Financial planning tips tailored to the crop, land, and budget considerations.\n"
                "If the input is invalid or not related to agriculture, reply: 'The input provided does not seem to relate to agricultural practices. Please provide a valid crop name.'\n\n"
                "Crop Name: "
            )

    def get_crop_advice(self, crop_name: str) -> Tuple[Optional[str], Optional[str]]:
        try:
            if not crop_name.strip():
                return None, ("Please enter a valid crop name." if self.language == "en" else "कृपया वैध पिकाचे नाव भरा.")
            prompt = f"{self.base_prompt}{crop_name}"
            response = self.model.generate_content(prompt)
            return response.text, None
        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg or "quota" in error_msg.lower():
                try:
                    fallback = genai.GenerativeModel("models/gemini-1.5-flash-8b")
                    response = fallback.generate_content(prompt)
                    return response.text, None
                except Exception:
                    return None, "AI quota exceeded. Please try again later."
            return None, f"AI Error: {error_msg}"
