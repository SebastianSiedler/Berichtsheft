import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    component: () =>
      import(
        /* webpackChunkName: "LandingPage" */ 'views/zLandingPage/Home.vue'
      ),
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () =>
      import(
        /* webpackChunkName: "SignupSelect" */ 'views/Authentication/SignUp/SignUp.vue'
      ),
  },
  {
    path: '/signup/private',
    name: 'SignupPrivate',
    component: () =>
      import(
        /* webpackChunkName: "SignupPrivate" */ 'views/Authentication/SignUp/Private/Private.vue'
      ),
  },
  {
    path: '/signup/enterprise',
    name: 'SignupEnterprise',
    component: () =>
      import(
        /* webpackChunkName: "SignupEnterprise" */ 'views/Authentication/SignUp/Enterprise/Enterprise.vue'
      ),
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(
        /* webpackChunkName: "Login" */ 'views/Authentication/Login/Login.vue'
      ),
  },
  {
    path: '/login/activate',
    name: 'ActivateCompanyAndAccount',
    component: () =>
      import(
        /* webpackChunkName: "LoginActiveAccount" */ 'views/Authentication/AccountActions/Activate.vue'
      ),
  },
  {
    path: '/login/resetpassword',
    name: 'ResetPassword',
    component: () =>
      import(
        /* webpackChunkName: "ResetPassword" */ 'views/Authentication/AccountActions/sendMailResetPassword.vue'
      ),
  },
  {
    path: '/login/password/new:token?',
    name: 'PasswordNew',
    component: () =>
      import(
        /* webpackChunkName: "NewPassword" */ 'views/Authentication/AccountActions/NewUserPassword.vue'
      ),
  },
  {
    path: '/login/password/reset:token?',
    name: 'PasswordReset',
    component: () =>
      import(
        /* webpackChunkName: "ResetPassword" */
        'views/Authentication/AccountActions/NewUserPassword.vue'
      ),
  },
  {
    path: '/login/password/change',
    name: 'PasswordChange',
    component: () =>
      import(
        /* webpackChunkName: "ChangePassword" */ 'views/Authentication/AccountActions/NewUserPassword.vue'
      ),
  },

  // Page Not found
  {
    path: '/:catchAll(.*)*',
    component: () =>
      import(
        /* webpackChunkName: "Error404" */ 'views/Navigation/Error404.vue'
      ),
  },
];

export default routes.map((route) => {
  const meta = {
    guest: true,
    requiresAuth: false,
  };
  return { ...route, meta };
});
