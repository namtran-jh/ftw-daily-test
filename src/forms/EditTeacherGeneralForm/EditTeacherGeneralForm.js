import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { maxLength, required, composeValidators } from '../../util/validators';
import { Form, Button, FieldTextInput, FieldCheckboxGroup } from '../../components';
import config from '../../config';
import { findOptionsForSelectFilter } from '../../util/search';
import CustomHourSelectFieldMaybe from './CustomHourSelectFieldMaybe';

import css from './EditTeacherGeneralForm.css';

const TITLE_MAX_LENGTH = 60;

const EditTeacherGeneralFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        className,
        disabled,
        ready,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        filterConfig,
      } = formRenderProps;

      const titleMessage = intl.formatMessage({ id: 'EditTeacherGeneralForm.title' });
      const titlePlaceholderMessage = intl.formatMessage({
        id: 'EditTeacherGeneralForm.titlePlaceholder',
      });
      const titleRequiredMessage = intl.formatMessage({
        id: 'EditTeacherGeneralForm.titleRequired',
      });
      const maxLengthMessage = intl.formatMessage(
        { id: 'EditTeacherGeneralForm.maxLength' },
        {
          maxLength: TITLE_MAX_LENGTH,
        }
      );
      const maxLength60Message = maxLength(maxLengthMessage, TITLE_MAX_LENGTH);

      const descriptionMessage = intl.formatMessage({
        id: 'EditTeacherGeneralForm.description',
      });
      const descriptionPlaceholderMessage = intl.formatMessage({
        id: 'EditTeacherGeneralForm.descriptionPlaceholder',
      });
      const descriptionRequiredMessage = intl.formatMessage({
        id: 'EditTeacherGeneralForm.descriptionRequired',
      });

      const { updateListingError, createListingDraftError, showListingsError } = fetchErrors || {};
      const errorMessageUpdateListing = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditTeacherGeneralForm.updateFailed" />
        </p>
      ) : null;

      // This error happens only on first tab (of EditListingWizard)
      const errorMessageCreateListingDraft = createListingDraftError ? (
        <p className={css.error}>
          <FormattedMessage id="EditTeacherGeneralForm.createTeacherDraftError" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditTeacherGeneralForm.showTeacherFailed" />
        </p>
      ) : null;

      const optionsSubjects = findOptionsForSelectFilter('subjects', filterConfig);
      const optionsLevels = findOptionsForSelectFilter('levels', filterConfig);
      const optionsHours = findOptionsForSelectFilter('hours', filterConfig);

      const subjectMessage = intl.formatMessage({ id: 'EditTeacherGeneralForm.subject' });
      const subjectRequiredMessage = intl.formatMessage({
        id: 'EditTeacherGeneralForm.subjectRequired',
      });

      const levelMessage = intl.formatMessage({ id: 'EditTeacherGeneralForm.level' });
      const levelRequiredMessage = intl.formatMessage({
        id: 'EditTeacherGeneralForm.levelRequired',
      });

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessageCreateListingDraft}
          {errorMessageUpdateListing}
          {errorMessageShowListing}
          <FieldTextInput
            id="title"
            name="title"
            className={css.title}
            type="text"
            label={titleMessage}
            placeholder={titlePlaceholderMessage}
            maxLength={TITLE_MAX_LENGTH}
            validate={composeValidators(required(titleRequiredMessage), maxLength60Message)}
          />

          <FieldTextInput
            id="description"
            name="description"
            className={css.description}
            type="textarea"
            label={descriptionMessage}
            placeholder={descriptionPlaceholderMessage}
            validate={composeValidators(required(descriptionRequiredMessage))}
          />

          <FieldCheckboxGroup
            className={css.multipleChoices}
            id="subjects"
            name="subjects"
            options={optionsSubjects}
            label={subjectMessage}
            validate={required(subjectRequiredMessage)}
          />

          <FieldCheckboxGroup
            className={css.multipleChoices}
            id="levels"
            name="levels"
            options={optionsLevels}
            label={levelMessage}
            validate={required(levelRequiredMessage)}
          />

          <CustomHourSelectFieldMaybe
            id="hours"
            name="hours"
            hours={optionsHours}
            intl={intl}
          />

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

EditTeacherGeneralFormComponent.defaultProps = {
  className: null,
  fetchErrors: null,
  filterConfig: config.custom.filters,
};

EditTeacherGeneralFormComponent.propTypes = {
  className: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    createListingDraftError: propTypes.error,
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  categories: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ),
  filterConfig: propTypes.filterConfig,
};

export default compose(injectIntl)(EditTeacherGeneralFormComponent);
