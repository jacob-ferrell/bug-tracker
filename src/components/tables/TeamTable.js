import { useState } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { fetchURL } from "../../api";
import Warning from "../modals/Warning";
import { capitalize } from "../../utils/capitalize";

const TeamTable = (props) => {
  const [showWarning, setShowWarning] = useState(false);
  const [message, setMessage] = useState("");
  const [url, setURL] = useState(null);
  const [user, setUser] = useState(null);

  const hasAuth = props.hasAuth || true;

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
    const userId = e.target.dataset.user;
    const name = props.users.find((user) => user.user_id == userId).name;
    setUser(userId);
    setMessage({
      heading: 'Warning!',
      body: `Are you sure you want to remove ${name} from the team?`});
    setURL("/removeFromTeam");
    setShowWarning(true);
    /* await fetchURL("/removeFromTeam", { user });
    props.queryClient.invalidateQueries({queryKey: ['team']});   */
  };

  const changeTeamRole = async (e) => {
    const userId = e.target.dataset.user;
    const name = props.users.find((user) => user.user_id == userId).name;
    setUser(userId);
    setMessage({
      heading: 'Change Role',
      body: `Select a new Team role for ${name}`,
      change: true
    });
    setURL("/changeTeamRole");
    setShowWarning(true);
  };

  const removeFromProject = async (e) => {};

  const changeProjectRole = async (e) => {};

  const teamRows = props.users
    .filter((member) => member.email != props.userData.email)
    .map((member, i) => {
      return (
        <tr key={member.name + i}>
          <td>{member.name}</td>
          <td>{member.email}</td>
          <td>{capitalize(member.role)}</td>
          <td className="ellipsis text-center">
            {props.hasAuth && (
              <DropdownButton variant="light" id="ellipsis" title="⠇">
                <Dropdown.Item
                  data-user={member.user_id}
                  onClick={
                    props.type == "myteam" ? removeFromTeam : removeFromProject
                  }
                >
                  {props.type == 'myteam' ? 'Remove User' : 'Remove From Project'}
                </Dropdown.Item>
                <Dropdown.Item
                  data-user={member.user_id}
                  onClick={
                    props.type == "myteam" ? changeTeamRole : changeProjectRole
                  }
                >
                  Change Role
                </Dropdown.Item>
              </DropdownButton>
            )}
          </td>
        </tr>
      );
    });

  return (
    <>
      {showWarning && (
        <Warning
          close={() => setShowWarning(false)}
          show={showWarning}
          message={message}
          url={url}
          user={user}
          queryClient={props.queryClient}
        />
      )}
      <table className="table table-hover table-sm mt-2">
        <thead>
          <tr>{headings}</tr>
        </thead>
        <tbody>{teamRows}</tbody>
      </table>
    </>
  );
};

export default TeamTable;
