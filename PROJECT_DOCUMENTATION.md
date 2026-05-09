# SecondBrain Backend - Comprehensive Project Documentation

## 1. PROJECT OVERVIEW

**Project Name:** SecondBrain  
**Type:** Full-Stack Web Application Backend (RESTful API)  
**Purpose:** A content management and knowledge sharing platform that allows users to save, organize, tag, and share their personal knowledge/content (similar to Reddit-style anonymous sharing with AI capabilities)  
**Version:** 1.0.0  
**License:** ISC

### Key Concept

SecondBrain is a personal knowledge vault where users can:

- Save various types of content (YouTube videos, articles, tweets, images, etc.)
- Organize content with tags
- Star/bookmark favorite content
- Share their knowledge base publicly with a shareable link
- Interact with other users' shared content via comments
- Get AI-powered responses to questions about their saved content

---

## 2. TECHNOLOGY STACK & DEPENDENCIES

### Core Runtime

- **Node.js** with ES Modules (type: "module")
- **TypeScript** (v5.9.3) - for type safety and development

### Frontend Communication

- **Express.js** (v5.2.1) - HTTP server framework
- **CORS** (v2.8.6) - Cross-Origin Resource Sharing middleware

### Database

- **MongoDB** - NoSQL database (via Mongoose)
- **Mongoose** (v9.3.1) - MongoDB object modeling and ODM

### Authentication & Security

- **JWT (jsonwebtoken)** (v9.0.3) - Token-based authentication
- **bcrypt** (v6.0.0) - Password hashing and verification

### File Handling

- **Multer** (v2.1.1) - Middleware for handling multipart/form-data (file uploads)
- **multer-storage-cloudinary** (v2.2.1) - Cloudinary storage integration for multer

### External APIs & Services

- **Cloudinary** (v2.9.0) - Cloud storage for image/file uploads
- **Google Generative AI** (v0.24.1) - Gemini AI API for intelligent responses
- **@google/generative-ai** - Official Google AI library

### Validation

- **Zod** (v4.3.6) - Schema validation library for runtime type checking

### Request Processing

- **body-parser** (v2.2.2) - Middleware for parsing HTTP request bodies

### Type Definitions

- @types/express, @types/jsonwebtoken, @types/bcrypt, @types/cors, @types/multer - TypeScript type definitions

---

## 3. PROJECT DIRECTORY STRUCTURE

```
SecondBrain/backend/
├── src/
│   ├── index.ts                           # Main entry point/server initialization
│   ├── db.ts                              # Database schemas & models
│   ├── config/
│   │   ├── cloudinary.ts                  # Cloudinary configuration
│   │   └── gemini.ts                      # Google Gemini AI configuration
│   ├── middlewares/
│   │   ├── AuthMiddleware.ts              # JWT authentication middleware
│   │   └── UploadFile.ts                  # Multer file upload configuration
│   ├── routes/
│   │   └── routes.ts                      # All API endpoints/routes
│   └── utils/
│       ├── utils.ts                       # Utility functions (hash generation)
│       └── UploadFile.ts                  # Cloudinary file upload handler
├── dist/                                   # Compiled JavaScript (generated)
├── uploads/                                # Local uploads directory
├── package.json                            # Project dependencies & scripts
├── tsconfig.json                           # TypeScript configuration
└── README.md                               # Project documentation
```

---

## 4. DATABASE SCHEMA & MODELS

### 4.1 UserSchema (Users Collection)

```typescript
{
  username: {
    type: String,
    unique: true,          // Each username is unique
    required: true
  },
  password: {
    type: String,
    required: true         // Bcrypt hashed password
  },
  sharedQuote: {
    type: String           // User's public quote/bio shown on shared profile
  }
}
```

**Purpose:** Stores user account information  
**Indexes:** Unique index on username for fast lookups

---

### 4.2 ContentSchema (Content Collection)

```typescript
{
  link: String,                    // URL/link associated with content
  type: {
    type: String,
    enum: [                        // Content categorization
      "youtube",
      "twitter",
      "instagram",
      "article",
      "spotify",
      "note",
      "quote",
      "default",
      "pinterest",
      "image"
    ],
    default: "default"
  },
  title: String,                   // Content title
  notes: String,                   // User's notes/description
  tags: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Tags"                  // Reference to Tag documents
    }
  ],
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Users"                   // Reference to User who created it
  },
  imageUrl: String,                // URL of uploaded image/file
  createdAt: {
    type: Date,
    default: Date.now              // Timestamp of creation
  },
  updatedAt: {
    type: Date,
    default: Date.now              // Timestamp of last update
  },
  sharing: {
    type: String,
    enum: ["public", "private"]    // Visibility control
  }
}
```

