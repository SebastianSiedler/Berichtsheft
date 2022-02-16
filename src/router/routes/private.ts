//import $store from "@/store/index.js";

import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () =>
      import(/* webpackChunkName: "Main" */ 'layouts/MainLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () =>
          import(
            /* webpackChunkName: "Main" */ 'src/views/Dashboard/Dashboard.vue'
          ),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () =>
          import(
            /* webpackChunkName: "Einstellungen" */ 'src/views/Settings/Settings.vue'
          ),
      },

      {
        path: 'reports',
        name: 'Reports',
        component: () =>
          import(
            /* webpackChunkName: "Berichte" */ 'src/views/Berichte/Berichte.vue'
          ),
        children: [
          // Nur Azubi Ansicht
          {
            path: 'nr/:id?',
            name: 'TraineeView',
            component: () =>
              import(
                /* webpackChunkName: "AzubiBericht" */ 'src/views/Berichte/Trainee/Trainee.vue'
              ),
          },
          // Ausbilder oder Teamleiter ansicht
          {
            path: 'u/:uid?/:reportId?',
            name: 'SelectUser',
            component: () =>
              import(
                /* webpackChunkName: "AusbilderTabelle" */ 'src/views/Berichte/Trainer/Supervisor.vue'
              ),
          },
        ],
      },

      {
        path: 'grades',
        name: 'Grades',
        component: () =>
          import(/* webpackChunkName: "Noten" */ 'src/views/Grades/Grades.vue'),
      },
      {
        path: 'admin',
        name: 'Admin',
        component: () =>
          import(
            /* webpackChunkName: "AdminSettings" */ 'src/views/AdminSettings/AdminSettings.vue'
          ),
        redirect: {
          path: '/admin/profile',
        },
        children: [
          {
            path: 'profile',
            component: () =>
              import(
                /* webpackChunkName: "AdminProfile" */ 'src/views/AdminSettings/Profile/Profile.vue'
              ),
          },
          {
            path: 'departments',
            component: () =>
              import(
                /* webpackChunkName: "AdminDepartments" */ 'src/views/AdminSettings/Departments/Departments.vue'
              ),
          },
          {
            path: 'jobyeartemplate',
            component: () =>
              import(
                /* webpackChunkName: "AdminTemplates" */ 'src/views/AdminSettings/JobYearTemplate/JobYearTemplate.vue'
              ),
          },
          {
            path: 'billing',
            component: () =>
              import(
                /* webpackChunkName: "AdminBilling" */ 'src/views/AdminSettings/Billing/Billing.vue'
              ),
          },
          {
            path: 'usermanagement',
            component: () =>
              import(
                /* webpackChunkName: "AdminUserMgmt" */ 'src/views/AdminSettings/UserManagement/UserManagement.vue'
              ),
          },
        ],
      },
    ],
  },
];

export default routes.map((route) => {
  const meta = {
    guest: false,
    requiresAuth: true,
  };
  return { ...route, meta };
});
