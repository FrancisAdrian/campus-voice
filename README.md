# Campus Voice

Campus Voice is a school feedback and suggestion management system built for a campus environment. It allows students and staff to submit concerns, suggestions, or issues, track their status using a unique code, and let assigned staff members respond and resolve them.

The app is designed for a simple and practical workflow:
- Students can submit feedback anonymously or as themselves.
- Staff members log in by role.
- Admins manage users and review all submissions.
- Guidance staff handle safety and well-being related issues.
- Reports and dashboard summaries help monitor campus concerns.

## Features

- Public feedback and suggestion form
- Anonymous or named submissions
- Automatic tracking code for every submission
- Status tracking page using the generated code
- Role-based login for admin, guidance, student, and teacher accounts
- Admin dashboard with filtering and search
- Guidance dashboard for relevant categories
- Response and resolution workflow for staff
- User management with active/inactive toggling
- Audit log for actions taken on feedback items
- Summary reports by category and status

## Tech Stack

- Node.js
- Express.js
- EJS templates
- SQLite database via better-sqlite3
- bcrypt for password hashing
- express-session for authentication

## Project Structure

```text
campus-voice/
├── app.js
├── config/
│   └── db.js
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   └── feedbackController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── feedbackModel.js
│   └── userModel.js
├── public/
│   ├── css/
│   └── js/
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── feedbackRoutes.js
│   └── reportRoutes.js
├── views/
│   ├── admin-dashboard.ejs
│   ├── error.ejs
│   ├── feedback-details.ejs
│   ├── home.ejs
│   ├── login.ejs
│   ├── reports.ejs
│   ├── student-dashboard.ejs
│   ├── submit.ejs
│   ├── success.ejs
│   ├── track.ejs
│   ├── users.ejs
│   └── partials/
├── campus.db
├── package.json
├── LICENSE
└── README.md
```

## Roles and Access

- Student: can submit feedback and view their own submissions
- Teacher: same general access as student in the app workflow
- Admin: manages users and reviews all campus feedback
- Guidance: reviews safety and well-being concerns assigned to that role

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the application:

```bash
npm start
```

3. Open the app in your browser:

```text
http://localhost:3000
```

## Environment Setup

The app will run with default settings, but you may optionally create a `.env` file with values such as:

```env
SESSION_SECRET=your-secret-key
PORT=3000
DB_FILE=campus.db
```

## Demo Accounts

The database seeds demo accounts automatically on first run. You can use the following login credentials:

- Admin: `admin@school.edu` / `password123`
- Guidance: `guidance@school.edu` / `password123`
- Student: `student@school.edu` / `password123`
- Teacher: `teacher@school.edu` / `password123`

## Main Routes

- `/` - Home page
- `/submit` - Submit feedback or suggestion
- `/track` - Track a submission by code
- `/login` - Staff login
- `/admin/dashboard` - Admin dashboard
- `/guidance/dashboard` - Guidance dashboard
- `/admin/users` - Manage users
- `/reports` - Reports overview

## Notes

- Feedback categories include academics, facilities, safety, bullying/well-being, teacher concerns, canteen, extracurriculars, and general suggestions.
- Safety and well-being items are routed to guidance by default.
- Anonymous submissions are stored without linking a user ID to protect identity.
- The app uses SQLite with WAL mode for persistent local data storage.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

