
async function fetchURL(url, data = null) {
    const req = {
        headers: {
            'Content-type': 'application/json'
        },
    };
    if (url != '/login') req.headers['x-access-token'] = localStorage.getItem('token');
    req.method = data ? 'POST' : 'GET';
    if (data) req.body = JSON.stringify(data);
    const res = await fetch(url, {...req})
    const json = await res.json();
    if (json.failed) alert(json.message);
    console.log(url, json);
    return json;
}
const req = {
    headers: {
        'x-access-token': localStorage.getItem('token')
    },
};

async function fetchCreateProject(project) {
    const fetchData = await fetch('/createProject', {
        ...req,
        method: 'POST',
        body: JSON.stringify(project)
    })
    const res = await fetchData.json();
    if (res.failed) return alert(res.message);
  }

  async function fetchEditProject(project) {
    const fetchData = await fetch('/editProject', {
        ...req,
        method: 'POST',
        body: JSON.stringify(project)
    })
    const res = await fetchData.json();
    if (res.takenName) return alert('You already have a project with that name');
  }
  
  async function fetchTeamData() {
    try {
        const fetchData = await fetch('/getTeamMembers', {...req})
        const res = await fetchData.json();
        return res;
    } catch(err) {
        console.log(err);
    }
  }

  const fetchUserData = async () => {
    try {
        const fetchData = await fetch('/isUserAuth', {...req})
        const res = await fetchData.json();
        return res;
    } catch(err) {
        console.log(err);
    }
}

async function fetchProjectData() {
  const fetchData = await fetch('/getProjectData', {...req})
  const res = await fetchData.json();
  return res;
}

export {fetchURL, fetchProjectData, fetchEditProject, fetchCreateProject, fetchTeamData, fetchUserData};