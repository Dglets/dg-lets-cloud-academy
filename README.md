# ☁️ DG-LETS Cloud Academy

A professional cloud training platform for student enrollment, startup partnerships, and cloud education content.

---

## 📁 Project Structure

```
dg-lets-cloud-academy/
├── frontend/                  # React + Tailwind CSS
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── FormField.jsx
│   │   │   └── Alert.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Program.jsx
│   │   │   ├── Enroll.jsx
│   │   │   ├── Partner.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── NotFound.jsx
│   │   ├── hooks/
│   │   │   └── useForm.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env
│
├── backend/                   # Node.js + Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── dynamodb.js
│   │   ├── controllers/
│   │   │   ├── enrollmentController.js
│   │   │   ├── partnershipController.js
│   │   │   ├── blogController.js
│   │   │   ├── contactController.js
│   │   │   └── adminController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── validate.js
│   │   ├── routes/
│   │   │   ├── enrollments.js
│   │   │   ├── partnerships.js
│   │   │   ├── blogs.js
│   │   │   ├── contacts.js
│   │   │   └── admin.js
│   │   └── index.js
│   ├── lambda.js              # Lambda handler wrapper
│   ├── package.json
│   └── .env
│
└── infrastructure/
    ├── cloudformation.yml     # Full AWS stack definition
    ├── setup-dynamodb.js      # DynamoDB table creation script
    └── lambda-deps.txt
```

---

## 🗄️ Database Schema (DynamoDB)

### `dg-lets-enrollments`
| Field           | Type   | Description                          |
|-----------------|--------|--------------------------------------|
| id              | String | UUID (Partition Key)                 |
| fullName        | String | Student full name                    |
| email           | String | Email address                        |
| phone           | String | Phone number                         |
| experienceLevel | String | beginner / intermediate / advanced   |
| preferredDate   | String | Preferred program start date         |
| status          | String | pending / approved / rejected        |
| createdAt       | String | ISO timestamp                        |

### `dg-lets-partnerships`
| Field               | Type   | Description              |
|---------------------|--------|--------------------------|
| id                  | String | UUID (Partition Key)     |
| companyName         | String | Company name             |
| website             | String | Company website URL      |
| contactPerson       | String | Contact person name      |
| email               | String | Contact email            |
| partnershipInterest | String | Type of partnership      |
| message             | String | Additional message       |
| status              | String | pending / active         |
| createdAt           | String | ISO timestamp            |

### `dg-lets-blogs`
| Field     | Type    | Description          |
|-----------|---------|----------------------|
| id        | String  | UUID (Partition Key) |
| title     | String  | Post title           |
| content   | String  | Full post content    |
| excerpt   | String  | Short summary        |
| category  | String  | Post category        |
| published | Boolean | Visibility flag      |
| createdAt | String  | ISO timestamp        |

### `dg-lets-contacts`
| Field     | Type   | Description          |
|-----------|--------|----------------------|
| id        | String | UUID (Partition Key) |
| name      | String | Sender name          |
| email     | String | Sender email         |
| subject   | String | Message subject      |
| message   | String | Message body         |
| createdAt | String | ISO timestamp        |

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- AWS account with DynamoDB access (or use AWS Free Tier)
- AWS CLI configured (`aws configure`)

### 1. Clone and install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

**Backend** — edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
DYNAMODB_ENROLLMENTS_TABLE=dg-lets-enrollments
DYNAMODB_PARTNERSHIPS_TABLE=dg-lets-partnerships
DYNAMODB_BLOGS_TABLE=dg-lets-blogs
DYNAMODB_CONTACTS_TABLE=dg-lets-contacts
JWT_SECRET=<min-32-char-secret>
ADMIN_EMAIL=admin@dg-lets.com
ADMIN_PASSWORD=<your-password>
```

**Frontend** — edit `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Create DynamoDB tables

```bash
cd infrastructure
npm install @aws-sdk/client-dynamodb dotenv
node setup-dynamodb.js
```

