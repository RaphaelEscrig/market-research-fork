import type { IAnalytics } from '@/modules/shared/analytics/core/domain';

export const useAnalytics = (analytics: IAnalytics) => {
  const trackPageView = (): void => {
    analytics.trackEvent('$pageview', {
      current_url: window.location.href,
      path: location.pathname,
    });
  };

  return {
    trackPageView,
  };
};
