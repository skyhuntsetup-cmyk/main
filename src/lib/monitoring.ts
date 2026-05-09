import * as Sentry from "@sentry/react";

export const initMonitoring = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
      ],
      tracesSampleRate: 1.0,
    });
  }
};

export const logError = (error: Error, context?: any) => {
  console.error(error, context);
  if (import.meta.env.PROD) {
    Sentry.captureException(error, { extra: context });
  }
};
