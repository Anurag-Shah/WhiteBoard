const base_url = "http://10.186.69.241:8888//"

export default {
    login: base_url + "User/login/",
    logout: base_url + "User/logout/",
    resetPwd: base_url + "password_reset",
    updateAccount: base_url + "User/update/",
    avatar: base_url + "User/avatar",
    group_operations: base_url + "User/group/",
    memeber_operations: base_url + "User/group/memeber",
}