import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Row, Col, Button, InputGroup, FormControl} from 'react-bootstrap';
import FadeIn from 'react-fade-in';
import { BackButton } from './BackButton';
import { web3Selector, accountSelector, networkSelector, withdrawingSelector, withdrawConfirmationNumberSelector, redeemValueSelector, pageParameterSelector } from './redux/selectors';
import { convertWeiToEth, convertEthToWei } from './helpers';
import { FadeInSpinner } from './FadeInSpinner';
import { setRedeemValue } from './redux/actions/withdraw';

class Withdraw extends Component{
    render() {

        const {dispatch, web3, withdrawing, confirmationNumber, redeemValue, 
            account, network, pageParameter} = this.props;
        const weiRedeemValue = convertEthToWei(web3, redeemValue);
        // const ethUnderlyingBalance = convertWeiToEth(web3, underlyingBalance);

        const changeRedeemValue = (e) => dispatch(setRedeemValue(e.target.value));

        const withdraw = () => {

        }

        const pageContent = () => {
            return (
                <FadeIn>
                    <Container>
                        <Row>
                            <Col className="text-center">
                                <BackButton dispatch={dispatch} pageName="Save" />
                                {/* <p>Savings Balance: {parseFloat(ethUnderlyingBalance).toFixed(5)} ETH</p> */}
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1">ETH</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    {/* <FormControl onChange={changeRedeemValue} type="number" min="0" max={ethUnderlyingBalance} step="0.00001" aria-describedby="basic-addon1" /> */}
                                </InputGroup>
                                <Button onClick={withdraw}>
                                    Withdraw Savings
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </FadeIn>
            );
        }

        return (withdrawing ? <FadeInSpinner message={`Withdrawing ${redeemValue} ETH`} confirmationNumber={confirmationNumber} /> : pageContent());

    }
}

function mapStateToProps(state){
    const pageParameter = pageParameterSelector(state);

	return {
        web3: web3Selector(state),
        withdrawing: withdrawingSelector(state),
        confirmationNumber: withdrawConfirmationNumberSelector(state),
        redeemValue: redeemValueSelector(state),
        account: accountSelector(state),
        network: networkSelector(state),
        pageParameter: pageParameter
	}
}

export default connect(mapStateToProps)(Withdraw);