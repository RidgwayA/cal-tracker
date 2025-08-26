# 🥗 Fullstack Calorie Tracker

A fullstack calorie tracking web app built with TypeScript, React, Express, PostgreSQL, and Docker. Users can register, log in, track meals, set daily calorie goals, and monitor macros.

---

## Features

- **Authentication**
  - JWT-based auth with secure password requirements
  - Password reset functionality with email tokens
  - Real-time password validation with visual indicators
  - Rate limiting for security
  
- **Nutrition Tracking**
  - Calorie and macronutrient tracking
  - Add and edit meals and food items
  - Set and persist daily calorie and protein goals
  - View progress by date
  
- **Modern UI/UX**
  - Clean, responsive design with gradient backgrounds
  - Real-time form validation feedback
  - Loading states and error handling
  - Consistent design system across all screens
  
- **Production Ready**
  - Dockerized backend and frontend
  - Input validation and sanitization
  - Security middleware and CORS protection

---

## Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **Auth:** JWT
- **Containerization:** Docker + Docker Compose

---

## Getting Started

### Prerequisites

- Docker & Docker Compose installed

## Environment Variables

### Installation

```bash
git clone https://github.com/your-username/fullstack-cal-tracker.git
cd fullstack-cal-tracker
cp example.env .env
# Edit .env with your actual values
```

**Required Variables:**
- `DB_*` - PostgreSQL database credentials
- `JWT_SECRET` - Secret key for JWT tokens (make it long and random)
- `GMAIL_*` - Gmail SMTP settings for password reset emails
- `EMAIL_FROM` - Email address for outgoing messages
- `PGADMIN_*` - pgAdmin web interface credentials
- `CLOUDFLARE_TUNNEL_TOKEN*` - your cloudflare tunnel token

**Gmail Setup for Password Reset:**
1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password" (not your regular password)
3. Use the app password in `GMAIL_APP_PASSWORD`



### Running with Docker

docker-compose up --build (Local docker container for devlopment)
- App: http://localhost:4001  
- pgAdmin: http://localhost:8080  
- Frontend Dev (Testing wiht npm run dev): http://localhost:5173

docker-compose --profile production up -d
- App: https://[yoursubdomain].[yourdomain.com]

## Recent Improvements
  - Enhanced password security with 8-character minimum and complexity requirements      
  - Token-based password reset functionality with email
  - Real-time password validation with visual indicators
  - Redesigned UI with consistent styling across auth screens

## Future Improvements

  - Social media login integration (Google, Facebook, etc)
  - Admin dashboard to manage users, view logs, and delete spam accounts
  - Mobile responsiveness
  - Barcode scanning for instant food nutrition facts
  - Meal templates, being able to save specific meals and add them easily
  - Monthly/weekly trends with graphs enhancing goal tracking
  - Ability to plan meals and add notes
  - AI Meal suggestions based on earlier meals in the day or planned meals

## License

MIT — Free to use, modify, and distribute.
