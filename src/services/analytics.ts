// Analytics service for backend integration (no Firebase)

class AnalyticsService {
  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  async track(eventName: string, parameters?: Record<string, any>): Promise<void> {
    if (!this.isClient()) {
      console.log('[Analytics - Server]:', eventName, parameters);
      return;
    }

    // Log to console for now - will integrate with backend analytics endpoint
    console.log('[Analytics]:', eventName, {
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      ...parameters,
    });

    // TODO: Send to backend analytics service
    // await apiClient.post('/api/analytics/events', { eventName, parameters });
  }

  async setUser(userId: string, properties?: { [key: string]: any }): Promise<void> {
    if (!this.isClient()) return;
    console.log('[Analytics] Set User:', userId, properties);
  }

  async trackPageView(pageName: string, additionalParams?: Record<string, any>): Promise<void> {
    await this.track('page_view', {
      page_title: pageName,
      page_location: this.isClient() ? window.location.pathname : '',
      ...additionalParams,
    });
  }

  async trackSignUp(accountType: 'startup' | 'professional', success: boolean = true): Promise<void> {
    await this.track(success ? 'sign_up_completed' : 'sign_up_failed', { account_type: accountType });
  }

  async trackLogin(success: boolean = true, errorMessage?: string): Promise<void> {
    await this.track(success ? 'login_completed' : 'login_failed', { error_message: errorMessage });
  }

  async trackButtonClick(buttonName: string, context?: string): Promise<void> {
    await this.track('button_clicked', {
      button_name: buttonName,
      category: context,
    });
  }

  async trackFormInteraction(formName: string, action: 'started' | 'submitted' | 'abandoned'): Promise<void> {
    const eventMap = {
      started: 'form_started',
      submitted: 'form_submitted',
      abandoned: 'form_abandoned',
    } as const;
    await this.track(eventMap[action], { form_name: formName });
  }

  async trackAIFeature(feature: string, success: boolean = true): Promise<void> {
    await this.track('ai_match_requested', { feature_name: feature, success });
  }

  async trackError(errorType: string, errorMessage: string, context?: string): Promise<void> {
    await this.track('error', {
      error_message: errorMessage,
      category: errorType,
      page_location: context || (this.isClient() ? window.location.pathname : ''),
    });
  }

  async trackEngagement(feature: string, duration?: number): Promise<void> {
    await this.track('feature_discovered', { feature_name: feature, duration });
  }
}

export const analyticsService = new AnalyticsService();

export const trackEvent = (eventName: string, params?: Record<string, any>) =>
  analyticsService.track(eventName, params);

export const trackPageView = (pageName: string, params?: Record<string, any>) =>
  analyticsService.trackPageView(pageName, params);

export const trackButtonClick = (buttonName: string, context?: string) =>
  analyticsService.trackButtonClick(buttonName, context);

export const trackFormEvent = (formName: string, action: 'started' | 'submitted' | 'abandoned') =>
  analyticsService.trackFormInteraction(formName, action);