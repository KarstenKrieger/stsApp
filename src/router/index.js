import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../views/HomeView.vue";
import LoginPage from '../components/LoginPage.vue'
import TokenCode from '../components/TokenCode.vue'
import RegisterPage from '../components/RegisterPage.vue'
import PasswordManagement from '../components/PasswordManagement.vue'
import EditProfile from '../components/EditProfile.vue'
import ConfirmRegister from '../components/ConfirmRegister.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: MainPage,
        meta: { hideNavigation: false, login: true }
    },
    {
        path: '/login',
        component: LoginPage,
        name: 'login',
        meta: { hideNavigation: true, login: false }
    },
    {
        path: '/token',
        component: TokenCode,
        name: 'token',
        meta: { hideNavigation: true, login: false }
    },
    {
        path: '/register',
        component: RegisterPage,
        name: 'register',
        meta: { hideNavigation: true, login: false }
    },
    {
        path: '/passwordmanagement',
        component: PasswordManagement,
        name: 'passwordManagement',
        meta: { hideNavigation: false, login: true }
    },
    {
        path: '/editprofile',
        component: EditProfile,
        name: 'editProfile',
        meta: { hideNavigation: false, login: true }
    },
    {
        path: '/confirmregister',
        component: ConfirmRegister,
        name: 'confirmRegister',
        meta: { hideNavigation: true, login: false }
    },
    {
        path: "/about",
        name: "about",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
