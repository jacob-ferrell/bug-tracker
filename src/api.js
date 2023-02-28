const server =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://bug-tracker-backend-934x.onrender.com";
async function fetchURL(url, data = null) {
  const req = {
    headers: {
      "Content-type": "application/json",
    },
  };
  if (url != "/login")
    req.headers["x-access-token"] = localStorage.getItem("token");
  req.method = data ? "POST" : "GET";
  if (data) req.body = JSON.stringify(data);
  const res = await fetch(server + url, { ...req });
  //console.log('fired')
  const json = await res.json();
  console.log(url, json)

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
