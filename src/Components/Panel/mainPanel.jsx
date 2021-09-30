import React, { useContext } from 'react';
import {  Redirect , useHistory} from 'react-router-dom';
import { globalDataContext } from '../../globalContext';

import Arrow from '../../Images/img/Arrow.png';

const NavigatePanel = () => {
    const history = useHistory();

    return (
        <div className="navigate-buttons">
            <img src={Arrow} alt="LeftArrow" title="Go Back" onClick={() => history.goBack()}/>
            <img src={Arrow} alt="RightArrow" title="Go Forward" onClick={() => history.goForward()}/>
        </div>
    )
}

const MainPanel = ({
    componentInside = null
}) => {
    const [ dataContext, ] = useContext(globalDataContext);

    if (dataContext.loginData.isLogged) {
        return (
            <div className="main-panel" >
                {componentInside}
            </div>)
    } else return (<Redirect to="/" />)
}

export { MainPanel, NavigatePanel };