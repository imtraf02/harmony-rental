# Harmony Wedding Rental

A modern, high-performance Wedding Rental Management System built with a focus on speed, reliability, and local-first desktop/mobile capabilities.

## 🚀 Overview

Harmony Wedding Rental is a monorepo project designed to manage wedding rental inventories, customers, and orders. It leverages a powerful GraphQL backend and a responsive cross-platform frontend.

## 🏗️ Project Structure

The project is organized as a monorepo using **Bun**:

- `client/`: A [Tauri 2](https://v2.tauri.app/) desktop/mobile application built with React and Vite.
- `server/`: A [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server) API backend powered by Prisma and PostgreSQL.
- `tools/`: Utility scripts and tools.
- `shell.nix`: Nix environment configuration for reproducible development across Linux, macOS, and Windows (via MingW).

## 🛠️ Technology Stack

### Client
- **Framework:** [React 19](https://react.dev/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Desktop/Mobile Shell:** [Tauri 2.0](https://v2.tauri.app/)
- **Routing:** [TanStack Router](https://tanstack.com/router)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching:** [Apollo Client](https://www.apollographql.com/docs/react/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Form Management:** [TanStack Form](https://tanstack.com/form)

### Server
- **Runtime:** [Bun](https://bun.sh/)
- **API Engine:** [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server)
- **Schema Builder:** [Pothos GraphQL](https://pothos-graphql.dev/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL (with Supabase integration capabilities)
- **Validation:** [Zod](https://zod.dev/)

## 🚦 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (Primary runtime and package manager)
- [Nix](https://nixos.org/) (Optional, but recommended for development environment consistency)
- [Rust](https://www.rust-lang.org/) (Required for Tauri builds)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd harmony-wedding-rental
   ```
2. Install dependencies:
   ```bash
   bun install
   ```

### Development

#### Server
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Set up your environment:
   - Create a `.env` file based on `.env.example`.
3. Initialize the database:
   ```bash
   bun db:migrate
   bun db:seed
   ```
4. Start the development server:
   ```bash
   bun dev
   ```

#### Client
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Start the Vite development server (Web):
   ```bash
   bun dev
   ```
3. Run the Tauri development environment (Desktop):
   ```bash
   bun tauri:dev
   ```

## 📜 Core Business Logic
The system manages:
- **Inventory:** Products, variants (size/color), and individual items/codes.
- **Customers:** Client contact details and rental history.
- **Orders:** Full rental lifecycle (Booking, Pickup, Return, Cancellation).
- **Maintenance:** Tracking item repairs and status.
- **Payments:** Deposit and balance tracking.

## 🛠️ Tools & Lints
- **Linting & Formatting:** [Biome](https://biomejs.dev/) is used across the project.
- **Codegen:** GraphQL introspection and TypeScript type generation for the client.

---
*Created with ❤️ for Harmony Wedding Rental management.*
