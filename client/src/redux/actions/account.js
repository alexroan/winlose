export function loggingIn(){
    return {
        type: 'LOGGING_IN'
    }
}

export function loggedIn(web3){
    return {
        type: 'LOGGED_IN',
        web3
    }
}

export function loginFailed(error){
    return {
        type: 'LOGIN_FAILED',
        error
    }
}

export function accountLoaded(account){
    return {
        type: 'ACCOUNT_LOADED',
        account
    }
}

export function balanceLoaded(balance){
    return {
        type: 'BALANCE_LOADED',
        balance
    }
}

export function setNetwork(network){
    return {
        type: 'NETWORK_LOADED',
        network
    }
}

export function contractLoaded(instance){
    return {
        type: 'CONTRACT_LOADED',
        instance
    }
}

export function higherPriceLoaded(price){
    return {
        type: 'HIGHER_PRICE_LOADED',
        price
    }
}

export function lowerPriceLoaded(price){
    return {
        type: 'LOWER_PRICE_LOADED',
        price
    }
}