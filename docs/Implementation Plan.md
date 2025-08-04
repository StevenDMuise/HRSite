# My Application Tracker – Implementation Plan

## Core Features (MVP)

- **Secure User Login:** OAuth 2.0 + OIDC federated identity with Google and Microsoft accounts.
- **Job Tracker Dashboard:**
  - Add new job application records with:
    - Company name
    - Job description (text or link)
    - Resume & cover letter (cloud storage link only, not uploaded)
    - Contact info (name, email, phone, LinkedIn URL)
    - Interview notes, outcomes, timestamps
  - Archive functionality for rejected or closed applications.
  - Export feature to download all user data as a JSON file.

## User Stories

### As a user:

- I want to log in using my existing Google or Microsoft account.
- I want to create a new job application entry with links to my resume and cover letter.
- I want to add notes about each conversation or interview.
- I want to log contact information related to each job opportunity.
- I want to archive job applications that are closed or rejected.
- I want to export my entire job application history to a structured JSON file.
- If I’m a free user, I want to view my past submissions but not add new ones.

## Technical Architecture

- **Frontend:**
  - Framework: React (web-first, mobile-ready, possible PWA)
  - Hosting: AWS Amplify or S3 + CloudFront (static site delivery)

- **Backend:**
  - Runtime: Node.js with TypeScript
  - Orchestration: AWS EKS (Elastic Kubernetes Service)
  - API Layer: REST or GraphQL endpoints (to be defined later)

- **Data Storage:**
  - DynamoDB for storing structured job application data
  - User files (resumes, cover letters) are not stored — users provide cloud links

- **Auth:**
  - OAuth 2.0 and OpenID Connect via AWS Cognito or Auth0
  - Federated login with Google and Microsoft

## Roles and Access

- **Trial User:** Full functionality for a limited time.
- **Paid User:** Unlimited access and export features.
- **Free User:** Read-only access to previously entered data.

## Notes for Future Enhancements

- Integration with Glassdoor, LinkedIn APIs for company research
- AI-powered resume review and interview prep (OpenAI GPT API)
- Career roadmap suggestions based on job descriptions
- Mobile-native app (React Native or Flutter) post-MVP
