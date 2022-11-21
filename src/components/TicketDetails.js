import { useQuery, useMutation } from "react-query";
import { useEffect, useState } from "react";
import { fetchProjects, fetchURL } from "../api";
import { formatDate } from "../utils/formatDate";
import { capitalize } from "../utils/capitalize";
import Comment from "./Comment";
import uniqid from "uniqid";

const TicketDetails = (props) => {
  const { data } = useQuery("projects", fetchProjects);
  const [ticket, setTicket] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const queryClient = props.queryClient;

  let comment;

  useEffect(() => {
    if (!props.ticketId) return;
    const ticket = data
      .find((project) => project.project_id == props.projectId)
      .tickets.find((ticket) => ticket._id == props.ticketId);
    setTicket(ticket);
  }, [props.ticketId]);

  const addComment = () => fetchURL("/createComment", comment);

  const mutation = useMutation(addComment, {
    onMutate: async (newComment) => {
      await queryClient.cancelQueries("comments");
      const previousComments = queryClient.getQueryData("comments");
      const userData = props.userData;
      const name = userData.firstName + " " + userData.lastName;
      await queryClient.setQueryData("comments", (oldQueryData) => {
        return [
          ...oldQueryData,
          {
            ...newComment,
            id: oldQueryData.length + 1,
            createdAt: new Date(),
            creator: {
              name,
            },
          },
        ];
      });
      return {
        previousComments,
      };
    },
    onError: async (error, project, context) => {
      queryClient.setQueryData("comments", context.previousComments);
      alert(error + "an error occurred");
    },
    onSettled: () => {
      //queryClient.invalidateQueries("comments");
    },
  });

  const handleCommentClick = async (e) => {
    console.log(commentContent);
    comment = {
      content: commentContent,
      ticket_id: props.ticketId,
    };
    mutation.mutate(comment);
  };

  const comments = props.comments
    .filter((comment) => comment.ticket_id == props.ticketId)
    .map((comment) => {
      return <Comment comment={comment} key={uniqid()} />;
    });

  return (
    <div className="p-2 w-auto bg-light shadow rounded m-3">
      <h5 className="w-auto border-bottom pb-3">Ticket Details</h5>
      {ticket && (
        <div className="d-flex justify-content-between">
          <div className="d-flex-column mr-2 flex-fill bg-light shadow rounded border p-2">
            <div className="row d-flex justify-content-between w-auto">
              <div className="col">
                <div>
                  <div className="text-primary">Title</div>
                  <div>{ticket.title}</div>
                </div>
                <div>
                  <div className="text-primary">Status</div>
                  <div>{capitalize(ticket.status)}</div>
                </div>
              </div>
              <div className="col">
                <div>
                  <div className="text-primary">Description</div>
                  <div>{ticket.description}</div>
                </div>
                <div>
                  <div className="text-primary">Type</div>
                  <div>{ticket.type}</div>
                </div>
              </div>
              <div className="col">
                <div>
                  <div className="text-primary">Creator</div>
                  <div>{ticket.creator.name}</div>
                </div>
                <div>
                  <div className="text-primary">Priority</div>
                  <div>{ticket.priority}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="comments flex-fill bg-light border shadow rounded p-2">
            <h6 className="border-bottom pb-3">Comments</h6>
            <div className="d-flex">
              <input
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="form-control"
                placeholder="Enter Comment"
              ></input>
              <button
                className="btn btn-info btn-sm"
                onClick={handleCommentClick}
              >
                Comment
              </button>
            </div>
            {comments}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetails;
