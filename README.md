# Airbnb Pricing Analysis — NYC Market Insights

![Python](https://img.shields.io/badge/Python-3.11%2B-blue?logo=python)
![Pandas](https://img.shields.io/badge/Pandas-Data%20Analysis-yellow?logo=pandas)
![Seaborn](https://img.shields.io/badge/Seaborn-Visualizations-blueviolet?logo=seaborn)
![SciPy](https://img.shields.io/badge/SciPy-Statistical%20Tests-lightgrey?logo=scipy)
![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-orange?logo=jupyter)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Completed-success)

---

## Project Overview

This project explores **factors influencing Airbnb listing prices across New York City** using open Airbnb 2019 data.  
The analysis combines **predictive modeling** and **statistical hypothesis testing** to uncover drivers of price variation — ultimately producing **actionable business insights** for both hosts and the platform.

Key focus areas:
- Host pricing strategy  
- Market and neighborhood behavior  
- The role of trust signals (e.g., Superhost status)

---

## Project Pipeline

### **1. Data Cleaning**
- Removed duplicates, missing prices, and invalid entries  
- Handled outliers using log-transformation and IQR filtering  
- Standardized column formats and categorical labels  

### **2️. Exploratory Data Analysis (EDA)**
- Examined price distribution and skew  
- Visualized price differences by borough and room type  
- Analyzed correlations and feature importance candidates  

### **3️. Feature Engineering**
- Created dummy variables for neighborhood groups and room types  
- Log-transformed prices to stabilize variance  
- Consolidated engineered features into `lean_features` for modeling  

### **4️. Predictive Modeling**
- Built a **Robust OLS regression model** to explain log(price)  
- Identified key price drivers: location, room type, and host attributes  
- Saved model artifacts, evaluation metrics, and diagnostics for reproducibility  

### **5️. Statistical Deep Dives**
Applied rigorous hypothesis testing to validate the model’s findings:

| Test | Question | Method | Key Finding |
|------|-----------|--------|--------------|
| **Test 1** | Do entire homes in Manhattan have higher prices than Brooklyn? | Welch’s t-test | Yes, ~45% higher (p < 0.001) |
| **Test 2** | Does room type drive price differences? | Welch’s ANOVA + Games–Howell | Yes, large effect (η² ≈ 0.40) |
| **Test 3** | Do Superhosts charge more? | Welch’s t-test | Slightly lower prices (~11%) |

### **6️. Business Insights**
- **Room type** explains nearly 40% of price variance — the dominant pricing driver  
- **Manhattan listings** command a clear premium due to location demand  
- **Superhost status** improves trust and occupancy, but not necessarily price  
- Data-driven recommendation: optimize pricing by room type and area competitiveness rather than host badges alone
- 
---

## Tech Stack

- **Languages:** Python 3.11+  
- **Libraries:** Pandas, NumPy, SciPy, Statsmodels, Seaborn, Matplotlib, Pingouin  
- **Tools:** Jupyter Notebook  
- **Dataset:** [Inside Airbnb Open Data (NYC 2019)](https://www.kaggle.com/datasets/dgomonov/new-york-city-airbnb-open-data?)

---

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/<yourusername>/airbnb-pricing-analysis.git
   cd airbnb-pricing-analysis
   ```
2. Install dependecies
  ```bash
  pip install -r requirements.txt
  ```
3. Launch notebooks
  ```bash
  cd notebooks
  jupyter notebook
  ```
4. Start with the **Data Cleaning(01)** notebook and proceed sequentially.

---

## Key Takeaways

- Room type dominates price structure - hosts with entire homes can expect the highest margins
- Borough-level effects remain strong; **Manhattan > Brooklyn > Queens**
- Superhost trust factor issues improves engagement but doesn't command higher nightly rates

---

## Author
Shalom Arbsie
Computer Science Student @ Addis Ababa University
Focus: Data Science and Machine Learning
![LinkedIn](www.linkedin.com/in/shalom-arbsie)
![Github](https://github.com/shalomarbsie)
