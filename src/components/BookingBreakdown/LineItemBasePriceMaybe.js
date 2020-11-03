import React from 'react';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import { formatMoney } from '../../util/currency';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY, propTypes } from '../../util/types';
import { LISTING_CATEGORY_TEACHER } from '../../util/listingCategoryName';

import css from './BookingBreakdown.css';
import { bool, string } from 'prop-types';

const LineItemBasePriceMaybe = props => {
  const { transaction, unitType, intl, isTeacherType, listingCategory } = props;
  const isNightly = unitType === LINE_ITEM_NIGHT;
  const isDaily = unitType === LINE_ITEM_DAY;
  const translationKey = isTeacherType || listingCategory === LISTING_CATEGORY_TEACHER
    ? 'BookingBreakdown.baseUnitHour'
    : isNightly
      ? 'BookingBreakdown.baseUnitNight'
      : isDaily
        ? 'BookingBreakdown.baseUnitDay'
        : 'BookingBreakdown.baseUnitQuantity';

  // Find correct line-item for given unitType prop.
  // It should be one of the following: 'line-item/night, 'line-item/day', 'line-item/units', or 'line-item/time'
  // These are defined in '../../util/types';
  const unitPurchase = transaction.attributes.lineItems.find(
    item => item.code === unitType && !item.reversal
  );

  const units = unitPurchase ? unitPurchase.units.toString() : null;
  const seats = unitPurchase ? unitPurchase.seats.toString() : null;
  const unitPrice = unitPurchase ? formatMoney(intl, unitPurchase.unitPrice) : null;
  const total = unitPurchase ? formatMoney(intl, unitPurchase.lineTotal) : null;

  return units && seats && total ? (
    <div className={css.lineItem}>
      <span className={css.itemLabel}>
        <FormattedMessage id={translationKey} values={{ unitPrice, units, seats }} />
      </span>
      <span className={css.itemValue}>{total}</span>
    </div>
  ) : null;
};

LineItemBasePriceMaybe.propTypes = {
  transaction: propTypes.transaction.isRequired,
  unitType: propTypes.bookingUnitType.isRequired,
  intl: intlShape.isRequired,
  isTeacherType: bool.isRequired,
  listingCategory: string.isRequired,
};

export default LineItemBasePriceMaybe;
