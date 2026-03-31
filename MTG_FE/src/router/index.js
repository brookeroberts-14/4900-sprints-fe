import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Register from '../components/Register.vue'
import Auth from '../components/Auth.vue'
import LeagueList from '../components/LeagueList.vue'
import FormatList from '../components/FormatList.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register', 
    name: 'Register',
    component: Register
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/leagues',
    name: 'LeagueList', 
    component: LeagueList
  },
  {
    path: '/formats',
    name: 'FormatList',
    component: FormatList
  },
]


const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes
 })

export default router