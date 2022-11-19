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
  const res = await fetch(url, { ...req });
  const json = await res.json();
  if (json.failed) alert(json.message);
  console.log(url, json);
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

export { fetchURL, fetchTeam, fetchProjects, fetchUser };
