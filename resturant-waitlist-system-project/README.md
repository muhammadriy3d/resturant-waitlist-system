# Restaurant Waitlist System

A small restaurant waitlist application for guest check-in and staff monitoring.

## Overview

This project lets customers join a restaurant line without needing a host to manually track names. The guest fills in their name and party size, then receives a ticket number and can check how many parties are ahead.

Staff members can log in to a secure dashboard to view the current waiting parties.

## Features

- Guest registration form for the waitlist
- Ticket number generation for each party
- Position tracking for guests waiting in line
- Staff login page with protected dashboard
- SQLite database storage for waitlist records

## Tech stack

- Next.js
- React + TypeScript
- SQLite
- JWT authentication

## Project structure

The project follows Next.js feature-based folder organization ("Split project files by feature or route"):

- `app/_components/` — globally shared UI components (`Button`, `Card`)
- `app/_lib/` — globally shared utilities (`cn`)
- `app/waitlist/` — waitlist feature (pages, `_actions`, `_components`, `_lib`)
- `app/staff/` — staff feature (dashboard, login, `_actions`, `_lib`)
- `app/api/` — API route handlers
- `database/` — SQLite connection, migrations, and repository layer

## Setup

Use Node.js 18 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000

## Environment variables

Copy the values from `.env.example` and update them before running the app.

- `STAFF_NAME` — display name shown in the staff area
- `STAFF_USERNAME` — staff login username
- `STAFF_PASSWORD` — staff login password
- `JWT_SECRET` — secret key for JWT tokens (minimum 32 characters)

Important: change the default login credentials before using this app in a real environment.

## Staff login

Default staff login is:

- Username: `staff`
- Password: set in `STAFF_PASSWORD`

The login page is available at `/staff/login`.

## Database

The app uses SQLite and stores data in `database/data/waitlist.sqlite` by default. Schema setup is handled by the migration files in `database/migrations/sqlite/`.

## Usage

1. Open the home page and go to the waitlist form.
2. Enter your name and party size.
3. Submit the form to receive a ticket.
4. View your waiting position on the results page.
5. Log in as staff to see all active waiting parties.

## Notes

This is a lightweight MVP intended for local development or demo use. For production, you would typically move to a more robust database and add additional operational safeguards.