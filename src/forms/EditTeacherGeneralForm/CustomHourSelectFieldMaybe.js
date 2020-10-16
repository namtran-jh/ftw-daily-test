import React from 'react';
import { required } from '../../util/validators';
import { FieldSelect } from '../../components';

import css from './EditTeacherGeneralForm.css';

const CustomHourSelectFieldMaybe = props => {
  const { name, id, options, intl, isNumberOfHours, formValues } = props;
  const hourLabel = intl.formatMessage({
    id: isNumberOfHours ? 'EditTeacherGeneralForm.numberOfHourLabel' : 'EditTeacherGeneralForm.hourLabel',
  });
  const hourPlaceholder = intl.formatMessage({
    id: isNumberOfHours ? 'EditTeacherGeneralForm.numberOfHourPlaceholder' : 'EditTeacherGeneralForm.hourPlaceholder',
  });
  const hourRequired = required(
    intl.formatMessage({
      id: isNumberOfHours ? 'EditTeacherGeneralForm.numberOfHourRequired' : 'EditTeacherGeneralForm.hourRequired',
    })
  );

  if (!isNumberOfHours)
    return options ? (
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
        {options.map(opt => (
          <option key={opt.key} value={opt.key}>
            {opt.label}
          </option>
        ))}
      </FieldSelect>
    ) : null;
  else return options ? (
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
      {formValues.hours === "h_fulltime"
        ? (
          <option key="noh_8" value="noh_8">
            8 hours
          </option>
        )
        : options.map(opt => (
          <option key={opt.key} value={opt.key}>
            {opt.label}
          </option>
        ))}
    </FieldSelect>
  ) : null;
};

export default CustomHourSelectFieldMaybe;