**Purpose:** Stores saved content items with metadata  
**Key Features:**

- Multiple content type support
- Tag-based organization
- Timestamp tracking
- Public/private visibility control

---

### 4.3 TagSchema (Tags Collection)

```typescript
{
  title: {
    type: String,
    required: true,
    unique: true               // Each tag name is unique
  }
}
```

**Purpose:** Centralized storage for all tags  
**Relationship:** Referenced by ContentSchema

---

### 4.4 LinkSchema (Links Collection)

```typescript
{
  hash: String,                    // Unique shareable link identifier
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    unique: true               // One link per user
  },
  share: {
    type: Boolean,
    req: true                  // Whether sharing is enabled
  }
}
```

**Purpose:** Manages shareable brain links  
**Usage:** Public sharing with randomly generated hash URLs

---

### 4.5 StarredSchema (Starred Collection)

```typescript
{
  contentId: {
    type: mongoose.Types.ObjectId,
    ref: "Content"             // Reference to starred content
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Users"               // User who starred it
  }
}
```

**Purpose:** Tracks user's starred/bookmarked content  
**Relationship:** Many-to-many relationship between Users and Content

---

### 4.6 CommentSchema (Comment Collection)

```typescript
{
  comment: String,                 // Comment text
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Users"                   // User who commented
  },
  shareId: {
    type: String,
    ref: "Links"                   // Associated shared brain link
  },
  createdAt: {
    type: Date,
    default: Date.now              // Comment timestamp
  }
}
```

**Purpose:** Stores comments on shared content  
**Usage:** Users can comment on publicly shared brains

---

## 5. NAMING CONVENTIONS

### Model Naming

- **Pattern:** `{EntityName}Schema` and `{EntityName}Model`
- **Examples:** `UserSchema` → `UserModel`, `ContentSchema` → `ContentModel`
- **Collection Names:** Plural form (Users, Content, Tags, Links, Starred, Comment)

### Variable Naming

- **camelCase:** For variables, functions, and parameters
  - `userId`, `sharedQuote`, `isAlreadySharing`, `tagIds`
- **UPPER_CASE:** For environment variables
  - `JWT_SECRET`, `MONGODB_URI`, `GEMINI_API_KEY`

### Route Naming

- **Pattern:** Lowercase, forward-slash separated paths
- **Resource-oriented:** `/user`, `/content`, `/star`, `/brain/share`
- **HTTP Methods:**
  - `POST` - Create new resource
  - `GET` - Retrieve resource
  - `PUT` - Update resource
  - `DELETE` - Remove resource

### Schema/Validation Naming

- **Pattern:** `{Feature}Schema`
- **Examples:** `authSchema`, `loginSchema`, `contentSchema`, `passUpdateSchema`

### Function Naming

- **Descriptive:** `generateHash()`, `UploadFile()`, `AuthMiddleware()`
- **Middleware:** Suffixed with `Middleware`
- **Utility:** Clear, action-oriented names

---

## 6. API ENDPOINTS & FEATURES

### BASE URL: `/api/v1`

---

### 6.1 AUTHENTICATION ENDPOINTS

#### 6.1.1 User Signup

- **Endpoint:** `POST /signup`
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "username": "string (min 3 characters)",
    "password": "string (min 6 characters)",
    "sharedQuote": "string"
  }
  ```
- **Response:** `201 Created`
  ```json
  { "message": "Signed Up successfully." }
  ```
- **Validation:** Uses `authSchema` (Zod)
- **Features:**
  - Checks if username already exists
  - Hashes password with bcrypt (10 rounds)
  - Creates new user document in database

---

#### 6.1.2 User Signin

- **Endpoint:** `POST /signin`
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "username": "string (min 3 characters)",
    "password": "string (min 6 characters)"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "message": "Signed In Successfully.",
    "token": "JWT_TOKEN_STRING"
  }
  ```
- **Validation:** Uses `loginSchema` (Zod)
- **Features:**
  - Verifies username exists
  - Compares password using bcrypt
  - Generates JWT token with user ID
  - Token stored in Authorization header for future requests

---

