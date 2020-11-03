const TRANSITION_ENQUIRE = 'transition/enquire';
const TRANSITION_DECLINE = 'transition/decline';
const TRANSITION_DECLINE_AFTER_EXPIRE = 'transition/decline-after-expire';
const TRANSITION_PROVIDER_CANCEL_BEFORE_EXPIRE = 'transition/provider-cancel-before-expire';
const TRANSITION_OPERATOR_CANCEL_BEFORE_EXPIRE = 'transition/operator-cancel-before-expire';
const TRANSITION_PROVIDER_CANCEL_AFTER_EXPIRE = 'transition/provider-cancel-after-expire';
const TRANSITION_OPERATOR_CANCEL_AFTER_EXPIRE = 'transition/operator-cancel-after-expire';

exports.checkIsFirstTimeOfCustomer = (queryResult) => {
  if (queryResult.data.data.length === 0) return true;
  else if (queryResult.data.data.length > 0) {
    const countOfValidRejectBookings = queryResult.data.data.reduce((acc, item) => {
      if (item.attributes.lastTransition === TRANSITION_DECLINE
        || item.attributes.lastTransition === TRANSITION_DECLINE_AFTER_EXPIRE
        || item.attributes.lastTransition === TRANSITION_PROVIDER_CANCEL_BEFORE_EXPIRE
        || item.attributes.lastTransition === TRANSITION_OPERATOR_CANCEL_BEFORE_EXPIRE
        || item.attributes.lastTransition === TRANSITION_PROVIDER_CANCEL_AFTER_EXPIRE
        || item.attributes.lastTransition === TRANSITION_OPERATOR_CANCEL_AFTER_EXPIRE)
        acc += 1;
      return acc;
    }, 0);

    const countOfEnquiredBookings = queryResult.data.data.reduce((acc, item) => {
      if (item.attributes.lastTransition === TRANSITION_ENQUIRE) acc += 1;
      return acc;
    }, 0);

    return countOfValidRejectBookings + countOfEnquiredBookings === queryResult.data.data.length ? true : false;
  }
}