import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { PropertyGroup } from '../../components';

import css from './TeacherPage.css';

const SectionSubjectsMaybe = props => {
  const { options, publicData } = props;
  if (!publicData) {
    return null;
  }

  const selectedOptions = publicData && publicData.subjects ? publicData.subjects : [];

  return (
    <div className={css.sectionFeatures}>
      <h2 className={css.featuresTitle}>
        <FormattedMessage id="TeacherPage.subjectsTitle" />
      </h2>
      <PropertyGroup
        id="TeacherPage.subjects"
        options={options}
        selectedOptions={selectedOptions}
        twoColumns={true}
      />
    </div>
  );
};

export default SectionSubjectsMaybe;