### 6.2 USER PROFILE ENDPOINTS

#### 6.2.1 Get User Profile

- **Endpoint:** `GET /user`
- **Authentication:** Required (JWT token)
- **Request Headers:** `Authorization: {JWT_TOKEN}`
- **Response:** `200 OK`
  ```json
  {
    "user": {
      "_id": "ObjectId",
      "username": "string",
      "password": "hashed_string",
      "sharedQuote": "string"
    }
  }
  ```
- **Features:** Returns complete user profile data

---

#### 6.2.2 Update Username

- **Endpoint:** `PUT /user`
- **Authentication:** Required (JWT token)
- **Request Body:**
  ```json
  {
    "username": "string"
  }
  ```
- **Response:** `200 OK`
  ```json
  { "message": "Username updated." }
  ```
- **Features:** Updates username field only

---

#### 6.2.3 Update Shared Quote

- **Endpoint:** `PUT /user/quote`
- **Authentication:** Required (JWT token)
- **Request Body:**
  ```json
  {
    "sharedQuote": "string"
  }
  ```
- **Response:** `200 OK`
  ```json
  { "message": "Shared quote updated successfully." }
  ```
- **Validation:** Checks if sharedQuote is provided
- **Features:** Updates user's public quote/bio

---

#### 6.2.4 Update Password

- **Endpoint:** `PUT /password`
- **Authentication:** Required (JWT token)
- **Request Body:**
  ```json
  {
    "oldPassword": "string (min 6 characters)",
    "newPassword": "string (min 6 characters)"
  }
  ```
- **Response:** `200 OK` or `401 Unauthorized`
  ```json
  { "message": "Password updated." }
  // or
  { "message": "Old password is incorrect." }
  ```
- **Validation:** Uses `passUpdateSchema` (Zod)
- **Features:**
  - Verifies old password
  - Hashes new password with bcrypt (3 rounds - NOTE: Should be 10)
  - Updates password in database

---

### 6.3 CONTENT MANAGEMENT ENDPOINTS

#### 6.3.1 Create Content

- **Endpoint:** `POST /content`
- **Authentication:** Required (JWT token)
- **Content-Type:** `multipart/form-data`
- **Request Body:**
  ```json
  {
    "title": "string (min 3 characters)",
    "link": "string (URL format, optional)",
    "type": "string (youtube|twitter|instagram|article|spotify|note|quote|default|pinterest|image)",
    "notes": "string (optional)",
    "tags": "string|array (comma-separated or array format)",
    "sharing": "public|private",
    "file": "multipart file (optional)"
  }
  ```
- **Response:** `201 Created`
  ```json
  { "message": "Content added." }
  ```
- **Features:**
  - Handles file upload via Multer
  - Uploads files to Cloudinary
  - Creates/references tags automatically
  - Supports comma-separated or array tag format
  - Sets sharing visibility (public/private)

---

#### 6.3.2 Get All User Content

- **Endpoint:** `GET /content`
- **Authentication:** Required (JWT token)
- **Response:** `200 OK`
  ```json
  {
    "contents": [
      {
        "_id": "ObjectId",
        "title": "string",
        "link": "string",
        "type": "string",
        "notes": "string",
        "tags": [{ "_id": "ObjectId", "title": "string" }],
        "userId": { "username": "string" },
        "imageUrl": "string",
        "createdAt": "timestamp",
        "updatedAt": "timestamp",
        "sharing": "public|private"
      }
    ]
  }
  ```
- **Features:**
  - Populates userId with username
  - Populates tags with title
  - Returns all user's content

---

#### 6.3.3 Delete Content

- **Endpoint:** `DELETE /content/:contentId`
- **Authentication:** Required (JWT token)
- **URL Parameters:** `contentId` (MongoDB ObjectId)
- **Response:** `200 OK` or `404 Not Found`
  ```json
  { "message": "Content deleted successfully." }
  // or
  { "message": "Content not found." }
  ```
- **Features:**
  - Verifies user ownership before deletion
  - Returns error if content not found

---

#### 6.3.4 Update Content

- **Endpoint:** `PUT /content/:contentId`
- **Authentication:** Required (JWT token)
- **URL Parameters:** `contentId` (MongoDB ObjectId)
- **Request Body:** (all optional)
  ```json
  {
    "title": "string (min 3 characters, optional)",
    "link": "string (URL format, optional)",
    "type": "string (optional)",
    "notes": "string (optional)",
    "tags": ["array of tag names (optional)"]
  }
  ```
