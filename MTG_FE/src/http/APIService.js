import axios from "axios";
// Change the API_URL to the correct location of the backend API before deploying the app
const API_URL =
  "http://127.0.0.1:8000" //"https://brooke14roberts.pythonanywhere.com/"; /* 'http://localhost:8000' or  'http://yourPythonAnywhereName.pythonanywhere.com/'*/

export class APIService {
  constructor() {}

  authenticateLogin(credentials) {
    const url = `${API_URL}/api/`;
    return axios.post(url, credentials);
  }
  registerUser(credentials) {
    const url = `${API_URL}/register/`;
    credentials.customusername = credentials.username;
    return axios.post(url, credentials);
  }
  getLeagues() {
    const url = `${API_URL}/league_tracker/leagues/`;
    let jwtToken = localStorage.getItem("access");
    const headers = { Authorization: `JWT ${jwtToken}` };
    return axios.get(url, {headers: headers});
  }
  getFormats() {
    const url = `${API_URL}/league_tracker/formats/`;
    let jwtToken = localStorage.getItem("access");
    const headers = { Authorization: `JWT ${jwtToken}` };
    return axios.get(url, {headers: headers});
  }
  getLeagueDetail(param_pk) {
    const url = `${API_URL}/league_tracker/league/${param_pk}`;
    let jwtToken = localStorage.getItem("access");
    const headers = { Authorization: `JWT ${jwtToken}` };
    return axios.get(url, {headers: headers});
  }
  createLeague(league) {
    const url = `${API_URL}/league_tracker/leagues/`;
    let jwtToken = localStorage.getItem("access");
    const headers = { Authorization: `JWT ${jwtToken}` };
    return axios.post(url, league, { headers: headers });
  }
  getLeaguePlayers() {
    const url = `${API_URL}/league_tracker/league_players/`;
    let jwtToken = localStorage.getItem("access");
    const headers = { Authorization: `JWT ${jwtToken}` };
    return axios.get(url, {headers: headers});
  }
  getDecks() {
    const url = `${API_URL}/league_tracker/decks/`;
    let jwtToken = localStorage.getItem("access");
    const headers = { Authorization: `JWT ${jwtToken}` };
    return axios.get(url, {headers: headers});
  }
  createLeaguePlayer(league_player) {
    const url = `${API_URL}/league_tracker/league_players/`;
    let jwtToken = localStorage.getItem("access");
    const headers = { Authorization: `JWT ${jwtToken}` };
    return axios.post(url, league_player, {headers: headers});
  }
  deleteLeaguePlayer(pk) {
    const url = `${API_URL}/league_tracker/league_player/${pk}/`;
    let jwtToken = localStorage.getItem("access");
    const headers = { Authorization: `JWT ${jwtToken}` };
    return axios.delete(url, {headers: headers});
  }
  createMatch(match) {
    const url = `${API_URL}/league_tracker/matches/`;
    let jwtToken = localStorage.getItem("access");
    const headers = { Authorization: `JWT ${jwtToken}` };
    return axios.post(url, match, {headers: headers});
  }
  getMatches() {
    const url = `${API_URL}/league_tracker/matches/`;
    let jwtToken = localStorage.getItem("access");
    const headers = { Authorization: `JWT ${jwtToken}` };
    return axios.get(url, { headers: headers });
  }
  deleteMatch(pk) {
    const url = `${API_URL}/league_tracker/match/${pk}/`;
    let jwtToken = localStorage.getItem("access");
    const headers = { Authorization: `JWT ${jwtToken}` };
    return axios.delete(url, { headers: headers });
  }
  createMatchRound(matchRound) {
    const url = `${API_URL}/league_tracker/match_rounds/`;
    let jwtToken = localStorage.getItem("access");
    const headers = { Authorization: `JWT ${jwtToken}` };
    return axios.post(url, matchRound, { headers: headers });
  }
  createMatchRoundPlayer(matchRoundPlayer) {
    const url = `${API_URL}/league_tracker/match_round_players/`;
    let jwtToken = localStorage.getItem("access");
    const headers = { Authorization: `JWT ${jwtToken}` };
    return axios.post(url, matchRoundPlayer, { headers: headers });
  }
  createDeck(deck) {
    const url = `${API_URL}/league_tracker/decks/`;
    let jwtToken = localStorage.getItem("access");
    const headers = { Authorization: `JWT ${jwtToken}` };
    return axios.post(url, deck, { headers: headers });
  }
}