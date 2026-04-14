import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Register from '../components/Register.vue'
import Auth from '../components/Auth.vue'
import LeagueList from '../components/LeagueList.vue'
import FormatList from '../components/FormatList.vue'
import LeagueDetail from '../components/LeagueDetail.vue'
import CreateLeague from '../components/CreateLeague.vue'
import CreateFormat from '../components/CreateFormat.vue'

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
  {
    path: '/league_detail/:pk',
    name: 'LeagueDetail',
    component: LeagueDetail
  },
  {
    path: '/create_league',
    name: 'CreateLeague',
    component: CreateLeague
  },
  {
    path: '/create_format',
    name: 'CreateFormat',
    component: CreateFormat
  },
]


const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes
 })

export default router