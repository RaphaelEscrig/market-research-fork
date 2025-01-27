import posthog, { type PostHogConfig } from 'posthog-js';
import type { IAnalytics } from '@/modules/shared/analytics/core/domain';

export class PostHogAdapter implements IAnalytics {
  constructor(apiKey: string, options: Partial<PostHogConfig>) {
    posthog.init(apiKey, options);
  }

  get client() {
    return posthog;
  }

  trackEvent(event: string, properties?: Record<string, unknown>): void {
    posthog.capture(event, {
      distinct_id: posthog.get_distinct_id(),
      ...properties,
    });
  }
}
