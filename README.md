# Hazo Config Component Library

A React component library for managing configuration with Storybook for component testing and documentation.

## Tech Stack

- **React** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Shadcn/UI** - Component primitives
- **Storybook** - Component development and testing
- **Vite** - Build tool

## Getting Started

### Installation

Install dependencies:

```bash
npm install
```

### Development

Run Storybook to develop and test components:

```bash
npm run storybook
```

This will start Storybook on `http://localhost:6006`

### Building

Build the library:

```bash
npm run build
```

Build Storybook for static deployment:

```bash
npm run build-storybook
```

## Project Structure

```
hazo_config/
├── src/
│   ├── components/          # React components
│   │   ├── example_component.tsx
│   │   └── example_component.stories.tsx
│   ├── lib/                 # Utility functions
│   │   └── utils.ts
│   ├── styles/              # Global styles
│   │   └── globals.css
│   └── index.ts             # Main entry point
├── .storybook/              # Storybook configuration
├── components.json          # Shadcn/UI configuration
├── tailwind.config.js       # TailwindCSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Adding Components

1. Create your component in `src/components/`
2. Create a corresponding `.stories.tsx` file for Storybook
3. Export the component from `src/components/index.ts`
4. Export from `src/index.ts` to make it available in the library

## Adding Shadcn/UI Components

Use the Shadcn CLI to add components:

```bash
npx shadcn@latest add [component-name]
```

## Code Style

- Use **snake_case** for file names and variables
- Include file purpose description at the top of each file
- Add comments for functions and major code sections
- Use `cls_` prefix for div class names (e.g., `cls_example_component`)

## License

MIT

