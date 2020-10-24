import {loggedIn, accountLoaded, balanceLoaded, loggingIn, loginFailed, setNetwork, contractLoaded} from "../actions/account";
import { subscribeToAccountsChanging } from "../subscriptions";
import { getWeb3 } from "../../getWeb3";
import HighOrLow from "../../contracts/HighOrLow.json";

export const loadWeb3 = async (dispatch) => {
    dispatch(loggingIn());
    let web3 = null;
    try{
        web3 = await getWeb3();
        loadAccount(dispatch, web3).then((account) => {
            loadNetwork(dispatch, web3, account).then((network) => {
                loadBalance(dispatch, web3, account, network);
                dispatch(loggedIn(web3));
            }).catch((error) => {
                dispatch(loginFailed(error));
            });
        });
    }
    catch(error) {
        dispatch(loginFailed(error));
    }
    return web3;
}

export const loadAccount = async (dispatch, web3) => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    dispatch(accountLoaded(account));
    subscribeToAccountsChanging(dispatch, web3);
    return account;
}

export const loadNetwork = async (dispatch, web3, account) => {
    const network = await web3.eth.net.getId();
    dispatch(setNetwork(network));
    const contractInstance = await loadContract(dispatch, web3, network);
    if (!contractInstance) throw new Error("Network not supported");
    return network;
}

export const loadContract = async (dispatch, web3, networkId) => {
    const deployedNetwork = HighOrLow.networks[networkId];
    if (!deployedNetwork) return null;
    const instance = new web3.eth.Contract(
        HighOrLow.abi,
        deployedNetwork && deployedNetwork.address,
    );
    dispatch(contractLoaded(instance));
    return instance;
}
  
export const loadBalance = async (dispatch, web3, account, network) => {
    const balance = await web3.eth.getBalance(account);
    dispatch(balanceLoaded(balance));
    return balance;
}