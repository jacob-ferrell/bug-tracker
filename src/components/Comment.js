import { formatDate } from "../utils/formatDate";
import { formatTime } from "../utils/formatTime";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useQuery } from "react-query";
import { fetchUser } from "../api";

const Comment = (props) => {
  const comment = props.comment;
  const user = useQuery("user", fetchUser);
  console.log(props.role, comment, user.data.user_id);

  const isOwnComment = () => comment.creator.id === user.data.user_id;
  const hasAuth = () => ["admin", "project-manager"].includes(props.role);

  console.log(isOwnComment(), hasAuth());

  return (
    <div className="bg-light border shadow rounded p-2 mt-2">
      <div className="d-flex justify-content-between">
        <div>
          <span className="font-weight-bold">{comment.creator.name}</span>
          {" - "}
          <span>{formatDate(comment.createdAt)}</span>
          {" @ "}
          <span>{formatTime(comment.createdAt)}</span>
        </div>
        {(isOwnComment() || hasAuth()) && (
          <DropdownButton variant="light" id="ellipsis" title="⠇">
            {isOwnComment() && (
              <Dropdown.Item data-commentid={comment.creator.id} onClick={null}>
                Edit
              </Dropdown.Item>
            )}
            <Dropdown.Item data-commentid={comment.creator.id}>
              Delete
            </Dropdown.Item>
          </DropdownButton>
        )}
      </div>
      <div className="pl-2 text-secondary">{comment.content}</div>
    </div>
  );
};

export default Comment;
