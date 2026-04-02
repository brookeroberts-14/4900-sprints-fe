<template>
    <div class="container-fluid mt-4">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <button class="btn btn-mtg-outline btn-sm mb-3" @click="router.back()" data-testid="create-league-back-btn">
                </button>
                <div class="card dark-card shadow">
                    <div class="card-header">
                        <div v-if="showMsg === 'error'" class="alert alert-danger">Failed to create league. Please try again.</div>
                        <div v-if="showMsg === 'success'" class="alert alert-success">League created successfully!</div> 

                        <form @submit.prevent="handleSubmit">
                            <div class="mb-3">
                                <label class="form-label text-mtg-secondary small">League Name *</label>
                                <input v-model="form.name" class="form-control form-control-dark" placeholder="The Grand Tournament" required data-testid="create-league-name-input" />

                            </div>
                            <div class="mb-3">
                                <label class="form-label text-mtg-secondary small">Format</label>
                                <select v-model="form.format" class="form-select form-control-dark" data-testid="create-league-format-select">
                                    <option value="">Select format</option>
                                    <option v-for="f in formats" :key="f.pk" :value="f.pk">
                                        {{ f.name }} ({{ f.players_per_match  }}) players, {{ f.rounds_per_match }} rounds)

                                    </option>

                                </select>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label text-mtg-secondary small">Start Date *</label>
                                    <input v-model="form.start_date" type="datetime-local" class="form-control form-control-dark" required data-testid="create-league-start-date" />
                                
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label text-mtg-secondary small">End Date *</label>
                                    <input v-model="form.end_date" type="datetime-local" class="form-control form-control-dark" required data-testid="create-league-end-date" />
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label text-mtg-secondary small">Decks Per User</label>
                                    <input v-model.number="form.deck_per_user" type="number" min="1" class="form-control form-control-dark" data-testid="create-league-decks-per-user" />
                                </div>
                                <div class="col-md-6 md-3">
                                    <label class="form-label text-mtg-secondary small">Match Quantity</label>
                                    <input v-model.number="form.match_qty" type="number" min="1" class="form-control form-control-dark" data-testid="create-league-match-qty" />
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label txt-mtg-secondary small">Win Points</label>
                                    <input v-model.number="form.points_win" type="number" min="0" class="form-control form-control-dark" data-testid="create-league-points-win" />

                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label text-mtg-secondary small">Loss Points</label>
                                    <input v-model.number="form.points_loss" type="number" min="0" class="form-control form-control-dark" data-testid="create-league-points-loss" />

                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label txt-mtg-secondary small">Draw Points</label>
                                    <input v-model.number="form.points_draw" type="number" min="0" class="form-control form-control-dark" data-testid="create-league-points-draw" />

                                </div>
                            </div>

                            <button type="submit" class="btn btn-mtg-primary w-100" :disabled="loading" data-testid="create-league-submit-btn">
                                {{ loading ? 'Creating...' : 'Create League' }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { APIService } from '../http/APIService'

const apiService = new APIService()
const router = useRouter()

const formats = ref([])
const loading = ref(flase)
const showMsg = ref('')

const from = reactive({
    name: '', format: '', start_date: '', end_date: '',
    decks_per_user: 1, match_qty: 1, points_win: 3, points_loss: 0, points_draw: 1,
})

onMounted(async () => {
    try {
        const res = await apiService.getFormats()
        formats.value = res.data.data || res.data
    } catch (e) { console.error(e) }
})

async function handleSubmit() {
    loading.value = true
    showMsg.value = ''
    try {
        const payload = {
            name: form.name,
            start_date: new Date(form.start_date).toISOString(),
            end_date: new Date(form.end_date).toISOString(),
            decks_per_user: form.decks_per_user,
            match_qty: form.match_qty,
            points_win: form.points_win,
            points_loss: form.points_loss,
            points_draw: form.points_draw,
        }
        if (form.format) payload.format = parseInt(form.format)

        const res = await apiService.createLeague(payload)
        showMsg.value = 'success'
        setTimeout(() => router.push(`/league/${res.data.pk}`), 500)
    }   catch (e) {
        showMsg.value = 'error'
        console.error(e)
    }   finally {
        loading.value = false
    }
}
</script>