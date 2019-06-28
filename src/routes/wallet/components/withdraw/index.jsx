/**
 * Displays a form to withdraw tokens from the current Snowflake balance
 * TODO: Wallet - Fix Max button
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Button,
  Input,
  FormGroup,
  FormText,
} from 'reactstrap';
import {
  IoIosArrowRoundForward,
} from 'react-icons/io';
import {
  useWeb3Context,
} from 'web3-react';

import {
  withdrawSnowflakeBalance,
} from '../../../../services/utilities';

import TransactionButton from '../../../../components/transactionButton';

function Withdraw(props) {
  const {
    user,
    hydroBalance,
    snowflakeBalance,
    cancel,
  } = props;

  const [amount, setAmount] = useState(0);

  const web3 = useWeb3Context();

  return (
    <div>
      <Row className="mx-4 justify-content-center align-items-center no-gutters">
        <Col sm="5">
          <p className="withdraw__subtitle">
            From
          </p>
        </Col>
        <Col sm="2" />
        <Col sm="5">
          <p className="withdraw__subtitle">
            To
          </p>
        </Col>
      </Row>
      <Row className="mx-4 justify-content-center align-items-center no-gutters">
        <Col sm="5" className="withdraw__from">
          <Row className="justify-content-center align-items-center">
            <Col xs="8">
              <div>
                <FormGroup className="withdraw__form-group">
                  <Input
                    type="number"
                    className="withdraw__input"
                    placeholder="0"
                    onChange={e => setAmount(e.target.value)}
                    value={amount}
                  />
                  <FormText
                    className="withdraw__form-text"
                  >
                    dApp Store Wallet
                  </FormText>
                </FormGroup>
              </div>
            </Col>
            <Col className="text-center" xs="4">
              <Button
                size="sm"
                onClick={() => setAmount(snowflakeBalance)}
                className="withdraw__max-button"
              >
                Max
              </Button>
            </Col>
          </Row>
        </Col>

        <Col sm="2" className="text-center">
          <IoIosArrowRoundForward className="withdraw__arrow" />
        </Col>

        <Col sm="5">
          <div className="withdraw__to">
            <p className="withdraw__balance">
              {hydroBalance.substring(0, 5)}
            </p>
            <p className="withdraw__to-small-text">
              {`${user.substring(0, 12)}...`}
            </p>
          </div>
        </Col>
      </Row>
      <Row className="pt-5 mx-4 justify-content-center align-items-center no-gutters">
        <Col className="text-left">
          <Button onClick={cancel}>
            Cancel
          </Button>
        </Col>
        <Col className="text-right">
          <TransactionButton
            color="success"
            initialText="Confirm"
            sendAction={() => withdrawSnowflakeBalance(
              web3.library,
              web3.account,
              amount.toString(),
            )}
            afterConfirmationAction={cancel}
          />
        </Col>
      </Row>
    </div>
  );
}

Withdraw.propTypes = {
  hydroBalance: PropTypes.string.isRequired,
  snowflakeBalance: PropTypes.string.isRequired,
  cancel: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired,
};

export default Withdraw;
