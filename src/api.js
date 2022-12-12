const server = "https://bug-tracker-backend-934x.onrender.com";

async function fetchURL(url, data = null) {
  const req = {
    headers: {
      "Content-type": "application/json",
    },
  };
  if (url != "/login")
    req.headers["x-access-token"] = localStorage.getItem("token");
  req.method = data ? "POST" : "GET";
  //req.mode = 'no-cors';
  if (data) req.body = JSON.stringify(data);
  const res = await fetch(url, { ...req });
  const json = await res.json();
  if (json.failed) alert(json.message);
  if (json.isLoggedIn == false) logout();
  return json;
}
const fetchProjects = async () => {
  return await fetchURL("/getProjectData");
};

const fetchTeam = async () => {
  return await fetchURL("/getTeamMembers");
};

const fetchUser = async () => {
  return await fetchURL("/isUserAuth");
};

const fetchNotifications = async () => {
  return await fetchURL("/getNotifications");
};

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("selectedProject");
}

export { fetchURL, fetchTeam, fetchProjects, fetchUser, fetchNotifications };
