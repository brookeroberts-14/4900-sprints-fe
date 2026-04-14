<template>
    <div class="container-fluid mt-4">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="d-flex justify-content-start">
                    <button class="btn btn-outline-danger btn-md mb-3" @click="router.back()" data-testid="create-format-back-btn">
                        <font-awesome-icon :icon="['fas', 'arrow-left']" class="me-1" /> Cancel
                    </button>
                </div>

                <div class="card dark-card shadow">
                    <div class="card-header">
                        <h4 class="text-mtg-light mb-4">Create New Format</h4>
                        
                        <div v-if="showMsg === 'error'" class="alert alert-danger">Failed to create format. Please try again.</div>
                        <div v-if="showMsg === 'success'" class="alert alert-success">Format created successfully!</div> 

                        <form @submit.prevent="handleSubmit">
                            <div class="mb-3">
                                <label class="form-label text-mtg-secondary small">Format Name *</label>
                                <input v-model="form.name" class="form-control form-control-dark" placeholder="e.g. Commander, Modern, Draft" required data-testid="create-format-name-input" />
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label text-mtg-secondary small">Players Per Match *</label>
                                    <input v-model.number="form.players_per_match" type="number" min="1" class="form-control form-control-dark" required data-testid="create-format-players-input" />
                                    <div class="form-text text-muted">Usually 2 or 4.</div>
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label class="form-label text-mtg-secondary small">Rounds Per Match *</label>
                                    <input v-model.number="form.rounds_per_match" type="number" min="1" class="form-control form-control-dark" required data-testid="create-format-rounds-input" />
                                    <div class="form-text text-muted">Usually 1 or 3 (Best of 3).</div>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-outline-success btn-md w-100 mt-3" :disabled="loading" data-testid="create-format-submit-btn">
                                {{ loading ? 'Creating...' : 'Create Format' }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { APIService } from '../http/APIService'

const apiService = new APIService()
const router = useRouter()

const loading = ref(false)
const showMsg = ref('')

const form = reactive({
    name: '',
    players_per_match: 2,
    rounds_per_match: 3
})

async function handleSubmit() {
    loading.value = true
    showMsg.value = ''
    try {
        const payload = {
            name: form.name,
            players_per_match: form.players_per_match,
            rounds_per_match: form.rounds_per_match
        }

        await apiService.createFormat(payload)
        showMsg.value = 'success'
        
        setTimeout(() => router.push('/formats'), 1000)
    }   catch (e) {
        showMsg.value = 'error'
        console.error(e)
    }   finally {
        loading.value = false
    }
}
</script>