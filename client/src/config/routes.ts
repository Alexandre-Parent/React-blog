import Iroute from "../interfaces/routeInterface"
import LoginPage from "../pages/login"
import EditPage from "../pages/edit"
import BlogPage from "../pages/blog"
import HomePage from "../pages/home"


const authRoutes: Iroute[] = [
    {
        path: "/login",
        exact: true,
        auth: false,
        component: LoginPage,
        name: 'Login'
    },
    {
        path: "/register",
        exact: true,
        auth: false,
        component: LoginPage,
        name: 'Register'
    }
]

const blogRoutes: Iroute[] = [
    {
        path: "/edit",
        exact: true,
        auth: true,
        component: EditPage,
        name: 'Edit'
    },
    {
        path: "/edit/:blogID",
        exact: true,
        auth: true,
        component: EditPage,
        name: 'Edit'
    },
    {
        path: "/edit/:blogID",
        exact: true,
        auth: false,
        component: BlogPage,
        name: 'Blog'
    }

]

const mainRoutes: Iroute[] = [
    {
        path: "/",
        exact: true,
        auth: false,
        component: HomePage,
        name: 'Home'
    }
]

const routes : Iroute[] = [
    ...authRoutes,
    ...blogRoutes,
    ...mainRoutes
]

export default routes