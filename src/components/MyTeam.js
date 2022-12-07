import { useState } from "react";
import { Spinner } from "react-bootstrap";
import CreateTeam from "./modals/CreateTeam";
import AddToTeam from "./modals/AddToTeam";
import { useQuery } from "react-query";
import { fetchTeam, fetchURL } from "../api";
import TeamTable from "./tables/TeamTable";

const MyTeam = (props) => {
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showAddToTeam, setShowAddToTeam] = useState(false);

  const team = useQuery("team", fetchTeam);
  const teamData = team.data;

  const handleLeaveClick = async (e) => {
    await fetchURL("/leaveTeam");
    props.queryClient.invalidateQueries();
  };

  const hasAuth = () => {
    return (
      teamData.find((user) => user.user_id == props.userData.user_id).role ==
      "admin"
    );
  };

  return (
    <>
      {showCreateTeam && (
        <CreateTeam
          handleClose={() => setShowCreateTeam(false)}
          show={showCreateTeam}
          teamData={teamData}
          userData={props.userData}
          queryClient={props.queryClient}
        />
      )}
      {showAddToTeam && (
        <AddToTeam
          handleClose={() => setShowAddToTeam(false)}
          show={showAddToTeam}
          userData={props.userData}
          queryClient={props.queryClient}
        />
      )}
      {!team.isLoading ? (
        <div className="p-3 w-auto h-auto">
          <div id="team" className="team bg-light shadow rounded p-2">
            <div className="team-header d-flex justify-content-between">
              <h5>My Team</h5>
              {!team.data?.noTeam && (
                <div className="d-flex">
                  {hasAuth() && (
                    <button
                      onClick={() => setShowAddToTeam(true)}
                      className="btn btn-primary btn-sm"
                    >
                      Add Member
                    </button>
                  )}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleLeaveClick}
                  >
                    Leave Team
                  </button>
                </div>
              )}
            </div>
            {team.data?.noTeam ? (
              <div className="d-flex flex-column justify-content-center">
                <span className="text-center">
                  You are not part of a team. You can create a team, or you must
                  wait for another user to add you to theirs
                </span>
                <button
                  onClick={() => setShowCreateTeam(true)}
                  className="btn btn-primary btn-sm"
                >
                  Create Team
                </button>
              </div>
            ) : !team.isLoading ? (
              <TeamTable
                users={teamData}
                queryClient={props.queryClient}
                userData={props.userData}
                type="myteam"
                hasAuth={hasAuth}
              />
            ) : null}
          </div>
        </div>
      ) : (
        <div id="team" className="team bg-light shadow rounded p-2">
          <div className="team-header d-flex justify-content-between">
            <h5>
              {team.isLoading && (
                <Spinner
                  animation="border"
                  as="span"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              {" Loading Team"}
            </h5>
          </div>
        </div>
      )}
    </>
  );
};

export default MyTeam;
