# What Makes Lands Happy?

## Full Results: https://asseternity.github.io/what_makes_lands_happy/

## Summary
Data science and visualization project exploring which national metrics correlate most strongly with happiness. The dataset combines over a dozen global indicators (economic, environmental, demographic, and social) into a single normalized table for analysis and visualization. The output powers the **What Makes Lands Happy** interactive frontend built in TypeScript + React.

---

## Tech
- **Languages:** Python (pandas, seaborn, matplotlib), TypeScript (frontend)  
- **Data Sources:** World Happiness Report, IQAir, World Bank, Our World in Data, Netflix Prices, Wage and Cost-of-Living datasets, and more  
- **Processing:** pandas, pandasql, fuzzy string matching via `thefuzz`  
- **Visualization:** matplotlib, seaborn  
- **Exports:** JSON for frontend visualization layer  
- **Environment:** local Dockerized pipeline or Kaggle runtime  

---

## Key Features
- Integrates **18 global datasets** into a single harmonized DataFrame.
- Implements **fuzzy country matching** to merge heterogeneous data sources.
- Handles **temporal selection** (latest-year filters) and **aggregation logic** per metric.
- Automatically assigns **units of measurement** and **cleans country aliases**.
- Computes **Pearson correlations** between each feature and the “Happiness” score.
- Generates both signed and absolute correlation weights for visualization and model input.
- Exports two JSONs:
  - `/exports/happiness_df.json` — main merged dataset  
  - `/exports/happiness_corr.json` — correlation metrics  

---

## Pipeline Overview

1. **Download & Validate Data**
   - Uses a local `download_datasets()` wrapper to ensure each CSV is present or redownloaded.  
   - Standardizes column names and trims whitespace.  

2. **Normalization**
   - Applies country cleaning with:
     ```python
     from string_helpers import normalize_country, apply_alias
     ```
   - Produces `Country_clean` column as canonical join key.

3. **Merging Stages**
   Each dataset adds a thematic dimension:
   - **Wages:** Median, average, min/max salary
   - **Air Quality (IQAir):** Country-level median AQI
   - **Life Expectancy:** Survival rate, alcohol rate, life expectancy
   - **Netflix:** Subscription cost
   - **Women’s Safety Index**
   - **Temperature:** Summer/winter averages for 2024
   - **Population**
   - **Energy:** Per-capita energy + power source mix
   - **World Bank Indicators:** Agriculture, forests, territory, rainfall, corruption
   - **Food Production:** Wheat, potatoes, chicken, avocado, rye
   - **Petrol Prices:** Consumption and cost
   - **CO₂ Emissions**
   - **Cost of Living:** Median city-level consumer and housing costs
   - **GDP Per Capita**
   - **Military Expenditure**
   - **Homicide Rate**
   - **Average Age**
   - **Inflation Rate**

4. **Correlation Analysis**
   - Selects numeric columns and computes a full correlation matrix:
     ```python
     numeric_cols = happiness_df.select_dtypes(include='number')
     corr_matrix = numeric_cols.corr()
     corr_with_happiness = corr_matrix['Happiness (score 0-10)']
     ```
   - Visualizes correlations as a color-coded horizontal bar plot (positive → blue, negative → red).

5. **Export**
   - Writes merged dataset and correlation weights to `/exports/` as JSON.