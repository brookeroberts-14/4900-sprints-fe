<template>
  <div class="container-fluid mt-4">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card shadow">
          <div class="card-header text-white d-flex justify-content-between align-items-center" style="background-color: cadetblue !important;">
            <h4 class="mb-0">Game Formats</h4>
            <button class="btn btn-light btn-sm" @click="getFormats">Refresh</button>
          </div>
          
          <div class="card-body">
            <div v-if="showMsg === 'loading'" class="text-center py-5">
              <div class="spinner-border text-info"></div>
            </div>

            <div v-else class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>PK</th>
                    <th>Format Name</th>
                    <th>Players</th>
                    <th>Rounds</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="format in formats" :key="format.pk">
                    <td>{{ format.pk }}</td>
                    <td><strong>{{ format.name }}</strong></td>
                    <td>{{ format.players_per_match }}</td>
                    <td>{{ format.rounds_per_match }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="formats.length === 0 && showMsg !== 'loading'" class="text-center py-3">
              No formats found.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { APIService } from '../http/APIService';
const apiService = new APIService();

export default {
  name: 'FormatList',
  data: () => ({
    formats: [],
    showMsg: ''
  }),
  methods: {
    getFormats() {
      this.showMsg = 'loading';
      apiService.getFormats()
        .then(response => {
          // Using the same .data.data nesting logic as your leagues
          this.formats = response.data.data || response.data;
          this.showMsg = '';
        })
        .catch(error => {
          this.showMsg = 'error';
          console.error(error);
        });
    }
  },
  mounted() {
    this.getFormats();
  }
}
</script>