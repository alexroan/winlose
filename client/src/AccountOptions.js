import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Row, Col, Button} from 'react-bootstrap';
import { accountSelector, topupOpenSelector, topupErrorSelector, topupSuccessSelector, topupResponseSelector, balanceSelector, web3Selector, higherPriceSelector, lowerPriceSelector } from './redux/selectors';
import { topupWallet } from './redux/interactions/ramp';
import FadeIn from 'react-fade-in';
import { selectPage } from './redux/actions/display';
import { convertWeiToEth } from './helpers';

class AccountOptions extends Component {
    render() {
        const {dispatch, account, web3, balance, lowerPrice, higherPrice} = this.props;
        const ethLowerPrice = convertWeiToEth(web3, lowerPrice);
        const ethHigherPrice = convertWeiToEth(web3, higherPrice);

        const topup = () => {
            topupWallet(dispatch, account);
        }

        const save = () => {
            dispatch(selectPage("Save"));
        }
        return (
            <FadeIn>
                <Container>
                    <Row>
                        <Col className="text-center">
                            <p>
                                Wallet: {parseFloat(convertWeiToEth(web3, balance)).toFixed(2)} ETH
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-center">
                            <Button onClick={topup}>
                                Topup
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-center">
                            <h2>Higher Price</h2>
                            <Button>
                                {parseFloat(ethHigherPrice).toFixed(2)} ETH
                            </Button>
                        </Col>
                        <Col className="text-center">
                            <h2>Lower Price</h2>
                            <Button>
                                {parseFloat(ethLowerPrice).toFixed(2)} ETH
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </FadeIn>
        );
    }
}


function mapStateToProps(state){
	return {
        account: accountSelector(state),
        web3: web3Selector(state),
        balance: balanceSelector(state),
        topupOpen: topupOpenSelector(state),
        topupError: topupErrorSelector(state),
        topupSuccess: topupSuccessSelector(state),
        topupResponse: topupResponseSelector(state),
        higherPrice: higherPriceSelector(state),
        lowerPrice: lowerPriceSelector(state),
	}
}

export default connect(mapStateToProps)(AccountOptions);