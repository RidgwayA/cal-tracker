# 🥗 Fullstack Calorie Tracker

A fullstack calorie tracking web app built with TypeScript, React, Express, PostgreSQL, and Docker. Users can register, log in, track meals, set daily calorie goals, and monitor macros.

---

## Features

- JWT-based authentication
- Calorie and macronutrient tracking
- Add and edit meals and food items
- Set and persist daily calorie goals
- View progress by date
- Dockerized backend and frontend

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

Create a `.env` file in the root directory with values referenced in the example.env file

### Installation (Local Dev)

```bash
git clone https://github.com/your-username/fullstack-cal-tracker.git
cd fullstack-cal-tracker
cp .env.example .env
# Add your own values to .env
```

### Running with Docker

```bash
docker-compose up --build
```

- App: http://localhost:4001  
- pgAdmin: http://localhost:8080  
- Frontend Dev (if separate): http://localhost:5173

---





---

## Future Improvements

- Registration/Login security improvements, including token based password reset with email or login via social media
- Admin dashboard to manage users, view logs, and delete spam accounts
- Clean UI and modularize more components 
- Mobile responsiveness
- Barcode scanning for instant food nutrition facts
- Meal templates, being able to save specific meals and add them easily
- Monthly/weekly trends with graphs enhancing goal tracking
- Ability to plan meals and add notes
- AI Meal suggestions based on earlier meals in the day or planned meals

---

## License

MIT — Free to use, modify, and distribute.
