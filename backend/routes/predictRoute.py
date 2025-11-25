from fastapi import APIRouter
from schemas.predictSchema import PredictInput
from ml.predict_service import predict_diabetes

router = APIRouter()

@router.post("/predict")
def predict(input_data: PredictInput):
    result = predict_diabetes(input_data)
    return {
        "hasil_prediksi": "Diabetes" if result["prediction"] == 1 else "Tidak Diabetes",
        "probabilitas (%)": result["probability"]
    }
