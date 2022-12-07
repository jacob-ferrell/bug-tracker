const temp = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <div>
              <span className="ticket-detail-label text-primary font-weight-bold">
                Title
              </span>
              <div>{ticket.title}</div>
            </div>
          </div>
          <div className="col">
            <div>
              <span className="ticket-detail-label text-primary font-weight-bold">
                Description
              </span>
              <div>{ticket.description}</div>
            </div>
          </div>
          <div className="col">
            <div>
              <span className="ticket-detail-label text-primary font-weight-bold">
                Creator
              </span>
              <div>{ticket.creator.name}</div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div>
              <span className="ticket-detail-label text-primary font-weight-bold">
                Status
              </span>
              <div>{capitalize(ticket.status)}</div>
            </div>
          </div>
          <div className="col">
            <div>
              <span className="ticket-detail-label text-primary font-weight-bold">
                Type
              </span>
              <div>{ticket.type}</div>
            </div>
          </div>
          <div className="col">
            <div>
              <span className="ticket-detail-label text-primary font-weight-bold">
                Priority
              </span>
              <div>{ticket.priority}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
