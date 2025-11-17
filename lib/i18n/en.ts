import { Translation } from './zh'

export const en: Translation = {
  // Common
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    confirm: 'Confirm',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    active: 'Active',
    inactive: 'Cancelled',
  },

  // Navigation
  nav: {
    dashboard: 'Dashboard',
    subscriptions: 'Subscriptions',
    analytics: 'Analytics',
    settings: 'Settings',
    logout: 'Logout',
    profile: 'Profile',
  },

  // Authentication
  auth: {
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    loginNow: 'Login Now',
    registerNow: 'Register Now',
    welcomeBack: 'Welcome Back',
    createAccount: 'Create Account',
  },

  // Subscription Management
  subscription: {
    // List
    title: 'My Subscriptions',
    addNew: 'Add Subscription',
    noSubscriptions: 'No Subscriptions',
    noSubscriptionsDesc: 'Click the button above to add your first subscription',
    totalSubscriptions: 'Total Subscriptions',
    activeSubscriptions: 'Active Subscriptions',

    // Form
    createTitle: 'Add Subscription',
    createDesc: 'Quickly add a new subscription service',
    editTitle: 'Edit Subscription',
    editDesc: 'Edit {name} information',

    // Fields
    name: 'Subscription Name',
    namePlaceholder: 'e.g., Netflix',
    amount: 'Amount',
    amountPlaceholder: '30.00',
    currency: 'Currency',
    billingCycle: 'Billing Cycle',
    customCycleDays: 'Custom Days',
    firstBillingDate: 'First Billing Date',
    nextBillingDate: 'Next Billing Date',
    category: 'Category',
    categorySelect: 'Select Category',
    websiteUrl: 'Website URL',
    websiteUrlPlaceholder: 'https://example.com',
    logoUrl: 'Logo URL',
    notes: 'Notes',
    notesPlaceholder: 'Add notes...',
    remindDaysBefore: 'Remind (Days Before)',
    status: 'Status',

    // Categories
    categories: {
      entertainment: 'Entertainment',
      productivity: 'Productivity',
      education: 'Education',
      fitness: 'Fitness',
      music: 'Music',
      cloud: 'Cloud',
      other: 'Other',
    },

    // Billing Cycles
    cycles: {
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      semiAnnually: 'Semi-Annually',
      annually: 'Annually',
      custom: 'Custom',
    },

    // Currencies
    currencies: {
      CNY: 'CNY (¥)',
      USD: 'USD ($)',
      EUR: 'EUR (€)',
      GBP: 'GBP (£)',
    },

    // Icons
    quickSelect: 'Quick Select Common Services',
    iconSettings: 'Icon Settings',
    fetchFavicon: 'Favicon',
    fetchGoogle: 'Google',
    fetchClearbit: 'Clearbit',

    // Buttons
    creating: 'Creating...',
    create: 'Create Subscription',
    saving: 'Saving...',
    saveChanges: 'Save Changes',
    deleting: 'Deleting...',

    // Details
    detailsTitle: 'Subscription Details',
    renewalInfo: 'Renewal Information',
    reminderSettings: 'Reminder Settings',
    website: 'Website',
    daysBeforeRenewal: 'Remind {days} days before renewal',

    // Renewal Status
    renewingToday: 'Renewing today',
    renewingTomorrow: 'Renewing tomorrow',
    renewingInDays: 'Renewing in {days} days',
    overdueDays: 'Overdue by {days} days',

    // Messages
    deleteConfirm: 'Are you sure you want to delete this subscription?',
    deleteSuccess: 'Subscription deleted',
    createSuccess: 'Subscription created successfully',
    updateSuccess: 'Subscription updated successfully',
    canceledNote: 'Cancelled subscriptions will not be included in statistics',
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome Back',
    overview: 'Overview',
    monthlySpending: 'Monthly Spending',
    upcomingRenewals: 'Upcoming Renewals',
    recentActivity: 'Recent Activity',
    viewAll: 'View All',
    noUpcoming: 'No upcoming renewals',
  },

  // Analytics
  analytics: {
    title: 'Analytics',
    totalSpending: 'Total Spending',
    avgMonthly: 'Avg. Monthly',
    byCategory: 'By Category',
    byCurrency: 'By Currency',
    trend: 'Spending Trend',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    thisYear: 'This Year',
  },

  // Settings
  settings: {
    title: 'Settings',
    profile: 'Profile',
    preferences: 'Preferences',
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications',
    account: 'Account',
    changePassword: 'Change Password',
    deleteAccount: 'Delete Account',
  },

  // Error Messages
  errors: {
    required: 'This field is required',
    invalidEmail: 'Invalid email format',
    passwordTooShort: 'Password must be at least 6 characters',
    passwordMismatch: 'Passwords do not match',
    loginFailed: 'Login failed, please check your email and password',
    registerFailed: 'Registration failed, please try again',
    networkError: 'Network error, please check your connection',
    unknownError: 'An unknown error occurred, please try again',
    loadFailed: 'Failed to load',
    saveFailed: 'Failed to save',
    deleteFailed: 'Failed to delete',
  },
}
