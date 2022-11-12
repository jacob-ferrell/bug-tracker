import { DropdownButton, Dropdown } from "react-bootstrap";

const TeamTable = props => {

    const headings = ['Name', 'Email', 'Role', '']
        .map((heading, i) => {
            return (
                <th className='text-left' key={heading + i}>{heading}</th>
            );
        });
    const teamRows = props.users
      .filter(member => member.email != props.userData.email)
      .map((member, i) => {
      return (
          <tr key={member.name + i} data-user={member.user_id}>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.role}</td>
              <td className="ellipsis text-center">
                    <DropdownButton variant='light' id='ellipsis' title='⠇'>
                        <Dropdown.Item 

                        >Edit ticket
                        </Dropdown.Item>
                        <Dropdown.Item>View Details</Dropdown.Item>
                    </DropdownButton>
                </td>
          </tr>
      );
})

return (
    <table className='table table-hover table-sm mt-2'>
            <thead>
                <tr>
                  {headings}
                </tr>
            </thead>
            <tbody>
                {teamRows}
            </tbody>
        </table>
);

}

export default TeamTable;