# PRD V4: PaperSpec TDS Manager (Comprehensive)

## 1. Introduction
**Product Name**: PaperSpec TDS Manager
**Purpose**: An AI-powered decision-support tool to archive, search, filter, and visually compare Technical Data Sheets (TDS) of paper stock.
**Goals**:
- Enable users to quickly find the optimal paper specification.
- Reduce purchasing costs through data-driven comparison.
- Accumulate organizational knowledge on paper specifications.
**Target Audience**: Paper Purchasing Managers, Sales Managers, Print Planners.
**Language Requirement**: The UI text must be entirely in Korean. (Code variables/comments in English).

## 2. User Stories
- **Purchasing Manager**: "I want to filter papers by specific 'Whiteness' and 'Stiffness' levels to find the most cost-effective option that meets my client's quality standards."
- **Sales Manager**: "I want to show a client a visual chart comparing our product against a competitor's product to prove our quality advantage."
- **Admin**: "I want the system to automatically extract specs from PDF files so I don't have to manually type data for hundreds of products."

## 3. Tech Stack & Architecture
- **Frontend**: Next.js (App Router), Tailwind CSS, Shadcn/UI.
- **Visualization**: Recharts (Must support Parallel Coordinates, Bar Charts, and Scatter Plots).
- **Backend**: Supabase (PostgreSQL, Auth, Storage).
- **AI Engine**: OpenAI GPT-4o (via Supabase Edge Functions) for OCR & Data Standardization.

## 4. Functional Requirements

### 4.1. Search & Filtering (Enhanced)
- **Search**: Partial text search by Manufacturer and Product Name.
- **Basic Filters**: Dropdowns for Manufacturer, Classification.
- **Technical Filters (Range Sliders)**:
    - Basis Weight ($g/m^2$)
    - Whiteness (CIE)
    - Smoothness (Bekk)
    - Thickness ($\mu m$)

### 4.2. Automated TDS Data Processing (The "Auto Update" Workflow)
- **Trigger**: Admin uploads a PDF file.
- **AI Process**: The system automatically OCRs the text and standardizes units (ISO) using GPT-4o.
- **Normalization Logic**:
    - Split Rows: If one PDF contains multiple grammages (e.g., 80g, 100g), split them into distinct database entries.
    - Null Handling: Auto-fill missing values with 0 or null.
- **Verification**: Extracted data enters a "Draft" state. Admin reviews and clicks "Approve" to publish (ensuring data integrity).

### 4.3. Visual Comparison Suite
- **Parallel Coordinates Chart (Core)**: Visualizes multi-dimensional specs (Thickness vs. Whiteness vs. Cost) on a single graph.
- **Additional Chart Types**:
    - Bar Chart: For direct side-by-side comparison of a single attribute (e.g., Opacity of 5 selected papers).
    - Scatter Plot: For analyzing correlations (e.g., Basis Weight vs. Stiffness).
- **Customizable Axes**: Users must be able to toggle specific axes on/off to focus on relevant criteria (e.g., hide "Tensile Strength" to focus only on "Whiteness").

## 5. Database Schema (Paper-Specific)
To ensure the app works for the paper business, these columns are mandatory:
- `id` (UUID)
- `manufacturer` (Text)
- `product_name` (Text)
- `basis_weight` (Int) - $g/m^2$
- `thickness` (Int) - $\mu m$
- `whiteness` (Float) - CIE Whiteness (ISO 11475)
- `smoothness` (Float) - Bekk (ISO 5627)
- `cobb_value` (Float) - Cobb 60 (Water absorption)
- `tensile_strength_md` / `_cd` (Float) - $kN/m$
- `tearing_strength_md` / `_cd` (Float)
- `extra_specs` (JSONB) - For flexible data storage.
- `tds_file_url` (Text)

## 6. Non-Functional Requirements
- **Performance**: Search results and chart rendering must load within 2 seconds.
- **Security**: Only authenticated users (Admin approved) can access the data.
- **Responsive**: Full functionality on Desktop and Tablet (Mobile view supports Search/List, heavy charts optimized for Desktop).

## 7. UI/UX Specifications (Korean UI)
### 7.1. Dashboard (Main)
- **Layout**: Search Bar (Top) + Filter Sidebar (Left) + Results Table (Center).
- **Interaction**: Clicking a checkbox on the table adds the item to the "Comparison Cart" (Floating Widget).

### 7.2. Comparison Workspace
- **Controls**:
    - Chart Selector: Buttons to switch between [Parallel Analysis] | [Bar Comparison] | [Scatter Plot].
    - Axis Toggles: Checkboxes to Show/Hide specific spec axes.
- **Visuals**: Distinct colors for each paper product. Tooltips show exact values on hover.

## 8. AI System Prompt (For Development)
Use this prompt logic for the AI Agent:
"You are an expert Paper Engineer.
Extract & Standardize: Parse the PDF. Convert 'Brightness' to 'CIE Whiteness' if possible. Convert 'Smoothness' to 'Bekk (sec)'. Convert all strength metrics to ISO standard units.
Handle Multi-spec Docs: If the table lists specifications for 80g, 100g, and 120g, return a JSON array with three distinct objects.
Missing Data: Return null for missing fields. Do not hallucinate values."
