import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const isLogin = () => {
    var loginCheck = localStorage.getItem('isLogin')
    if (loginCheck != null){
        return true
    } else {
        return false
    }
}

const PrivateRoute = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={props => (
            isLogin() ?
                <Component {...props} />
            : <Redirect to="/" />
        )} />
    );
};

export default PrivateRoute;