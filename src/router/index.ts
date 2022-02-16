import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes/index';
import { Store as store } from 'src/store/index';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const createHistory = process.env.SERVER
  ? createMemoryHistory
  : process.env.VUE_ROUTER_MODE === 'history'
  ? createWebHistory
  : createWebHashHistory;

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,

  // Leave this as is and make changes in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  history: createHistory(
    process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
  ),
});

router.beforeEach((to, from, next) => {
  // nur Angemeldete Nutzer
  const isAuthenticated = store.state.auth.isAuthenticated;

  // Route für Gäste (nicht angemeldete) only
  const guest = to.matched.some((record) => record.meta.guest);

  // Route nur für angemeldete
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // Wenn ein Gast eine requiresAuth Seite besuchen will wird auf /login geleitet
  if (!isAuthenticated && requiresAuth) {
    return next('/login');
  }
  if (isAuthenticated && guest) {
    return next('/');
  }

  next();
});

export default router;
