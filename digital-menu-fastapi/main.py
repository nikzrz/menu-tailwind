from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import requests
import os


processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def predict_dish(image_path):
    image = Image.open(image_path).convert("RGB")
    inputs = processor(image, return_tensors="pt")
    out = model.generate(**inputs)
    caption = processor.decode(out[0], skip_special_tokens=True)
    return caption

def translate_text(text, target_lang="ru"):
    endpoint = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1"
    headers = {
        "Authorization": f"Bearer {HF_API_TOKEN}",
        "Content-Type": "application/json"
    }
    prompt = f"Переведи на русский: {text}"
    payload = {"inputs": prompt}
    response = requests.post(endpoint, headers=headers, json=payload)
    if response.status_code == 200:
        res = response.json()
        if isinstance(res, list):
            text = res[0].get("generated_text", "")
        elif isinstance(res, dict) and "generated_text" in res:
            text = res["generated_text"]
        elif isinstance(res, dict) and "error" in res:
            return "Ошибка перевода: " + res["error"]
        else:
            text = str(res)
        return text.strip()
    else:
        return f"Ошибка HF API (перевод): {response.status_code} — {response.text}"

def get_nutrition_from_api(dish_description):
    url = "https://api.calorieninjas.com/v1/nutrition?query=" + dish_description
    headers = {"X-Api-Key": CALORIE_NINJAS_API_KEY}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        if data["items"]:
            item = data["items"][0]
            calories = item.get("calories", "нет данных")
            protein = item.get("protein_g", "нет данных")
            fat = item.get("fat_total_g", "нет данных")
            carbs = item.get("carbohydrates_total_g", "нет данных")
            name = item.get("name", dish_description)
            return {
                "name": name.capitalize(),
                "calories": calories,
                "protein": protein,
                "fat": fat,
                "carbs": carbs
            }
        else:
            return {}
    else:
        return {}

def get_ingredients_hf(dish_caption_ru):
    endpoint = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1"
    headers = {
        "Authorization": f"Bearer {HF_API_TOKEN}",
        "Content-Type": "application/json"
    }
    prompt = f"Напиши на русском список основных ингредиентов для блюда: {dish_caption_ru}. Только список, без лишнего текста."
    payload = {"inputs": prompt}
    response = requests.post(endpoint, headers=headers, json=payload)
    if response.status_code == 200:
        res = response.json()
        if isinstance(res, list):
            text = res[0].get("generated_text", "")
        elif isinstance(res, dict) and "generated_text" in res:
            text = res["generated_text"]
        elif isinstance(res, dict) and "error" in res:
            return "Ошибка HuggingFace API: " + res["error"]
        else:
            text = str(res)
        return text.strip()
    else:
        return f"Ошибка HF API (ингредиенты): {response.status_code} — {response.text}"

@app.post("/generate-dish-info")
async def generate_dish_info(photo: UploadFile = File(...)):
    temp_path = "temp_image.jpg"
    with open(temp_path, "wb") as f:
        f.write(await photo.read())
    caption_en = predict_dish(temp_path)
    caption_ru = translate_text(caption_en)
    nutrition = get_nutrition_from_api(caption_en)
    ingredients = get_ingredients_hf(caption_ru)
    os.remove(temp_path)
    return {
        "caption_en": caption_en,
        "caption_ru": caption_ru,
        "nutrition": nutrition,
        "ingredients": ingredients
    }
