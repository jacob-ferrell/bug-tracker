const server = process.env.REACT_APP_SERVER ?? "https://bugtracker-server.jacobferrell.net";

async function fetchURL(url, data = null, method = null) {
  const req = {
    headers: {
      "Content-type": "application/json",
    },
  };
  if (url !== "/auth/login")
    req.headers["x-access-token"] = localStorage.getItem("token");
  req.method = method || (data ? "POST" : "GET");
  if (data) req.body = JSON.stringify(data);
  const res = await fetch(server + url, { ...req });
  const json = await res.json();
  if (process.env.NODE_ENV === "development") console.log(url, json);

  if (json.failed) alert(json.message);
  if (json.isLoggedIn === false) logout();

  return json;
}

const fetchProjects = async () => fetchURL("/projects");
const fetchTeam = async () => fetchURL("/team/members");
const fetchUser = async () => fetchURL("/auth/me");
const fetchNotifications = async () => fetchURL("/notifications");

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("selectedProject");
}

export { fetchURL, fetchTeam, fetchProjects, fetchUser, fetchNotifications };
