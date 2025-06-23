# Tool Call Playground - Information Architecture

## Project Overview

**Tool Call Playground** is a Next.js application designed to visualize and interact with AI tool calls in a structured, user-friendly interface. The application processes JSON data containing AI model responses and renders different types of tool calls with customizable display modes.

## Core Purpose

The application serves as a visualization and debugging tool for AI tool call sequences, allowing users to:
- Upload and parse AI model response data (JSON format)
- View different types of tool calls in expandable/collapsible format
- Configure display preferences for different tool call types
- Analyze tool call outputs and metadata
- Process mock data for testing and demonstration

## Technology Stack

### Framework & Core Libraries
- **Next.js 15.3.2** - React framework with App Router
- **React 19.0.0** - UI library
- **TypeScript** - Type safety and development experience
- **Tailwind CSS** - Utility-first styling

### UI & Design System
- **@primer/octicons** - GitHub's icon system (prioritized per workspace rules)
- **@primer/css** - GitHub's design system
- **Lucide React** - Additional icon library
- **@radix-ui/react-popover** - Accessible popover components

### Content Rendering
- **react-markdown** - Markdown rendering
- **react-syntax-highlighter** - Code syntax highlighting

## Data Architecture

### Data Flow

```
Mock Data (JSON) → Parser → Message Processing → Component Rendering
```

### Core Data Types

#### ToolCall
```typescript
type ToolCall = {
  function: {
    arguments: string;
    name: string;
  };
  id: string;
  index: number;
  type: string;
};
```

#### Message Structure
```typescript
Array<{
  type: "text" | "tool-call";
  content: string;
  toolCall?: any;
  output?: string;
  modelInfo?: ModelInfo;
  metadata?: Record<string, any>;
}>
```

### Configuration Types
- **ToolCallDisplayConfig** - Controls expanded/condensed view per tool type
- **GlobalDisplaySettings** - Application-wide display preferences

## Component Architecture

### Application Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.js          # Root layout
│   ├── page.tsx           # Main application entry
│   └── components-reference/ # Component documentation
├── components/            # Reusable components
│   ├── tool-calls/        # Tool call specific components
│   ├── ui/               # UI primitives and renderers
│   ├── endBlocks/        # End block detection and rendering
│   └── DisplayConfig.tsx # Configuration panel
├── context/              # React Context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and helpers
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

### Component Hierarchy

#### Core Components

1. **Main Application** (`src/app/page.tsx`)
   - Primary entry point
   - Handles file upload and data processing
   - Manages display configuration state
   - Renders message sequence

2. **ToolCallFactory** (`src/components/tool-calls/ToolCallFactory.tsx`)
   - Factory pattern for tool call rendering
   - Routes to appropriate tool call component
   - Supports: Figma, Think, Bash, StrReplace, CreateIssue, ReportProgress

3. **DisplayConfig** (`src/components/DisplayConfig.tsx`)
   - Configuration panel for display preferences
   - Toggle between expanded/condensed views
   - Global settings management

#### Specialized Tool Call Components

- **FigmaToolCall** - Figma design tool integration
- **ThinkToolCall** - AI reasoning/thinking visualization
- **BashToolCall** - Terminal command execution
- **StrReplaceToolCall** - File editing operations
- **CreateIssueToolCall** - GitHub issue creation
- **ReportProgressToolCall** - Progress reporting
- **BaseToolCall** - Generic fallback component

#### UI Rendering System

1. **ContentRenderer** (`src/components/ui/renderers/ContentRenderer.tsx`)
   - Auto-detects content type (markdown, code, diff)
   - Routes to appropriate renderer
   - Handles content truncation

2. **Specialized Renderers**
   - **MarkdownRenderer** - Markdown content
   - **CodeHighlight** - Syntax-highlighted code
   - **DiffRenderer** - Git diff visualization

3. **TruncatedContent** - Expandable content with height limits

### State Management

#### Global Context
- **SiteContext** (`src/context/SiteContext.tsx`)
  - Global display settings
  - Maximum content height configuration
  - Shared across all components

