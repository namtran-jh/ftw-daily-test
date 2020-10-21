import React, { Component } from 'react';
import { array, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { nonEmptyArray, composeValidators } from '../../util/validators';
import { isUploadImageOverLimitError } from '../../util/errors';
import { AddImages, Button, Form, ValidationError } from '../../components';
// import { OnChange } from 'react-final-form-listeners';

import css from './EditTeacherPhotosForm.css';

const ACCEPT_IMAGES = 'image/*';

export class EditTeacherPhotosFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { imageUploadRequested: false };
    this.onImageUploadHandler = this.onImageUploadHandler.bind(this);
    this.onMainImageUploadHandler = this.onMainImageUploadHandler.bind(this);
    this.onOtherImageUploadHandler = this.onOtherImageUploadHandler.bind(this);
    this.submittedImages = [];
  }

  onImageUploadHandler(file) {
    if (file) {
      this.setState({ imageUploadRequested: true });
      this.props
        .onImageUpload({ id: `${file.name}_${Date.now()}`, file })
        .then(() => {
          this.setState({ imageUploadRequested: false });
        })
        .catch(() => {
          this.setState({ imageUploadRequested: false });
        });
    }
  }

  onMainImageUploadHandler(file) {
    if (file) {
      this.setState({ imageUploadRequested: true });
      this.props
        .onMainImageUpload({ id: `${file.name}_${Date.now()}`, file })
        .then(() => {
          this.setState({ imageUploadRequested: false });
        })
        .catch(() => {
          this.setState({ imageUploadRequested: false });
        });
    }
  }

  onOtherImageUploadHandler(file) {
    if (file) {
      this.setState({ imageUploadRequested: true });
      this.props
        .onOtherImageUpload({ id: `${file.name}_${Date.now()}`, file })
        .then(() => {
          this.setState({ imageUploadRequested: false });
        })
        .catch(() => {
          this.setState({ imageUploadRequested: false });
        });
    }
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        mutators={{ ...arrayMutators }}
        onImageUploadHandler={this.onImageUploadHandler}
        onMainImageUploadHandler={this.onMainImageUploadHandler}
        onOtherImageUploadHandler={this.onOtherImageUploadHandler}
        imageUploadRequested={this.state.imageUploadRequested}
        render={formRenderProps => {
          const {
            form,
            className,
            fetchErrors,
            handleSubmit,
            images,
            mainImage,
            otherImage,
            imageUploadRequested,
            intl,
            invalid,
            onMainImageUploadHandler,
            onOtherImageUploadHandler,
            onRemoveImage,
            onRemoveMainImage,
            onRemoveOtherImage,
            disabled,
            ready,
            saveActionMsg,
            updated,
            updateInProgress,
          } = formRenderProps;

          const chooseImageText = (
            <span className={css.chooseImageText}>
              <span className={css.chooseImage}>
                <FormattedMessage id="EditTeacherPhotosForm.chooseImage" />
              </span>
              <span className={css.imageTypes}>
                <FormattedMessage id="EditTeacherPhotosForm.imageTypes" />
              </span>
            </span>
          );

          const imageRequiredMessage = intl.formatMessage({
            id: 'EditTeacherPhotosForm.imageRequired',
          });

          const { publishListingError, showListingsError, updateListingError, uploadImageError } =
            fetchErrors || {};
          const uploadOverLimit = isUploadImageOverLimitError(uploadImageError);

          let uploadImageFailed = null;

          if (uploadOverLimit) {
            uploadImageFailed = (
              <p className={css.error}>
                <FormattedMessage id="EditTeacherPhotosForm.imageUploadFailed.uploadOverLimit" />
              </p>
            );
          } else if (uploadImageError) {
            uploadImageFailed = (
              <p className={css.error}>
                <FormattedMessage id="EditTeacherPhotosForm.imageUploadFailed.uploadFailed" />
              </p>
            );
          }

          // NOTE: These error messages are here since Photos panel is the last visible panel
          // before creating a new listing. If that order is changed, these should be changed too.
          // Create and show listing errors are shown above submit button
          const publishListingFailed = publishListingError ? (
            <p className={css.error}>
              <FormattedMessage id="EditTeacherPhotosForm.publishListingFailed" />
            </p>
          ) : null;
          const showListingFailed = showListingsError ? (
            <p className={css.error}>
              <FormattedMessage id="EditTeacherPhotosForm.showListingFailed" />
            </p>
          ) : null;

          const submittedOnce = this.submittedImages.length > 0;
          // imgs can contain added images (with temp ids) and submitted images with uniq ids.
          const arrayOfImgIds = imgs =>
            imgs.map(i => (typeof i.id === 'string' ? i.imageId : i.id));
          const imageIdsFromProps = arrayOfImgIds(images);
          const imageIdsFromPreviousSubmit = arrayOfImgIds(this.submittedImages);
          const imageArrayHasSameImages = isEqual(imageIdsFromProps, imageIdsFromPreviousSubmit);

          const mainImageIdsFromProps = arrayOfImgIds(mainImage);
          const mainImageIdsFromPreviousSubmit = arrayOfImgIds(this.submittedImages);
          const mainImageArrayHasSameImages = isEqual(mainImageIdsFromProps, mainImageIdsFromPreviousSubmit);

          const pristineSinceLastSubmit = submittedOnce && imageArrayHasSameImages && mainImageArrayHasSameImages;

          const submitReady = (updated && pristineSinceLastSubmit) || ready;
          const submitInProgress = updateInProgress;
          const submitDisabled =
            invalid || disabled || submitInProgress || imageUploadRequested || ready;

          const classes = classNames(css.root, className);

          return (
            <Form
              className={classes}
              onSubmit={e => {
                this.submittedImages = images;
                handleSubmit(e);
              }}
            >
              {updateListingError ? (
                <p className={css.error}>
                  <FormattedMessage id="EditTeacherPhotosForm.updateFailed" />
                </p>
              ) : null}

              <label>Main Photos</label>
              <AddImages
                className={css.imagesField}
                images={mainImage}
                thumbnailClassName={css.thumbnail}
                savedImageAltText={intl.formatMessage({
                  id: 'EditTeacherPhotosForm.savedImageAltText',
                })}
                onRemoveImage={id => {
                  onRemoveImage(id);
                  onRemoveMainImage(id);
                }}
              >
                <Field
                  id="addMainImage"
                  name="addMainImage"
                  accept={ACCEPT_IMAGES}
                  form={null}
                  label={chooseImageText}
                  type="file"
                  disabled={imageUploadRequested}
                >
                  {fieldprops => {
                    const { accept, input, label, disabled: fieldDisabled } = fieldprops;
                    const { name, type } = input;
                    const onChange = e => {
                      const file = e.target.files[0];
                      form.change(`addMainImage`, file);
                      form.blur(`addMainImage`);
                      onMainImageUploadHandler(file);
                    };
                    const inputProps = { accept, id: name, name, onChange, type };
                    return (
                      <div className={css.addImageWrapper}>
                        <div className={css.aspectRatioWrapper}>
                          {fieldDisabled ? null : (
                            <input {...inputProps} className={css.addImageInput} />
                          )}
                          <label htmlFor={name} className={css.addImage}>
                            {label}
                          </label>
                        </div>
                      </div>
                    );
                  }}
                </Field>

                <Field
                  component={props => {
                    const { input, meta } = props;
                    return (
                      <div className={css.imageRequiredWrapper}>
                        <input {...input} />
                        <ValidationError fieldMeta={meta} />
                      </div>
                    );
                  }}
                  name="mainImage"
                  type="hidden"
                  validate={composeValidators(nonEmptyArray(imageRequiredMessage))}
                />
              </AddImages>
              {uploadImageFailed}
              <p className={css.tip}>
                <FormattedMessage id="EditTeacherPhotosForm.addImagesTipMainPhotos" />
              </p>

              <label className={css.photosLabel}>Other Photos</label>
              <AddImages
                className={css.imagesField}
                images={otherImage}
                thumbnailClassName={css.thumbnail}
                savedImageAltText={intl.formatMessage({
                  id: 'EditTeacherPhotosForm.savedImageAltText',
                })}
                onRemoveImage={id => {
                  onRemoveImage(id);
                  onRemoveOtherImage(id);
                }}
              >
                <Field
                  id="addImage"
                  name="addImage"
                  accept={ACCEPT_IMAGES}
                  form={null}
                  label={chooseImageText}
                  type="file"
                  disabled={imageUploadRequested}
                >
                  {fieldprops => {
                    const { accept, input, label, disabled: fieldDisabled } = fieldprops;
                    const { name, type } = input;
                    const onChange = e => {
                      const file = e.target.files[0];
                      form.change(`addImage`, file);
                      form.blur(`addImage`);
                      onOtherImageUploadHandler(file);
                    };
                    const inputProps = { accept, id: name, name, onChange, type };
                    return (
                      <div className={css.addImageWrapper}>
                        <div className={css.aspectRatioWrapper}>
                          {fieldDisabled ? null : (
                            <input {...inputProps} className={css.addImageInput} />
                          )}
                          <label htmlFor={name} className={css.addImage}>
                            {label}
                          </label>
                        </div>
                      </div>
                    );
                  }}
                </Field>

                <Field
                  component={props => {
                    const { input, meta } = props;
                    return (
                      <div className={css.imageRequiredWrapper}>
                        <input {...input} />
                        <ValidationError fieldMeta={meta} />
                      </div>
                    );
                  }}
                  name="images"
                  type="hidden"
                  validate={composeValidators(nonEmptyArray(imageRequiredMessage))}
                />
              </AddImages>
              {uploadImageFailed}
              <p className={css.tip}>
                <FormattedMessage id="EditTeacherPhotosForm.addImagesTipOtherPhotos" />
              </p>

              {publishListingFailed}
              {showListingFailed}

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

EditTeacherPhotosFormComponent.defaultProps = { fetchErrors: null, images: [] };

EditTeacherPhotosFormComponent.propTypes = {
  fetchErrors: shape({
    publishListingError: propTypes.error,
    showListingsError: propTypes.error,
    uploadImageError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  images: array,
  intl: intlShape.isRequired,
  onImageUpload: func.isRequired,
  onUpdateImageOrder: func.isRequired,
  onMainImageUpload: func.isRequired,
  onUpdateMainImageOrder: func.isRequired,
  onOtherImageUpload: func.isRequired,
  onUpdateOtherImageOrder: func.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  onRemoveImage: func.isRequired,
  onRemoveMainImage: func.isRequired,
  onRemoveOtherImage: func.isRequired,
};

export default compose(injectIntl)(EditTeacherPhotosFormComponent);
