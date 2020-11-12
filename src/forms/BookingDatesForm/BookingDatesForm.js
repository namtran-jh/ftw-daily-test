import React, { Component } from 'react';
import { string, bool, arrayOf, array, func } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import moment from 'moment';
import { required, bookingDateRequired, composeValidators } from '../../util/validators';
import { calculateBookingDate } from '../../util/dates';
import { propTypes } from '../../util/types';
import config from '../../config';
import { Form, IconSpinner, PrimaryButton, FieldDateInput, FieldSelect } from '../../components';
import EstimatedBreakdownMaybe from './EstimatedBreakdownMaybe';
import { BookingTimes } from './BookingTimes';

import css from './BookingDatesForm.css';

const identity = v => v;

export class BookingDatesFormComponent extends Component {
  constructor(props) {
    super(props);
    // this.state = { focusedInput: null };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    // this.onFocusedInputChange = this.onFocusedInputChange.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  // Function that can be passed to nested components
  // so that they can notify this component when the
  // focused input changes.
  // onFocusedInputChange(focusedInput) {
  //   this.setState({ focusedInput });
  // }

  // In case start or end date for the booking is missing
  // focus on that input, otherwise continue with the
  // default handleSubmit function.
  handleFormSubmit(e) {
    const startDate = e.bookingDates && e.bookingStartTime
      ? calculateBookingDate(e.bookingDates.date, Number.parseInt(e.bookingStartTime))
      : ""
    const endDate = e.bookingDates && e.bookingStartTime
      ? calculateBookingDate(e.bookingDates.date, Number.parseInt(e.bookingStartTime) + 24 + this.props.units)
      : ""

    const displayStart = e.bookingDates && e.bookingStartTime
      ? calculateBookingDate(e.bookingDates.date, Number.parseInt(e.bookingStartTime))
      : ""
    const displayEnd = e.bookingDates && e.bookingStartTime
      ? calculateBookingDate(e.bookingDates.date, Number.parseInt(e.bookingStartTime) + this.props.units)
      : ""

    if (!startDate || !endDate) {
      e.preventDefault();
    } else {
      this.props.onSubmit({ bookingDates: { startDate, endDate, displayStart, displayEnd }, seats: 1, units: this.props.units });
    }
  }

  // When the values of the form are updated we need to fetch
  // lineItems from FTW backend for the EstimatedTransactionMaybe
  // In case you add more fields to the form, make sure you add
  // the values here to the bookingData object.
  handleOnChange(formValues) {
    const listingId = this.props.listingId;
    const isOwnListing = this.props.isOwnListing;
    const seats = 1;
    const units = this.props.units

    const date = formValues.values && formValues.values.bookingDates
      ? formValues.values.bookingDates.date : "";
    const time = formValues.values && formValues.values.bookingStartTime
      ? formValues.values.bookingStartTime : "";

    const startDate = date && time
      ? calculateBookingDate(date, Number.parseInt(time))
      : "";
    const endDate = date && time
      ? calculateBookingDate(date, Number.parseInt(time) + 24 + units)
      : "";

    const displayStart = date && time
      ? calculateBookingDate(date, Number.parseInt(time))
      : "";
    const displayEnd = date && time
      ? calculateBookingDate(date, Number.parseInt(time) + units)
      : "";

    if (startDate && endDate && !this.props.fetchLineItemsInProgress) {
      this.props.onFetchTransactionLineItems({
        bookingData: { startDate, endDate, displayStart, displayEnd, seats, units },
        listingId,
        isOwnListing,
        customerId: this.props.currentUser.id.uuid
      });
    }
  }

  render() {
    const { rootClassName, className, price: unitPrice, ...rest } = this.props;
    const classes = classNames(rootClassName || css.root, className);

    if (!unitPrice) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingDatesForm.listingPriceMissing" />
          </p>
        </div>
      );
    }
    if (unitPrice.currency !== config.currency) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingDatesForm.listingCurrencyInvalid" />
          </p>
        </div>
      );
    }

    return (
      <FinalForm
        {...rest}
        unitPrice={unitPrice}
        onSubmit={this.handleFormSubmit}
        render={fieldRenderProps => {
          const {
            datePlaceholder,
            formId,
            handleSubmit,
            intl,
            isOwnListing,
            submitButtonWrapperClassName,
            unitType,
            units,
            isTeacherType,
            listingCategory,
            values,
            timeSlots,
            fetchTimeSlotsError,
            lineItems,
            fetchLineItemsInProgress,
            fetchLineItemsError,
          } = fieldRenderProps;
          // const { startDate, endDate } = values && values.bookingDates ? values.bookingDates : {};

          const startDate = values && values.bookingDates && values.bookingDates.date && values.bookingStartTime
            ? calculateBookingDate(values.bookingDates.date, Number.parseInt(values.bookingStartTime))
            : "";
          const endDate = values && values.bookingDates && values.bookingDates.date && values.bookingStartTime
            ? calculateBookingDate(values.bookingDates.date, Number.parseInt(values.bookingStartTime) + 24 + units)
            : "";

          const displayStart = values && values.bookingDates && values.bookingDates.date && values.bookingStartTime
            ? calculateBookingDate(values.bookingDates.date, Number.parseInt(values.bookingStartTime))
            : "";
          const displayEnd = values && values.bookingDates && values.bookingDates.date && values.bookingStartTime
            ? calculateBookingDate(values.bookingDates.date, Number.parseInt(values.bookingStartTime) + units)
            : "";

          const bookingTimesOptions = BookingTimes.slice(0, BookingTimes.length - units);

          const bookingLabel = intl.formatMessage({
            id: 'BookingDatesForm.bookingTitle',
          });
          // const bookingStartLabel = intl.formatMessage({
          //   id: 'BookingDatesForm.bookingStartTitle',
          // });
          // const bookingEndLabel = intl.formatMessage({
          //   id: 'BookingDatesForm.bookingEndTitle',
          // });
          const requiredMessage = intl.formatMessage({
            id: 'BookingDatesForm.requiredDate',
          });
          const dateErrorMessage = intl.formatMessage({
            id: 'FieldDateInput.invalidDate',
          });
          // const startDateErrorMessage = intl.formatMessage({
          //   id: 'FieldDateRangeInput.invalidStartDate',
          // });
          // const endDateErrorMessage = intl.formatMessage({
          //   id: 'FieldDateRangeInput.invalidEndDate',
          // });
          const timeSlotsError = fetchTimeSlotsError ? (
            <p className={css.sideBarError}>
              <FormattedMessage id="BookingDatesForm.timeSlotsError" />
            </p>
          ) : null;

          // This is the place to collect breakdown estimation data.
          // Note: lineItems are calculated and fetched from FTW backend
          // so we need to pass only booking data that is needed otherwise
          // If you have added new fields to the form that will affect to pricing,
          // you need to add the values to handleOnChange function
          const bookingData =
            startDate && endDate
              ? {
                unitType,
                startDate,
                endDate,
                displayStart,
                displayEnd,
                units,
                seats: 1
              }
              : null;

          const showEstimatedBreakdown =
            bookingData && lineItems && !fetchLineItemsInProgress && !fetchLineItemsError;

          const bookingInfoMaybe = showEstimatedBreakdown ? (
            <div className={css.priceBreakdownContainer}>
              <h3 className={css.priceBreakdownTitle}>
                <FormattedMessage id="BookingDatesForm.priceBreakdownTitle" />
              </h3>
              <EstimatedBreakdownMaybe
                isTeacherType={isTeacherType}
                listingCategory={listingCategory}
                bookingData={bookingData}
                lineItems={lineItems}
              />
            </div>
          ) : null;

          const loadingSpinnerMaybe = fetchLineItemsInProgress ? (
            <IconSpinner className={css.spinner} />
          ) : null;

          const bookingInfoErrorMaybe = fetchLineItemsError ? (
            <span className={css.sideBarError}>
              <FormattedMessage id="BookingDatesForm.fetchLineItemsError" />
            </span>
          ) : null;

          const dateFormatOptions = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          };

          const now = moment();
          const today = now.startOf('day').toDate();
          // const tomorrow = now
          //   .startOf('day')
          //   .add(1, 'days')
          //   .toDate();
          const datePlaceholderText =
            datePlaceholder || intl.formatDate(today, dateFormatOptions);
          // const startDatePlaceholderText =
          //   startDatePlaceholder || intl.formatDate(today, dateFormatOptions);
          // const endDatePlaceholderText =
          //   endDatePlaceholder || intl.formatDate(tomorrow, dateFormatOptions);
          const submitButtonClasses = classNames(
            submitButtonWrapperClassName || css.submitButtonWrapper
          );

          const startTimeLabel = intl.formatMessage({
            id: 'BookingDatesForm.startTimeTitle',
          });
          // const endTimeLabel = intl.formatMessage({
          //   id: 'BookingDatesForm.endTimeTitle',
          // });
          const startTimePlaceholder = 'Choose your start time'
          const startTimeRequired = required(
            intl.formatMessage({
              id: 'FieldDateInput.startTimeRequired',
            })
          );

          return (
            <Form onSubmit={handleSubmit} className={classes}>
              {timeSlotsError}
              <FormSpy
                subscription={{ values: true }}
                onChange={values => {
                  this.handleOnChange(values);
                }}
              />
              <FieldDateInput
                className={css.bookingDate}
                name="bookingDates"
                id={`${formId}.bookingDate`}
                label={bookingLabel}
                placeholderText={datePlaceholderText}
                format={identity}
                timeSlots={timeSlots}
                useMobileMargins
                validate={composeValidators(
                  required(requiredMessage),
                  bookingDateRequired(dateErrorMessage)
                )}
                disabled={fetchLineItemsInProgress}
              />

              <FieldSelect
                className={css.bookingTimes}
                name="bookingStartTime"
                id={`${formId}.bookingStartTime`}
                label={startTimeLabel}
                validate={startTimeRequired}
              >
                <option disabled value="">
                  {startTimePlaceholder}
                </option>
                {bookingTimesOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </FieldSelect>

              {bookingInfoMaybe}
              {loadingSpinnerMaybe}
              {bookingInfoErrorMaybe}

              <p className={css.smallPrint}>
                <FormattedMessage
                  id={
                    isOwnListing
                      ? 'BookingDatesForm.ownListing'
                      : 'BookingDatesForm.youWontBeChargedInfo'
                  }
                />
              </p>
              <div className={submitButtonClasses}>
                <PrimaryButton type="submit">
                  <FormattedMessage id="BookingDatesForm.requestToBook" />
                </PrimaryButton>
              </div>
            </Form>
          );
        }}
      />
    );
  }
}

BookingDatesFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  submitButtonWrapperClassName: null,
  price: null,
  isOwnListing: false,
  startDatePlaceholder: null,
  endDatePlaceholder: null,
  timeSlots: null,
  lineItems: null,
  fetchLineItemsError: null,
};

BookingDatesFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  submitButtonWrapperClassName: string,

  unitType: propTypes.bookingUnitType.isRequired,
  price: propTypes.money,
  isOwnListing: bool,
  timeSlots: arrayOf(propTypes.timeSlot),

  onFetchTransactionLineItems: func.isRequired,
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,

  // for tests
  startDatePlaceholder: string,
  endDatePlaceholder: string,
};

const BookingDatesForm = compose(injectIntl)(BookingDatesFormComponent);
BookingDatesForm.displayName = 'BookingDatesForm';

export default BookingDatesForm;
