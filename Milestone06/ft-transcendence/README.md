*This project has been created as part of the 42 curriculum by ktakeru, lchuang, thashimo, ccolin, sykawai.*

# ft_transcendence

## Description

**ft_transcendence** is the final project of the 42 curriculum — a single-page application (SPA) for an online Pong game. The goal is to build a full-stack web application that combines real-time multiplayer gaming, user authentication, social features, and modern web technologies.

### Project Name
**Pong Arena** — An online Pong platform with ranked matches, friend system, and real-time chat.

### Key Features
- **Real-time Pong Game**: Single player (vs AI), local multiplayer, and online multiplayer (random matchmaking or with friends)
- **User Authentication**: Local registration/login, Google OAuth, 2FA (TOTP), email verification, password reset
- **Social Features**: Friend requests, friend list, direct messaging (DM) chat
- **User Profiles**: Profile page, stats, leaderboard, and rating system
- **Internationalization (i18n)**: Multi-language support (Japanese, English, Arabic, Chinese)
- **Admin Panel**: User management and moderation tools
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

---

## Instructions

### Prerequisites

- **Docker** and **Docker Compose** (for containerized development)
- **Make** (for running Makefile commands)
- **Git**

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ft-transcendence
   ```

2. **Create `.env` file**
   ```bash
   make setup
   # or manually: cp .env.example .env
   ```

3. **Generate SSL certificate** (required for HTTPS, used by OAuth and WebSocket):
   ```bash
   make ssl-gen
   ```
   This creates self-signed certificates in `nginx/ssl/`.

4. **Configure `.env`** — Edit `.env` and set:
   - `JWT_SECRET`: Strong secret for JWT (min 32 chars in production)
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` (for Google OAuth)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (optional; if not set, Ethereal is used for dev email testing)
   - The default `.env` uses HTTPS (`https://localhost:8443`). No additional changes needed if using `make ssl-gen`.

### Step-by-Step Execution

(After completing Environment Setup above)

1. **Run database migrations** (first run or after schema changes):
   ```bash
   make migrate
   ```

2. **Start all services**:
   ```bash
   make dev
   ```

3. **Access the application**:
   - **Frontend**: https://localhost:8443
   - **Backend API**: https://localhost:8443/api/health
   - **Socket.io**: wss://localhost:8443/socket.io
   - (Browser will warn about self-signed cert—accept for local dev)

### Makefile Commands

| Command | Description |
|---------|-------------|
| `make setup` | Create .env (if not exists) |
| `make ssl-gen` | Generate self-signed SSL cert for HTTPS (required for first run) |
| `make dev` | Start all services (foreground) |
| `make up` | Start in background |
| `make down` | Stop and remove containers |
| `make logs` | View logs |
| `make migrate` | Create and apply DB migrations |
| `make shell-backend` | Enter backend container |
| `make shell-frontend` | Enter frontend container |
| `make clean` | Stop and remove volumes |

---

## Resources

