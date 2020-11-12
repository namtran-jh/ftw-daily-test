import React, { useState } from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { displayOtherImage } from '../../util/displayImage';
import { ResponsiveImage, Modal, ImageCarousel } from '../../components';

import css from './TeacherPage.css';
import { LISTING_CATEGORY_TEACHER } from '../../util/listingCategoryName';

const SectionOtherImage = props => {
  const [otherPhotoIndex, setOtherPhotoIndex] = useState(null);

  const {
    listing,
    handleViewOtherPhotosClick,
    otherImageCarouselOpen,
    onOtherImageCarouselClose,
    onManageDisableScrolling,
  } = props;
  const { publicData } = listing.attributes;

  const otherImages = publicData.isTeacherType || publicData.listingCategory === LISTING_CATEGORY_TEACHER
    ? displayOtherImage(publicData.mainImage, listing.images)
    : listing.images;

  const handleViewOtherPhotos = (index) => {
    handleViewOtherPhotosClick();
    setOtherPhotoIndex(index);
  }

  return otherImages ? (
    <div className={css.sectionOtherImage}>
      <h2 className={css.otherImageTitle}>
        <FormattedMessage id="TeacherPage.otherImageTitle" />
      </h2>
      <div className={css.rootOtherImage}>
        <div className={css.columnImage}>
          {otherImages.map((image, index) =>
            index % 3 === 0 &&
            <ResponsiveImage
              key={image.id.uuid}
              rootClassName={css.imageWrapper}
              alt="Other images"
              image={image}
              variants={[
                'landscape-crop',
                'landscape-crop2x',
                'landscape-crop4x',
                'landscape-crop6x',
              ]}
              onClick={() => handleViewOtherPhotos(index)}
            />
          )}
        </div>
        <div className={css.columnImage}>
          {otherImages.map((image, index) =>
            index % 3 === 1 &&
            <ResponsiveImage
              key={image.id.uuid}
              rootClassName={css.imageWrapper}
              alt="Other images"
              image={image}
              variants={[
                'landscape-crop',
                'landscape-crop2x',
                'landscape-crop4x',
                'landscape-crop6x',
              ]}
              onClick={() => handleViewOtherPhotos(index)}
            />
          )}
        </div>
        <div className={css.columnImage}>
          {otherImages.map((image, index) =>
            index % 3 === 2 &&
            <ResponsiveImage
              key={image.id.uuid}
              rootClassName={css.imageWrapper}
              alt="Other images"
              image={image}
              variants={[
                'landscape-crop',
                'landscape-crop2x',
                'landscape-crop4x',
                'landscape-crop6x',
              ]}
              onClick={() => handleViewOtherPhotos(index)}
            />
          )}
        </div>
      </div>
      <Modal
        id="TeacherPage.imageCarousel"
        scrollLayerClassName={css.carouselModalScrollLayer}
        containerClassName={css.carouselModalContainer}
        isOpen={otherImageCarouselOpen}
        onClose={onOtherImageCarouselClose}
        onManageDisableScrolling={onManageDisableScrolling}
      >
        <ImageCarousel images={otherImages} otherPhotoIndex={otherPhotoIndex} />
      </Modal>
    </div>
  ) : null;
};

export default SectionOtherImage;
