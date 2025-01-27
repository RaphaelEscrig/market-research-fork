import type { IAnalytics } from '@/modules/shared/analytics/core/domain';
import { InMemoryAnalyticsProvider } from '@/modules/shared/analytics/core/infrastructure/in-memory-analytics.adapter';
import type { Configuration } from './domain';

export class App {
  private envVariables: Configuration.Env;
  private analyticsProvider: IAnalytics;

  constructor() {
    this.envVariables = {
      LINKUP_WEB_APP_PUBLIC_POSTHOG_API_KEY: '',
    };
    this.analyticsProvider = new InMemoryAnalyticsProvider();
  }

  get env(): Configuration.Env {
    return this.envVariables;
  }

  get analytics(): IAnalytics {
    return this.analyticsProvider;
  }

  set analytics(analytics: IAnalytics) {
    this.analyticsProvider = analytics;
  }

  public async init() {
    console.log('App initialized');
    await this.initEnvVariables();
  }

  private async initEnvVariables() {
    return fetch('/api/configuration')
      .then((env) => env.json())
      .then((env: Configuration.Env) => (this.envVariables = env));
  }
}

const app = new App();

export default app;
