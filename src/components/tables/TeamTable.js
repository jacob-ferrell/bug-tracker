import { DropdownButton, Dropdown } from "react-bootstrap";
import { fetchURL } from "../../api";

const TeamTable = (props) => {
  const headings = ["Name", "Email", "Role", ""].map((heading, i) => {
    return (
      <th className="text-left" key={heading + i}>
        {heading}
      </th>
    );
  });
  let dropdownItems = ["Remove User", "Change Role"].map((text) => (
    <Dropdown.Item>{text}</Dropdown.Item>
  ));

  const removeFromTeam = async (e) => {
    const user = e.target.dataset.user;
    await fetchURL("/removeFromTeam", { user });
    props.queryClient.invalidateQueries();
  };

  const changeTeamRole = async e => {
    const user = e.target.dataset.user;
    await fetchURL("/changeRole", { user });
    props.queryClient.invalidateQueries();
  }

  const teamRows = props.users
    .filter((member) => member.email != props.userData.email)
    .map((member, i) => {
      return (
        <tr key={member.name + i}>
          <td>{member.name}</td>
          <td>{member.email}</td>
          <td>{member.role}</td>
          <td className="ellipsis text-center">
            <DropdownButton variant="light" id="ellipsis" title="⠇">
              <Dropdown.Item
                data-user={member.user_id}
                onClick={props.type == "myteam" ? removeFromTeam : null}
              >
                Remove User
              </Dropdown.Item>
              <Dropdown.Item
                data-user={member.user_id}
                onClick={props.type == "myteam" ? changeTeamRole : null}
              >
                Change Role
              </Dropdown.Item>
            </DropdownButton>
          </td>
        </tr>
      );
    });

  return (
    <table className="table table-hover table-sm mt-2">
      <thead>
        <tr>{headings}</tr>
      </thead>
      <tbody>{teamRows}</tbody>
    </table>
  );
};

export default TeamTable;
