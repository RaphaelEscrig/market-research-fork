'use client';

import { PostHogProvider } from 'posthog-js/react';
import { FC, ReactNode, useEffect } from 'react';
import app from '@/modules/app/core/main';
import { useAnalytics } from '@/modules/shared/analytics/react/hooks';
import { usePathname } from 'next/navigation';
import { PostHogAdapter } from '@/modules/shared/analytics/core/infrastructure/posthog-analytics.adapter';

const AppWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const pathName = usePathname();
  const { trackPageView } = useAnalytics(app.analytics);

  useEffect(() => {
    app.init().then(() => {
      app.analytics = new PostHogAdapter(app.env.LINKUP_WEB_APP_PUBLIC_POSTHOG_API_KEY, {
        api_host: 'https://eu.i.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false, //  Since it's a SAP, this event doesn't trigger on navigation and we need to capture $pageview events manually. (https://posthog.com/docs/libraries/js#single-page-apps-and-pageviews)
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') posthog.debug(false); // debug mode in development
        },
      });
    });
  }, []);

  useEffect(() => {
    if (pathName) {
      trackPageView();
    }
  }, [pathName, trackPageView]);

  return <PostHogProvider client={app.analytics.client}>{children}</PostHogProvider>;
};

export default AppWrapper;