- **Response:** `200 OK` or `404 Not Found`
  ```json
  { "message": "Content updated successfully." }
  // or
  { "message": "Content not found." }
  ```
- **Validation:** Uses `contentUpdateSchema` (Zod)
- **Features:**
  - Only updates provided fields
  - Creates/references tags as needed
  - Verifies user ownership

---

#### 6.3.5 Search Content

- **Endpoint:** `GET /content/search/:querySearch`
- **Authentication:** Required (JWT token)
- **URL Parameters:** `querySearch` (search query string)
- **Response:** `200 OK`
  ```json
  {
    "searchResults": [
      {
        /* content objects */
      }
    ]
  }
  ```
- **Features:**
  - Case-insensitive search
  - Searches content titles
  - Limits to 20 results
  - Uses MongoDB regex ($regex with $options: "i")

---

### 6.4 STARRING/BOOKMARKING ENDPOINTS

#### 6.4.1 Star/Unstar Content

- **Endpoint:** `POST /star/:contentId`
- **Authentication:** Required (JWT token)
- **URL Parameters:** `contentId` (MongoDB ObjectId)
- **Response:** `200 OK`
  ```json
  { "message": "Starred." }
  // or
  { "message": "Removed from starred" }
  ```
- **Features:**
  - Toggles star status
  - Creates new star if doesn't exist
  - Removes star if already exists

---

#### 6.4.2 Get Starred Content

- **Endpoint:** `GET /star`
- **Authentication:** Required (JWT token)
- **Response:** `200 OK`
  ```json
  {
    "starredPosts": [
      {
        "_id": "ObjectId",
        "contentId": {
          /* populated content object */
        },
        "userId": "ObjectId"
      }
    ]
  }
  ```
- **Features:**
  - Returns all starred items for user
  - Populates contentId with full content details

---

### 6.5 SHARING/PUBLIC BRAIN ENDPOINTS

#### 6.5.1 Enable/Disable Brain Sharing

- **Endpoint:** `POST /brain/share`
- **Authentication:** Required (JWT token)
- **Request Body:**
  ```json
  {
    "share": true | false
  }
  ```
- **Response:** `200 OK` or `404 Not Found`
  ```json
  { "message": "/brain/{hash}" }
  // or if already exists
  { "message": "Sharing now.", "at": "/brain/{hash}" }
  // or when disabling
  { "message": "sharing restricted" }
  ```
- **Features:**
  - Generates unique hash for new shares
  - Toggles sharing status
  - Returns shareable URL

---

#### 6.5.2 View Shared Brain

- **Endpoint:** `GET /brain/:shareId`
- **Authentication:** Not required
- **URL Parameters:** `shareId` (hash identifier)
- **Response:** `200 OK`, `403 Forbidden`, or `404 Not Found`
  ```json
  {
    "content": [
      {
        /* public content objects */
      }
    ],
    "shareQuote": {
      "_id": "ObjectId",
      "username": "string",
      "sharedQuote": "string"
    }
  }
  ```
- **Features:**
  - Public accessible endpoint
  - Returns only public content
  - Shows user's shared quote
  - Verifies share is enabled

---

#### 6.5.3 Make Content Public/Private

- **Endpoint:** `POST /brain/make-public/`
- **Authentication:** Required (JWT token)
- **Request Body:**
  ```json
  {
    "contentId": "string (ObjectId)"
  }
  ```
- **Response:** `200 OK` or `404 Not Found`
  ```json
  { "message": "public" }
  // or
  { "message": "private" }
  ```
- **Features:**
  - Toggles content visibility
  - Verifies user ownership
  - Returns new sharing status

---

### 6.6 COMMENTS ENDPOINTS

#### 6.6.1 Post Comment

- **Endpoint:** `POST /comments/:shareId`
- **Authentication:** Required (JWT token)
- **URL Parameters:** `shareId` (hash identifier)
- **Request Body:**
  ```json
  {
    "comment": "string"
  }
  ```
- **Response:** `200 OK`
  ```json
  { "message": "Commented." }
  ```
- **Features:**
  - Creates comment on shared brain
  - Records user ID and timestamp

---

#### 6.6.2 Get Comments

