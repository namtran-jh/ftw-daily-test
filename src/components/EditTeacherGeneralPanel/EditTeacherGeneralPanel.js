import React from 'react';
import { bool, func, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditTeacherGeneralForm } from '../../forms';

import css from './EditTeacherGeneralPanel.css';

const EditTeacherGeneralPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { description, title, publicData } = currentListing.attributes;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditTeacherGeneralPanel.title"
      values={{ teacherTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
      <FormattedMessage id="EditTeacherGeneralPanel.createTeacherTitle" />
    );

  /**  
  const subjectsOptions = findOptionsForSelectFilter('subjects', config.custom.filters);
  const levelsOptions = findOptionsForSelectFilter('levels', config.custom.filters);
  const hoursOptions = findOptionsForSelectFilter('hours', config.custom.filters);
  */
  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditTeacherGeneralForm
        className={css.form}
        initialValues={{ title, description, subjects: publicData.subjects, levels: publicData.levels, hours: publicData.hours, numberOfHours: publicData.numberOfHours, isTeacherType: publicData.isTeacherType }}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const { title, description, subjects = [], levels = [], hours, numberOfHours, isTeacherType = true } = values;
          const updateValues = {
            title: title.trim(),
            description,
            publicData: { subjects, levels, hours, numberOfHours, isTeacherType },
          };

          onSubmit(updateValues);
        }}
        onChange={onChange}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
      />
    </div>
  );
};

EditTeacherGeneralPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  listing: null,
};

EditTeacherGeneralPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditTeacherGeneralPanel;
