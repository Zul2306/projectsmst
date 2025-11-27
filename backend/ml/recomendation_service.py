import os
import pandas as pd


NUTRITION_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "nutrition.csv")
nutrition_df = pd.read_csv(NUTRITION_PATH)


def generate_food_recommendation(data):
    df = nutrition_df.copy()

    # Filtering rules
    filters = []

    if data.Glucose > 140:
        df = df[df["Carbohydrates (g)"] <= 20]

    if data.BloodPressure > 90:
        df = df[df["Sodium (mg)"] <= 200]

    if data.BMI > 30:
        df = df[df["Fat (g)"] <= 10]

    if data.DiabetesPedigreeFunction > 0.7:
        df = df[df["Cholesterol (mg)"] <= 50]

    # Limit 10 foods
    df = df.head(10)

    # Return list of food names
    return df["Menu"].tolist()