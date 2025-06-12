# GitHub Pages Setup Guide

## 🚀 Quick Setup Instructions

### 1. Create GitHub Repository
```bash
# Create a new repository on GitHub called 'ai-art-gallery'
# Initialize with README
```

### 2. Upload Files to Repository
Upload these files to your repository root:
- `index.html`
- `style.css` 
- `app.js`
- `README.md`

### 3. Enable GitHub Pages
1. Go to repository **Settings**
2. Scroll to **Pages** section
3. Under **Source**, select **Deploy from a branch**
4. Choose **main** branch
5. Select **/ (root)** folder
6. Click **Save**

### 4. Access Your Gallery
Your gallery will be available at:
`https://[your-username].github.io/ai-art-gallery/`

## 📁 File Structure
```
ai-art-gallery/
├── index.html          # Main gallery page
├── style.css           # Styling and themes
├── app.js              # Gallery functionality
├── data/
│   └── artworks.json   # Dynamic artwork data
├── assets/
│   └── icons/          # Custom icons
└── README.md           # Project documentation
```

## 🔧 Configuration

### Environment Setup
1. Clone the repository locally
2. Open in your preferred code editor
3. Modify `app.js` to connect to your Google Drive
4. Update data sources as needed

### Google Drive Integration
Replace the sample data in `app.js` with your Google Drive folder API connection:

```javascript
// Replace this section in app.js
async loadArtworksFromDrive() {
    const folderId = 'YOUR_GOOGLE_DRIVE_FOLDER_ID';
    const apiKey = 'YOUR_GOOGLE_API_KEY';
    
    // Add Google Drive API implementation
}
```

## ⚡ GitHub Actions (Optional)
For automated updates, add `.github/workflows/update-gallery.yml`:

```yaml
name: Update Gallery
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Update artwork data
        run: |
          # Add script to fetch latest from Google Drive
          # Update artworks.json
          # Commit changes
```

## 🌐 Custom Domain (Optional)
1. Add `CNAME` file to repository root
2. Enter your domain: `gallery.yourdomain.com`
3. Configure DNS with your domain provider
4. Add CNAME record pointing to `[username].github.io`

## 🔄 Continuous Deployment
Every push to main branch automatically updates your live gallery.