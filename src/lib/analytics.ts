import posthog from 'posthog-js';

export const initAnalytics = () => {
  if (import.meta.env.PROD && import.meta.env.VITE_POSTHOG_KEY) {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
      api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
      capture_pageview: true, // Automatically capture pageviews
      persistence: 'localStorage',
      autocapture: true, // Capture clicks, inputs, etc.
    });
  }
};

export const trackEvent = (name: string, properties?: Record<string, any>) => {
  if (import.meta.env.PROD) {
    posthog.capture(name, properties);
  } else {
    console.log(`[Analytics] ${name}:`, properties);
  }
};

export const identifyUser = (id: string, properties?: Record<string, any>) => {
  if (import.meta.env.PROD) {
    posthog.identify(id, properties);
  }
};