- **Endpoint:** `GET /comments/:shareId`
- **Authentication:** Required (JWT token)
- **URL Parameters:** `shareId` (hash identifier)
- **Response:** `200 OK`
  ```json
  {
    "message": "Comments fetched.",
    "comments": [
      {
        "_id": "ObjectId",
        "comment": "string",
        "userId": "ObjectId",
        "shareId": "string",
        "createdAt": "timestamp"
      }
    ]
  }
  ```
- **Features:**
  - Fetches all comments for a shared brain
  - Ordered by creation time

---

### 6.7 AI/CHAT ENDPOINTS

#### 6.7.1 Simple Chat (No Context)

- **Endpoint:** `GET /chat`
- **Authentication:** Not required
- **Response:** `200 OK`
  ```json
  {
    "answer": "string (AI-generated response)"
  }
  ```
- **Features:**
  - Test endpoint
  - Uses Gemini AI
  - Hardcoded question: "explain react in simple terms"

---

#### 6.7.2 Chat with User Content (AI-Powered Search)

- **Endpoint:** `POST /chat-ai`
- **Authentication:** Required (JWT token)
- **Request Body:**
  ```json
  {
    "question": "string"
  }
  ```
- **Response:** `200 OK` or `503 Service Unavailable`
  ```json
  {
    "answer": "string (conversational AI response based on user's content)"
  }
  ```
- **Features:**
  - Semantic search through user's saved content
  - Filters stop words (common English words)
  - Ranks results by keyword match count
  - Returns top 5 relevant content items
  - Uses Gemini AI for conversational response
  - Supports markdown formatting
  - Handles service unavailability gracefully

**Algorithm:**

1. Extracts meaningful words from user question
2. Searches through user's content (title, notes, link, type, tags)
3. Scores content based on keyword matches
4. Passes top 5 results to Gemini AI
5. Returns conversational response with proper formatting

**Stop Words Filtered:**

- Common words: "what", "is", "the", "that", "i", "a", "an", "and", "or", "in", "on", "at", "to", "for", "of", "this", "you", "me", "my", "they"

---

### 6.8 SEED ENDPOINT (Testing/Development)

#### 6.8.1 Seed All Content as Public

- **Endpoint:** `PUT /seed`
- **Authentication:** Required (JWT token)
- **Response:** `200 OK`
  ```json
  { "message": "seeded" }
  ```
- **Features:**
  - Updates all user's content to "public"
  - Used for testing/development

---

## 7. MIDDLEWARE & AUTHENTICATION

### 7.1 AuthMiddleware

**File:** `src/middlewares/AuthMiddleware.ts`

**Purpose:** Validates JWT tokens and extracts user ID

**Implementation:**

```typescript
export interface CustomRequest extends Request {
  id?: string;
}

export function AuthMiddleware(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
);
```

**Flow:**

1. Checks for `authorization` header
2. Verifies JWT token signature
3. Extracts user ID from token payload
4. Attaches ID to `req.id` for route handlers
5. Returns 401 error if token missing or invalid

**JWT_SECRET:** From `process.env.JWT_SECRET_USER` or defaults to "thisisactuallyasecret"

---

### 7.2 File Upload Middleware

**File:** `src/middlewares/UploadFile.ts`

**Purpose:** Configures Multer for file uploads

**Implementation:**

- Uses **memory storage** (files stored in RAM, not disk)
- Configured for **single file upload** via `.single("file")`
- Works with content creation endpoint

---

## 8. CONFIGURATION & SETUP

### 8.1 Environment Variables Required

```
MONGODB_URI              # MongoDB connection string
JWT_SECRET_USER          # Secret key for JWT signing
GEMINI_API_KEY          # Google Gemini AI API key
CLOUD_NAME              # Cloudinary cloud name
API_KEY                 # Cloudinary API key
API_SECRET              # Cloudinary API secret
```

### 8.2 Server Configuration

**File:** `src/index.ts`

**Setup:**

- Express server on port **8000**
- CORS enabled (allows cross-origin requests)
- JSON body parser enabled
- All routes prefixed with `/api/v1`

**Start Command:** `npm run dev`

- Compiles TypeScript: `tsc -b`
- Runs compiled JavaScript: `node dist/index.js`

---

### 8.3 Cloudinary Configuration

**File:** `src/config/cloudinary.ts`

**Purpose:** Initializes Cloudinary SDK for file uploads

**Features:**

- Auto-detects resource type
- Returns `secure_url` for uploaded files
- Supports images and media files

---

### 8.4 Gemini AI Configuration

