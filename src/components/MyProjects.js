import {useState} from 'react';
import NewProjectForm from './NewProjectForm';

const MyProjects = props => {

    const [showForm, setShowForm] = useState(false);

    function handleCreateClick(e) {
        setShowForm(true);
    }

    return (
        <div className="my-projects">
            { !showForm ? (
            <button onClick={handleCreateClick} className='btn btn-primary'>Create Project</button>
            )
        : (<NewProjectForm userData={props.userData}/>)}
        </div>
    );
}

export default MyProjects;