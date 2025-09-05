# Flex Living - Reviews Dashboard

This project is a comprehensive reviews management system built for Flex Living. It provides a modern dashboard for property managers to analyze guest feedback, manage review visibility, and monitor property performance. It also includes public-facing pages to display approved reviews in a style consistent with the Flex Living brand.

## Key Features

- **Manager Dashboard**: An intuitive interface to filter, search, and analyze all guest reviews.
- **Review Approval System**: Managers can select which reviews are displayed on public property pages. The approval state is persisted in the browser's local storage.
- **Data Analytics**: Visual charts and KPIs for tracking review volume, average ratings, and category-specific performance over time.
- **Public Review Pages**: Property detail pages that replicate the Flex Living website style, dynamically displaying only manager-approved reviews.
- **Mocked API Integration**: A robust backend API simulation for Hostaway and Google Reviews, providing normalized and structured data to the frontend.

---

## Local Development Setup

### Prerequisites

- Node.js (v20 or newer)
- npm (recommended package manager)

### Installation & Running

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd flex-living-assessment
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm dev
    ```

4.  **Open the application:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS with PostCSS
- **Component Library**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect, useReducer)
- **Data Fetching**: Native `fetch` API within Server and Client Components
- **Linting/Formatting**: ESLint, Prettier

---

## Key Design & Logic Decisions

- **Data Normalization**: The system is designed to handle multiple review sources. All incoming data (e.g., from Hostaway) is normalized into a consistent `NormalizedReview` format. Hostaway's 10-point category ratings are converted to a standard 5-point scale.
- **Review Approval Persistence**: To meet the requirement of a manager selecting public reviews without a database, the approval status is stored in the browser's `localStorage`. This is a lightweight solution perfect for this assessment's scope.
- **API Mocking**: The Hostaway and Google Reviews APIs are mocked using local JSON files and served via Next.js API Routes. This ensures a stable and predictable data source for development and testing, fulfilling the requirement to implement a `GET /api/reviews/hostaway` route.
- **Component Architecture**: The project heavily utilizes the Next.js App Router paradigm, separating Server Components (for data fetching and SEO) from Client Components (for interactivity). Reusable components from shadcn/ui ensure a consistent and high-quality UI.

---

## API Endpoints

The application serves its mocked data through the following API routes:

- **`GET /api/reviews/hostaway`**

  - **Description**: Fetches and normalizes review data from the mocked Hostaway JSON file.
  - **Behavior**: Returns a structured response containing the list of reviews and a summary of analytics (total reviews, average rating, etc.).

- **`GET /api/reviews/google`**

  - **Description**: Provides mocked, normalized data simulating a response from a Google Reviews API.
  - **Behavior**: Returns a small set of reviews and includes implementation notes regarding the feasibility of a real integration.

- **`GET /api/reviews/combined`**
  - **Description**: A unified endpoint that fetches data from both `hostaway` and `google` sources, combines them, sorts by date, and returns a single, consistent data structure for the frontend.

---

## Google Reviews Integration Findings

A feasibility study was conducted to explore integrating real Google Reviews.

- **Current Status**: **Mocked Implementation**. The dashboard uses a mocked Google Reviews API endpoint to demonstrate how such an integration would function.

- **Technical Challenges**:

  1.  **Google Places API**: This API is easy to implement but is severely limited. It returns a **maximum of 5 reviews** per location with no control over sorting or pagination, making it unsuitable for a comprehensive dashboard.
  2.  **Google My Business API**: This is the correct tool for the job, offering access to all reviews with pagination. However, it has a strict and lengthy approval process (**2-4 weeks**) and requires the developer to have verified ownership of the Google Business Profiles for each property.

- **Conclusion & Recommendation**:
  - Direct integration was not feasible within the scope of this assessment due to the limitations and approval requirements mentioned above.
  - The recommended approach for a production environment would be to complete the Google My Business API approval process or use a third-party service (e.g., EmbedSocial, ReviewTrackers) that handles the API integration.
  - The current mocked implementation successfully demonstrates the technical capability to normalize and display Google Reviews once a data source is established.
