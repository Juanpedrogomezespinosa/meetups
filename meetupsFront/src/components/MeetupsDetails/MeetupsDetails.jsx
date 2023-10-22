import PropTypes from "prop-types";

const MeetupDetails = ({ meetup, user, onSignUp, onUnsubscribe }) => {
  return (
    <div>
      <p>Asistentes: {meetup.attendees}</p>
      {user && (
        <div>
          <button onClick={() => onSignUp(meetup.id)}>Inscribirse</button>
          <button onClick={() => onUnsubscribe(meetup.id)}>
            Darse de baja
          </button>
        </div>
      )}
    </div>
  );
};

MeetupDetails.propTypes = {
  meetup: PropTypes.object,
  user: PropTypes.object,
  onSignUp: PropTypes.func.isRequired,
  onLeave: PropTypes.func.isRequired,
  onUnsubscribe: PropTypes.func.isRequired,
};

export default MeetupDetails;
