import { IAnalytics } from '../domain';

export class InMemoryAnalyticsProvider implements IAnalytics {
  get client() {
    return null;
  }

  trackEvent(_event: string, _properties?: Record<string, unknown>): void {
    return;
  }
}
