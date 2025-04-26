// This script checks the current domain and adjusts the base URL accordingly
(function() {
  // The main domain and paths we want to handle
  const MAIN_DOMAIN = 'netanel.pl';
  const JOTA_PATH = '/jota';

  // Get current hostname
  const hostname = window.location.hostname;

  // Check if we're on a subdomain vs main domain with path
  const isSubdomain = hostname.endsWith('.' + MAIN_DOMAIN);

  // Store the domain and path information for use in the app
  window.JOTA_APP_CONFIG = {
    // Store whether we're on a subdomain (like bible.netanel.pl, biblia.netanel.pl, jota.netanel.pl)
    isSubdomain: isSubdomain,
    // Store the original hostname for debugging
    hostname: hostname,
    // Set basePath to empty for subdomains, or to /jota for main domain
    basePath: isSubdomain ? '' : JOTA_PATH
  };

  // If we're on a subdomain, adjust the base URL
  if (isSubdomain) {
    // Create a base element if it doesn't exist
    let baseElement = document.querySelector('base');
    if (!baseElement) {
      baseElement = document.createElement('base');
      document.head.appendChild(baseElement);
    }

    // Set base href to root path (as if we're not in /jota subdirectory)
    baseElement.href = '/';
  }

  // For debugging
  console.log('Domain detection:', window.JOTA_APP_CONFIG);
})();
