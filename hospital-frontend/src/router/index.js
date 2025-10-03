import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "../stores/auth"
import LoginView from "../views/LoginView.vue"
import SignupView from "../views/SignupView.vue"
import DashboardLayout from "../layouts/DashboardLayout.vue"
import DashboardView from "../views/DashboardView.vue"
import PatientsView from "../views/PatientsView.vue"
import DoctorsView from "../views/DoctorsView.vue"
import NursesView from "../views/NursesView.vue"
import UsersView from "../views/UsersView.vue"

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { requiresGuest: true },
  },
  {
    path: "/signup",
    name: "Signup",
    component: SignupView,
    meta: { requiresGuest: true },
  },
  {
    path: "/",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "Dashboard",
        component: DashboardView,
      },
      {
        path: "patients",
        name: "Patients",
        component: PatientsView,
      },
      {
        path: "doctors",
        name: "Doctors",
        component: DoctorsView,
      },
      {
        path: "nurses",
        name: "Nurses",
        component: NursesView,
      },
      {
        path: "users",
        name: "Users",
        component: UsersView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login")
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next("/")
  } else {
    next()
  }
})

export default router
