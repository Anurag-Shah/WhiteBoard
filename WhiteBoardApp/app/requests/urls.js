const base_url = "http://66.253.158.235:8000/"

export default {
    login: base_url + "User/login/",
    logout: base_url + "User/logout/",
    resetPwd: base_url + "password_reset",
    updateAccount: base_url + "User/update/",
    avatar: base_url + "User/avatar",
    create_group: base_url + "User/group/create/",
    delete_group: base_url + "User/group/delete/",
    add_memeber: base_url + "User/group/add_memeber/",
    delete_member: base_url + "User/group/remove_member/",
}