### Documentation & References

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [i18next](https://www.i18next.com/)
- [Docker Documentation](https://docs.docker.com/)

### AI Usage

AI tools (e.g. Cursor, ChatGPT, Claude) were used for:

- **Debugging**: Analyzing error messages and suggesting fixes
- **Code review**: Providing suggestions during Pull Request (PR) reviews
- **Translation**: Assisting with multilingual content translation

---

## Team Information

| Member | Assigned Role(s) | Responsibilities |
|--------|------------------|------------------|
| ktakeru | Product Owner (PO) | Requirements definition (18 pts), UI design, Privacy/Terms, GDPR compliance |
| lchuang | Project Manager (PM) | Docker/SSL environment, README, i18n implementation, standard login, OAuth (Google), 2FA (TOTP) |
| thashimo | Technical Lead (TL) | Backend/DB architecture (NestJS, Prisma, API structure) |
| ccolin | Developer A | Pong game engine, WebSocket sync, AI opponent, lag handling |
| sykawai | Developer B | User profile, friends/search, game statistics, chat system |

---

## Project Management

### Work Organization

- **Task distribution**: Features and modules were assigned by area (backend, frontend, auth, game, chat, etc.)
- **Meetings**: Regular sync meetings to align on architecture and integration points
- **Code review**: Pull requests reviewed before merge

### Tools

- **Version control**: Git, GitHub
- **Project management**: GitHub Issues
- **Communication**: Discord

---

## Technical Stack

### Frontend

- **React 18** — UI library
- **Vite** — Build tool and dev server
- **Tailwind CSS** — Utility-first CSS framework
- **Zustand** — Lightweight state management
- **React Router** — Client-side routing
- **i18next / react-i18next** — Internationalization (ja, en, ar, zh)
- **Socket.io Client** — Real-time communication

### Backend

- **NestJS** — Node.js framework
- **Socket.io** — Real-time bidirectional communication
- **Prisma** — ORM for database access and migrations
- **Passport** — Authentication (JWT, Google OAuth)
- **bcrypt** — Password hashing
- **Nodemailer** — Email sending
- **Speakeasy / QRCode** — 2FA (TOTP)

### Database

- **PostgreSQL 16** — Relational database
- **Choice rationale**: ACID compliance, strong support for relations (users, friendships, matches, messages), mature ecosystem, good Prisma support

### Other Technologies

- **Docker / Docker Compose** — Containerization
- **Nginx** — Reverse proxy, SSL termination
- **TypeScript** — Used in both frontend and backend

### Major Technical Choices

- **NestJS over Express**: Modular architecture, built-in WebSocket support, dependency injection
- **Prisma over raw SQL**: Type-safe queries, migrations, schema-first design
- **Zustand over Redux**: Simpler API, less boilerplate for small-to-medium app
- **PostgreSQL**: Relational data (users, matches, friendships, messages) fits well

---

## Database Schema

### Entity Relationship Overview

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │───────│ Friendship  │───────│    User     │
│             │       │ (requester) │       │ (addressee) │
└──────┬──────┘       └─────────────┘       └─────────────┘
       │
       │ 1:N
       ├──────────────────────────────────────────────────┐
       │                                                  │
       ▼                                                  ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────────┐
│    Game     │       │   Match     │       │  Conversation   │
│ (player1/2) │       │ MatchPlayer │       │       Message   │
└─────────────┘       └─────────────┘       └─────────────────┘
```

### Tables / Collections

| Table | Key Fields | Purpose |
|-------|------------|---------|
| **User** | id, username, name, email, provider, avatar, wins, losses, rating, twoFactorEnabled, emailVerified | User accounts, stats, auth |
| **Game** | id, player1Id, player2Id, player1Score, player2Score, winnerId, duration, status | Game records |
| **Match** | id, mode, status, startedAt, endedAt | Match sessions |
| **MatchPlayer** | id, matchId, userId, score, isWinner | Match participation |
| **Friendship** | id, requesterId, addresseeId, status (PENDING/ACCEPTED/BLOCKED) | Friend requests and status |
| **Conversation** | id, userAId, userBId | DM conversations |
| **Message** | id, conversationId, senderId, body, createdAt | Chat messages |

### Enums

- **GameStatus**: IN_PROGRESS, COMPLETED, ABANDONED
- **MatchMode**: SINGLE_PLAYER, LOCAL_MULTIPLAYER, ONLINE_MULTIPLAYER
- **MatchStatus**: IN_PROGRESS, FINISHED, ABANDONED
- **FriendshipStatus**: PENDING, ACCEPTED, BLOCKED

---

## Features List

### IV.1 Web

| Type | Requirement | Points | Owner |
| :--- | :--- | :--- | :--- |
| Major | Use a framework for both the frontend and backend (React, Vue, Express, NestJS, etc.). | 2 | All |
| Minor | Use a frontend framework (React, Vue, Angular, Svelte, etc.). | 1 | All |
| Minor | Use a backend framework (Express, Fastify, NestJS, Django, etc.). | 1 | All |
| Major | **Implement real-time features using WebSockets or similar technology:** <br>• Real-time updates across clients. <br>• Handle connection/disconnection gracefully. <br>• Efficient message broadcasting. | 2 | ccolin, sykawai |
| Major | **Allow users to interact with other users:** <br>• A basic chat system. <br>• A profile system (view user information). <br>• A friends system (add/remove friends, see friends list). | 2 | sykawai, ktakeru |
| Major | **A public API** with secured API key, rate limiting, documentation, and at least 5 endpoints (GET, POST, PUT, DELETE). | 2 | thashimo |

### IV.2 Accessibility and Internationalization

| Type | Requirement | Points | Owner |
| :--- | :--- | :--- | :--- |
| Minor | **Support for multiple languages (at least 3 languages):** <br>• Implement i18n system. <br>• Language switcher in the UI. <br>• All user-facing text must be translatable. | 1 | lchuang, ktakeru |
| Minor | **Right-to-left (RTL) language support:** <br>• Support for at least one RTL language (Arabic, Hebrew, etc.). <br>• Complete layout mirroring and UI adjustments. | 1 | lchuang |

### IV.3 User Management

| Type | Requirement | Points | Owner |
| :--- | :--- | :--- | :--- |
| Major | **Standard user management and authentication:** <br>• Update profile info / Upload avatar. <br>• Add friends and see **online status**. <br>• Profile page displaying information. | 2 | ktakeru, sykawai |
| Minor | **Game statistics and match history:** <br>• Track wins, losses, ranking. <br>• Display match history (1v1 dates, results). <br>• Leaderboard integration. | 1 | sykawai |
| Minor | Implement remote authentication with OAuth 2.0 (Google, GitHub, 42, etc.). | 1 | lchuang |

### IV.4 Artificial Intelligence

| Type | Requirement | Points | Owner |
| :--- | :--- | :--- | :--- |
| Major | **Introduce an AI Opponent for games:** <br>• Challenging but simulates human-like behavior. <br>• Compatible with game customization options. <br>• Must be able to explain implementation during evaluation. | 2 | ccolin |

### IV.6 Gaming and user experience

| Type | Requirement | Points | Owner |
| :--- | :--- | :--- | :--- |
| Major | **Implement a complete web-based game (e.g., Pong, Chess):** <br>• Real-time multiplayer live matches. <br>• Clear rules and win/loss conditions. | 2 | ccolin, ktakeru |
| Major | **Remote players:** <br>• Enable two players on separate computers in real-time. <br>• Handle network latency and reconnection logic. | 2 | ktakeru |

### IV.8 Data and Analytics

| Type | Requirement | Points | Owner |
| :--- | :--- | :--- | :--- |
| Major | **Data export and import functionality:** <br>• Multiple formats (JSON, CSV, XML). <br>• Validation and bulk operations support. | 2 | thashimo |
| Minor | **GDPR compliance features:** <br>• Allow users to request/delete their data. <br>• Export user data in a readable format. | 1 | thashimo |

-----

**Total Points: 25**
### Other

| Feature | Pts | Assignee | Description |
|---------|-----|----------|-------------|
| README | — | lchuang | Fulfill all README requirements |
| Docker & SSL/TLS | — | lchuang | Full environment, HTTPS setup |
| Privacy & Terms | — | ktakeru | Privacy Policy, Terms of Service |
| UI design | — | ktakeru | Screen flows, UI design |

---

## Modules (Point Summary)

| Category | Module | Pts | Assignee |
|----------|--------|-----|----------|
| **IV.1 Web** | Frontend + Backend frameworks | 4–6 | All |
| | Real-time WebSocket | 2 | ccolin |
| | Chat system | 2 | sykawai |
| | Profile system | 2 | ktakeru |
| | Friends system | 2 | sykawai |
| | Public API | 2 | thashimo |
| **IV.2** | i18n (3+ languages) | 1 | lchuang |
| | RTL support | 1 | lchuang |
| **IV.3** | Avatar upload | 2 | ktakeru |
| | Match history | 1 | sykawai |
| | OAuth 2.0 | 1 | lchuang |
| **IV.4** | AI opponent | 2 | ccolin |
| **IV.6** | Real-time multiplayer | 2 | ccolin |
| | Remote players | 2 | ccolin |
| **IV.8** | Data export/import | 2 | thashimo |
| | GDPR compliance | 1 | thashimo |

**Point calculation**: Major = 2pts, Minor = 1pt. **Total: 25 points** .


---

## Individual Contributions

### ktakeru (Product Owner)

- **Contributions**: 18-point requirements definition and final progress confirmation; screen transition diagrams and UI design; Privacy Policy and Terms of Service; GDPR compliance (data download, account deletion)
- **Challenges**: Aligning requirements across modules, ensuring UI consistency with design specs
- **Solutions**: Clear requirement checklists, design specifications, structured legal page content

### lchuang (Project Manager)

- **Contributions**: Docker Compose setup for Frontend, Backend, and DB; SSL/TLS (HTTPS) configuration with self-signed certificates; README.md creation and maintenance (roles, startup instructions); i18n implementation (Japanese, English, Arabic, Chinese); standard login (password hashing, validation); OAuth with Google; 2FA (TOTP, Google Authenticator–compatible)

- **Challenges**: Environment parity across dev machines; HTTPS setup for OAuth callbacks; OAuth callback handling; 2FA flow integration

- **Solutions**: Single make dev workflow; documented SSL generation steps; language switcher with i18next; Passport strategy for Google OAuth; Speakeasy for TOTP

### thashimo (Technical Lead)

- **Contributions**: Backend and database architecture design and technology selection; NestJS module layout; Prisma schema and migrations; ER diagram and data modeling; integration with auth and game modules
- **Challenges**: Consistent API patterns, database schema evolution, coordinating backend features with frontend and real-time layers
- **Solutions**: Layered NestJS structure, Prisma as single source of truth for the schema, clear service boundaries

### ccolin (Developer A)

- **Contributions**: Pong game engine (physics, collision detection); WebSocket-based remote multiplayer sync; single-player AI (CPU) opponent; lag handling (client-side prediction)
- **Challenges**: Real-time game state sync, matchmaking logic, network latency
- **Solutions**: Socket.io for events, shared state types between frontend and backend, client-side prediction for smoother gameplay

### sykawai (Developer B)

- **Contributions**: User profile (including avatar upload); user interaction (friend add/remove, user search); game statistics (wins, losses, history, rank) stored and displayed; chat system (in-game chat, DM)
- **Challenges**: Real-time chat updates, friend request flow, statistics aggregation
- **Solutions**: Socket.io for chat, Friendship model for status, Prisma for stats queries

---

## Additional Information

### Email Verification (Development)

When `SMTP_HOST` is not set, the app uses **Ethereal** (fake SMTP). Check backend logs for the Ethereal login URL to view test emails.

### License

This project is part of the 42 curriculum. See your school’s policy for usage and distribution.
