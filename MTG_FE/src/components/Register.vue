<template>
    <div class="container-fluid mt-5">
        <div class="row align-items-center justify-content-center">
            <div class="col col-12 col-sm-6 col-md-10 col-lg-6">
                <div class="card shadow">
                    <div class="card-header bg-primary text-white">Register</div>
                    
                    <div v-if="showMsg === 'error'" class="alert alert-danger m-2" role="alert">
                        Invalid username or password or user already exists. Please try again.
                    </div>

                    <div class="card-body">
                        <form ref="form" @submit.prevent="register">
                            <div class="container-fluid">
                                <div class="form-group row justify-content-left py-2">
                                    <label class="col-4">Username</label>
                                    <div class="col col-8">
                                        <input v-model="credentials.username" type="text" required class="form-control-sm form-control">
                                    </div>
                                </div>
                                
                                <div class="form-group row justify-content-end py-2">
                                    <label class="col-4">Password</label>
                                    <div class="col col-8">
                                        <input v-model="credentials.password" type="password" required class="form-control-sm form-control">
                                    </div>
                                </div>

                                <div class="form-group row justify-content-left py-2">
                                    <label class="col-4">Re-enter password</label>
                                    <div class="col col-8">
                                        <input v-model="credentials.password2" type="password" required class="form-control-sm form-control">
                                    </div>
                                </div> 

                                <div class="form-group row justify-content-left py-2">
                                    <label class="col-4">Email</label>
                                    <div class="col col-8">
                                        <input v-model="credentials.email" type="email" class="form-control-sm form-control">
                                    </div>
                                </div>       

                                <div class="form-group row justify-content-left py-2">
                                    <label class="col-4">First Name</label>
                                    <div class="col col-8">
                                        <input v-model="credentials.first_name" type="text" class="form-control-sm form-control">
                                    </div>
                                </div>
                                <div class="form-group row justify-content-left py-2">
                                    <label class="col-4">Last Name</label>
                                    <div class="col col-8">
                                        <input v-model="credentials.last_name" type="text" class="form-control-sm form-control">
                                    </div>
                                </div>

                                <div class="row justify-content-around mt-3">
                                    <button type="button" class="btn btn-secondary col-5" @click="login">Back to Login</button>    
                                    <button type="submit" class="btn btn-primary col-5">Register</button>   
                                </div>                                                                                                                                                                                                                      
                           </div>
                        </form>                     
                   </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import router from '../router';
  import { APIService } from '../http/APIService';
  const apiService = new APIService();

  export default {
    name: 'Register',
    data: () => ({
      credentials: {
        username: '',
        password: '',
        password2: '',
        email: '',
        first_name: '',
        last_name: ''
      },
      showMsg: '',
    }),
    methods: {
      register() {    
        // Basic frontend check for matching passwords
        if (this.credentials.password !== this.credentials.password2) {
            this.showMsg = "error";
            return;
        }

        apiService.registerUser(this.credentials)
          .then(response => {
            // Django usually returns 201 Created for a new user
            if (response.status === 201 || response.status === 200) {
              this.showMsg = "";
              router.push('/auth/');
            } else {
              this.showMsg = "error";
            }
          })
          .catch(error => {
            console.error(error);
            this.showMsg = "error";
          });
      },
      login() {
        router.push('/auth/');
      }
    }
  }
</script>