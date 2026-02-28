# Mytelecomproject

frontend setup:
cd frontend
npm install

# Set API URL in .env if not already set
# Example:
# API_URL=http://localhost:8000/api/v1

npm run dev
# Open browser at the URL shown in terminal


backend setup:

cd backend

# Create virtual environment
python -m venv venv

# Activate environment
# Linux / Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn main:app --reload
# or uvicorn main:app --reload --port 8000
 
# Backend will run at http://localhost:8000



seed data: 
# Open a new terminal and activate backend environment
cd backend/seed_data

# Run sample data generator
python generate_sample_data.py
# This populates the database with sample data



