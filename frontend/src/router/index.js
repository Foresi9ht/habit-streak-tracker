import { createRouter, createWebHistory } from "vue-router";
const Login = () => import("../components/Login.vue");
const Register = () => import("../components/Register.vue");
const MyHabit = () => import("../components/MyHabit.vue");
const HabitDetails = () => import("../components/HabitDetails.vue");
const NotFound = () => import("../components/NotFound.vue");

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/habits",
    component: MyHabit,
    meta: { requiresAuth: true },
    children: [
      {
        path: ":id",
        component: HabitDetails,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem("userToken");
  if (to.meta.requiresAuth && !loggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
