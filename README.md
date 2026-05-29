# VyomXpress

Backend assignment. Node + Express + MySQL + Sequelize, plus a Discord bot.

## Stack

- Node.js (ES modules)
- Express
- MySQL + Sequelize
- JWT auth, bcryptjs for password hashing
- discord.js for the slash commands
- helmet, cors, express-rate-limit

## Setup

Need Node 18+ and MySQL running (local or remote).

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
DISCORD_GUILD_ID=<your test server id, optional but recommended in dev>
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

Server runs on `http://localhost:3000`. There's a `GET /health` to check it's alive.

## API

Base path: `/api/v1`

### Auth

`POST /auth/signup` body: `{ username, password, email? }`. Returns `{ user, token }`.
`POST /auth/login` body: `{ username, password }`. Returns `{ user, token }`.

Passwords are hashed with bcrypt (12 rounds). Duplicate usernames return `409`. Auth routes are rate-limited (10 requests per 15 min per IP).

### Users (requires `Authorization: Bearer <token>`)

`GET /users/me`: returns the current user (based on the token).
`GET /users/:username`: look up any user by username.

See `docs/API.md` for full request/response examples.

## Discord commands

Three slash commands. Bot needs to be invited to a server, then commands registered with `npm run bot:deploy`.

- `/ppcreateuser username password email?`: creates a user (same logic as signup)
- `/ppcreateservice username name description? price?`: adds a service for the given user
- `/ppgetuser username`: fetches a user and their service count

Errors come back as ephemeral replies (only visible to the person who ran the command).

## Postman

`docs/postman_collection.json`. Import it into Postman. The `baseUrl` variable defaults to `http://localhost:3000/api/v1`. After hitting login, the token is saved into the `token` collection variable automatically, so the user routes just work.

## Project layout

```
src/
  app.js               express app
  server.js            entry, boots http server + discord bot
  config/
    env.js             loads and exports env vars
    sequelize.js       sequelize instance
    db.cjs             config for sequelize-cli (migrations)
  models/              User, Service
  migrations/          sequelize-cli migrations
  controllers/         thin, req/res only
  services/            business logic, used by both REST and the bot
  repositories/        DB calls live here
  routes/              express routers
  middleware/          jwt auth, error handler
  bot/
    index.js           discord client + interaction handler
    deploy.js          registers slash commands
    commands/          one file per slash command
  utils/               token signer
```

The pattern: controller -> service -> repository -> model. Bot commands skip the controller (no HTTP layer) and call the service directly.

## Notes

- Using `bcryptjs` instead of `bcrypt` because it's pure JS, no native build step, doesn't randomly fail on Windows.
- Migrations use `.cjs` because sequelize-cli still doesn't fully support ESM.
- The bot won't block server startup if its token is missing or invalid, it just logs and the API keeps running.
- `env.js` checks required vars at boot and exits if anything's missing, saves debugging time later.

## Deployment

Deployed on Render. To deploy yourself:

1. Push the repo to GitHub
2. Create a new project on Render, deploy from repo
3. Add a MySQL database (Render, Railway, PlanetScale, whatever)
4. Paste env vars from `.env.example` into the dashboard
5. After first deploy, run `npm run migrate` from the host's shell
6. Run `npm run bot:deploy` once to register slash commands

Live URL: `https://vyomxpress-backend-project.onrender.com`
