# JobTracker

A modern, efficient Applicant Tracking System (ATS) to help you organize and track your job search. Built with React and Vite.

## Features

- **Application Tracking**: Log job applications with details like Position, Company, Location, Status, and Remarks.
- **Applied On Date**: Accurately track when you applied for each role.
- **My Interviews**: A dedicated dashboard section to see your upcoming scheduled interviews at a glance.
- **Search**: Instantly filter your applications and interviews by Job Role or Company Name.
- **Sorting**: Sort your applications by "Newest First" or "Oldest First".
- **Job Info**: Store the direct URL to the job posting for easy access.
- **File Management**: Attach your CV and Cover Letter to each application.
- **Data Persistence**: Uses IndexedDB (via `idb-keyval`) to store your data locally in the browser.

## Getting Started

### Prerequisites

- Node.js installed on your machine.

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Technologies

- React
- Vite
- Lucide React (Icons)
- IDB-Keyval (Storage)
