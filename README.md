# PAR Enterprise Backend

## Dev
pip install -r requirements.txt
copy .env.example -> .env (set INPUT_PATH=Data.xlsx or full path)
python app.py  # http://127.0.0.1:8050

## Endpoints
GET /api/healthz
GET /api/overall
GET /api/officer?name=JOSEPH%20KIWIA%20MWANYA
GET /api/export/overall.csv
