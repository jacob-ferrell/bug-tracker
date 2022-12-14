import { formatDate } from "../utils/formatDate";
import { formatTime } from "../utils/formatTime";
import { useQuery } from "react-query";
import { fetchURL, fetchUser } from "../api";
import { Dropdown, DropdownButton } from "react-bootstrap";

const Comment = (props) => {
  const comment = props.comment;
  const user = useQuery("user", fetchUser);

  const isCreator = () => user.data.user_id === comment.creator.id;
  const hasAuth = () =>
    ["admin", "project-manager"].includes(props.project.role);

  const deleteComment = async (e) => {
    await fetchURL('/deleteComment', {
      comment: props.comment._id,
      project: props.project.project_id,
      ticket: props.ticketId
    });
    props.queryClient.invalidateQueries();
  }

  return (
    <div className="bg-light border shadow rounded p-2 mt-2">
      <div className="d-flex justify-content-between">
        <div>
          <span className="font-weight-bold">{comment.creator.name}</span>
          {`   ${formatDate(comment.createdAt)} @ ${formatTime(comment.createdAt)}`}
        </div>
        {(isCreator() || hasAuth()) && (
          <DropdownButton variant="light" id="ellipsis" title="⠇">
            {isCreator() && (
              <Dropdown.Item data-commentid={props.comment._id} onClick={null}>
                Edit
              </Dropdown.Item>
            )}
            <Dropdown.Item onClick={deleteComment}>Delete</Dropdown.Item>
          </DropdownButton>
        )}
      </div>
      <div className="pl-2 text-secondary">{comment.content}</div>
    </div>
  );
};

export default Comment;
