import { useQuery, useMutation } from "react-query";
import { useEffect, useState } from "react";
import { fetchProjects, fetchURL } from "../api";
import { formatDate } from "../utils/formatDate";
import { capitalize } from "../utils/capitalize";
import { Spinner } from "react-bootstrap";
import Comment from "./Comment";
import uniqid from "uniqid";

const TicketDetails = (props) => {
  const { data, isLoading } = useQuery("projects", fetchProjects);
  const [ticket, setTicket] = useState(null);
  const [project, setProject] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const queryClient = props.queryClient;

  let comment;

  useEffect(() => {
    if (!props.ticketId) return;
    const project = data.find(
      (project) => project.project_id == props.projectId
    );

    const ticket = project.tickets.find(
      (ticket) => ticket._id == props.ticketId
    );
    setProject(project);
    setTicket(ticket);
  }, [props.ticketId]);

  const addComment = () => fetchURL("/createComment", comment);

  const mutation = useMutation(addComment, {
    onMutate: async (newComment) => {
      await queryClient.cancelQueries("comments");
      const previousComments = queryClient.getQueryData("comments");
      const { firstName, lastName } = props.userData;
      await queryClient.setQueryData("comments", (oldQueryData) => {
        return [
          ...oldQueryData,
          {
            ...newComment,
            id: oldQueryData.length + 1,
            createdAt: new Date(),
            creator: {
              name: firstName + " " + lastName,
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
      setCommentContent("");
    },
  });

  const handleCommentClick = async (e) => {
    comment = {
      content: commentContent,
      ticket_id: props.ticketId,
    };
    mutation.mutate(comment);
  };

  const comments = props.comments
    .filter((comment) => comment.ticket_id == props.ticketId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .map((comment) => {
      return <Comment comment={comment} key={uniqid()} />;
    });

  const getAssignedDevs = () => {
    const assignedDevs = project.users.filter((user) => {
      return ticket.users.includes(user.user_id);
    });
    return assignedDevs.map((dev) => {
      return <span key={uniqid()}>{dev.name}</span>;
    });
  };

  return (
    <div className="p-2 w-auto bg-light shadow rounded m-3">
      <h5 className="w-auto border-bottom pb-3">
        {isLoading || comments.isLoading ? (
          <Spinner
            animation="border"
            as="span"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        ) : (
          "Ticket Details"
        )}
      </h5>
      {ticket && (
        <div className="d-flex w-auto">
          <div className="p-3 flex-even">
            <div className="ticket-details p-2">
              <div className="row d-flex justify-content-between w-auto border-bottom">
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
              <div className="row p-2">
                <span>Assigned Devs</span>
                {getAssignedDevs()}
              </div>
            </div>
          </div>
          <div className="p-3 flex-even">
            <div className="comments flex-even bg-light border shadow rounded p-2">
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
                  disabled={!commentContent}
                >
                  Comment
                </button>
              </div>
              {comments}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetails;
