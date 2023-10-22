import PropTypes from "prop-types";

export const meetupPropTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  image: PropTypes.string,
  username: PropTypes.string.isRequired,
  owner: PropTypes.bool.isRequired,
  likes: PropTypes.number.isRequired,
  likedByMe: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  createdAt: PropTypes.string.isRequired,
});

export const userPropTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
});
