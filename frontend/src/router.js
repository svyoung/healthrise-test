import { createRouter, createWebHistory } from 'vue-router'
import Homepage from './components/HomePage.vue'
import LoginPage from './components/LoginPage.vue'
import ActivityLog from './components/activitylog/ActivityLog.vue'


const routes = [
    { path: '/', name: 'Home', component: Homepage },
    { path: '/login', name: 'Login', component: LoginPage },
    { path: '/activitylog', name: 'ActivityLog', component: ActivityLog }
  ]
  
const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
    const isLoggedIn = localStorage.getItem('token') // or your auth check
    if (to.name !== 'Login' && !isLoggedIn) next({ name: 'Login' })
    else next()
})

export default router
  