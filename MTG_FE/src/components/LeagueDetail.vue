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
                  <h2 class="text-mtg-light mb-1" style="text-align: left;" data-testid="league-name">{{ league.name }}</h2>
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <span class="badge rounded-pill text-black" :class="statusBadge(computedLeagueStatus)">
                      {{ statusText(computedLeagueStatus) }}
                    </span>
                    <span v-if="league.format_details" class="badge rounded-pill bg-primary bg-opacity-25 text-info">{{ league.format_details.name }}</span>
                  </div>
                  <p class="text-mtg-secondary small mb-0">
                    {{ players.length }} players &middot; {{ matches.length }} matches &middot; {{ decks.length }} decks
                  </p>
                </div>
                <div class="d-flex gap-2">
                  <button
                    v-if="computedLeagueStatus === 'p'"
                    class="btn btn-mtg-primary btn-sm"
                    @click="showJoin = true"
                    data-testid="join-league-btn">
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
                <div class="d-flex justify-content-between"><span class="text-mtg-secondary">Win</span><span class="badge-win badge rounded-pill text-black">{{ league.points_win }} pts</span></div>
                <div class="d-flex justify-content-between mt-1"><span class="text-mtg-secondary">Loss</span><span class="badge-loss badge rounded-pill text-black">{{ league.points_loss }} pts</span></div>
                <div class="d-flex justify-content-between mt-1"><span class="text-mtg-secondary">Draw</span><span class="badge-draw badge rounded-pill text-black">{{ league.points_draw }} pts</span></div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card dark-card p-3">
                <h6 class="text-mtg-secondary small text-uppercase">League Info</h6>
                <div class="d-flex justify-content-between"><span class="text-mtg-secondary">Decks/User</span><span class="text-mtg-secondary">{{ league.decks_per_user }}</span></div>
                <div class="d-flex justify-content-between mt-1"><span class="text-mtg-secondary">Match Qty</span><span class="text-mtg-secondary">{{ league.match_qty }}</span></div>
                <div class="d-flex justify-content-between mt-1"><span class="text-mtg-secondary">Format</span><span v-if="league.format_details" class="text-mtg-secondary">{{ league.format_details.name }}</span></div>
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
                <div d-flex gap-2>
                  <button
                    v-if="computedLeagueStatus === 'p'"
                    class="btn btn-mtg-primary btn-sm"
                    @click="showAddPlayerModal = true"
                    data-testid="add-player-btn"
                  >
                    <font-awesome-icon :icon="['fas', 'plus']" class="me-1" /> Add Player
                  </button>
                  <button class="btn btn-mtg-primary btn-sm" @click="showJoin = true" data-testid="join-league-btn">
                    <font-awesome-icon :icon="['fas', 'plus']" class="me-1" /> Join
                  </button>
                </div>
              </div>
              <div class="card-body p-0">
                <table class="table table-dark-mtg align-middle mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Player</th>
                      <th class="text-end">Points</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(p, idx) in players" :key="p.pk" :data-testid="`player-row-${p.pk}`">
                      <td class="text-mtg-muted">{{ idx + 1 }}</td>
                      <td class="text-mtg-light fw-semibold">{{ p.player_name }}</td>
                      <td class="text-end text-mtg-accent fw-bold">{{ p.league_player_points }}</td>
                      <td>
                        <button class="btn btn-outline-danger btn-sm" @click="handleRemovePlayer(p.pk)">
                          <font-awesome-icon :icon="['fas', 'trash']" />
                        </button>
                      </td>
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
              <button class="btn btn-mtg-primary btn-sm" @click="openCreateMatchModal" :disabled="!canCreateMatch" data-testid="create-match-btn">
                <font-awesome-icon :icon="['fas', 'plus']" class="me-1" /> New Match
              </button>
              <small v-if="!canCreateMatch" class="text-danger ms-2">
                Match limit reached.
              </small>
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
                    <button class="btn btn-outline-secondary btn-sm" @click="openResult(m)" :data-testid="`record-result-btn-${m.pk}`">Record Result</button>
                    <button class="btn btn-outline-danger btn-sm" @click="handleDeleteMatch(m.pk)" :data-testid="`delete-match-btn-${m.pk}`">
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </button>
                  </div>
                </div>
                <div v-if="m.participants?.length" class="mb-2">
                  <small class="text-mtg-muted text-uppercase">Participants:</small>
                  <span v-for="p in m.participants" :key="p.pk" class="badge border-mtg ms-1 text-muted">{{ p.player_name }} — {{ p.deck_name }}</span>
                </div>
                <div v-if="m.rounds?.length">
                  <small class="text-mtg-muted text-uppercase">Rounds:</small>
                  <span v-for="r in m.rounds" :key="r.pk" class="badge rounded-pill ms-1 text-muted" :class="statusBadge(r.status)">Round {{ r.number }}: {{ r.status_display }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Decks Tab -->
          <div v-if="activeTab === 'decks'">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="text-mtg-light mb-0">Decks ({{ decks.length }})</h5>
              <button
                v-if="computedLeagueStatus === 'p'"
                class="btn btn-mtg-primary btn-sm"
                @click="showDeckModal = true"
                data-testid="add-deck-btn">
                <font-awesome-icon :icon="['fas', 'plus']" class="me-1" /> Add Deck
              </button>
            </div>
            <div v-if="decks.length === 0" class="text-center text-mtg-secondary py-3">No decks yet.</div>
            <div class="row g-3">
              <div v-for="d in decks" :key="d.pk" class="col-md-4" :data-testid="`deck-card-${d.pk}`">
                <div class="card dark-card p-3">
                  <h6 class="text-mtg-light mb-1">{{ d.name }}</h6>
                  <small class="text-mtg-secondary">{{ d.league_player?.player_name }}</small>
                  <button
                    v-if="computedLeagueStatus === 'p'"
                    class="btn btn-outline-secondary btn-sm mt-2"
                    @click="openEditDeck(d)"
                    data-testid="edit-deck-btn"
                  >
                    <font-awesome-icon :icon="['fas', 'pen']" class="me-1" />
                    Edit
                  </button>
                  <a v-if="d.url" :href="d.url" target="_blank" class="text-mtg-accent small mt-2 d-block" :data-testid="`deck-url-${d.pk}`">
                    <font-awesome-icon :icon="['fas', 'external-link']" class="me-1" /> View Deck List
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Edit Deck Modal -->
          <div v-if="showEditDeckModal" class="modal d-block modal-dark" @click.self="showEditDeckModal = false">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title text-mtg-light">Edit Deck</h5>
                  <button class="btn-close" @click="showEditDeckModal = false"></button>
                </div>

                <div class="modal-body">
                  <!-- PLAYER (READ ONLY) -->
                  <div class="mb-3">
                    <label class="form-label text-mtg-secondary small">Player</label>
                    <input
                      :value="editingDeck?.player_name || ''"
                      class="form-control form-control-dark"
                      readonly
                    />
                    <small class="text-mtg-secondary">Deck owner cannot be changed.</small>
                  </div>

                  <!-- DECK NAME (READ ONLY) -->
                  <div class="mb-3">
                    <label class="form-label text-mtg-secondary small">Deck Name</label>
                    <input
                      v-model="editDeckForm.name"
                      class="form-control form-control-dark"
                      readonly
                    />
                    <small class="text-mtg-secondary">Deck name cannot be changed.</small>
                  </div>

                  <!-- URL (EDITABLE) -->
                  <div class="mb-3">
                    <label class="form-label text-mtg-secondary small">Deck URL</label>
                    <input
                      v-model="editDeckForm.url"
                      class="form-control form-control-dark"
                      placeholder="https://moxfield.com/decks/..."
                    />
                  </div>
                </div>

                <div class="modal-footer">
                  <button class="btn btn-mtg-outline" @click="showEditDeckModal = false">Cancel</button>
                  <button class="btn btn-mtg-primary" @click="handleUpdateDeck">Save</button>
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

    <!-- Add Player Manual Modal-->
    <div v-if="showAddPlayerModal" class="modal-backdrop fade show"></div>
      <div v-if="showAddPlayerModal" class="modal d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content bg-mtg-dark text-mtg-light border-mtg-primary">
            <div class="modal-header border-mtg-secondary">
              <h5 class="modal-title">Add Player to League</h5>
              <button type="button" class="btn-close btn-close-white" @click="showAddPlayerModal = false"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="handleAddPlayer">
                <div class="mb-3">
                  <label class="form-label">Player ID or Username</label>
                  <input 
                    v-model="addPlayerForm.username" 
                    type="text" 
                    class="form-control text-black border-secondary" 
                    placeholder="Enter player Username or ID"
                    required
                  >
                  <div class="form-text text-muted">Enter the exact ID or Username of the player.</div>
                </div>
                <div class="d-flex justify-content-end gap-2">
                  <button type="button" class="btn btn-secondary" @click="showAddPlayerModal = false">Cancel</button>
                  <button type="submit" class="btn btn-mtg-primary">Add to League</button>
                </div>
              </form>
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
            <div class="mb-3">
              <label class="form-label text-mtg-secondary small">Match Number</label>
              <input v-model.number="matchNumber" type="number" min="1" class="form-control form-control-dark" data-testid="match-number-input"/>
            </div>
            <div v-for="(slot, index) in matchSlots" :key="index" class="border rounded p-3 mb-3">
              <div class="mb-2">
                <label class="form-label text-mtg-secondary small">Player {{ index + 1 }}</label>
                <select v-model="slot.league_player" class="form-select form-control-dark">
                <option value="">Select player</option>
                <option v-for="p in players" :key="p.pk" :value="p.pk">{{ p.player_name }}</option>
                </select>
              </div>
              <div>
                <label class="form-label text-mtg-secondary small">Deck</label>
                <select v-model="slot.deck" class="form-select form-control-dark" :disabled="!slot.league_player">
                <option value="">Select deck</option>
                <option v-for="d in getDeckOptionsForPlayer(slot.league_player)" :key="d.pk" :value="d.pk">
                  {{ d.name }}
                </option>
                </select>
              </div>
            </div>
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
                <option v-for="p in selectedMatch?.participants" :key="p.pk" :value="p.pk">{{ p.player_name }}</option>
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
import { APIService } from '../http/APIService';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const apiService = new APIService();

const route = useRoute()
const router = useRouter()
const pk = route.params.pk

const loading = ref(true)
const league = ref(null)
const players = ref([])
const decks = ref([])
const matches = ref([])
const activeTab = ref('overview')

const showJoin = ref(false)
const showAddPlayerModal = ref(false)
const showMatchModal = ref(false)
const showDeckModal = ref(false)
const showResultModal = ref(false)
const selectedMatch = ref(null)
const matchNumber = ref(1)
const matchSlots = ref([])

const deckForm = reactive({ name: '', url: '', league_player: '' })
const showEditDeckModal = ref(false)
const editingDeck = ref(null)
const resultForm = reactive({ round: '', player: '', result: 'w', points: 0 })
const addPlayerForm = reactive({ username: '', })

const editDeckForm = reactive({
  name: '',
  url: '',
  league_player: ''
})

const tabs = [
  { key: 'overview', label: 'Overview', icon: 'trophy' },
  { key: 'players', label: 'Players', icon: 'users' },
  { key: 'matches', label: 'Matches', icon: 'dice' },
  { key: 'decks', label: 'Decks', icon: 'book' },
  { key: 'leaderboard', label: 'Leaderboard', icon: 'crown' },
]

const statusBadge = (s) => ({ 
  a: 'badge-active', 
  c: 'badge-completed', 
  p: 'badge-pending' 
}[s] || 'badge-pending')

const statusText = (s) => ({
  a: 'Active',
  c: 'Completed',
  p: 'Pending'
}[s] || 'Pending')

const computedLeagueStatus = computed(() => {
  if (!league.value) return 'p'

  const now = new Date()
  const start = new Date(league.value.start_date)
  const end = new Date(league.value.end_date)

  if (now < start) return 'p'
  if (now > end) return 'c'
  return 'a'
})

const fmtDate = (d) => d ? new Date(d).toLocaleDateString() : 'N/A'
const leaderboard = computed(() => [...players.value].sort((a, b) => b.league_player_points - a.league_player_points))

const canCreateMatch = computed(() => {
  if (!league.value) return false
  if (!league.value.match_qty || league.value.match_qty <= 0) return true
  return matches.value.length < league.value.match_qty
})

function getDeckOptionsForPlayer(leaguePlayerPk) {
  if (!leaguePlayerPk) return [];
  return decks.value.filter(d => d.league_player == leaguePlayerPk);
}

function openCreateMatchModal() {
  matchNumber.value = matches.value.length + 1

  const seats = league.value?.format_details?.players_per_match || 0
  matchSlots.value = Array.from({ length: seats }, () => ({
    league_player: '',
    deck: ''
  }))

  showMatchModal.value = true
}

function openEditDeck(deck) {
  editingDeck.value = deck
  editDeckForm.name = deck.name
  editDeckForm.url = deck.url || ''
  editDeckForm.league_player = deck.league_player
  showEditDeckModal.value = true
}

async function handleUpdateDeck() {
  console.log('handleUpdateDeck fired')

  if (!editingDeck.value) {
    alert('No deck selected.')
    return
  }

  try {
    await apiService.updateDeck(editingDeck.value.pk, {
      name: editingDeck.value.name,
      league_player: editingDeck.value.league_player,
      url: editDeckForm.url || ''
    })

    showEditDeckModal.value = false
    editingDeck.value = null
    editDeckForm.name = ''
    editDeckForm.url = ''
    editDeckForm.league_player = ''

    await loadData()
    alert('Deck updated successfully.')
  } catch (e) {
    console.error('Deck update failed:', e)
    alert('Failed to update deck: ' + (e.response?.data?.detail || JSON.stringify(e.response?.data) || e.message))
  }
}

async function loadData() {
  try {
    const res = await apiService.getLeagueDetail(pk)
    console.log("LEAGUE DETAIL RESPONSE:", res.data)
    console.log("STATUS:", res.data.status, res.data.status_display)
    console.log("DATES:", res.data.start_date, res.data.end_date)
    league.value = res.data
    const lid = parseInt(pk)

    try { 
      const playerRes = await apiService.getLeaguePlayers()
      players.value = (playerRes.data.data || []).filter(p => p.league === lid) 
    } catch (e) { console.error("Player load error", e) }

    try { 
      const deckRes = await apiService.getDecks()
      const allDecks = deckRes.data.data || [];
      //decks.value = (deckRes.data.data || []).filter(d => d.league_player?.league_id === lid) 
      decks.value = allDecks.filter(d => d.league_id == lid);
    } catch (e) { console.error("Deck load error", e) }

    try { 
      const matchRes = await apiService.getMatches()
      matches.value = (matchRes.data.data || []).filter(m => m.league === lid) 
    } catch (e) { console.error("Match load error", e) }

    loading.value = false
  } catch (e) {
    console.error("General load error", e)
    loading.value = false
  }
}

async function handleJoin() {
  try { await apiService.createLeaguePlayer({ league: parseInt(pk) }); showJoin.value = false; loadData() }
  catch (e) { alert('Failed to join: ' + JSON.stringify(e.response?.data?.detail || e.message)) }
}

async function handleAddPlayer() {
  try {
    await apiService.createLeaguePlayer({ 
      league: parseInt(pk), 
      player: addPlayerForm.username
    });
    
    showAddPlayerModal.value = false;
    addPlayerForm.username = '';
    loadData();
  } catch (e) {
    alert('Failed to add player: ' + JSON.stringify(e.response?.data?.detail || e.message));
  }
}

async function handleCreateMatch() {
  try {
    const expectedPlayers = league.value?.format_details?.players_per_match || 0
    const roundsPerMatch = league.value?.format_details?.rounds_per_match || 1

    if (matchSlots.value.length !== expectedPlayers) {
      alert(`This format requires exactly ${expectedPlayers} players.`)
      return
    }

    const selectedPlayers = matchSlots.value.map(slot => slot.league_player)

    if (selectedPlayers.some(playerId => !playerId)) {
      alert('Please select a player for every slot.')
      return
    }

    if (new Set(selectedPlayers).size !== selectedPlayers.length) {
      alert('A player can only be selected once per match.')
      return
    }

    const matchRes = await apiService.createMatch({league: parseInt(pk), number: matchNumber.value, status: 'p'})
    const createdMatch = matchRes.data

    for (const slot of matchSlots.value) {
      await apiService.createMatchPlayerDetail({
        match: createdMatch.pk, league_player: parseInt(slot.league_player), deck: slot.deck ? parseInt(slot.deck) : null
      })
    }

    for (let i = 1; i <= roundsPerMatch; i++) {
      await apiService.createMatchRound({match: createdMatch.pk, number: i, status: 'p'
      })
    }

    showMatchModal.value = false
    matchSlots.value = []
    await loadData()
  } catch (e) {
    alert('Failed: ' + JSON.stringify(e.response?.data || e.message))
  }
}

async function handleCreateDeck() {
  if (!deckForm.name || !deckForm.league_player) return;

  try {
    const response = await apiService.createDeck({ 
      name: deckForm.name, 
      url: deckForm.url || '', 
      league_player: parseInt(deckForm.league_player) 
    });

    console.log("Deck Created:", response.data);

    showDeckModal.value = false;

    deckForm.name = '';
    deckForm.url = '';
    deckForm.league_player = '';

    await loadData();
    
  } catch (e) {
    console.error("Submission error:", e);
    alert('Failed: ' + (e.response?.data?.detail || JSON.stringify(e.response?.data) || e.message));
  }
}

function openResult(m) {
  selectedMatch.value = m
  console.log("Match Data", m);
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
    await apiService.createMatchRoundPlayer({ round: parseInt(resultForm.round), player: parseInt(resultForm.player), result: resultForm.result})
    showResultModal.value = false; loadData()
  } catch (e) { alert('Failed: ' + JSON.stringify(e.response?.data || e.message)) }
}

