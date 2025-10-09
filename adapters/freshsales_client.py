import requests, os

DOMAIN = "tuwende-team.myfreshworks.com"
API_KEY = "flrkwmYpmqWRKZSeUa3T8A"
headers = {"Authorization": f"Token token={API_KEY}", "Accept": "application/json"}

candidates = [
    "crm/sales/api/deals",
    "crm/sales/api/v2/deals",
    "crm/sales/api/contacts",
    "crm/sales/api/v2/contacts",
    "crm/sales/api/accounts",
    "crm/sales/api/v2/accounts",
    "crm/sales/api/leads",
    "crm/sales/api/v2/leads",
]

for ep in candidates:
    url = f"https://{DOMAIN}/{ep}"
    try:
        r = requests.get(url, headers=headers, timeout=15)
        ctype = r.headers.get("content-type", "")
        print(f"{r.status_code:3} | {ep} | {ctype}")
        if r.status_code == 200 and "json" in ctype:
            print(r.text[:300], "\n")
            break
    except Exception as e:
        print(f"⚠️  {ep}: {e}")
