import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

with open("sample_data.json", "r") as f:
    data = json.load(f)





# Seed Workers
for worker in data.get("sample_workers", []):
    res = requests.post(f"{BASE_URL}/workers/", json=worker)
    print("Worker:", res.status_code)

# Seed Assets
for asset in data.get("sample_assets", []):
    res = requests.post(f"{BASE_URL}/assets/", json=asset)
    print("Asset:", res.status_code)

# Seed Maintenance Plans
for plan in data.get("sample_plans", []):
    res = requests.post(f"{BASE_URL}/maintenance-plans/", json=plan)
    print("Plan:", res.status_code)



for task in data.get("sample_tasks", []):
    res = requests.post(f"{BASE_URL}/tasks/", json=task)
    print("task:", res.status_code)

print("Seeding completed.")