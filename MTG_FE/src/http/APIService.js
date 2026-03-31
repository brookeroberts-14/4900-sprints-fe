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
}