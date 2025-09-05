# SHCOOL Platform

SHCOOL is a comprehensive educational platform designed to enhance the learning experience for students, teachers, and administrators. This platform provides a wide range of features including learning path management, portfolio tracking, peer collaboration, mentoring programs, and career guidance.

## Features

### For Students

- Personalized dashboard with key metrics
- Learning path selection and progress tracking
- Portfolio management and showcase
- Peer collaboration and study groups
- Mentor connection and session scheduling
- Career exploration and guidance
- Progress analytics and recommendations

### For Teachers/Administrators

- Comprehensive student progress monitoring
- Learning path management and analytics
- Portfolio oversight and assessment
- Peer collaboration facilitation
- Mentoring program administration
- Career guidance content management
- Detailed analytics and reporting

## Technology Stack

- **Frontend**: React, Material UI, React Router, Context API
- **Styling**: Tailwind CSS, Emotion
- **Data Visualization**: Recharts
- **Build Tool**: Vite
- **State Management**: React Context API
- **Data Persistence**: localStorage

## Prerequisites

- Node.js (version 16 or higher)
- npm or pnpm (package manager)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/RasyaAndrean/SHCOOL-Platform.git
   ```

2. Navigate to the project directory:

   ```bash
   cd SHCOOL-Platform
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

## Running the Application

### Development Mode

To run the application in development mode with hot reloading:

```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173` by default.

### Production Build

To create a production build:

```bash
npm run build
# or
pnpm build
```

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
# or
pnpm preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/            # State management contexts
├── docs/                # Documentation files
├── hooks/               # Custom React hooks
├── pages/               # Page components
│   ├── admin/           # Admin-specific pages
│   └── student/         # Student-specific pages
└── App.jsx              # Main application component
```

## Available Scripts

- `dev`: Starts the development server
- `build`: Creates a production build
- `lint`: Runs ESLint on the project
- `preview`: Previews the production build locally

## Creator

**Rasya Andrean**

- Email: rasyaandrean@outlook.co.id

## License

This project is licensed under a custom license. All rights reserved by Rasya Andrean.

**Commercial Use Restrictions:**

- This software and its source code may not be sold, sublicensed, or distributed for commercial purposes without explicit written permission from the creator, Rasya Andrean.
- Unauthorized selling, distribution, or commercial use of this software is strictly prohibited.
- Any commercial use requires prior written consent from Rasya Andrean (rasyaandrean@outlook.co.id).

**Permitted Use:**

- This software may be used for educational, personal, or non-commercial purposes.
- Modifications are allowed for personal or educational use, but distribution of modified versions requires permission.

**Disclaimer:**

- This software is provided "as is", without warranty of any kind.
- The creator shall not be liable for any damages arising from the use of this software.

By using this software, you agree to these terms and conditions.
