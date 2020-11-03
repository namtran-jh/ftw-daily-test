const TRANSITION_ENQUIRE = 'transition/enquire';
const TRANSITION_DECLINE = 'transition/decline';
const TRANSITION_DECLINE_AFTER_EXPIRE = 'transition/decline-after-expire';
const TRANSITION_PROVIDER_CANCEL_BEFORE_EXPIRE = 'transition/provider-cancel-before-expire';
const TRANSITION_OPERATOR_CANCEL_BEFORE_EXPIRE = 'transition/operator-cancel-before-expire';
const TRANSITION_PROVIDER_CANCEL_AFTER_EXPIRE = 'transition/provider-cancel-after-expire';
const TRANSITION_OPERATOR_CANCEL_AFTER_EXPIRE = 'transition/operator-cancel-after-expire';

const arrayOfTransitions = [
  TRANSITION_ENQUIRE,
  TRANSITION_DECLINE,
  TRANSITION_DECLINE_AFTER_EXPIRE,
  TRANSITION_PROVIDER_CANCEL_BEFORE_EXPIRE,
  TRANSITION_OPERATOR_CANCEL_BEFORE_EXPIRE,
  TRANSITION_PROVIDER_CANCEL_AFTER_EXPIRE,
  TRANSITION_OPERATOR_CANCEL_AFTER_EXPIRE
]

exports.isFirstPurchase = ({ data }) => {
  if (data.length === 0) return true;
  else if (data.length > 0) {
    const countOfValidRejectBookings = data.reduce((acc, item) => {
      if (arrayOfTransitions.includes(item.attributes.lastTransition)) acc += 1;
      return acc;
    }, 0);

    const countOfEnquiredBookings = data.reduce((acc, item) => {
      if (item.attributes.lastTransition === TRANSITION_ENQUIRE) acc += 1;
      return acc;
    }, 0);

    return countOfValidRejectBookings + countOfEnquiredBookings === data.length ? true : false;
  }
}