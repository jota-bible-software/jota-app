import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'

import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

  // Determine base URL dynamically based on domain
  // Default to /jota/ for the main domain
  let baseUrl = '/jota/';
  
  // If we're in a browser environment, check for subdomain configuration
  if (typeof window !== 'undefined' && window.JOTA_APP_CONFIG) {
    // Get the base path from our domain detection
    const basePath = window.JOTA_APP_CONFIG.basePath || '';
    baseUrl = basePath ? `/${basePath}/`.replace(/\/\/+/g, '/') : '/';
  }
  
  // For development, use root path if not otherwise specified
  if (process.env.NODE_ENV !== 'production') {
    baseUrl = process.env.VUE_ROUTER_BASE || '/';
  }
  
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Use the determined base URL
    history: createHistory(baseUrl),
  })

  return Router
})
