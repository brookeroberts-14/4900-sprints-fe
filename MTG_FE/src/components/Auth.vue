<template>
  <div class="container mt-5">
    <div class="row align-items-center justify-content-center">
      <div class="col-12 col-sm-6 col-md-4 col-lg-4">
        <div class="card mx-auto shadow">
          <div class="card-body">
            <div class="card-title text-center"><h3>Login</h3></div>
            
            <div v-if="showMsg === 'loginError'" class="alert alert-danger" role="alert">
              Invalid username or password. Please try again.
            </div>
            <div v-else-if="showMsg === 'axiosError'" class="alert alert-danger" role="alert">
              Access blocked by server. Check server.
            </div>

            <div class="card-text pt-2">
              <form @submit.prevent="login">
                <div class="mb-3">
                  <div class="input-group">
                    <span class="input-group-text">@</span>
                    <input 
                      v-model="credentials.username" 
                      type="text" 
                      class="form-control" 
                      placeholder="Username" 
                      required
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <div class="input-group">
                    <span class="input-group-text">***</span>
                    <input 
                      :type="showPassword ? 'text' : 'password'" 
                      v-model="credentials.password" 
                      class="form-control" 
                      placeholder="Password" 
                      required
                      @keyup.enter="login"
                    />
                    <button 
                      class="btn btn-outline-secondary" 
                      type="button" 
                      @click="showPassword = !showPassword"
                    >
                      {{ showPassword ? 'Hide' : 'Show' }}
                    </button>
                  </div>
                </div>

                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary">Login</button>
                </div>
              </form>
              
              <div class="mt-3 text-center">
                <small>Don't have an account? <router-link to="/register">Register here</router-link></small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '../router';
import { APIService } from "../http/APIService";
const apiService = new APIService();

export default {
  name: "Auth",
  data: () => ({
    credentials: {
      username: '',
      password: ''
    },
    showMsg: "",
    showPassword: false,
  }),
  methods: {
    login() {
      // Clear previous session data
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      apiService.authenticateLogin(this.credentials)
        .then((response) => {
          // Store JWT tokens
          const access = response.data.access;
          const refresh = response.data.refresh;
          
          localStorage.setItem("access", access);
          localStorage.setItem("refresh", refresh);
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("log_user", JSON.stringify(this.credentials.username));
          
          // Use window.location to force a refresh and update the Navbar state in App.vue
          window.location.href = "/";
        })
        .catch(error => {
          console.error("Error during login:", error);
          if (!error.response) { 
            // Network error (Server down or CORS issue)
            this.showMsg = "axiosError";
          } else if (error.response.status === 401 || error.response.status === 400) { 
            this.showMsg = "loginError";
          } else {
            this.showMsg = "axiosError";
          }
        });
    }
  }
}
</script>