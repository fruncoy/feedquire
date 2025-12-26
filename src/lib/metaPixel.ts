declare global {
  interface Window {
    fbq: any;
  }
}

export const trackEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

export const trackCustomEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, parameters);
  }
};

// Standard Facebook events
export const MetaPixelEvents = {
  // User registration
  completeRegistration: (method: string = 'email') => {
    trackEvent('CompleteRegistration', { registration_method: method });
  },

  // Purchases
  purchase: (value: number, currency: string = 'USD', content_name?: string) => {
    trackEvent('Purchase', { 
      value, 
      currency,
      content_name 
    });
  },

  // Lead generation (task submissions, feedback)
  lead: (content_name?: string, value?: number) => {
    trackEvent('Lead', { 
      content_name,
      value 
    });
  },

  // Content views
  viewContent: (content_name: string, content_type?: string, value?: number) => {
    trackEvent('ViewContent', { 
      content_name,
      content_type,
      value 
    });
  },

  // Checkout initiation
  initiateCheckout: (value: number, currency: string = 'USD', content_name?: string) => {
    trackEvent('InitiateCheckout', { 
      value,
      currency,
      content_name 
    });
  },

  // Payment info
  addPaymentInfo: (content_name?: string) => {
    trackEvent('AddPaymentInfo', { content_name });
  },

  // Contact/Support
  contact: (content_name?: string) => {
    trackEvent('Contact', { content_name });
  },

  // Custom events
  taskStarted: (platform: string, value: number) => {
    trackCustomEvent('TaskStarted', { 
      platform_name: platform,
      task_value: value 
    });
  },

  taskCompleted: (platform: string, value: number) => {
    trackCustomEvent('TaskCompleted', { 
      platform_name: platform,
      task_value: value 
    });
  },

  dashboardView: (user_type: string) => {
    trackCustomEvent('DashboardView', { user_type });
  },

  paymentMethodSetup: (method: string) => {
    trackCustomEvent('PaymentMethodSetup', { payment_method: method });
  }
};