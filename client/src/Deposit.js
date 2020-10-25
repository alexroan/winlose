import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Row, Col, Button, InputGroup, FormControl} from 'react-bootstrap';
import FadeIn from 'react-fade-in';
import { web3Selector, accountSelector, balanceSelector, networkSelector, pageParameterSelector, supplyValueSelector, depositingSelector, depositConfirmationNumberSelector} from './redux/selectors';
import { convertWeiToEth, convertEthToWei } from './helpers';
import { BackButton } from './BackButton';
import { FadeInSpinner } from './FadeInSpinner';
import { setSupplyValue } from './redux/actions/deposit';

class Deposit extends Component {
    render() {
        const {dispatch, account, balance, web3, supplyValue, network,
            depositing, confirmationNumber, pageParameter} = this.props;
        const weiSupplyValue = convertEthToWei(web3, supplyValue);
        const ethBalance = convertWeiToEth(web3, balance);

        const changeSaveValue = (e) => dispatch(setSupplyValue(e.target.value));

        const save = () => {

        }

        const pageContent = () => {
            return (
                <FadeIn>
                    <Container>
                        <Row>
                            <Col className="text-center">
                                <BackButton dispatch={dispatch} pageName="Save" />
                                <p>Balance Available: {parseFloat(ethBalance).toFixed(5)} ETH</p>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1">ETH</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl onChange={changeSaveValue} type="number" min="0" max={ethBalance} step="0.001" aria-describedby="basic-addon1" />
                                </InputGroup>
                                <Button onClick={save}>
                                    Earn % APY
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </FadeIn>
            )
        }

        return (depositing ? <FadeInSpinner message={`Depositing ${supplyValue} ETH`} confirmationNumber={confirmationNumber} /> : pageContent());

    }
}

function mapStateToProps(state){
    const pageParameter = pageParameterSelector(state);

	return {
        pageParameter: pageParameterSelector(state),
        web3: web3Selector(state),
        account: accountSelector(state),
        balance: balanceSelector(state),
        network: networkSelector(state),
        supplyValue: supplyValueSelector(state),
        depositing: depositingSelector(state),
        confirmationNumber: depositConfirmationNumberSelector(state)
	}
}

export default connect(mapStateToProps)(Deposit);