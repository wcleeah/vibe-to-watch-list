# AGENTS.md - Coding Agent Guidelines

## Project Context
- **Tech Stack**: NestJS backend (per REQUIREMENT.md)
- **Purpose**: Web app for tracking "want-to-watch" content across platforms

## Build/Lint/Test Commands
- No package.json found yet - project is in early stage
- Standard NestJS commands when implemented:
  - `npm run build` - Build the project
  - `npm run start:dev` - Start development server
  - `npm run test` - Run all tests
  - `npm run test:watch` - Run tests in watch mode
  - `npm run test -- --testNamePattern="test name"` - Run single test

## Code Style Guidelines
- **Framework**: Use NestJS conventions and decorators
- **TypeScript**: Strict typing, interfaces for data structures
- **Naming**: camelCase for variables/functions, PascalCase for classes/interfaces
- **Imports**: Group by: Node modules, local modules, relative imports
- **Error Handling**: Use NestJS exception filters and HTTP exceptions
- **Database**: Follow NestJS TypeORM/Prisma patterns when implemented
- **API**: RESTful endpoints with proper HTTP status codes

## Notes
- Project is in initial stage - only REQUIREMENT.md exists
- No existing code style rules found (.cursorrules, copilot-instructions.md)
- Follow NestJS best practices and TypeScript strict mode