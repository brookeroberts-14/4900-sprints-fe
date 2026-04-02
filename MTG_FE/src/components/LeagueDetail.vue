<template>
  <div class="container-fluid mt-4">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <!-- Back Button -->
        <button class="btn btn-mtg-outline btn-sm mb-3" @click="router.push('/leagues')" data-testid="league-back-btn">
          <font-awesome-icon :icon="['fas', 'arrow-left']" class="me-1" /> Back to Leagues
        </button>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-warning" role="status"></div>
          <p class="text-mtg-secondary mt-2">Loading league...</p>
        </div>

        <template v-else-if="league">
          <!-- League Header -->
          <div class="card dark-card shadow mb-4">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <span class="badge rounded-pill" :class="statusBadge(league.status)" data-testid="league-status-badge">{{ league.status_display }}</span>
                    <span v-if="league.format" class="badge rounded-pill bg-primary bg-opacity-25 text-info">{{ league.format.name }}</span>
                  </div>
                  <h2 class="text-mtg-light mb-1" data-testid="league-name">{{ league.name }}</h2>
                  <p class="text-mtg-secondary small mb-0">
                    {{ players.length }} players &middot; {{ matches.length }} matches &middot; {{ decks.length }} decks
                  </p>
                </div>
                <div class="d-flex gap-2">
                  <button class="btn btn-mtg-primary btn-sm" @click="showJoin = true" data-testid="join-league-btn">
                    <font-awesome-icon :icon="['fas', 'users']" class="me-1" /> Join
                  </button>
                  <button class="btn btn-outline-danger btn-sm" @click="handleDeleteLeague" data-testid="delete-league-btn">
                    <font-awesome-icon :icon="['fas', 'trash']" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <ul class="nav nav-tabs nav-tabs-mtg mb-4" data-testid="league-tabs">
            <li class="nav-item" v-for="tab in tabs" :key="tab.key">
              <a class="nav-link" :class="{ active: activeTab === tab.key }" href="#" @click.prevent="activeTab = tab.key" :data-testid="`tab-${tab.key}`">
                <font-awesome-icon :icon="['fas', tab.icon]" class="me-1" /> {{ tab.label }}
              </a>
            </li>
          </ul>

          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="row g-3">
            <div class="col-md-4">
              <div class="card dark-card p-3">
                <h6 class="text-mtg-secondary small text-uppercase">Point System</h6>
                <div class="d-flex justify-content-between"><span class="text-mtg-secondary">Win</span><span class="badge-win badge rounded-pill">{{ league.points_win }} pts</span></div>
                <div class="d-flex justify-content-between mt-1"><span class="text-mtg-secondary">Loss</span><span class="badge-loss badge rounded-pill">{{ league.points_loss }} pts</span></div>
                <div class="d-flex justify-content-between mt-1"><span class="text-mtg-secondary">Draw</span><span class="badge-draw badge rounded-pill">{{ league.points_draw }} pts</span></div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card dark-card p-3">
                <h6 class="text-mtg-secondary small text-uppercase">League Info</h6>
                <div class="d-flex justify-content-between"><span class="text-mtg-secondary">Decks/User</span><span class="text-mtg-light">{{ league.decks_per_user }}</span></div>
                <div class="d-flex justify-content-between mt-1"><span class="text-mtg-secondary">Match Qty</span><span class="text-mtg-light">{{ league.match_qty }}</span></div>
                <div v-if="league.format" class="d-flex justify-content-between mt-1"><span class="text-mtg-secondary">Format</span><span class="text-mtg-light">{{ league.format.name }}</span></div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card dark-card p-3">
                <h6 class="text-mtg-secondary small text-uppercase">Schedule</h6>
                <div class="d-flex justify-content-between"><span class="text-mtg-secondary">Start</span><span class="text-mtg-light">{{ fmtDate(league.start_date) }}</span></div>
                <div class="d-flex justify-content-between mt-1"><span class="text-mtg-secondary">End</span><span class="text-mtg-light">{{ fmtDate(league.end_date) }}</span></div>
              </div>
            </div>
          </div>

          <!-- Players Tab -->
          <div v-if="activeTab === 'players'">
            <div class="card dark-card shadow">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0 text-mtg-light">Players ({{ players.length }})</h5>
                <button class="btn btn-mtg-primary btn-sm" @click="showJoin = true" data-testid="add-player-btn">
                  <font-awesome-icon :icon="['fas', 'plus']" class="me-1" /> Join
                </button>
              </div>
              <div class="card-body p-0">
                <table class="table table-dark-mtg align-middle mb-0">
                  <thead><tr><th>#</th><th>Player</th><th class="text-end">Points</th></tr></thead>
                  <tbody>
                    <tr v-for="(p, idx) in players" :key="p.pk" :data-testid="`player-row-${p.pk}`">
                      <td class="text-mtg-muted">{{ idx + 1 }}</td>
                      <td class="text-mtg-light fw-semibold">{{ p.player_name }}</td>
                      <td class="text-end text-mtg-accent fw-bold">{{ p.league_player_points }}</td>
                    </tr>
                    <tr v-if="players.length === 0"><td colspan="3" class="text-center text-mtg-secondary py-3">No players yet.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Matches Tab -->
          <div v-if="activeTab === 'matches'">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="text-mtg-light mb-0">Matches ({{ matches.length }})</h5>
              <button class="btn btn-mtg-primary btn-sm" @click="showMatchModal = true" data-testid="create-match-btn">
                <font-awesome-icon :icon="['fas', 'plus']" class="me-1" /> New Match
              </button>
            </div>
            <div v-if="matches.length === 0" class="text-center text-mtg-secondary py-3">No matches yet.</div>
            <div v-for="m in matches" :key="m.pk" class="card dark-card mb-3" :data-testid="`match-card-${m.pk}`">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <strong class="text-mtg-light">Match #{{ m.number }}</strong>
                    <span class="badge rounded-pill ms-2" :class="statusBadge(m.status)">{{ m.status_display }}</span>
                  </div>
                  <div class="d-flex gap-2">
                    <button class="btn btn-mtg-outline btn-sm" @click="openResult(m)" :data-testid="`record-result-btn-${m.pk}`">Record Result</button>
                    <button class="btn btn-outline-danger btn-sm" @click="handleDeleteMatch(m.pk)" :data-testid="`delete-match-btn-${m.pk}`">
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </button>
                  </div>
                </div>
                <div v-if="m.participants?.length" class="mb-2">
                  <small class="text-mtg-muted text-uppercase">Participants:</small>
                  <span v-for="p in m.participants" :key="p.pk" class="badge bg-mtg-surface border-mtg ms-1">{{ p.player_name }} — {{ p.deck_name }}</span>
                </div>
                <div v-if="m.rounds?.length">
                  <small class="text-mtg-muted text-uppercase">Rounds:</small>
                  <span v-for="r in m.rounds" :key="r.pk" class="badge rounded-pill ms-1" :class="statusBadge(r.status)">Rd {{ r.number }}: {{ r.status_display }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Decks Tab -->
          <div v-if="activeTab === 'decks'">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="text-mtg-light mb-0">Decks ({{ decks.length }})</h5>
              <button class="btn btn-mtg-primary btn-sm" @click="showDeckModal = true" data-testid="add-deck-btn">
                <font-awesome-icon :icon="['fas', 'plus']" class="me-1" /> Add Deck
              </button>
            </div>
            <div v-if="decks.length === 0" class="text-center text-mtg-secondary py-3">No decks yet.</div>
            <div class="row g-3">
              <div v-for="d in decks" :key="d.pk" class="col-md-4" :data-testid="`deck-card-${d.pk}`">
                <div class="card dark-card p-3">
                  <h6 class="text-mtg-light mb-1">{{ d.name }}</h6>
                  <small class="text-mtg-secondary">{{ d.league_player?.player_name }}</small>
                  <a v-if="d.url" :href="d.url" target="_blank" class="text-mtg-accent small mt-2 d-block" :data-testid="`deck-url-${d.pk}`">
                    <font-awesome-icon :icon="['fas', 'external-link']" class="me-1" /> View Deck List
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Leaderboard Tab -->
          <div v-if="activeTab === 'leaderboard'">
            <div class="card dark-card shadow">
              <div class="card-header"><h5 class="mb-0 text-mtg-light"><font-awesome-icon :icon="['fas', 'crown']" class="text-mtg-accent me-2" />Leaderboard</h5></div>
              <div class="card-body p-0">
                <table class="table table-dark-mtg align-middle mb-0" data-testid="leaderboard-table">
                  <thead><tr><th>Rank</th><th>Player</th><th class="text-end">Points</th></tr></thead>
                  <tbody>
                    <tr v-for="(p, idx) in leaderboard" :key="p.pk" :data-testid="`leaderboard-row-${idx}`">
                      <td><span v-if="idx === 0" class="text-mtg-accent"><font-awesome-icon :icon="['fas', 'crown']" /></span><span v-else class="text-mtg-muted">{{ idx + 1 }}</span></td>
                      <td class="text-mtg-light fw-semibold">{{ p.player_name }}</td>
                      <td class="text-end text-mtg-accent fw-bold fs-5">{{ p.league_player_points }}</td>
                    </tr>
                    <tr v-if="leaderboard.length === 0"><td colspan="3" class="text-center text-mtg-secondary py-3">No players to rank.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Join Modal -->
    <div v-if="showJoin" class="modal d-block modal-dark" @click.self="showJoin = false">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content">
          <div class="modal-header"><h5 class="modal-title text-mtg-light">Join League</h5><button class="btn-close" @click="showJoin = false"></button></div>
          <div class="modal-body"><p class="text-mtg-secondary">Your account will be added as a player.</p></div>
          <div class="modal-footer">
            <button class="btn btn-mtg-outline" @click="showJoin = false">Cancel</button>
            <button class="btn btn-mtg-primary" @click="handleJoin" data-testid="confirm-join-btn">Join</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Match Modal -->
    <div v-if="showMatchModal" class="modal d-block modal-dark" @click.self="showMatchModal = false">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content" data-testid="create-match-dialog">
          <div class="modal-header"><h5 class="modal-title text-mtg-light">Create Match</h5><button class="btn-close" @click="showMatchModal = false"></button></div>
          <div class="modal-body">
            <label class="form-label text-mtg-secondary small">Match Number</label>
            <input v-model.number="matchNumber" type="number" min="1" class="form-control form-control-dark" data-testid="match-number-input" />
          </div>
          <div class="modal-footer">
            <button class="btn btn-mtg-outline" @click="showMatchModal = false">Cancel</button>
            <button class="btn btn-mtg-primary" @click="handleCreateMatch" data-testid="match-submit-btn">Create</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Deck Modal -->
    <div v-if="showDeckModal" class="modal d-block modal-dark" @click.self="showDeckModal = false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" data-testid="add-deck-dialog">
          <div class="modal-header"><h5 class="modal-title text-mtg-light">Add Deck</h5><button class="btn-close" @click="showDeckModal = false"></button></div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label text-mtg-secondary small">Player</label>
              <select v-model="deckForm.league_player" class="form-select form-control-dark" data-testid="deck-player-select">
                <option value="">Select player</option>
                <option v-for="p in players" :key="p.pk" :value="p.pk">{{ p.player_name }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label text-mtg-secondary small">Deck Name</label>
              <input v-model="deckForm.name" class="form-control form-control-dark" placeholder="Fire Deck" data-testid="deck-name-input" />
            </div>
            <div class="mb-3">
              <label class="form-label text-mtg-secondary small">Deck URL (optional)</label>
              <input v-model="deckForm.url" class="form-control form-control-dark" placeholder="https://moxfield.com/decks/..." data-testid="deck-url-input" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-mtg-outline" @click="showDeckModal = false">Cancel</button>
            <button class="btn btn-mtg-primary" @click="handleCreateDeck" data-testid="deck-submit-btn">Add Deck</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Record Result Modal -->
    <div v-if="showResultModal" class="modal d-block modal-dark" @click.self="showResultModal = false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" data-testid="record-result-dialog">
          <div class="modal-header"><h5 class="modal-title text-mtg-light">Record Result — Match #{{ selectedMatch?.number }}</h5><button class="btn-close" @click="showResultModal = false"></button></div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label text-mtg-secondary small">Round</label>
              <select v-model="resultForm.round" class="form-select form-control-dark" data-testid="result-round-select">
                <option value="">Select round</option>
                <option v-for="r in selectedMatch?.rounds" :key="r.pk" :value="r.pk">Round {{ r.number }} ({{ r.status_display }})</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label text-mtg-secondary small">Player</label>
              <select v-model="resultForm.player" class="form-select form-control-dark" data-testid="result-player-select">
                <option value="">Select player</option>
                <option v-for="p in players" :key="p.pk" :value="p.pk">{{ p.player_name }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label text-mtg-secondary small">Result</label>
              <select v-model="resultForm.result" class="form-select form-control-dark" @change="updatePoints" data-testid="result-outcome-select">
                <option value="w">Win</option><option value="l">Loss</option><option value="d">Draw</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label text-mtg-secondary small">Points</label>
              <input v-model.number="resultForm.points" type="number" class="form-control form-control-dark" data-testid="result-points-input" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-mtg-outline" @click="showResultModal = false">Cancel</button>
            <button class="btn btn-mtg-primary" @click="handleRecordResult" data-testid="result-submit-btn">Record</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { APIService } from '../http/APIService'

const apiService = new APIService()
const route = useRoute()
const router = useRouter()
const id = route.params.id

const loading = ref(true)
const league = ref(null)
const players = ref([])
const decks = ref([])
const matches = ref([])
const activeTab = ref('overview')

const showJoin = ref(false)
const showMatchModal = ref(false)
const showDeckModal = ref(false)
const showResultModal = ref(false)
const selectedMatch = ref(null)
const matchNumber = ref(1)

const deckForm = reactive({ name: '', url: '', league_player: '' })
const resultForm = reactive({ round: '', player: '', result: 'w', points: 0 })

const tabs = [
  { key: 'overview', label: 'Overview', icon: 'trophy' },
  { key: 'players', label: 'Players', icon: 'users' },
  { key: 'matches', label: 'Matches', icon: 'dice' },
  { key: 'decks', label: 'Decks', icon: 'book' },
  { key: 'leaderboard', label: 'Leaderboard', icon: 'crown' },
]

const statusBadge = (s) => ({ a: 'badge-active', c: 'badge-completed', p: 'badge-pending' }[s] || 'badge-pending')
const fmtDate = (d) => d ? new Date(d).toLocaleDateString() : 'N/A'
const leaderboard = computed(() => [...players.value].sort((a, b) => b.league_player_points - a.league_player_points))

async function loadData() {
  try {
    const res = await apiService.getLeague(id)
    league.value = res.data
    loading.value = false
    const lid = parseInt(id)
    try { players.value = ((await apiService.getLeaguePlayers()).data.data || []).filter(p => p.league === lid) } catch {}
    try { decks.value = ((await apiService.getDecks()).data.data || []).filter(d => d.league_player?.league === lid) } catch {}
    try { matches.value = ((await apiService.getMatches()).data.data || []).filter(m => m.league === lid) } catch {}
  } catch (e) {
    console.error(e)
    loading.value = false
  }
}

async function handleJoin() {
  try { await apiService.createLeaguePlayer({ league: parseInt(id) }); showJoin.value = false; loadData() }
  catch (e) { alert('Failed to join: ' + JSON.stringify(e.response?.data || e.message)) }
}

async function handleCreateMatch() {
  try { await apiService.createMatch({ league: parseInt(id), number: matchNumber.value }); showMatchModal.value = false; loadData() }
  catch (e) { alert('Failed: ' + JSON.stringify(e.response?.data || e.message)) }
}

async function handleCreateDeck() {
  if (!deckForm.name || !deckForm.league_player) return
  try {
    await apiService.createDeck({ name: deckForm.name, url: deckForm.url || '', league_player: parseInt(deckForm.league_player) })
    showDeckModal.value = false; Object.assign(deckForm, { name: '', url: '', league_player: '' }); loadData()
  } catch (e) { alert('Failed: ' + JSON.stringify(e.response?.data || e.message)) }
}

function openResult(m) {
  selectedMatch.value = m
  resultForm.round = ''; resultForm.player = ''; resultForm.result = 'w'
  resultForm.points = league.value?.points_win || 0
  showResultModal.value = true
}

function updatePoints() {
  if (!league.value) return
  resultForm.points = resultForm.result === 'w' ? league.value.points_win : resultForm.result === 'l' ? league.value.points_loss : league.value.points_draw
}

async function handleRecordResult() {
  if (!resultForm.round || !resultForm.player) return
  try {
    await apiService.createMatchRoundPlayer({ round: parseInt(resultForm.round), player: parseInt(resultForm.player), result: resultForm.result, points: resultForm.points })
    showResultModal.value = false; loadData()
  } catch (e) { alert('Failed: ' + JSON.stringify(e.response?.data || e.message)) }
}

async function handleDeleteLeague() {
  if (!confirm(`Delete "${league.value?.name}"?`)) return
  try { await apiService.deleteLeague(id); router.push('/leagues') }
  catch (e) { alert('Failed to delete') }
}

async function handleDeleteMatch(pk) {
  try { await apiService.deleteMatch(pk); loadData() }
  catch (e) { alert('Failed to delete match') }
}

onMounted(loadData)
</script>
