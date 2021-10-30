const base_url = "http://66.253.158.235:8000/"

export default {
    login: base_url + "User/login/",
    resetPwd: base_url + "password_reset",
    getCSRF: base_url + "User/csrf",
    getSession: base_url + "User/session/",
    whoami: base_url + "User/whoami",
}