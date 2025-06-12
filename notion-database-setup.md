# Notion Database Setup Guide

## 🗄️ Database Structure

### Create New Database
1. Open Notion workspace
2. Click **+ New Page**
3. Select **Database** → **Table**
4. Name it: **"AI Art Gallery"**

## 📊 Database Properties

### Essential Properties
| Property Name | Type | Description | Options |
|---------------|------|-------------|---------|
| **Name** | Title | Artwork title | Primary field |
| **Category** | Select | Folder category | Focus, Latest, Archive, Video, Music |
| **Platform** | Select | AI platform used | Midjourney, DALL-E, Stable Diffusion, Udio |
| **Drive File** | URL | Google Drive link | - |
| **Image URL** | URL | Direct image link | - |
| **Thumbnail** | URL | Thumbnail link | - |
| **Featured** | Checkbox | Highlight toggle | - |
| **Date Added** | Date | Upload date | - |
| **Tags** | Multi-select | Keywords/tags | Custom tags |
| **Prompt** | Text | AI prompt used | - |
| **Description** | Rich Text | Artwork description | - |
| **Status** | Select | Publishing status | Draft, Published, Hidden |

### Advanced Properties (Optional)
| Property Name | Type | Description | Options |
|---------------|------|-------------|---------|
| **Dimensions** | Rich Text | Image size | - |
| **File Size** | Number | File size in MB | - |
| **Views** | Number | View count | - |
| **Likes** | Number | Like count | - |
| **Created By** | Person | Artist/Creator | - |
| **Collection** | Relation | Link to collections | - |
| **Color Palette** | Multi-select | Dominant colors | Red, Blue, Green, etc. |
| **Mood** | Select | Artwork mood | Dark, Bright, Calm, Energetic |

## 🎨 Database Views

### 1. Gallery View (Default)
**Configuration:**
- **View Type**: Gallery
- **Card Preview**: Image URL
- **Card Size**: Medium
- **Properties Shown**: Name, Category, Platform, Featured

### 2. Focus Collection
**Configuration:**
- **View Type**: Gallery  
- **Filter**: Featured = Checked
- **Sort**: Date Added (Newest first)

### 3. By Category
**Configuration:**
- **View Type**: Board
- **Group By**: Category
- **Sort**: Date Added (Newest first)

### 4. Content Calendar
**Configuration:**
- **View Type**: Calendar
- **Date Property**: Date Added
- **Properties Shown**: Name, Platform, Category

### 5. Tag Explorer
**Configuration:**
- **View Type**: Table
- **Group By**: Tags
- **Properties Shown**: All

## 🔧 Database Templates

### New Artwork Template
```
Name: [Artwork Title]
Category: Latest
Platform: Midjourney
Featured: ☐
Status: Draft
Tags: AI Art
Description: AI generated artwork featuring...
```

### Quick Add Template
```
Name: 
Category: Latest
Platform: Midjourney
Featured: ☐
```

## 🔗 Integration Setup

### 1. Get Notion API Token
1. Go to [Notion Developers](https://developers.notion.com/)
2. Click **New Integration**
3. Name: "AI Art Gallery Integration"
4. Select workspace
5. Copy **Internal Integration Token**

### 2. Share Database with Integration
1. Open your AI Art Gallery database
2. Click **Share** button
3. Click **Invite**
4. Search for your integration name
5. Select and invite

### 3. Get Database ID
1. Open database in Notion
2. Copy URL: `https://notion.so/workspace/DATABASE_ID?v=...`
3. Extract the `DATABASE_ID` part

## 📝 Notion API Examples

### Create New Entry
```javascript
const notion = new Client({ auth: process.env.NOTION_TOKEN });

const response = await notion.pages.create({
  parent: { database_id: "YOUR_DATABASE_ID" },
  properties: {
    "Name": {
      title: [
        {
          text: {
            content: "Cyberpunk Cityscape"
          }
        }
      ]
    },
    "Category": {
      select: {
        name: "Focus"
      }
    },
    "Platform": {
      select: {
        name: "Midjourney"
      }
    },
    "Drive File": {
      url: "https://drive.google.com/file/d/FILE_ID"
    },
    "Image URL": {
      url: "https://drive.google.com/uc?export=view&id=FILE_ID"
    },
    "Featured": {
      checkbox: true
    },
    "Date Added": {
      date: {
        start: "2025-06-12"
      }
    },
    "Tags": {
      multi_select: [
        { name: "cyberpunk" },
        { name: "cityscape" },
        { name: "neon" }
      ]
    },
    "Description": {
      rich_text: [
        {
          text: {
            content: "A stunning cyberpunk cityscape featuring towering skyscrapers with neon advertisements."
          }
        }
      ]
    }
  }
});
```

### Query Database
```javascript
const response = await notion.databases.query({
  database_id: "YOUR_DATABASE_ID",
  filter: {
    property: "Category",
    select: {
      equals: "Focus"
    }
  },
  sorts: [
    {
      property: "Date Added",
      direction: "descending"
    }
  ]
});
```

## 🎯 Database Automation Rules

### Auto-Fill Rules
1. **New Entry**: Auto-set Status to "Draft"
2. **Focus Category**: Auto-check Featured
3. **Date Added**: Auto-fill with current date
4. **Tags**: Auto-add "AI Art" tag

### Validation Rules
1. **Required Fields**: Name, Category, Platform
2. **URL Validation**: Check valid Drive links
3. **Category Options**: Limit to predefined list

## 📱 Mobile Optimization

### Notion Mobile App
- **Quick Add**: Use mobile app for fast entry
- **Voice Notes**: Add descriptions via voice
- **Camera**: Take photos of physical artworks

### Mobile Templates
```
📱 Quick Mobile Entry
Name: 
Category: Latest
Platform: Midjourney
📝 Add details later
```

## 🔄 Sync with Website

### Export to JSON
```javascript
// Script to export Notion data for website
const exportData = async () => {
  const response = await notion.databases.query({
    database_id: "YOUR_DATABASE_ID",
    filter: {
      property: "Status",
      select: {
        equals: "Published"
      }
    }
  });
  
  const artworks = response.results.map(page => ({
    id: page.id,
    title: page.properties.Name.title[0]?.plain_text || '',
    category: page.properties.Category.select?.name || '',
    platform: page.properties.Platform.select?.name || '',
    imageUrl: page.properties['Image URL'].url || '',
    thumbnailUrl: page.properties.Thumbnail.url || '',
    featured: page.properties.Featured.checkbox || false,
    date: page.properties['Date Added'].date?.start || '',
    tags: page.properties.Tags.multi_select.map(tag => tag.name),
    description: page.properties.Description.rich_text[0]?.plain_text || ''
  }));
  
  return artworks;
};
```

## 🎨 Visual Customization

### Cover Images
- Set database cover to showcase featured artwork
- Use high-quality AI art as header

### Icons
- 🎨 for main database
- 🌟 for featured items
- 📁 for categories
- 🤖 for AI platforms

### Colors
- **Focus**: Red
- **Latest**: Green  
- **Archive**: Gray
- **Video**: Blue
- **Music**: Purple