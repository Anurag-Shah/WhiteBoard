const base_url =
  "http://ec2-3-138-112-15.us-east-2.compute.amazonaws.com:8000/";

export default {
  base_url: base_url,
  login: base_url + "User/login/",
  logout: base_url + "User/logout/",
  register: base_url + "Register/",
  resetPwd: base_url + "password_reset",
  updateAccount: base_url + "User/update/",
  avatar: base_url + "User/avatar/",
  getAllGroups: base_url + "User/groups/",
  group_operations: base_url + "User/group/",
  getAllMembers: base_url + "User/group/members/",
  memeber_operations: base_url + "User/group/member/",
  temp_text: base_url + "TempTextUpload/",
};
