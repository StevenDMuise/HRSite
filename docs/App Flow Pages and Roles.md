# My Application Tracker – App Flow, Pages, and Roles

## App Navigation Flow

1. **Login / Signup Page**
   - Federated login with Google or Microsoft
   - Redirects to dashboard on success

2. **Dashboard Page**
   - View list of all job applications
   - Quick stats (e.g., active vs. archived)
   - Buttons to add new application or export data

3. **Add/Edit Job Application Page**
   - Form to input:
     - Company name
     - Job description (paste or link)
     - Resume & cover letter (URL only)
     - Job post link
     - Date of application
   - Option to save as draft or submit

4. **Contact / Note Page (per Application)**
   - Add recruiter or hiring manager info:
     - Name, phone, email, LinkedIn URL
   - Add conversation or note entries with timestamp

5. **Interview Details Page (per Application)**
   - Add interview date, time, interviewer name(s)
   - Notes and outcomes for each interview

6. **Archive View Page**
   - Display all archived (rejected or closed) applications
   - Option to move items back to active list if needed

7. **Export Page**
   - One-click download of full job search record as JSON
   - Visible to trial and paid users only

8. **Account/Profile Page**
   - Displays user status (Trial, Paid, Free)
   - Upgrade prompt for free users
   - Trial countdown, if applicable

## User Roles and Access

### Trial User
- Full access to all features
- Limited time (e.g., 30 days)
- Export feature enabled

### Paid User
- Unlimited access
- Export feature enabled

### Free User
- Read-only access
- No export capability
- Prompt to upgrade for full functionality
