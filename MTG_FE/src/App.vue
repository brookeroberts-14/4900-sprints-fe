<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink, RouterView } from 'vue-router'

const router = useRouter()

// Reactive state
const authenticated = ref(false)
const userName = ref('Guest')

onMounted(() => {
  const isAuth = localStorage.getItem("isAuthenticated")
  if (isAuth && JSON.parse(isAuth) === true) {
    authenticated.value = true
    const savedUser = localStorage.getItem("log_user")
    if (savedUser) {
      userName.value = JSON.parse(savedUser)
    }
  } else {
    authenticated.value = false
    userName.value = 'Guest'
  }
})

const logout = () => {
  localStorage.clear()
  localStorage.setItem("isAuthenticated", false)
  localStorage.setItem("username", "Guest")
  authenticated.value = false
  userName.value = 'Guest'
  window.location.href = "/"; // Force refresh to clear all states
}

const login = () => router.push("/auth")
const register = () => router.push("/register")
</script>

<template>
  <div id="app">
    <nav class="navbar-custom">
      <div class="nav-container">
        <span class="logo">LeagueTracker</span>
        
        <ul class="nav-content">
          <li class="nav-item">
            <router-link :to="{name: 'Home'}">Home</router-link> | 
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              Leagues
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" :to="{name: 'LeagueList'}">View Leagues</router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <router-link class="dropdown-item" :to="{name: 'FormatList'}">Formats</router-link>
              </li>
            </ul>
          </li>
          
          <template v-if="!authenticated">
            <span class="separator">|</span>
            <li class="nav-item">
              <a @click="login" href="javascript:void(0)">Login</a> | 
            </li>
            <li class="nav-item">
              <a @click="register" href="javascript:void(0)">Register</a>
            </li>
          </template>
          
          <template v-else>
            <span class="separator">|</span>
            <span class="user-greeting">Hi, {{ userName }}</span>
            <li class="nav-item">
              <a @click="logout" href="javascript:void(0)">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </nav>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss">
// Global Resets
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  background-color: #f8f9fa;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.navbar-custom {
  background-color: cadetblue;
  padding: 0.75rem 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: center;

  .nav-container {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 1200px;
  }
}

.logo {
  font-weight: bold;
  font-size: 1.4rem;
  color: white;
  margin-right: auto; // Pushes everything else to the right
}

.nav-content {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;

  .nav-item {
    display: flex;
    align-items: center;
    font-weight: bold;
    color: #2c3e50;

    a {
      padding: 0.5rem;
      color: #2c3e50;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: white;
      }

      &.router-link-exact-active {
        color: #42b983; // Vue green for active state
      }
    }
  }
}

.separator {
  padding: 0 5px;
  color: #2c3e50;
  font-weight: bold;
}

.user-greeting {
  font-weight: bold;
  color: white;
  margin: 0 1rem;
  font-style: italic;
}

.content {
  padding: 2rem;
  text-align: center;
}
</style>