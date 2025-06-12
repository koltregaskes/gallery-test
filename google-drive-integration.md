# Google Drive Integration Guide

## 🔑 API Setup

### 1. Get Google Drive API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Drive API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Restrict the key to Google Drive API

### 2. Configure Drive Folder
Your shared folder ID: `1u77AUmGND0Q-cYH-SK791qAAHxaFhbKa`

### 3. Folder Structure Setup
```
AI Art/
├── Focus/           # Featured artworks
├── Latest/          # Recent creations  
├── Archive/         # Older works
├── Video/           # AI videos
└── Music/           # Udio music
```

## 📝 Integration Code

### JavaScript Google Drive Client
```javascript
class GoogleDriveClient {
    constructor(apiKey, folderId) {
        this.apiKey = apiKey;
        this.folderId = folderId;
        this.baseUrl = 'https://www.googleapis.com/drive/v3';
    }

    async getFolderContents(folderId = this.folderId) {
        const url = `${this.baseUrl}/files?q='${folderId}'+in+parents&key=${this.apiKey}&fields=files(id,name,mimeType,parents,createdTime,imageMediaMetadata,webViewLink,webContentLink)`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.files || [];
        } catch (error) {
            console.error('Error fetching folder contents:', error);
            return [];
        }
    }

    async getAllArtworks() {
        const folders = {
            'Focus': await this.getFolderByName('Focus'),
            'Latest': await this.getFolderByName('Latest'), 
            'Archive': await this.getFolderByName('Archive'),
            'Video': await this.getFolderByName('Video'),
            'Music': await this.getFolderByName('Music')
        };

        const artworks = [];
        
        for (const [category, folder] of Object.entries(folders)) {
            if (folder) {
                const files = await this.getFolderContents(folder.id);
                const categoryArtworks = this.processFiles(files, category);
                artworks.push(...categoryArtworks);
            }
        }

        return artworks;
    }

    async getFolderByName(name) {
        const url = `${this.baseUrl}/files?q=name='${name}'+and+'${this.folderId}'+in+parents&key=${this.apiKey}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.files?.[0] || null;
        } catch (error) {
            console.error(`Error finding folder ${name}:`, error);
            return null;
        }
    }

    processFiles(files, category) {
        return files
            .filter(file => this.isImageFile(file))
            .map(file => ({
                id: file.id,
                title: this.extractTitle(file.name),
                imageUrl: this.getImageUrl(file.id),
                thumbnailUrl: this.getThumbnailUrl(file.id),
                category: category,
                platform: this.extractPlatform(file.name),
                date: file.createdTime?.split('T')[0] || new Date().toISOString().split('T')[0],
                prompt: this.extractPrompt(file.name),
                tags: this.extractTags(file.name),
                featured: category === 'Focus',
                description: this.generateDescription(file.name),
                driveLink: file.webViewLink,
                metadata: file.imageMediaMetadata || {}
            }));
    }

    isImageFile(file) {
        const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        return imageTypes.includes(file.mimeType);
    }

    getImageUrl(fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }

    getThumbnailUrl(fileId) {
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
    }

    extractTitle(filename) {
        // Remove file extension and clean up
        return filename.replace(/\.[^/.]+$/, "").replace(/_/g, ' ');
    }

    extractPlatform(filename) {
        const platforms = ['Midjourney', 'DALL-E', 'Stable Diffusion', 'Udio'];
        const found = platforms.find(platform => 
            filename.toLowerCase().includes(platform.toLowerCase())
        );
        return found || 'Midjourney'; // Default
    }

    extractPrompt(filename) {
        // Extract prompt from filename if following naming convention
        const promptMatch = filename.match(/--prompt-(.+?)--/);
        return promptMatch ? promptMatch[1].replace(/_/g, ' ') : '';
    }

    extractTags(filename) {
        // Extract tags from filename if following naming convention
        const tagMatch = filename.match(/--tags-(.+?)--/);
        if (tagMatch) {
            return tagMatch[1].split('_');
        }
        
        // Fallback: generate tags from filename
        const words = filename.toLowerCase().split(/[_\-\s]+/);
        return words.slice(0, 3); // First 3 words as tags
    }

    generateDescription(filename) {
        const title = this.extractTitle(filename);
        return `AI generated artwork: ${title}`;
    }
}

// Usage in your gallery
const driveClient = new GoogleDriveClient(
    'YOUR_API_KEY_HERE',
    '1u77AUmGND0Q-cYH-SK791qAAHxaFhbKa' // Your folder ID
);

// Update gallery with Drive data
async function updateGalleryFromDrive() {
    try {
        const artworks = await driveClient.getAllArtworks();
        
        // Update your gallery
        gallery.artworks = artworks;
        gallery.filteredArtworks = artworks;
        gallery.renderGallery();
        gallery.updateStats();
        
        console.log(`Loaded ${artworks.length} artworks from Google Drive`);
    } catch (error) {
        console.error('Failed to load from Google Drive:', error);
    }
}
```

## 🔄 Recommended File Naming Convention

### For Metadata Extraction
```
Title--prompt-Your_prompt_here--tags-tag1_tag2_tag3--platform-Midjourney.jpg
```

### Examples
```
Cyberpunk_City--prompt-Futuristic_cityscape_neon_lights--tags-cyberpunk_city_neon--platform-Midjourney.jpg
Ocean_Dreams--prompt-Underwater_coral_reef_tropical--tags-ocean_underwater_coral--platform-Midjourney.jpg
```

## ⚙️ CORS Configuration
Since GitHub Pages can't make direct API calls, you'll need:

### Option 1: GitHub Actions (Recommended)
- Set up scheduled workflow to fetch data
- Store in `data/artworks.json`
- Gallery reads from JSON file

### Option 2: Proxy Service
- Use a CORS proxy service
- Or deploy a simple serverless function

### Option 3: Browser Extension
- Chrome extension to manage updates
- Direct access to Google Drive API