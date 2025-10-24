# 🚀 Deploy to Railway - Quick Start (5 Minutes)

## Step 1: Push to GitHub

```bash
git add .
git commit -m "PAR Dashboard - Production Ready"
git push origin main
```

If you haven't set up Git yet:
```bash
git init
git add .
git commit -m "PAR Dashboard - Production Ready"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## Step 2: Deploy on Railway

1. **Go to**: https://railway.app
2. **Sign in** with GitHub
3. Click: **New Project**
4. Click: **Deploy from GitHub repo**
5. **Select**: `par_enterprise_backend`
6. **Wait**: Railway will auto-detect Python and start building (~2 mins)

---

## Step 3: Configure Environment

In Railway dashboard:
1. Click your project
2. Click **Variables** tab
3. Click **New Variable**
4. Add:
   - **Key**: `INPUT_PATH`
   - **Value**: `Data.xlsx`
5. Click **Add**

Railway will automatically redeploy.

---

## Step 4: Get Your Live URL

1. Go to **Settings** tab
2. Under **Domains**, click **Generate Domain**
3. Your URL: `https://par-enterprise-backend-production.up.railway.app`
4. **Copy this link!** 🎉

---

## Step 5: Share with Supervisor

Send this message:

```
Hi [Supervisor Name],

The PAR Analytics Dashboard is now live! 🎉

🔗 Link: https://your-app.up.railway.app

How to use:
1. Click the calendar to select any date (e.g., Sep 18)
2. The dashboard shows data for your selected week
3. Choose "All Officers" or specific officers
4. Export reports in PDF, Excel, or PNG format

All dates now display exactly as selected!

Best regards,
[Your Name]
```

---

## ✅ You're Done!

Your dashboard is live and ready to use. The deployment is automatic and will update whenever you push to GitHub.

### What if I need to update the Excel file?

**Option 1**: Commit to Git
```bash
git add Data.xlsx
git commit -m "Update data"
git push
```

**Option 2**: Upload via Railway
- Project → Files → Upload `Data.xlsx`

---

## 🆘 Troubleshooting

**Dashboard not loading?**
- Check Railway Logs tab for errors
- Ensure `Data.xlsx` is in the root folder

**Port errors?**
- Railway auto-configures PORT, no action needed

**Need help?**
- Railway docs: https://docs.railway.app
- Check `DEPLOYMENT.md` for detailed guide

---

**Time to deploy: ~5 minutes**  
**Cost: FREE (Railway starter plan)**

🚀 Let's go!

