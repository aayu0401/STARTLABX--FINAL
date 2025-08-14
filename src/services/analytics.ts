import { logEvent, setUserId, setUserProperties, Analytics } from 'firebase/analytics';
import { analytics } from '@/lib/firebase';

// Custom event types for better type safety
export type AnalyticsEventName = 
  // Authentication events
  | 'sign_up_started'
  | 'sign_up_completed'
  | 'sign_up_failed'
  | 'login_started'
  | 'login_completed'
  | 'login_failed'
  | 'logout'
  
  // Navigation events
  | 'page_view'
  | 'dashboard_viewed'
  | 'startups_viewed'
  | 'talent_viewed'
  | 'projects_viewed'
  | 'ai_studio_viewed'
  | 'incubator_viewed'
  
  // User interaction events
  | 'button_clicked'
  | 'form_submitted'
  | 'form_started'
  | 'form_abandoned'
  | 'search_performed'
  | 'filter_applied'
  | 'profile_updated'
  
  // AI features
  | 'ai_match_requested'
  | 'ai_match_completed'
  | 'ai_suggestion_clicked'
  
  // Business events
  | 'startup_created'
  | 'talent_profile_viewed'
  | 'connection_made'
  | 'project_started'
  | 'collaboration_initiated'
  
  // Engagement events
  | 'feature_discovered'
  | 'tutorial_started'
  | 'tutorial_completed'
  | 'help_accessed';

export interface AnalyticsEventParams {
  [key: string]: any;
  page_title?: string;
  page_location?: string;
  button_name?: string;
  form_name?: string;
  search_term?: string;
  filter_type?: string;
  account_type?: 'startup' | 'professional';
  user_type?: string;
  feature_name?: string;
  error_message?: string;
  success?: boolean;
  duration?: number;
  category?: string;
  value?: number;
}

class AnalyticsService {
  private isInitialized = false;

  private async ensureInitialized(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    if (!this.isInitialized && analytics) {
      this.isInitialized = true;
    }
    
    return this.isInitialized;
  }

  async track(eventName: string, parameters?: Record<string, any>): Promise<void> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized || !analytics) {
        console.log('Analytics not available:', eventName, parameters);
        return;
      }

      // Add common parameters
      const eventParams = {
        timestamp: new Date().toISOString(),
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        ...parameters,
      };

      // Use custom events with proper typing
      if (analytics) {
        logEvent(analytics as any, eventName, eventParams);
      }
      console.log('Analytics event tracked:', eventName, eventParams);
    } catch (error) {
      console.error('Error tracking analytics event:', error);
    }
  }

  async setUser(userId: string, properties?: { [key: string]: any }): Promise<void> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized || !analytics) return;

      setUserId(analytics as any, userId);
      
      if (properties) {
        setUserProperties(analytics as any, properties);
      }
    } catch (error) {
      console.error('Error setting user properties:', error);
    }
  }

  // Convenience methods for common events
  async trackPageView(pageName: string, additionalParams?: Record<string, any>): Promise<void> {
    await this.track('page_view', {
      page_title: pageName,
      page_location: typeof window !== 'undefined' ? window.location.pathname : '',
      ...additionalParams,
    });
  }

  async trackSignUp(accountType: 'startup' | 'professional', success: boolean = true): Promise<void> {
    if (success) {
      await this.track('sign_up_completed', { account_type: accountType });
    } else {
      await this.track('sign_up_failed', { account_type: accountType });
    }
  }

  async trackLogin(success: boolean = true, errorMessage?: string): Promise<void> {
    if (success) {
      await this.track('login_completed');
    } else {
      await this.track('login_failed', { error_message: errorMessage });
    }
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
    await this.track('ai_match_requested', {
      feature_name: feature,
      success,
    });
  }

  async trackError(errorType: string, errorMessage: string, context?: string): Promise<void> {
    await this.track('sign_up_failed', {
      error_message: errorMessage,
      category: errorType,
      page_location: context || (typeof window !== 'undefined' ? window.location.pathname : ''),
    });
  }

  async trackEngagement(feature: string, duration?: number): Promise<void> {
    await this.track('feature_discovered', {
      feature_name: feature,
      duration,
    });
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();

// Export convenience functions for easier importing
export const trackEvent = (eventName: string, params?: Record<string, any>) => 
  analyticsService.track(eventName, params);

export const trackPageView = (pageName: string, params?: Record<string, any>) => 
  analyticsService.trackPageView(pageName, params);

export const trackButtonClick = (buttonName: string, context?: string) => 
  analyticsService.trackButtonClick(buttonName, context);

export const trackFormEvent = (formName: string, action: 'started' | 'submitted' | 'abandoned') => 
  analyticsService.trackFormInteraction(formName, action);