**File:** `src/config/gemini.ts`

**Purpose:** Initializes Google Generative AI

**Model:** `gemini-3.1-flash-lite-preview` (lightweight, fast)

**Usage:**

- Chat responses
- Content-aware AI assistance
- Natural language generation

---

## 9. UTILITY FUNCTIONS

### 9.1 generateHash()

**File:** `src/utils/utils.ts`

```typescript
export function generateHash(length: number) {
  const options =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12345678910";
  let hash = "";
  for (let i = 0; i < length; i++) {
    hash += options[Math.floor(Math.random() * length)];
  }
  return hash;
}
```

**Purpose:** Generates random alphanumeric strings

**Usage:** Creates unique shareable brain links

**Example:** `generateHash(10)` → "aB3xK9mQ2L"

---

### 9.2 UploadFile()

**File:** `src/utils/UploadFile.ts`

```typescript
export const UploadFile = (fileBuffer: Buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(fileBuffer);
  });
};
```

**Purpose:** Uploads file buffer to Cloudinary

**Input:** Binary file buffer from Multer

**Output:** Promise resolving to Cloudinary upload response with `secure_url`

**Usage:** Called when content created with file attachment

---

## 10. VALIDATION & ERROR HANDLING

### 10.1 Zod Schemas Used

#### authSchema

- username: min 3 characters
- password: min 6 characters
- sharedQuote: required string

#### loginSchema

- username: min 3 characters
- password: min 6 characters

#### contentSchema

- title: min 3 characters
- link: valid URL (optional)
- type: string
- notes: optional
- tags: optional array
- imageUrl: required

#### contentUpdateSchema

- All fields optional
- title: min 3 characters if provided
- link: valid URL if provided
- type: optional
- notes: optional
- tags: optional array

#### passUpdateSchema

- oldPassword: min 6 characters
- newPassword: min 6 characters

### 10.2 Error Responses

**Validation Errors:** `400 Bad Request`

```json
{ "errors": "Zod validation error details" }
```

**Authentication Errors:** `401 Unauthorized`

```json
{ "message": "No token provided" }
{ "message": "Invalid token" }
```

**Authorization Errors:** `403 Forbidden`

```json
{ "message": "This brain is not shared." }
```

**Not Found Errors:** `404 Not Found`

```json
{ "message": "Content not found." }
```

**Server Errors:** `500 Internal Server Error`

```json
{ "message": "Server error" }
```

---

## 11. SECURITY FEATURES

1. **Password Hashing:** Bcrypt with salt rounds (10 for signup, 3 for updates - NOTE: inconsistent)
2. **JWT Authentication:** Tokens include user ID, verified on protected routes
3. **User Ownership Verification:** Content operations check userId before execution
4. **Unique Constraints:** Username and tags must be unique
5. **Error Messages:** Generic error messages prevent information leakage
6. **CORS:** Configured to handle cross-origin requests safely

---

## 12. DATA FLOW EXAMPLES

### Example 1: Creating & Sharing Content

```
1. User POST /signup
   ↓ Validates with authSchema
   ↓ Checks username uniqueness
   ↓ Hashes password (bcrypt)
   ↓ Creates UserDocument

2. User POST /signin
   ↓ Validates with loginSchema
   ↓ Retrieves user from DB
   ↓ Compares password
   ↓ Generates JWT token
   ↓ Returns token

3. User POST /content (with JWT)
   ↓ AuthMiddleware validates token
   ↓ Extracts userId from token
   ↓ Multer processes file
   ↓ Uploads file to Cloudinary
   ↓ Gets secure_url
   ↓ Processes tags (create/reference)
   ↓ Creates ContentDocument
   ↓ Response: "Content added"

4. User POST /brain/share (with JWT)
   ↓ Checks if link exists for user
   ↓ If not: generates hash, creates LinkDocument
   ↓ If yes: updates share status
   ↓ Returns: "/brain/{hash}"

5. Anyone GET /brain/{hash}
   ↓ Retrieves LinkDocument by hash
   ↓ Checks if share === true
   ↓ Finds all user's public content
   ↓ Gets user's sharedQuote
   ↓ Returns: content + sharedQuote
```

### Example 2: AI-Powered Search

