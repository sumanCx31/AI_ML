import joblib
from fastapi import FastAPI
from pydantic import BaseModel

# Initialize the FastAPI app
app = FastAPI(
    title="Iris Species Prediction API",
    description="API for classifying Iris flowers using a trained Logistic Regression model",
    version="1.0",
)

# Load the saved model
model = joblib.load("model.pkl")


# Define the input data structure using Pydantic
class IrisFeatures(BaseModel):
  sepal_length: float
  sepal_width: float
  petal_length: float
  petal_width: float


@app.get("/")
def home():
  return {"message": "Welcome to the Iris Species Prediction API! Use the /docs endpoint to test."}


@app.post("/predict")
def predict_species(features: IrisFeatures):
  # Convert incoming data into the 2D array format expected by scikit-learn
  input_data = [[
      features.sepal_length,
      features.sepal_width,
      features.petal_length,
      features.petal_width,
  ]]

  # Make prediction
  prediction = model.predict(input_data)

  # Return the predicted class label
  return {"predicted_species": prediction[0]}