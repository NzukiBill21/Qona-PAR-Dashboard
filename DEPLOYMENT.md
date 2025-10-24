# Deployment Guide for PAR Analytics Dashboard

## 🚀 Quick Deploy to Railway

Railway is the recommended deployment platform for this application.

### Prerequisites
1. GitHub account
2. Railway account (sign up at https://railway.app)
3. Your Excel data file (`Data.xlsx`)

### Step-by-Step Deployment

#### 1. Push to GitHub (if not already done)
```bash
git init
git add .
git commit -m "Initial commit - PAR Analytics Dashboard"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

#### 2. Deploy on Railway

1. **Go to Railway**: https://railway.app
2. **Login** with your GitHub account
3. **Create New Project** → **Deploy from GitHub repo**
4. **Select your repository**: `par_enterprise_backend`
5. Railway will **auto-detect** the Python app and start building

#### 3. Configure Environment Variables

In Railway dashboard, go to your project → **Variables** tab and add:

```
INPUT_PATH=Data.xlsx
FLASK_ENV=production
LOG_LEVEL=INFO
PORT=10000
```

#### 4. Upload Your Excel File

You have two options:

**Option A: Include in Git (Simple)**
- Place `Data.xlsx` in the root folder
- Commit and push: 
  ```bash
  git add Data.xlsx
  git commit -m "Add data file"
  git push
  ```
- Railway will automatically redeploy

**Option B: Use Railway Volume (Recommended for sensitive data)**
- In Railway → **Storage** → **Create Volume**
- Mount path: `/app`
- Upload `Data.xlsx` through Railway's file browser

#### 5. Get Your Live URL

- Railway will generate a URL like: `https://your-app.up.railway.app`
- Click **Generate Domain** in the Settings tab if not auto-generated
- Your dashboard will be live! 🎉

---

## 🌐 Alternative: Deploy to Render

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy on Render

1. **Go to Render**: https://render.com
2. **New** → **Web Service**
3. **Connect** your GitHub repository
4. **Configure**:
   - **Name**: par-analytics-dashboard
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

### Step 3: Environment Variables
Add in Render dashboard:
```
INPUT_PATH=Data.xlsx
FLASK_ENV=production
PORT=10000
```

### Step 4: Upload Data File
- Use Render's disk storage or include in Git

---

## 🏠 Local Development

### 1. Install Dependencies
```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install packages
pip install -r requirements.txt
```

### 2. Set Up Environment
```bash
# Copy example env file
copy .env.example .env  # Windows
cp .env.example .env    # Mac/Linux

# Edit .env and set your configuration
```

### 3. Run Locally
```bash
# Start Flask backend
python app.py

# Access at http://localhost:10000
```

---

## 📋 Deployment Checklist

Before deploying, ensure:

- [x] Frontend is built (`Frontend/build/` exists)
- [x] `Data.xlsx` is in the correct location
- [x] `requirements.txt` includes all dependencies
- [x] Environment variables are configured
- [x] Favicon is visible
- [x] All dates display correctly
- [x] Exports work with correct dates

---

## 🔧 Post-Deployment

### Update Data File
When you need to update `Data.xlsx`:

**Railway:**
1. Upload new file through Volume browser, OR
2. Commit and push to GitHub (auto-redeploys)

**Render:**
1. Upload through Render dashboard, OR
2. Commit and push to GitHub

### Monitor Logs
- **Railway**: Dashboard → **Logs** tab
- **Render**: Dashboard → **Logs** section

### Custom Domain (Optional)
Both Railway and Render support custom domains:
- Railway: Settings → Domains → Add Custom Domain
- Render: Settings → Custom Domain

---

## 🆘 Troubleshooting

### Issue: Favicon not showing
**Fix**: Clear browser cache or hard refresh (Ctrl+F5)

### Issue: Wrong dates in exports
**Fix**: This has been fixed! Ensure you deployed the latest version

### Issue: App crashes on start
**Check**:
1. `Data.xlsx` exists at `INPUT_PATH`
2. All dependencies installed
3. Python version is 3.11.x

### Issue: Slow performance
**Solution**: 
- Railway: Upgrade to higher tier
- Render: Use paid plan for better resources

---

## 📧 Share with Your Supervisor

Once deployed, share:
```
PAR Analytics Dashboard
Live URL: https://your-app.up.railway.app
Username: (if you add authentication)
Note: Select any date from the calendar to view data for that week
```

---

## 🔐 Security Notes (Production)

For production deployment, consider:
1. Add authentication (Flask-Login or similar)
2. Use HTTPS (auto-enabled on Railway/Render)
3. Restrict CORS origins in `app.py`
4. Store `Data.xlsx` in secure volume storage
5. Add rate limiting for API endpoints

---

## ✅ You're All Set!

Your PAR Analytics Dashboard is ready to deploy. Follow the steps above and you'll have a working link in minutes! 🚀