```
1. User POST /chat-ai { question: "tell me about my saved articles" }
   ↓ AuthMiddleware validates JWT
   ↓ Fetches user's all content
   ↓ Extracts meaningful words from question
   ↓ Filters stop words
   ↓ Scores each content item (keyword matching)
   ↓ Sorts by score, takes top 5
   ↓ Creates prompt with top 5 content
   ↓ Calls Gemini AI
   ↓ Returns conversational response
```

---

## 13. KEY FEATURES SUMMARY

| Feature             | Implementation                            |
| ------------------- | ----------------------------------------- |
| User Authentication | JWT-based, with password hashing (bcrypt) |
| Content Management  | CRUD operations with tag support          |
| File Uploads        | Multer + Cloudinary cloud storage         |
| Public Sharing      | Unique hash-based shareable links         |
| Comments            | Comment system on shared brains           |
| Starring            | Bookmark favorite content                 |
| Search              | Content title search with regex           |
| AI Chat             | Semantic search + Gemini AI responses     |
| Visibility Control  | Public/private content settings           |
| Tag Organization    | Auto-create tags, tag-based filtering     |
| User Profiles       | Username, shared quote, content           |

---

## 14. POTENTIAL IMPROVEMENTS

1. **Security:** Increase bcrypt rounds for password updates from 3 to 10
2. **Error Handling:** More specific error messages and logging
3. **Rate Limiting:** Prevent API abuse
4. **Pagination:** Implement pagination for large content lists
5. **Caching:** Cache frequently accessed data
6. **Input Sanitization:** Sanitize user inputs to prevent XSS
7. **Database Indexes:** Add indexes for common queries
8. **Testing:** Unit and integration tests
9. **API Documentation:** Swagger/OpenAPI documentation
10. **Monitoring:** Error tracking and performance monitoring

---

## 15. DEPLOYMENT CONSIDERATIONS

- **Environment Variables:** Must be set before deployment
- **Database:** MongoDB Atlas or self-hosted MongoDB
- **File Storage:** Cloudinary account for image/file uploads
- **API Keys:** Secure storage of sensitive credentials
- **CORS:** Configure allowed origins for production
- **Port:** Change from 8000 to production port (e.g., 3000, 5000)
- **Process Manager:** Use PM2 or similar for production

---

## 16. TECH STACK VISUALIZATION

```
┌─────────────────────────────────────────────┐
│          Client (Frontend)                   │
│     (React, Vue, Angular, etc.)             │
└──────────────┬──────────────────────────────┘
               │ HTTP/REST
               ↓
┌─────────────────────────────────────────────┐
│       Express.js (API Server)                │
│       Port: 8000                             │
├─────────────────────────────────────────────┤
│ Routes          │ Middleware │ Controllers   │
│ • /signup       │ • Auth     │ • Validation  │
│ • /content      │ • Upload   │ • Logic       │
│ • /star         │ • CORS     │               │
│ • /brain/share  │            │               │
│ • /chat-ai      │            │               │
└──────────┬──────────────────────────┬────────┘
           │                          │
    ┌──────↓──────┐        ┌─────────↓────────┐
    │  MongoDB    │        │   Cloudinary     │
    │  Database   │        │  (File Storage)  │
    │             │        │                  │
    │ • Users     │        │ • Images         │
    │ • Content   │        │ • Documents      │
    │ • Tags      │        │ • Media Files    │
    │ • Links     │        │                  │
    │ • Starred   │        │                  │
    │ • Comments  │        │                  │
    └─────────────┘        └──────────────────┘
           │
    ┌──────↓───────────────────┐
    │   Google Gemini AI API   │
    │   (Chat & Responses)     │
    └──────────────────────────┘
```

---

## 17. PROJECT STATISTICS

- **Total Routes:** 22
- **Database Models:** 6
- **Middleware:** 2
- **Config Files:** 2
- **Utility Functions:** 2
- **Validation Schemas:** 5
- **Authentication Method:** JWT
- **File Storage:** Cloud (Cloudinary)
- **Database:** NoSQL (MongoDB)
- **Language:** TypeScript
- **Framework:** Express.js

---

## 18. CONCLUSION

SecondBrain is a comprehensive, feature-rich backend API for a personal knowledge management platform with the following key capabilities:

- Secure user authentication
- Rich content management with multiple content types
- Advanced search with AI assistance
- Social sharing capabilities
- Cloud-based file storage
- Scalable database design
- Type-safe development with TypeScript

The project demonstrates full-stack backend development skills including database design, REST API implementation, authentication, third-party API integration, and modern JavaScript/TypeScript practices.
