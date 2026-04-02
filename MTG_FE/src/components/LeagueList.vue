<template>
  <div class="container-fluid mt-4">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card shadow">
          <div class="card-header text-white d-flex justify-content-between align-items-center" style="background-color: cadetblue !important;">
            <h4 class="mb-0">Leagues</h4>
            <button class="btn btn-light btn-sm" @click="getLeagues">Refresh</button>
          </div>
          
          <div class="card-body">
            <div v-if="showMsg === 'loading'" class="text-center py-5">
              <div class="spinner-border text-info" role="status"></div>
            </div>

            <div v-else-if="showMsg === 'error'" class="alert alert-danger">
              Unable to load leagues. Please ensure you are logged in or API is on.
            </div>

            <div v-else class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>ID</th>
                    <th>League Name</th>
                    <th>Format</th>
                    <th class="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="league in leagues" :key="league.pk">
                    <td>{{ league.pk }}</td>
                    <td>{{ league.name }}</td>
                    <td>{{ league.format.name }}</td>
                    <td class="text-center">
                      <button class="btn btn-sm btn-info text-white"><router-link  :to="{name: 'LeagueDetail'}" class="text-white" style="text-decoration: none;">Details</router-link></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div v-if="!showMsg && leagues.length === 0" class="text-center py-3">
              <p class="text-muted">No leagues found.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-3">
            <button type="button" class="btn btn-primary btn-sm shadow-sm">
                Create New League
            </button>
      </div>
    </div>
  </div>
</template>

<script>
import { APIService } from '../http/APIService';
const apiService = new APIService();

export default {
  name: 'LeagueList',
  data: () => ({
    leagues: [],
    showMsg: '',
  }),
  methods: {
    getLeagues() {
  this.showMsg = 'loading';
  apiService.getLeagues()
    .then(response => {
      // Based on your screenshot, the array is inside response.data.data
      this.leagues = response.data.data; 
      
      this.showMsg = '';
      console.log("Leagues assigned:", this.leagues);
    })
    .catch(error => {
      this.showMsg = 'error';
      console.error(error);
    });
}
  },
  mounted() {
    this.getLeagues();
  }
}
</script>

<style scoped>
.card-header {
  background-color: cadetblue !important;
}

.text-cadetblue {
  color: cadetblue;
}

.table th {
  font-weight: 600;
  color: #495057;
}
</style>