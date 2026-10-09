from ml_model import run_forecast
import sys

with open('Sales Dataset.csv', 'r') as f:
    try:
        run_forecast(f.read())
        print("Sales Dataset OK")
    except Exception as e:
        print(f"Sales Dataset Error: {e}")

with open('train 3.csv', 'r') as f:
    try:
        run_forecast(f.read())
        print("train 3 OK")
    except Exception as e:
        print(f"train 3 Error: {e}")
