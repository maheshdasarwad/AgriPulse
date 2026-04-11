import os
from typing import Optional, Tuple
import google.generativeai as genai

class ImageAnalyzerService:
    def __init__(self, language: str = "en"):
        self.language = language
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY is not set")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("models/gemini-flash-latest")

        if self.language == "mr":
            self.analysis_prompt = (
                "तुम्ही भारतीय शेती आणि पिकांच्या आरोग्यतज्ञ आहात. दिलेल्या पिकाच्या प्रतिमेचे सखोल विश्लेषण करा. "
                "कृपया खालील बाबींचे पालन करा:\n"
                "1. प्रतिमेतून पिकाचे नाव आणि वाढीचा टप्पा ओळखा व नमूद करा.\n"
                "2. पानांवरील रंग बदल, डाग, मुरझाणे किंवा इतर लक्षणे तपासा.\n"
                "3. संभाव्य रोग किंवा पोषक तत्त्वांच्या कमतरतेची शक्यता आणि त्यावर विश्वासाची पातळी नमूद करा.\n"
                "4. अतिरिक्त पाणी देणे, खत देणे किंवा कीटक नियंत्रणासाठी तात्काळ उपाय सुचवा.\n"
                "5. आवश्यक असल्यास अधिक तपासणी किंवा प्रयोगशाळेची शिफारस करा.\n"
                "6. विश्लेषण करताना स्थानिक आणि हंगामानुसार परिस्थिती विचारात घ्या.\n"
                "जर प्रतिमा शेतीशी संबंधित नसेल, तर उत्तर द्या: 'दिलेली प्रतिमा शेतीशी संबंधित दिसत नाही. कृपया वैध पिकाची प्रतिमा अपलोड करा.'"
            )
        else:
            self.analysis_prompt = (
                "You are an expert agricultural assistant specialized in crop health analysis. Analyze the provided crop image thoroughly. "
                "Please perform the following steps in your analysis:\n"
                "1. Identify and state the crop type and its growth stage.\n"
                "2. Describe any visible symptoms such as discoloration, spots, wilting, or lesions.\n"
                "3. List possible diagnoses with associated confidence levels for each potential disease or nutrient deficiency.\n"
                "4. Provide recommendations for immediate actions such as additional watering, fertilization, or pest treatment if needed.\n"
                "5. Advise if further information or lab testing is recommended for confirmation.\n"
                "6. Consider the regional and seasonal context while formulating your analysis.\n"
                "If the image does not appear to be related to a crop, respond with: 'The image provided does not seem to be related to an agricultural crop. Please upload a valid crop image.'"
            )

    def analyze_crop_image(self, image_data: bytes, mime_type: str = "image/jpeg") -> Tuple[Optional[str], Optional[str]]:
        try:
            response = self.model.generate_content([
                self.analysis_prompt,
                {"mime_type": mime_type, "data": image_data}
            ])
            if response.text:
                return response.text, None
            return None, "No analysis generated."
        except Exception as e:
            error_msg = str(e)
            if "API key" in error_msg:
                return None, "Invalid API key configuration."
            return None, f"Error: {error_msg}"
