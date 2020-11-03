const { transactionLineItems } = require('../api-util/lineItems');
const { getSdk, getIntergrationSdk, handleError, serialize } = require('../api-util/sdk');
const { constructValidLineItems } = require('../api-util/lineItemHelpers');
const { checkIsFirstTimeOfCustomer } = require('../api-util/helper');

module.exports = (req, res) => {
  const { isOwnListing, listingId, bookingData, customerId } = req.body;
  const sdk = getSdk(req, res);
  const intergrationSdk = getIntergrationSdk(req, res);

  const listingPromise = isOwnListing
    ? sdk.ownListings.show({ id: listingId })
    : sdk.listings.show({ id: listingId });

  listingPromise
    .then(async (apiResponse) => {
      // Calculate fist time of customer booking
      const queryResult = await intergrationSdk.transactions.query({ customerId });
      const isFirstTime = checkIsFirstTimeOfCustomer(queryResult);

      const listing = apiResponse.data.data;
      const lineItems = transactionLineItems(listing, bookingData, isFirstTime);

      // Because we are using returned lineItems directly in FTW we need to use the helper function
      // to add some attributes like lineTotal and reversal that Marketplace API also adds to the response.
      const validLineItems = constructValidLineItems(lineItems);

      res
        .status(200)
        .set('Content-Type', 'application/transit+json')
        .send(serialize({ data: validLineItems }))
        .end();
    })
    .catch(e => {
      handleError(res, e);
    });
};
