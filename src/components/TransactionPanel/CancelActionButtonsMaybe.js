import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { SecondaryButton } from '../../components';
import { bool, func } from 'prop-types';

import css from './TransactionPanel.css';

// Functional component as a helper to build ActionButtons for
// provider when state is preauthorized
const CancelActionButtonsMaybe = props => {
  const {
    className,
    rootClassName,
    showButtons,
    cancelInProgress,
    cancelSaleError,
    onCancelSale,
  } = props;

  const buttonsDisabled = cancelInProgress;

  const cancelErrorMessage = cancelSaleError ? (
    <p className={css.actionError}>
      <FormattedMessage id="TransactionPanel.cancelSaleFailed" />
    </p>
  ) : null;

  const classes = classNames(rootClassName || css.actionButtons, className);

  return showButtons ? (
    <div className={classes}>
      <div className={css.actionErrors}>
        {cancelErrorMessage}
      </div>
      <div className={css.actionButtonWrapper}>
        <SecondaryButton
          inProgress={cancelInProgress}
          disabled={buttonsDisabled}
          onClick={onCancelSale}
        >
          <FormattedMessage id="TransactionPanel.cancelButton" />
        </SecondaryButton>
      </div>
    </div>
  ) : null;
};

CancelActionButtonsMaybe.defaultProps = {
  showButtons: true,
  cancelInProgress: null,
  cancelSaleError: null,
  onCancelSale: null,
};

CancelActionButtonsMaybe.propTypes = {
  showButtons: bool.isRequired,
  cancelInProgress: bool,
  cancelSaleError: bool,
  onCancelSale: func,
};


export default CancelActionButtonsMaybe;
