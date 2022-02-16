//import { RouteRecordRaw } from 'vue-router';

import publicRoutes from './public';
import privateRoutes from './private';
import { RouteRecordRaw } from 'vue-router';

const all_routes = publicRoutes.concat(privateRoutes);

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
];

export default routes.concat(all_routes);
