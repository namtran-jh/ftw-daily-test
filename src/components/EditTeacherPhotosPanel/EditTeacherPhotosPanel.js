import React, { Component } from 'react';
import { array, bool, func, object, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { EditTeacherPhotosForm } from '../../forms';
import { ensureOwnListing } from '../../util/data';
import { ListingLink } from '../../components';

import css from './EditTeacherPhotosPanel.css';

class EditTeacherPhotosPanel extends Component {
  render() {
    const {
      className,
      rootClassName,
      errors,
      disabled,
      ready,
      images,
      mainImage,
      otherImage,
      listing,
      onImageUpload,
      onUpdateImageOrder,
      onMainImageUpload,
      onUpdateMainImageOrder,
      onOtherImageUpload,
      onUpdateOtherImageOrder,
      submitButtonText,
      panelUpdated,
      updateInProgress,
      onChange,
      onSubmit,
      onRemoveImage,
      onRemoveMainImage,
      onRemoveOtherImage,
    } = this.props;

    const rootClass = rootClassName || css.root;
    const classes = classNames(rootClass, className);
    const currentListing = ensureOwnListing(listing);

    const isPublished =
      currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
    const panelTitle = isPublished ? (
      <FormattedMessage
        id="EditTeacherPhotosPanel.title"
        values={{ teacherTitle: <ListingLink listing={listing} /> }}
      />
    ) : (
        <FormattedMessage id="EditTeacherPhotosPanel.createTeacherTitle" />
      );

    return (
      <div className={classes}>
        <h1 className={css.title}>{panelTitle}</h1>
        <EditTeacherPhotosForm
          className={css.form}
          disabled={disabled}
          ready={ready}
          fetchErrors={errors}
          initialValues={{ images, mainImage }}
          images={images}
          mainImage={mainImage}
          otherImage={otherImage}
          onImageUpload={onImageUpload}
          onMainImageUpload={onMainImageUpload}
          onOtherImageUpload={onOtherImageUpload}
          onSubmit={values => {
            const { addImage, addMainImage, ...newImages } = values;
            const mainImageListID = newImages.mainImage.map(img => typeof img.id === "string" ? img.imageId.uuid : img.id.uuid);
            const updateValues = {
              images: newImages.images,
              publicData: { mainImage: mainImageListID }
            }
            onSubmit(updateValues);
          }}
          onChange={onChange}
          onUpdateImageOrder={onUpdateImageOrder}
          onRemoveImage={onRemoveImage}
          onUpdateMainImageOrder={onUpdateMainImageOrder}
          onRemoveMainImage={onRemoveMainImage}
          onUpdateOtherImageOrder={onUpdateOtherImageOrder}
          onRemoveOtherImage={onRemoveOtherImage}
          saveActionMsg={submitButtonText}
          updated={panelUpdated}
          updateInProgress={updateInProgress}
        />
      </div>
    );
  }
}

EditTeacherPhotosPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  images: [],
  listing: null,
};

EditTeacherPhotosPanel.propTypes = {
  className: string,
  rootClassName: string,
  errors: object,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  images: array,
  mainImage: array,
  otherImage: array,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  onImageUpload: func.isRequired,
  onUpdateImageOrder: func.isRequired,
  onMainImageUpload: func.isRequired,
  onUpdateMainImageOrder: func.isRequired,
  onOtherImageUpload: func.isRequired,
  onUpdateOtherImageOrder: func.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  onRemoveImage: func.isRequired,
  onRemoveMainImage: func.isRequired,
  onRemoveOtherImage: func.isRequired,
};

export default EditTeacherPhotosPanel;