#### Local State
- Tool call display configuration (expanded/condensed per type)
- Uploaded data and parsed messages
- Error handling and loading states

## File Organization

### Configuration Files
- `package.json` - Dependencies and scripts
- `next.config.js/mjs` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS customization
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - Linting rules

### Public Assets
```
public/
├── data/
│   └── mock-data.json     # Sample tool call data
└── *.svg                  # Static assets and icons
```

### Source Code Organization

#### Core Application Logic
- `src/app/page.tsx` - Main application component
- `src/types/tool-calls.ts` - Core type definitions
- `src/context/SiteContext.tsx` - Global state management

#### Component Libraries
- `src/components/tool-calls/` - Tool call specific implementations
- `src/components/ui/` - Reusable UI components
- `src/components/endBlocks/` - Special content block handling

#### Utilities and Helpers
- `src/lib/` - Business logic and utilities
- `src/hooks/` - Custom React hooks
- `src/utils/` - General utility functions

## Features & Functionality

### Core Features

1. **File Upload & Processing**
   - JSON file upload support
   - Automatic data parsing and validation
   - Error handling for malformed data

2. **Multi-Format Rendering**
   - Markdown content rendering
   - Syntax-highlighted code blocks
   - Git diff visualization
   - Tool call specific formatting

3. **Interactive Configuration**
   - Per-tool-call display mode toggling
   - Global content height settings
   - Bulk expand/collapse functionality

4. **Special Content Handling**
   - End block detection (PR summaries, etc.)
   - Truncated content with expand/collapse
   - Metadata and timing information display

### Display Modes

- **Expanded** - Full content visibility with all details
- **Condensed** - Compact view with key information only

### Supported Tool Call Types

1. **Development Tools**
   - `str_replace_editor` - File editing and code changes
   - `bash` - Terminal command execution

2. **Design & Collaboration**
   - `get_figma_data` - Figma design integration
   - `create_issue` - GitHub issue management

3. **AI Reasoning**
   - `think` - AI reasoning and analysis steps
   - `report_progress` - Task progress reporting

## Extension Points

### Adding New Tool Call Types

1. Create new component in `src/components/tool-calls/`
2. Add routing logic in `ToolCallFactory.tsx`
3. Update `DisplayConfig.tsx` with new tool type
4. Add appropriate icon mapping

### Content Renderers

1. Implement new renderer in `src/components/ui/renderers/`
2. Add content type detection in `ContentRenderer.tsx`
3. Register new content type handling

### Configuration Options

1. Extend `GlobalDisplaySettings` type
2. Update `SiteContext` for new global settings
3. Modify `DisplayConfig` component for UI controls

## Dependencies

### Production Dependencies
- **UI/UX**: @primer/css, @primer/octicons-react, lucide-react, @radix-ui/react-popover
- **Content**: react-markdown, react-syntax-highlighter
- **Styling**: sass (for SCSS support)

### Development Dependencies
- **Build Tools**: Next.js toolchain, PostCSS, Autoprefixer
- **Code Quality**: ESLint, TypeScript
- **Styling**: Tailwind CSS, @tailwindcss/typography

## Design Patterns

### Factory Pattern
- `ToolCallFactory` dynamically creates appropriate component instances based on tool call type

### Provider Pattern
- `SiteContextProvider` manages global application state

### Composition Pattern
- Components are composed of smaller, reusable UI primitives

### Configuration Pattern
- Centralized configuration management through context and props

## Performance Considerations

### Optimization Strategies
- Memoized message processing for faster rendering
- Conditional rendering based on display modes
- Lazy content expansion to reduce initial render cost
- Virtual scrolling considerations for large datasets

### Bundle Optimization
- Tree-shaking with ES modules
- Code splitting at route level
- Optimized asset loading

This architecture provides a flexible, extensible foundation for visualizing and interacting with AI tool calls while maintaining clean separation of concerns and scalable component design.