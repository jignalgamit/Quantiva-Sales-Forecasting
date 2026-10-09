import re

with open('backend/ml/ml_model.py', 'r') as f:
    content = f.read()

replacement = """import calendar
    hist_values = data['Sales'].values[-12:].tolist()
    if has_date:
        hist_month_names = data['Date'].dt.strftime('%b').values[-12:].tolist()
    else:
        hist_months = data['Month'].values[-12:].tolist()
        hist_month_names = [calendar.month_abbr[int(m)] for m in hist_months]

    historical  = [{"name": hist_month_names[i], "sales": float(v)} for i, v in enumerate(hist_values)]
    forecast    = [{"name": future_month_names[i], "sales": round(v, 2)} for i, v in enumerate(future_preds)]"""

target_to_replace = """    hist_values = data['Sales'].values[-12:].tolist()
    historical  = [{"name": f"Month -{12-i}", "sales": float(v)} for i, v in enumerate(hist_values)]
    forecast    = [{"name": f"Month {i+1}",   "sales": round(v, 2)} for i, v in enumerate(future_preds)]"""


content = content.replace(target_to_replace, replacement)

target2 = """    future_preds = []
    for i in range(12):
        frow = last_row.copy()

        # Advance month/year
        if 'Month' in frow.columns:
            cur_m = int(frow['Month'].values[0])
            cur_y = int(frow['Year'].values[0]) if 'Year' in frow.columns else 2024
            new_m = (cur_m % 12) + 1
            new_y = cur_y + (1 if cur_m == 12 else 0)
            frow['Month'] = new_m
            if 'Year' in frow.columns:
                frow['Year'] = new_y
            if 'Quarter' in frow.columns:
                frow['Quarter'] = (new_m - 1) // 3 + 1
            if 'Day' in frow.columns:
                frow['Day'] = 15"""

replacement2 = """    import calendar
    future_preds = []
    future_month_names = []
    for i in range(12):
        frow = last_row.copy()

        # Advance month/year
        if 'Month' in frow.columns:
            cur_m = int(frow['Month'].values[0])
            cur_y = int(frow['Year'].values[0]) if 'Year' in frow.columns else 2024
            new_m = (cur_m % 12) + 1
            new_y = cur_y + (1 if cur_m == 12 else 0)
            frow['Month'] = new_m
            if 'Year' in frow.columns:
                frow['Year'] = new_y
            if 'Quarter' in frow.columns:
                frow['Quarter'] = (new_m - 1) // 3 + 1
            if 'Day' in frow.columns:
                frow['Day'] = 15
            future_month_names.append(calendar.month_abbr[new_m])
        else:
            future_month_names.append(f"M{i+1}")"""

content = content.replace(target2, replacement2)

with open('backend/ml/ml_model.py', 'w') as f:
    f.write(content)
print("done")
