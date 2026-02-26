export const appConfig = {
  // App metadata
  app: {
    name: 'יומן שעות פרויקטים',
    title: 'רישום שעות עבודה לפרויקטים',
    description: 'דיווח יומי של שעות עבודה לפי פרויקט',
  },

  // Form labels
  labels: {
    project: 'פרויקט',
    date: 'תאריך',
    hours: 'סך השעות שעבדת היום',
    submit: 'שלח דיווח שעות',
    loading: 'טוען...',
    emptyState: 'אין פרויקטים זמינים',
    retry: 'נסה שוב',
    success: 'הדיווח נשלח בהצלחה!',
    error: 'אירעה שגיאה. אנא נסה שוב.',
    // Thank you page labels
    thankYou: 'תודה רבה!',
    submissionReceived: 'הדיווח התקבל בהצלחה',
    submissionDetails: 'פרטי הדיווח',
    submissionId: 'מספר דיווח',
    projectName: 'שם פרויקט',
    workDate: 'תאריך עבודה',
    totalHours: 'סה"כ שעות',
    submittedAt: 'שעת הגשה',
    newSubmission: 'דיווח חדש',
    printReceipt: 'הדפס קבלה',
    close: 'סגור',
  },

  // Validation rules
  validation: {
    project: {
      required: true,
    },
    date: {
      required: true,
    },
    hours: {
      required: true,
      min: 0.1,
      max: 24,
      allowDecimals: true,
      decimalPlaces: 2,
    },
  },

  // API settings
  api: {
    projectsEndpoint: '/api/projects.json',
    submitEndpoint: '/api/submit.json',
    timeout: 10000,
    mockMode: typeof process !== 'undefined' ? process.env.MOCK_MODE === 'true' : true,
  },

  // Fireberry mappings
  fireberry: {
    objectName: 'project',
    projectIdField: 'id',
    projectNameField: 'name',
    projectStatusField: 'status',
    activeStatusValue: 'active',
    sortBy: 'name',
    sortOrder: 'asc',
  },

  // Feature flags
  features: {
    enableSubmit: true,
    enableMockMode: typeof process !== 'undefined' ? process.env.MOCK_MODE === 'true' : true,
    enableDebugLogging: typeof process !== 'undefined' ? process.env.DEBUG === 'true' : false,
    enableEditMode: false, // Future feature
  },

  // Defaults
  defaults: {
    dateStrategy: 'today', // 'today' | 'none'
    dropdownPlaceholder: 'בחר פרויקט...',
    resetAfterSubmit: true,
    showConfirmation: true,
    confirmationDuration: 3000, // ms
  },

  // UI settings - Mobile first
  ui: {
    maxFormWidth: '100%', // Full width on mobile
    mobileBreakpoint: '768px',
    spacingUnit: '1rem',
    borderRadius: '0.5rem',
    primaryColor: '#1e40af',
    errorColor: '#dc2626',
    successColor: '#16a34a',
    fontFamily: '"Open Sans Hebrew", "Arial Hebrew", sans-serif',
    direction: 'rtl', // RTL for Hebrew
    textAlign: 'right',
  },

  // Mobile-first breakpoints
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
  },
} as const;

export type AppConfig = typeof appConfig;

// Export APP_CONFIG to match the form's expected import structure
export const APP_CONFIG = {
  // App metadata
  APP_NAME: appConfig.app.name,
  APP_TITLE: appConfig.app.title,
  APP_DESCRIPTION: appConfig.app.description,

  // Form fields
  FIELDS: {
    PROJECT: appConfig.labels.project,
    DATE: appConfig.labels.date,
    HOURS: appConfig.labels.hours,
  },

  // Buttons
  BUTTONS: {
    SUBMIT: appConfig.labels.submit,
    SUBMITTING: appConfig.labels.loading,
    RETRY: appConfig.labels.retry,
  },

  // Messages
  MESSAGES: {
    REQUIRED_FIELD: 'שדה חובה',
    INVALID_HOURS: 'נא להזין מספר שעות תקין (0.1-24)',
    INVALID_DATE: 'תאריך לא יכול להיות בעתיד',
    SUBMISSION_ERROR: appConfig.labels.error,
    SUBMISSION_SUCCESS: appConfig.labels.success,
  },

  // Thank you page
  THANK_YOU: {
    TITLE: appConfig.labels.thankYou,
    MESSAGE: appConfig.labels.submissionReceived,
    DETAILS_TITLE: appConfig.labels.submissionDetails,
    SUBMISSION_ID: appConfig.labels.submissionId,
    SUBMISSION_TIME: appConfig.labels.submittedAt,
    PRINT_RECEIPT: appConfig.labels.printReceipt,
    NEW_SUBMISSION: appConfig.labels.newSubmission,
    CLOSE: appConfig.labels.close,
  },

  // Units
  UNITS: {
    HOURS: 'שעות',
  },

  // Validation
  VALIDATION: appConfig.validation,

  // API
  API: appConfig.api,
};
