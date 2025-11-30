# PaperSpec TDS Manager

AI-powered decision-support tool to archive, search, filter, and visually compare Technical Data Sheets (TDS) of paper stock.

## Features

- **Dashboard**: Search and filter paper specifications by Manufacturer, Basis Weight, Whiteness, etc.
- **Visual Comparison**: Compare papers using Parallel Coordinates, Bar Charts, and Scatter Plots.
- **AI-Powered Data Entry**: Automatically extract specifications from PDF files using OpenAI GPT-4o.
- **Korean UI**: Fully localized interface for Korean users.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Shadcn/UI
- **Charts**: Recharts
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **AI**: OpenAI GPT-4o

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase Account

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/paper-tds-database.git
    cd paper-tds-database
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Copy `.env.local.example` to `.env.local` and add your Supabase credentials.
    ```bash
    cp .env.local.example .env.local
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

Run the SQL commands in `supabase/schema.sql` in your Supabase SQL Editor to set up the database schema.

## License

[MIT](LICENSE)
