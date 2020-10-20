import React, { Component } from 'react';
import { bool, func, object, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import * as validators from '../../util/validators';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { Form, Button, FieldTextInput } from '../../components';
import { OnChange } from 'react-final-form-listeners'

import ManageAvailabilityCalendar from './ManageAvailabilityCalendar';
import css from './EditTeacherAvailabilityForm.css';

export class EditTeacherAvailabilityFormComponent extends Component {
  render() {
    return (
      <FinalForm
        {...this.props}
        render={formRenderProps => {
          const {
            className,
            rootClassName,
            disabled,
            ready,
            handleSubmit,
            intl,
            invalid,
            pristine,
            saveActionMsg,
            updated,
            updateError,
            updateInProgress,
            availability,
            availabilityPlan,
            listingId,
            seatInputChange
          } = formRenderProps;

          const errorMessage = updateError ? (
            <p className={css.error}>
              <FormattedMessage id="EditTeacherAvailabilityForm.updateFailed" />
            </p>
          ) : null;

          // Seats of each day's booking
          const seatMessage = intl.formatMessage({
            id: 'EditTeacherAvailabilityForm.seatInput',
          });
          const seatPlaceholderMessage = intl.formatMessage({
            id: 'EditTeacherAvailabilityForm.seatInputPlaceholder',
          });

          const seatRequired = validators.required(
            intl.formatMessage({
              id: 'EditTeacherAvailabilityForm.seatRequired',
            })
          );
          const seatNumberFormatRequired = validators.numberFormatValid(
            intl.formatMessage({
              id: 'EditTeacherAvailabilityForm.seatNumberFormatRequired',
            })
          );
          const seatValidators = validators.composeValidators(seatRequired, seatNumberFormatRequired)

          const classes = classNames(rootClassName || css.root, className);
          const submitReady = (updated && pristine) || ready;
          const submitInProgress = updateInProgress;
          const submitDisabled = invalid || disabled || submitInProgress;

          return (
            <Form className={classes} onSubmit={handleSubmit}>
              {errorMessage}

              <FieldTextInput
                id="seat"
                name="seat"
                className={css.seatInput}
                type="text"
                autoFocus
                label={seatMessage}
                placeholder={seatPlaceholderMessage}
                validate={seatValidators}
              />
              <OnChange name="seat">
                {(value, previous) => {
                  seatInputChange(value === "" ? 0 : Number.parseInt(value));
                }}
              </OnChange>

              <div className={css.calendarWrapper}>
                <ManageAvailabilityCalendar
                  availability={availability}
                  availabilityPlan={availabilityPlan}
                  listingId={listingId}
                />
              </div>

              <Button
                className={css.submitButton}
                type="submit"
                inProgress={submitInProgress}
                disabled={submitDisabled}
                ready={submitReady}
              >
                {saveActionMsg}
              </Button>
            </Form>
          );
        }}
      />
    );
  }
}

EditTeacherAvailabilityFormComponent.defaultProps = {
  updateError: null,
};

EditTeacherAvailabilityFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateError: propTypes.error,
  updateInProgress: bool.isRequired,
  availability: object.isRequired,
  availabilityPlan: propTypes.availabilityPlan.isRequired,
};

export default compose(injectIntl)(EditTeacherAvailabilityFormComponent);
