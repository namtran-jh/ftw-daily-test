import React, { useState } from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditTeacherAvailabilityForm } from '../../forms';

import css from './EditTeacherAvailabilityPanel.css';

const EditTeacherAvailabilityPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    availability,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const [seatInput, setSeatInput] = useState(ensureOwnListing(listing).attributes.availabilityPlan ? ensureOwnListing(listing).attributes.availabilityPlan.entries[0].seats : 0);

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const defaultAvailabilityPlan = {
    type: 'availability-plan/day',
    entries: [
      { dayOfWeek: 'mon', seats: seatInput },
      { dayOfWeek: 'tue', seats: seatInput },
      { dayOfWeek: 'wed', seats: seatInput },
      { dayOfWeek: 'thu', seats: seatInput },
      { dayOfWeek: 'fri', seats: seatInput },
      { dayOfWeek: 'sat', seats: seatInput },
      { dayOfWeek: 'sun', seats: seatInput },
    ],
  };
  const availabilityPlan = defaultAvailabilityPlan;

  return (
    <div className={classes}>
      <h1 className={css.title}>
        {isPublished ? (
          <FormattedMessage
            id="EditTeacherAvailabilityPanel.title"
            values={{ teacherTitle: <ListingLink listing={listing} /> }}
          />
        ) : (
            <FormattedMessage id="EditTeacherAvailabilityPanel.createTeacherTitle" />
          )}
      </h1>
      <EditTeacherAvailabilityForm
        className={css.form}
        listingId={currentListing.id}
        initialValues={{ seat: seatInput, availabilityPlan }}
        availability={availability}
        availabilityPlan={availabilityPlan}
        onSubmit={() => {
          // We save the default availability plan
          // I.e. this listing is available every night.
          // Exceptions are handled with live edit through a calendar,
          // which is visible on this panel.
          onSubmit({ availabilityPlan });
        }}
        seatInputChange={val => setSeatInput(val)}
        onChange={onChange}
        saveActionMsg={submitButtonText}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateError={errors.updateListingError}
        updateInProgress={updateInProgress}
      />
    </div>
  );
};

EditTeacherAvailabilityPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditTeacherAvailabilityPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  availability: shape({
    calendar: object.isRequired,
    onFetchAvailabilityExceptions: func.isRequired,
    onCreateAvailabilityException: func.isRequired,
    onDeleteAvailabilityException: func.isRequired,
  }).isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditTeacherAvailabilityPanel;
