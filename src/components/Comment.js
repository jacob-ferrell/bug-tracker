import { formatDate } from "../utils/formatDate";
import { formatTime } from "../utils/formatTime";

const Comment = (props) => {
  const comment = props.comment;

  return (
    <div className="bg-light border shadow rounded p-2 mt-2">
      <div>
        <span className="font-weight-bold">{comment.creator.name}</span>
        {' - '}
        <span>{formatDate(comment.createdAt)}</span>
        {' - '}
        <span>{formatTime(comment.createdAt)}</span>
      </div>
      <div className="pl-2 text-secondary">{comment.content}</div>
    </div>
  );
};

export default Comment;
