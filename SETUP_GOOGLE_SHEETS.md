# Google Sheets Setup Guide

To connect your Whispering Bamboos app to Google Sheets, follow these steps:

## 1. Create a Google Service Account

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., "whispering-bamboos").
3. Enable the **Google Sheets API** for this project.
4. Go to **IAM & Admin** > **Service Accounts**.
5. Click **Create Service Account**, give it a name, and create it.
6. Click on the newly created service account, go to the **Keys** tab.
7. Click **Add Key** > **Create new key** > **JSON**.
8. A JSON file will download. **Keep this safe!**

## 2. Prepare the Google Sheet

1. Create a new Google Sheet at [docs.google.com](https://docs.google.com/).
2. Note the **Spreadsheet ID** from the URL:
   `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit`
3. Click the **Share** button in the top right.
4. Share the sheet with the **client_email** found in your downloaded JSON file (e.g., `whispering-bamboos@...iam.gserviceaccount.com`). Give it **Editor** access.

## 3. Configure Environment Variables

1. Open `.env` in your project root.
2. Fill in the values from your JSON file and Sheet ID:

```env
VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email@project.iam.gserviceaccount.com
VITE_GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
VITE_GOOGLE_SHEET_ID=your_spreadsheet_id
```

**Note:** For the private key, copy the *entire* string including the BEGIN/END parts. If pasting into Vercel dashboard, you might need to handle newlines carefully (replace `\n` with actual newlines or strictly check how Vercel handles it).

## 4. Deploy

When deploying to Vercel, add these same Environment Variables in the Project Settings.
