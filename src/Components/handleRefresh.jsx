import React, { useCallback, useEffect, useContext } from 'react';
import { useHistory } from "react-router";

import { GlobalDataContext } from '../globalContext';

const HandleRefresh = () => {
    const history = useHistory();
    const [ dataContext, ] = useContext(GlobalDataContext);

    const RefreshCallback = useCallback(() => {
        if (dataContext.loginData.isLogged) {
            const timer = setTimeout(() => {
                dataContext.loginData.isLogged = false;
                history.go('/');
            }, 1800000); // Refresh in 30 minutes for "refresh" data
            return () => clearTimeout(timer);
        }
    }, [history, dataContext]);

    useEffect(() => {
        RefreshCallback();
    }, [RefreshCallback]);

    return (<></>);
}

export default HandleRefresh;