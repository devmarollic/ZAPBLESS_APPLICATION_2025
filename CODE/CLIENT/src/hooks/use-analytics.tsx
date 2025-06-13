
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/lib/analytics';
import { updatePageSEO } from '@/lib/seo';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Update SEO for the current page
    updatePageSEO(location.pathname);
    
    // Track page views on route changes
    const page_path = location.pathname + location.search;
    const page_title = document.title;
    
    trackPageView(page_path, page_title);
  }, [location]);

  return null;
};
