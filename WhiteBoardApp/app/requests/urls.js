const base_url = "http://10.186.69.143:8888/"

export default {
    base_url: base_url,
    login: base_url + "User/login/",
    logout: base_url + "User/logout/",
    resetPwd: base_url + "password_reset",
    updateAccount: base_url + "User/update/",
    avatar: base_url + "User/avatar/",
    getAllGroups: base_url + "User/groups/",
    group_operations: base_url + "User/group/",
    getAllMembers: base_url + "User/group/members/",
    memeber_operations: base_url + "User/group/member/",
}
