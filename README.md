# Project Hours Logging App

A simple internal web app for logging daily total hours per project, built with Astro and integrated with Fireberry CRM.

## Features

- **Simple Form**: Clean, responsive form for submitting hours per project
- **Project Management**: Projects are pulled from Fireberry CRM through secure server-side integration
- **Centralized Configuration**: All settings, labels, and business rules in one config file
- **Mock Mode**: Built-in mock data for development and testing
- **Mobile-Friendly**: Works on desktop and mobile devices
- **Server-Side Security**: Fireberry credentials never exposed to the browser
- **Extensible**: Designed to grow without messy rewrites

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone and install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Configure your environment variables (see Configuration section below).

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:4321](http://localhost:4321) in your browser.

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Fireberry Integration (required for live mode)
FIREBERRY_BASE_URL=https://your-fireberry-instance.com
FIREBERRY_API_KEY=your-api-key-here

# App Configuration
MOCK_MODE=true                    # Set to false to use live Fireberry data
DEBUG=false                       # Enable debug logging

# Optional: Site URL for server-side requests
SITE_URL=http://localhost:4321
```

### Centralized App Configuration

All app settings are in `src/config/app.config.ts`:

```typescript
export const appConfig = {
  // App metadata
  app: {
    name: 'Project Hours Logger',
    title: 'Project Hours Logging',
    description: 'Submit daily work hours per project',
  },
  
  // Form labels - customize all text here
  labels: {
    project: 'Project',
    date: 'Date',
    hours: 'Total Hours Worked',
    submit: 'Submit Hours',
    // ... more labels
  },
  
  // Validation rules
  validation: {
    hours: {
      min: 0.1,
      max: 24,
      allowDecimals: true,
      decimalPlaces: 2,
    },
    // ... more validation
  },
  
  // API endpoints
  api: {
    projectsEndpoint: '/api/projects.json',
    submitEndpoint: '/api/submit.json',
    mockMode: process.env.MOCK_MODE === 'true',
  },
  
  // Fireberry field mappings
  fireberry: {
    objectName: 'project',
    projectIdField: 'id',
    projectNameField: 'name',
    // ... more mappings
  },
  
  // Feature flags
  features: {
    enableSubmit: true,
    enableMockMode: process.env.MOCK_MODE === 'true',
    enableDebugLogging: process.env.DEBUG === 'true',
  },
  
  // UI settings
  ui: {
    primaryColor: '#3b82f6',
    errorColor: '#ef4444',
    successColor: '#10b981',
  },
};
```

## Development

### Mock Mode

For development without Fireberry:

1. Set `MOCK_MODE=true` in your `.env` file
2. Mock projects are automatically loaded from `src/config/mock-projects.ts`
3. Submissions are simulated with success responses

### Live Mode

To use live Fireberry data:

1. Set `MOCK_MODE=false` in your `.env` file
2. Configure `FIREBERRY_BASE_URL` and `FIREBERRY_API_KEY`
3. Update field mappings in `appConfig.fireberry` if needed

### Customizing Mock Data

Edit `src/config/mock-projects.ts`:

```typescript
export const mockProjects: Project[] = [
  {
    id: 'project-001',
    name: 'Website Redesign',
  },
  {
    id: 'project-002', 
    name: 'Mobile App Development',
  },
  // Add more projects as needed
];
```

## API Endpoints

### GET /api/projects.json

Returns a list of active projects.

**Response:**
```json
{
  "projects": [
    {
      "id": "project-123",
      "name": "Example Project"
    }
  ]
}
```

### POST /api/submit.json

Submits hours for a project.

**Request:**
```json
{
  "projectId": "project-123",
  "projectName": "Example Project", 
  "date": "2026-02-26",
  "hours": 8
}
```

**Response:**
```json
{
  "success": true,
  "message": "Hours submitted successfully!",
  "data": {
    "id": "submission-123456"
  }
}
```

## Fireberry Integration

The app integrates with Fireberry through server-side API calls only:

1. **Security**: API keys are stored in environment variables and never exposed to the browser
2. **Normalization**: Fireberry responses are normalized to a consistent `{ id, name }` format
3. **Error Handling**: Graceful fallback to mock mode if Fireberry is unavailable
4. **Field Mapping**: Configure which Fireberry fields map to project ID and name

### Configuring Fireberry Fields

Update `appConfig.fireberry` in `src/config/app.config.ts`:

```typescript
fireberry: {
  objectName: 'project',              // Fireberry object name
  projectIdField: 'id',               // Field containing project ID
  projectNameField: 'name',           // Field containing project name
  projectStatusField: 'status',       // Field for active status
  activeStatusValue: 'active',        // Value indicating active project
  sortBy: 'name',                     // Sort field
  sortOrder: 'asc',                   // Sort direction
}
```

## Styling

The app uses custom CSS with CSS variables for theming:

- Global styles: `src/styles/global.css`
- Component styles: Scoped within each Astro component
- Theme colors: Configurable in `appConfig.ui`

### Customizing Colors

Update color variables in `src/config/app.config.ts`:

```typescript
ui: {
  primaryColor: '#3b82f6',    // Blue
  errorColor: '#ef4444',      // Red  
  successColor: '#10b981',    // Green
}
```

## Deployment

### Environment Setup

1. Set production environment variables
2. Set `MOCK_MODE=false` for production
3. Configure Fireberry credentials
4. Set `SITE_URL` to your production domain

### Build Commands

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to hosting provider
# (varies by provider)
```

### Security Considerations

- Fireberry API keys must be set as environment variables
- Never commit `.env` files to version control
- Use HTTPS in production
- Consider adding authentication for production use

## File Structure

```
src/
├── config/
│   ├── app.config.ts          # Centralized configuration
│   └── mock-projects.ts       # Mock project data
├── components/
│   └── HoursForm.astro        # Main form component
├── lib/
│   └── fireberry.ts           # Fireberry integration helper
├── layouts/
│   └── Layout.astro           # Base HTML layout
├── pages/
│   ├── api/
│   │   ├── projects.json.ts   # Projects API endpoint
│   │   └── submit.json.ts     # Submit API endpoint
│   └── index.astro            # Main page
└── styles/
    └── global.css             # Global styles
```

## Future Enhancements

The app is designed for easy expansion:

- **Authentication**: Add login/authorization
- **User Tracking**: Track who submitted hours
- **Dashboards**: Add reporting and analytics
- **Edit Mode**: Allow editing previous submissions
- **Notifications**: Email confirmations
- **Multi-step Forms**: Complex workflows
- **File Attachments**: Support for documents

## Troubleshooting

### Common Issues

1. **Projects not loading**: Check Fireberry credentials and network connectivity
2. **Mock mode not working**: Verify `MOCK_MODE=true` in environment variables
3. **Form validation errors**: Check validation rules in `appConfig.validation`
4. **Styling issues**: Ensure CSS variables are properly set

### Debug Mode

Enable debug logging:

```env
DEBUG=true
```

This will provide detailed console logs for API requests and responses.

## Support

For technical support or questions:

1. Check this README first
2. Review the configuration in `src/config/app.config.ts`
3. Enable debug mode to see detailed logs
4. Check browser console for JavaScript errors

## License

Internal use only - © 2026 Your Company
