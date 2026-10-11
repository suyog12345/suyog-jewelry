import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Disable browser default scroll restoration so route transitions always start at top
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // If there is a hash (e.g. /faq#returns), scroll to that element
    if (hash) {
      const targetId = hash.replace(/^#/, '');
      const element = document.getElementById(targetId) || document.querySelector(`[name="${targetId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'instant' });
        return;
      }
    }

    // Temporarily set scroll-behavior to auto to ensure instant scroll without smooth animation
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
