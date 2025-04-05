# Compound Direct Calculator E2E Tests

This repository contains end-to-end tests for the Compound Direct calculator component using Playwright with TypeScript.

## Features Tested

- Dosage Form Selection (6 different forms)
- Cream Medicine Functionality
  - Initial ingredients verification
  - Numeric value calculations
  - Ingredient management (add, remove, convert to excipient)
  - Base percentage adjustments
  - Ingredient order manipulation
- Capsule Medicine Functionality
  - Initial state verification
  - Capsule size selection
  - Pricing page navigation

## Test Coverage

- Positive test cases
- Negative test cases
- Edge cases
- UI interaction tests
- Navigation tests

## Project Structure

```
compound-tests/
├── tests/
│   ├── calculations.spec.ts     # Main test specifications
│   ├── pages/
│   │   └── calculations-page.ts # Page Object Model
│   ├── types/
│   │   └── calculations.types.ts # TypeScript type definitions
│   └── utils/
│       └── test-utils.ts        # Shared test utilities
├── playwright.config.ts         # Playwright configuration
└── package.json                 # Project dependencies
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Run tests with UI:
   ```bash
   npm run test:ui
   ```

5. Run tests in debug mode:
   ```bash
   npm run test:debug
   ```

## Test Design Principles

- **Page Object Model**: Separates test logic from page interactions
- **Type Safety**: Utilizes TypeScript for better code quality
- **Reusability**: Common functions and data are shared across tests
- **Maintainability**: Well-structured and documented code
- **Reliability**: Proper wait strategies and error handling

## Best Practices Implemented

1. **Element Selection**
   - Using data-testid attributes
   - Stable selectors
   - Clear locator naming

2. **Wait Strategies**
   - Explicit waits for elements
   - Network idle checks
   - Frame loading verification

3. **Error Handling**
   - Timeout management
   - Graceful failure handling
   - Clear error messages

4. **Test Organization**
   - Logical grouping
   - Clear test descriptions
   - Shared setup where appropriate

## Screenshots

Tests automatically capture screenshots at key points:
- Different dosage form views
- After ingredient modifications
- Before/after calculations
- Error states

Screenshots are saved in the `test-results/screenshots/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure everything works
5. Submit a pull request

## License

ISC
