const { transactionLineItems } = require('../api-util/lineItems');
const { getSdk, getIntergrationSdk, getTrustedSdk, handleError, serialize } = require('../api-util/sdk');
const { isFirstPurchase } = require('../api-util/helper');

module.exports = (req, res) => {
  const { isSpeculative, bookingData, bodyParams, queryParams } = req.body;

  const { listingId, units, seats, ...restParams } = bodyParams && bodyParams.params ? bodyParams.params : {};

  const sdk = getSdk(req, res);
  const intergrationSdk = getIntergrationSdk(req, res);
  let lineItems = null;

  sdk.listings
    .show({ id: listingId })
    .then(async (listingResponse) => {
      const listing = listingResponse.data.data;

      const fullBookingData = {
        ...bookingData,
        units,
        seats,
      }

      const queryResult = await intergrationSdk.transactions.query({ customerId: restParams.customerId });
      const isFirstTime = isFirstPurchase(queryResult.data);

      lineItems = transactionLineItems(listing, fullBookingData, isFirstTime);

      return getTrustedSdk(req);
    })
    .then(trustedSdk => {
      // Add lineItems to the body params
      const body = {
        ...bodyParams,
        params: {
          ...restParams,
          lineItems,
        },
      };

      if (isSpeculative) {
        return trustedSdk.transactions.transitionSpeculative(body, queryParams);
      }
      return trustedSdk.transactions.transition(body, queryParams);
    })
    .then(apiResponse => {
      const { status, statusText, data } = apiResponse;
      res
        .status(status)
        .set('Content-Type', 'application/transit+json')
        .send(
          serialize({
            status,
            statusText,
            data,
          })
        )
        .end();
    })
    .catch(e => {
      handleError(res, e);
    });
};
