const base_url = "http://10.186.69.241:8888/"

export default {
    base_url: "http://ec2-3-138-112-15.us-east-2.compute.amazonaws.com:8000/",
    login: base_url + "User/login/",
    logout: base_url + "User/logout/",
    resetPwd: base_url + "password_reset",
    updateAccount: base_url + "User/update/",
    avatar: base_url + "User/avatar/",
    getAllGroups: base_url + "/User/groups/",
    group_operations: base_url + "User/group/",
    memeber_operations: base_url + "User/group/memeber/",
}
