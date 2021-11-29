const base_url = "http://ec2-3-138-112-15.us-east-2.compute.amazonaws.com:8080/"
// const base_url = "http://192.168.1.10:8000/"

export default {
    base: base_url,
    login: base_url + "User/login/",
    logout: base_url + "User/logout/",
    resetPwd: base_url + "password_reset",
    updateAccount: base_url + "User/update/",
    avatar: base_url + "User/avatar",
}