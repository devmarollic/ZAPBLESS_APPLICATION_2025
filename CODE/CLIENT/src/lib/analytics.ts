
// Google Analytics and Microsoft Clarity configuration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    clarity: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'GA_MEASUREMENT_ID'; // Replace with your actual GA4 Measurement ID
export const CLARITY_PROJECT_ID = 'CLARITY_PROJECT_ID'; // Replace with your actual Clarity Project ID

// Google Analytics functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

export const trackPageView = (page_path: string, page_title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path,
      page_title,
    });
  }
};

// Microsoft Clarity functions
export const trackClarityEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('event', eventName, data);
  }
};

export const setClarityCustomTag = (key: string, value: string) => {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('set', key, value);
  }
};

// Track common events
export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    location: location || 'unknown'
  });
  
  trackClarityEvent('button_click', {
    button_name: buttonName,
    location: location || 'unknown'
  });
};

export const trackFormSubmission = (formName: string, success: boolean = true) => {
  trackEvent('form_submit', {
    form_name: formName,
    success
  });
  
  trackClarityEvent('form_submit', {
    form_name: formName,
    success
  });
};

export const trackPageError = (error: string, page: string) => {
  trackEvent('page_error', {
    error_message: error,
    page
  });
  
  trackClarityEvent('page_error', {
    error_message: error,
    page
  });
};
