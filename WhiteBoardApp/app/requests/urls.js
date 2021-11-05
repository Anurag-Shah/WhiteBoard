const base_url = "http://172.16.50.73:8000/";

export default {
  login: base_url + "User/login/",
  logout: base_url + "User/logout/",
  register: base_url + "Register/",
  resetPwd: base_url + "password_reset",
  updateAccount: base_url + "User/update/",
  avatar: base_url + "User/avatar/",
  group_operations: base_url + "User/group/",
  memeber_operations: base_url + "User/group/memeber/",
};
