# Make.com Automation Workflow

## 🚀 Why Make.com Over Zapier?

**Make.com is recommended because:**
- Visual workflow builder perfect for complex logic
- Better data transformation capabilities
- More cost-effective for multi-step workflows
- Superior error handling and debugging
- Built-in support for conditional logic and loops

## 🔧 Setup Overview

### Workflow: Google Drive → Notion → GitHub
```
[Google Drive Trigger] → [File Processing] → [Notion Update] → [GitHub Update]
```

## 📋 Step-by-Step Setup

### 1. Create Make.com Account
- Sign up at [make.com](https://make.com)
- Start with free tier (1,000 operations/month)

### 2. Set Up Google Drive Trigger

#### Module: Google Drive - Watch Files
**Configuration:**
- **Folder**: `1u77AUmGND0Q-cYH-SK791qAAHxaFhbKa` (your AI Art folder)
- **Watch**: New files and file updates
- **Subfolder handling**: Include subfolders
- **Output Bundle Limit**: 100

**Trigger Events:**
- New file added to any subfolder
- File moved between subfolders
- File renamed or modified

### 3. Add Router Module

#### Branch Logic:
- **Branch 1**: Image files (JPEG, PNG, WebP)
- **Branch 2**: Video files (MP4, MOV)  
- **Branch 3**: Audio files (MP3, WAV)

#### Filter Conditions:
```javascript
// Image Filter
{{1.mimeType}} contains "image"

// Video Filter  
{{1.mimeType}} contains "video"

// Audio Filter
{{1.mimeType}} contains "audio"
```

### 4. Data Processing Module

#### Module: Tools - Set Variables
**Variables to Extract:**
```javascript
{
  "fileId": "{{1.id}}",
  "fileName": "{{1.name}}",
  "parentFolder": "{{1.parents[1].name}}",
  "category": "{{if(1.parents[1].name = 'Focus', 'Focus', if(1.parents[1].name = 'Latest', 'Latest', 'Archive'))}}",
  "platform": "{{if(contains(1.name, 'MJ'), 'Midjourney', if(contains(1.name, 'DALLE'), 'DALL-E', 'Midjourney'))}}",
  "imageUrl": "https://drive.google.com/uc?export=view&id={{1.id}}",
  "thumbnailUrl": "https://drive.google.com/thumbnail?id={{1.id}}&sz=w400",
  "webViewLink": "{{1.webViewLink}}",
  "createdDate": "{{formatDate(1.createdTime, 'YYYY-MM-DD')}}",
  "featured": "{{if(1.parents[1].name = 'Focus', true, false)}}",
  "title": "{{replace(replace(1.name, '\\.jpg', ''), '_', ' ')}}",
  "description": "AI generated artwork: {{replace(1.name, '\\.jpg', '')}}"
}
```

### 5. Notion Integration

#### Module: Notion - Create/Update Database Item
**Database Configuration:**
- **Database**: Your AI Art Gallery database
- **Action**: Create new item or update existing

**Property Mapping:**
```javascript
{
  "Name": "{{2.title}}",
  "Category": {
    "select": {
      "name": "{{2.category}}"
    }
  },
  "Platform": {
    "select": {
      "name": "{{2.platform}}"
    }
  },
  "Drive File": {
    "url": "{{2.webViewLink}}"
  },
  "Image URL": {
    "url": "{{2.imageUrl}}"
  },
  "Thumbnail": {
    "url": "{{2.thumbnailUrl}}"
  },
  "Featured": {
    "checkbox": "{{2.featured}}"
  },
  "Date Added": {
    "date": {
      "start": "{{2.createdDate}}"
    }
  },
  "Description": {
    "rich_text": [
      {
        "text": {
          "content": "{{2.description}}"
        }
      }
    ]
  },
  "Tags": {
    "multi_select": [
      {
        "name": "AI Art"
      },
      {
        "name": "{{2.platform}}"
      }
    ]
  }
}
```

### 6. GitHub Repository Update

#### Module: GitHub - Create/Update File
**Configuration:**
- **Repository**: `your-username/ai-art-gallery`
- **File Path**: `data/artworks.json`
- **Action**: Update existing file

**Content Generation:**
```javascript
// Get current JSON from Notion
// Add new artwork data
// Format as JSON
// Commit to repository
```

## 🔄 Advanced Workflow Features

### Error Handling
- **Break Error Handler**: Log errors to Google Sheets
- **Retry Logic**: Retry failed operations 3 times
- **Notification**: Send Slack/email on failures

### Data Validation
- **File Size Check**: Skip files > 50MB
- **Format Validation**: Only process supported formats
- **Duplicate Detection**: Check if file already exists

### Performance Optimization
- **Batch Processing**: Process multiple files together
- **Rate Limiting**: Respect API limits
- **Caching**: Store processed data temporarily

## 📊 Monitoring & Analytics

### Make.com Dashboard
- **Execution History**: View all workflow runs
- **Error Logs**: Debug failed operations
- **Performance Metrics**: Optimize workflow speed

### Custom Webhooks
```javascript
// Success notification
{
  "status": "success",
  "file": "{{1.name}}",
  "category": "{{2.category}}",
  "timestamp": "{{now}}"
}

// Error notification  
{
  "status": "error",
  "file": "{{1.name}}",
  "error": "{{error.message}}",
  "timestamp": "{{now}}"
}
```

## 💰 Cost Estimation

### Make.com Pricing
- **Free**: 1,000 operations/month
- **Core**: $9/month - 10,000 operations
- **Pro**: $16/month - 10,000 operations + advanced features

### Operations Per Image
1. Google Drive trigger: 1 operation
2. Data processing: 1 operation  
3. Notion update: 1 operation
4. GitHub update: 1 operation
**Total**: ~4 operations per image

### Monthly Capacity
- **Free**: ~250 images/month
- **Core**: ~2,500 images/month
- **Pro**: ~2,500 images/month (with advanced features)

## 🔧 Testing Your Workflow

### 1. Create Test Scenario
- Upload a test image to your Google Drive
- Verify it triggers the workflow
- Check Notion database for new entry
- Confirm GitHub repository update

### 2. Debug Common Issues
- **API Rate Limits**: Add delays between operations
- **Authentication**: Refresh OAuth tokens
- **Data Format**: Validate JSON structure

### 3. Performance Tuning
- **Parallel Processing**: Use multiple workflow branches
- **Conditional Logic**: Skip unnecessary operations
- **Batch Updates**: Group multiple changes