async function handleDeleteLeague() {
  // Double check permissions in the logic
  if (!canDeleteLeague.value) {
    alert("You do not have permission to delete this league.");
    return;
  }

  if (!confirm(`Delete "${league.value?.name}"?`)) return;
  
  try { 
    await apiService.deleteLeague(pk); 
    router.push('/leagues');
  } catch (e) { 
    alert('Failed to delete: ' + (e.response?.data?.detail || 'Unauthorized'));
  }
}

async function handleDeleteMatch(pk) {
  try { await apiService.deleteMatch(pk); loadData() }
  catch (e) { alert('Failed to delete match') }
}

async function handleRemovePlayer(playerPk) {
  if (!confirm("Are you sure you want to remove this player from the league?")) {
    return;
  }
  try {
    await apiService.deleteLeaguePlayer(playerPk);
    await loadData();
    
    alert("Player removed successfully.");
  } catch (e) {
    console.error(e);
    alert('Failed to remove player: ' + (e.response?.data?.detail || e.message));
  }
}

//HANDLE AUTHORIZATION FOR DELETING LEAGUES
// Function to decode JWT tokens
const getUserIdFromToken = () => {
  const token = localStorage.getItem('access');
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload.user_id || payload.sub; 
  } catch (e) {
    return null;
  }
};

const getAuthData = () => {
  const token = localStorage.getItem('access');
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    return {
      userId: payload.user_id || payload.sub,
      isSuperuser: payload.is_superuser || false,
      isStaff: payload.is_staff || false
    };
  } catch (e) {
    console.error("Token decode error:", e);
    return null;
  }
};

const canDeleteLeague = computed(() => {
  if (!league.value) return false;

  const auth = getAuthData();
  if (!auth) return false;

  const creatorId = league.value.owner;
  const userId = auth.userId;
  
  // Permission logic:
  const isOwner = userId && creatorId && String(userId) === String(creatorId);
  const isAdmin = auth.isSuperuser || auth.isStaff;

  console.log("PERMISSIONS:", { isOwner, isAdmin, userId, creatorId });

  return isOwner || isAdmin;
});

onMounted(loadData)
</script>
