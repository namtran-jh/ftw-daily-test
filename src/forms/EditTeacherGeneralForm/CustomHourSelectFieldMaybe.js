import React from 'react';
import { required } from '../../util/validators';
import { FieldSelect } from '../../components';

import css from './EditTeacherGeneralForm.css';

const CustomHourSelectFieldMaybe = props => {
  const { name, id, hours, intl } = props;
  const hourLabel = intl.formatMessage({
    id: 'EditTeacherGeneralForm.hourLabel',
  });
  const hourPlaceholder = intl.formatMessage({
    id: 'EditTeacherGeneralForm.hourPlaceholder',
  });
  const hourRequired = required(
    intl.formatMessage({
      id: 'EditTeacherGeneralForm.hourRequired',
    })
  );
  return hours ? (
    <FieldSelect
      className={css.hour}
      name={name}
      id={id}
      label={hourLabel}
      validate={hourRequired}
    >
      <option disabled value="">
        {hourPlaceholder}
      </option>
      {hours.map(c => (
        <option key={c.key} value={c.key}>
          {c.label}
        </option>
      ))}
    </FieldSelect>
  ) : null;
};

export default CustomHourSelectFieldMaybe;
