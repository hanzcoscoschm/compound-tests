# Compound Direct Calculator Tests

End-to-end tests for the Compound Direct calculator application.

## Prerequisites

- Node.js >= 16.0.0
- npm >= 7.0.0

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install browser:
```bash
npm run install:browsers
```

## Running Tests

Run tests in debug mode with browser visible:
```bash
npm run test:debug
```

Run tests in headless mode:
```bash
npm test
```

Run tests with UI mode:
```bash
npm run test:ui
```

Run tests in headed mode:
```bash
npm run test:headed
```

## Test Reports

View test reports:
```bash
npm run report
```

## Project Structure

```
.
├── tests/
│   ├── pages/          # Page Object Models
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Test utilities and helpers
│   └── *.spec.ts       # Test files
├── playwright.config.ts # Playwright configuration
├── package.json        # Project dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Test Cases

1. Calculator Page Loading
2. Dosage Form Selection
3. Ingredient Management
4. Numeric Field Updates
5. Capsule-specific Features
6. Excipient Handling
7. Ingredient Order Management
