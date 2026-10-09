# Quantiva ML Forecasting Engine: Line-by-Line Explanation

This document provides a detailed breakdown of the machine learning logic used in `ml_model.py`. The engine uses a high-performance **HistGradientBoostingRegressor** (an optimized Gradient Boosting implementation) to predict complex sales patterns.

---

## 1. Environment Setup (Lines 7-18)
*   **Flask & CORS**: Sets up the web server and allows the Node.js backend to communicate with this Python script.
*   **Pandas & NumPy**: The "workhorses" of data science. pandas handles the tables (DataFrames), and NumPy handles the math.
*   **HistGradientBoostingRegressor**: The main AI brain. It builds a series of decision trees that learn from previous errors.
*   **random**: Used to create the "Randomized Future Dates" for a more realistic forecast.

---

## 2. Smart Column Detection (Lines 26-42)
Function: `detect_columns(data)`
*   This function scans your CSV file to find which column contains the **Date** and which contains **Sales**.
*   It looks for keywords like "revenue", "amount", "total", or "date", "month", "year".
*   This makes the system "plug-and-play"—it works even if your CSV headers aren't perfect.

---

## 3. Currency Normalization (Lines 48-70)
Function: `convert_to_inr(value)`
*   This is the "financial brain." It detects symbols like `$`, `€`, or `£`.
*   It applies a real-time-style multiplier (e.g., $1 = 83 INR) to convert any currency into **Indian Rupees (₹)**.
*   It strips away non-numeric characters so the AI only sees pure numbers.

---

## 4. Feature Engineering: The Secret Sauce (Lines 128-145)
This is where raw data turns into "intelligence":
*   **Lags (Lag_1 to Lag_12)**: The AI looks back at the previous 12 months. If sales went up last April, it predicts a similar pattern for this April.
*   **Rolling Windows (7 & 14 days)**: Calculates moving averages. This helps the AI understand if business is currently "speeding up" or "slowing down."
*   **Seasonality (Sin/Cos Encoding)**: Instead of treating "December" as just the number 12, it uses trigonometry (Sines and Cosines) to represent time as a circle. This helps the AI understand that December is actually very close to January in a cyclic sense.

---

## 5. The Training Phase (Lines 177-186)
*   **Log Transformation (`np.log1p`)**: We convert sales numbers into a logarithmic scale. This "flattens" huge spikes (like a sudden $1M sale), preventing them from confusing the AI.
*   **The Engine**: We use 600 iterations (`max_iter=600`) and a learning rate of 0.05. This means the model checks its own work 600 times, getting smarter with every step.

---

## 6. Smart Randomized Forecasting Loop (Lines 211-249)
This is the most advanced part of your specific requirement:
*   **Random Jump**: For each of the 5 future steps, it generates a random number between 7 and 35. This moves the prediction to a "random day" instead of just the next month.
*   **Recursive Prediction**:
    1.  The AI predicts the sales for "Step 1".
    2.  It then **feeds that prediction back into itself** as the "Lag" for the next step.
    3.  It updates the "Date" features (Month, Day, DayOfWeek) for the new random date.
    4.  It repeats this until it has 5 unique dates and 5 unique predictions.

---

## 7. The API Response (Lines 299-316)
*   The script listens on **Port 5001**.
*   When a CSV is uploaded, it runs the entire pipeline above and returns a JSON object.
*   **`historical`**: Last 12 months of real data for the graph.
*   **`forecast`**: The 5 new randomized predictions for the table.
*   **`metrics`**: Accuracy score, growth percentage, and more.

---

## Why HistGradientBoosting?
We use this over basic algorithms because it handles "Missing Data" (NaNs) and "Categorical Data" (like Region names) automatically and much more efficiently on modern computers, especially Macs.
