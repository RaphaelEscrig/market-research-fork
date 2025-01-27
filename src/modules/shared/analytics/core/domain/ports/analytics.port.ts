export interface IAnalytics {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any;

  trackEvent(event: string, properties?: Record<string, unknown>): void;
}