### 4. Start the servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm start
```

Frontend: http://localhost:3000  
Backend API: http://localhost:5000/api  
Admin Dashboard: http://localhost:3000/admin

---

## ☁️ Deploying to AWS

### Architecture Overview
```
Users → CloudFront → S3 (React App)
Users → CloudFront → API Gateway → Lambda → DynamoDB
```

---

### Step 1: Deploy Infrastructure with CloudFormation

```bash
aws cloudformation deploy \
  --template-file infrastructure/cloudformation.yml \
  --stack-name dg-lets-cloud-academy \
  --parameter-overrides \
    JwtSecret=<your-jwt-secret> \
    AdminEmail=admin@dg-lets.com \
    AdminPassword=<your-password> \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1
```

Get outputs (S3 bucket name, API URL, CloudFront URL):
```bash
aws cloudformation describe-stacks \
  --stack-name dg-lets-cloud-academy \
  --query "Stacks[0].Outputs"
```

---

### Step 2: Deploy Backend to Lambda

```bash
cd backend

# Install Lambda adapter
npm install serverless-http

# Package the app
zip -r ../lambda-package.zip . -x "*.env" -x "node_modules/.cache/*"

# Upload to Lambda
aws lambda update-function-code \
  --function-name dg-lets-api \
  --zip-file fileb://../lambda-package.zip \
  --region us-east-1
```

> **Note:** Update `backend/src/index.js` to export `module.exports = app;` at the bottom for Lambda compatibility.

---

### Step 3: Deploy Frontend to S3 + CloudFront

```bash
cd frontend

# Set production API URL (use your API Gateway URL from Step 1 outputs)
echo "REACT_APP_API_URL=https://<api-id>.execute-api.us-east-1.amazonaws.com/api" > .env.production

# Build
npm run build

# Upload to S3 (replace with your bucket name from CloudFormation outputs)
aws s3 sync build/ s3://dg-lets-cloud-academy-frontend-production --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id <your-distribution-id> \
  --paths "/*"
```

---

### Step 4: Access Your Live Platform

- **Frontend:** `https://<cloudfront-domain>.cloudfront.net`
- **API:** `https://<api-id>.execute-api.us-east-1.amazonaws.com`
- **Admin:** `https://<cloudfront-domain>.cloudfront.net/admin`

---

## 🔐 API Endpoints

| Method | Endpoint                | Auth     | Description                  |
|--------|-------------------------|----------|------------------------------|
| POST   | /api/enrollments        | Public   | Submit enrollment            |
| GET    | /api/enrollments        | Admin    | List all enrollments         |
| POST   | /api/partnerships       | Public   | Submit partnership request   |
| GET    | /api/partnerships       | Admin    | List all partnerships        |
| GET    | /api/blogs              | Public   | List published blog posts    |
| GET    | /api/blogs/:id          | Public   | Get single blog post         |
| POST   | /api/blogs              | Admin    | Create blog post             |
| DELETE | /api/blogs/:id          | Admin    | Delete blog post             |
| POST   | /api/contacts           | Public   | Submit contact message       |
| GET    | /api/contacts           | Admin    | List all contact messages    |
| POST   | /api/admin/login        | Public   | Admin login → returns JWT    |
| GET    | /api/health             | Public   | Health check                 |

---

## 🔮 Future Improvements

| Feature                    | Description                                                        |
|----------------------------|--------------------------------------------------------------------|
| **Student Dashboard**      | Personal portal for enrolled students to track progress            |
| **Payment Integration**    | Paystack or Flutterwave for enrollment fees                        |
| **Video Course Hosting**   | AWS S3 + CloudFront for video delivery, or integrate with Vimeo   |
| **Certification Tracking** | Issue and verify digital certificates on course completion         |
| **Email Notifications**    | AWS SES for enrollment confirmations and admin alerts              |
| **Blog CMS**               | Rich text editor (TipTap/Quill) for admin blog publishing          |
| **Search**                 | Full-text search across blog posts using OpenSearch                |
| **Analytics**              | AWS CloudWatch + custom dashboard for platform metrics             |
| **Custom Domain**          | Route 53 + ACM SSL certificate for branded domain                  |
| **Multi-cohort Support**   | Manage multiple program cohorts with scheduling                    |

---

## 🛡️ Security Notes

- JWT tokens expire in 24 hours — rotate `JWT_SECRET` regularly
- Never commit `.env` files — add to `.gitignore`
- Use AWS IAM roles with least-privilege access in production
- Enable AWS WAF on CloudFront for DDoS protection
- Store `ADMIN_PASSWORD` as a bcrypt hash in production

---

Built with ☁️ on AWS | DG-LETS Cloud Academy
