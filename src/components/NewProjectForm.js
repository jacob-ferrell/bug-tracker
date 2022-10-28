import { useNavigate } from 'react-router-dom';

const NewProjectForm = props => {

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;

        const project = {
            name: form[0].value,
            description: form[1].value,
            creator: props.userData.user_id,
        }

        fetch('/isUserAuth', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(data => !data.isLoggedIn 
            ? navigate('/login') 
            : fetch('/createProject', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(project)
            })
            .then(res => res.json())
            .then(data => data.takenName 
                ? alert('You already have a project with that name')
                : null));
    }

    return (
        <div className='new-project-form'>
            <form onSubmit={handleSubmit}>
            <h2 className="login-form-heading">New Project</h2>
            <div className="illustration">
            </div>
            <div className="form-group">
                <input required className="form-control" type="text" name="project-name" placeholder="Project Name">
                </input>
            </div>
            <div className="form-group">
                <textarea required className="form-control" type="text" name="project-description" placeholder="Project Description">
                </textarea>
            </div>
            <div className="form-group">
                <button className="btn btn-primary btn-block" type="submit">Create Project</button>
            </div>

        </form>
        </div>
    );
}

export default NewProjectForm;