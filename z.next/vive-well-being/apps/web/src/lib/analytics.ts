/**
 * Simple analytics utility for tracking user interactions.
 * In a production environment, this would integrate with services like 
 * Google Analytics, Mixpanel, or PostHog.
 */

type AnalyticsEvent = 
  | { type: 'button_click'; label: string; page: string }
  | { type: 'transaction_expand'; transactionId: string; transactionName: string }
  | { type: 'page_view'; page: string };

class AnalyticsService {
  private static instance: AnalyticsService;
  private isEnabled: boolean = true;

  private constructor() {
    // Initialize analytics provider here if needed
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public track(event: AnalyticsEvent) {
    if (!this.isEnabled) return;

    // For now, we just log to console in development
    // In production, you'd send this to your analytics provider
    console.log(`[Analytics] ${event.type}:`, event);

    // Example integration:
    // if (window.gtag) {
    //   window.gtag('event', event.type, event);
    // }
  }

  public trackButtonClick(label: string, page: string) {
    this.track({ type: 'button_click', label, page });
  }

  public trackTransactionExpand(id: string, name: string) {
    this.track({ type: 'transaction_expand', transactionId: id, transactionName: name });
  }

  public trackPageView(page: string) {
    this.track({ type: 'page_view', page });
  }
}

export const analytics = AnalyticsService.getInstance();
