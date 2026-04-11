import os
from typing import Optional, Tuple
import google.generativeai as genai

class FinancialPlannerService:
    def __init__(self, language: str = "en"):
        self.language = language
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY is not set.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("models/gemini-flash-latest")

        if self.language == "mr":
            self.financial_prompt = (
                "तुम्ही शेतकऱ्यांसाठी आर्थिक नियोजन आणि बजेटिंगमध्ये तज्ञ आहात. खालील इनपुट्सच्या आधारे: पिकाचे नाव, जमीन क्षेत्रफळ (एकर मध्ये), आणि बजेट (INR मध्ये), "
                "एक विस्तृत आर्थिक नियोजन रणनीती द्या. तुमच्या सल्ल्यात खालील बाबींचा समावेश असावा:\n"
                "1. जमीन तयार करणे, बियाणे, खत, सिंचन, मजुरी आणि कापणी नंतरच्या प्रक्रियेचा अंदाजे खर्च.\n"
                "2. संबंधित पिकासाठी आणि जमीन क्षेत्रफळासाठी उपलब्ध शासकीय योजना, सबसिडी किंवा कर्जाबद्दल शिफारस.\n"
                "3. खर्च वाचवण्याच्या आणि नफा वाढवण्याच्या रणनीती, बाजार विश्लेषण आणि जोखमीचे व्यवस्थापन.\n"
                "4. बजेटच्या मर्यादेनुसार व्यवसाय वाढवण्याचे उपाय.\n"
                "पिकाचे नाव: {crop}\nजमीन क्षेत्रफळ (एकर): {land}\nबजेट (INR): {budget}\n"
            )
        else:
            self.financial_prompt = (
                "You are an expert agricultural financial advisor specialized in planning and budgeting for farmers. "
                "Based on the following inputs: Crop type, Land area (in acres), and Budget (in INR), provide a detailed financial planning strategy. "
                "Your advice should include:\n"
                "1. An estimated cost breakdown for land preparation, seeds, fertilizers, irrigation, labor, and post-harvest processing.\n"
                "2. Recommendations on government schemes, subsidies, or loans available for the specified crop and land size.\n"
                "3. Strategies for cost-saving and maximizing profit, including market analysis and risk mitigation.\n"
                "4. Suggestions for scaling up operations if the budget allows.\n"
                "Crop Type: {crop}\nLand Area (acres): {land}\nBudget (INR): {budget}\n"
            )

    def get_financial_plan(self, crop: str, land: float, budget: float) -> Tuple[Optional[str], Optional[str]]:
        prompt = self.financial_prompt.format(crop=crop, land=land, budget=budget)
        try:
            response = self.model.generate_content(prompt)
            if response.text:
                return response.text, None
            return None, "No financial plan generated."
        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg or "quota" in error_msg.lower():
                try:
                    fallback = genai.GenerativeModel("models/gemini-1.5-flash-8b")
                    response = fallback.generate_content(prompt)
                    if response.text:
                        return response.text, None
                except Exception:
                    return None, "AI quota exceeded. Please try again later."
            return None, f"AI Error: {error_msg}"
