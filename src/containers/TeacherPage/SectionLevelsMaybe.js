import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { PropertyGroup } from '../../components';

import css from './TeacherPage.css';

const SectionLevelsMaybe = props => {
  const { options, publicData } = props;
  if (!publicData) {
    return null;
  }

  const selectedOptions = publicData && publicData.levels ? publicData.levels : [];

  return (
    <div className={css.sectionFeatures}>
      <h2 className={css.featuresTitle}>
        <FormattedMessage id="TeacherPage.levelsTitle" />
      </h2>
      <PropertyGroup
        id="TeacherPage.levels"
        options={options}
        selectedOptions={selectedOptions}
        twoColumns={true}
      />
    </div>
  );
};

export default SectionLevelsMaybe;
