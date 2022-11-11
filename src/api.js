

async function fetchCreateProject(project) {
    const fetchData = await fetch('/createProject', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'x-access-token': localStorage.getItem('token')
        },
        body: JSON.stringify(project)
    })
    const res = await fetchData.json();
    if (res.takenName) return alert('You already have a project with that name');
  }

  async function fetchEditProject(project) {
    const fetchData = await fetch('/editProject', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'x-access-token': localStorage.getItem('token')
        },
        body: JSON.stringify(project)
    })
    const res = await fetchData.json();
    if (res.takenName) return alert('You already have a project with that name');
  }
  
  async function fetchTeamData() {
    try {
        const fetchData = await fetch('/getTeamMembers', {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },  
        })
        const res = await fetchData.json();
        return res;
    } catch(err) {
        console.log(err);
    }
  }

  const fetchUserData = async () => {
    try {
        const fetchData = await fetch('/isUserAuth', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        const res = await fetchData.json();
        return res;
    } catch(err) {
        console.log(err);
    }
}

async function fetchProjectData() {
  const fetchData = await fetch('/getProjectData', {
      method: 'GET',
      headers: {
          'x-access-token': localStorage.getItem('token')
      },  
  })
  const res = await fetchData.json();
  return res;
}

export {fetchProjectData, fetchEditProject, fetchCreateProject, fetchTeamData, fetchUserData};