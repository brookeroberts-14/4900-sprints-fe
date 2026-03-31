<template>
  <div class="container-fluid mt-4">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card shadow">
          <div class="card-header text-white d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Leagues</h4>
          </div>
          
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Format</th>
                    <th class="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="league in dummyLeagues" :key="league.pk">
                    <td>{{ league.pk }}</td>
                    <td>{{ league.name }}</td>
                    <td>{{ league.format }}</td>
                    <td class="text-center">
                      <button class="btn btn-sm btn-info me-2 text-white">Details</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-3 small text-muted text-center">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeagueList',
  data: () => ({
    // Hardcoded array so the page shows data immediately
    dummyLeagues: [
      { pk: 1, name: "Summer Championship", format: "Standard" },
      { pk: 2, name: "Friday Night Lights", format: "Modern" },
      { pk: 3, name: "Junior League", format: "Pauper" }
    ]
  })
}
</script>

<style scoped>
.card-header {
  background-color: cadetblue !important;
}
.table th {
  font-weight: 600;
}
</style>