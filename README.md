# VyomXpress

Backend assignment — Node + Express + MySQL + Sequelize, with a Discord bot on the side.

## Stack

- Node.js (ES modules)
- Express
- MySQL + Sequelize
- JWT for auth, bcryptjs for password hashing
- discord.js for the slash commands
- helmet, cors, express-rate-limit for the basics

## Setup

You need Node 18+ and MySQL running locally (or a remote DB you can connect to).

```bash
git clone https://github.com/rahulsinghpharthyal/VyomXpress_backend_project.git
cd vyomxpress
npm install
cp .env.example .env
```

Fill in `.env`:

```
DB_PASSWORD=<your mysql password>
JWT_SECRET=<any random string, at least 32 characters>
DISCORD_BOT_TOKEN=<from discord developer portal>
DISCORD_CLIENT_ID=<your application id>
DISCORD_GUILD_ID=<your test server id — optional but recommended in dev>
```

Create the database:

```sql
CREATE DATABASE vyomxpress;
```

Run migrations to create the tables:

```bash
npm run migrate
```

Register the slash commands with Discord (do this once, and again whenever you change a command):

```bash
npm run bot:deploy
```

## Running

```bash
npm run dev      # with nodemon
# or
npm start
```

Server runs on `http://localhost:3000`. There's a `GET /health` if you want to check it's alive.

## API

Base path: `/api/v1`

### Auth

`POST /auth/signup` — body: `{ username, password, email? }`. Returns `{ user, token }`.
`POST /auth/login` — body: `{ username, password }`. Returns `{ user, token }`.

Passwords are hashed with bcrypt (12 rounds). Duplicate usernames return `409`. Auth routes are rate-limited (10 requests per 15 min per IP).

### Users (requires `Authorization: Bearer <token>`)

`GET /users/me` — returns the current user (based on the token).
`GET /users/:username` — look up any user by username.

See `docs/API.md` for full request/response examples.

## Discord commands

Three slash commands. The bot needs to be invited to a server and the commands registered with `npm run bot:deploy`.

- `/ppcreateuser username password email?` — creates a user (same logic as signup)
- `/ppcreateservice username name description? price?` — adds a service for the given user
- `/ppgetuser username` — fetches a user and their service count

Errors are sent back as ephemeral replies (only visible to the person who ran the command).

## Postman

`docs/postman_collection.json` — import it into Postman. The `baseUrl` variable defaults to `http://localhost:3000/api/v1`. After hitting login, the token is automatically saved into the `token` collection variable, so the user routes just work.

## Project layout

```
src/
  app.js               express app
  server.js            entry — boots http server + discord bot
  config/
    env.js             single source of truth for env vars
    sequelize.js       sequelize instance
    db.cjs             config for sequelize-cli (migrations)
  models/              User, Service
  migrations/          sequelize-cli migrations
  controllers/         thin — req/res only
  services/            business logic, used by both REST and the bot
  repositories/        all the DB calls
  routes/              express routers
  middleware/          jwt auth, error handler
  bot/
    index.js           discord client + interaction handler
    deploy.js          registers slash commands
    commands/          one file per slash command
  utils/               token signer
```

The pattern: controller → service → repository → model. The bot commands skip the controller (there's no HTTP layer) and call the service directly.

## Notes

- Using `bcryptjs` instead of `bcrypt` — pure JS, no native build step, doesn't randomly fail on Windows.
- Migrations use `.cjs` because sequelize-cli still doesn't fully support ESM.
- The bot won't block server startup if its token is missing or invalid — it just logs and the API keeps running.
- `env.js` validates required vars at boot and exits with a clear message if anything's missing, so you don't waste time debugging a misconfigured `.env`.

## Deployment

Deployed on Railway. To deploy yourself:

1. Push the repo to GitHub
2. Create a new project on Railway → deploy from repo
3. Add the MySQL plugin
4. Paste env vars from `.env.example` (Railway exposes MySQL vars automatically, just map them)
5. After first deploy, open the Railway shell and run `npm run migrate`
6. Run `npm run bot:deploy` once to register slash commands

Live URL: `https://vyomxpress-backend-project.onrender.com`
