// Google Analytics utility functions
export const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID);
  }
};

// Track page views
export const trackPageView = (path) => {
  if (GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
};

// Track custom events
export const trackEvent = (action, category, label, value) => {
  if (GA_MEASUREMENT_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};