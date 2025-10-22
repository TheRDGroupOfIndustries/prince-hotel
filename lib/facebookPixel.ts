interface FacebookEventParameters {
  content_name?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
  search_string?: string;
  [key: string]: unknown; 
}

export const trackFacebookEvent = (event: string, parameters?: FacebookEventParameters) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, parameters)
  }
}

export const facebookEvents = {
  pageView: () => trackFacebookEvent('PageView'),
  viewContent: (contentName: string, contentId: string, value?: number) =>
    trackFacebookEvent('ViewContent', {
      content_name: contentName,
      content_ids: [contentId],
      content_type: 'product',
      value,
      currency: 'INR'
    }),
  initiateCheckout: (value?: number) =>
    trackFacebookEvent('InitiateCheckout', {
      value,
      currency: 'INR'
    }),
  purchase: (value: number, currency: string = 'INR') =>
    trackFacebookEvent('Purchase', {
      value,
      currency
    }),
  search: (searchString: string) =>
    trackFacebookEvent('Search', {
      search_string: searchString
    }),
  contact: () => trackFacebookEvent('Contact'),
  completeRegistration: () => trackFacebookEvent('CompleteRegistration')
}