import {useState} from 'react';
import NewProjectForm from './NewProjectForm';
import Table from './Table';

const MyProjects = props => {

    const [showForm, setShowForm] = useState(false);

    function handleCreateClick(e) {
        setShowForm(true);
    }

    return (
        <div className="my-projects">
            { !showForm ? (
            <div>
                <Table type='projects'></Table>
                <button onClick={handleCreateClick} className='btn btn-primary'>Create Project</button>
            </div>
            )
        : (<NewProjectForm userData={props.userData}/>)}
        </div>
    );
}

export default MyProjects;