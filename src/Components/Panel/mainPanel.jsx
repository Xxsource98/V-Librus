import React, { useContext, useReducer } from 'react';
import {  Redirect , useHistory} from 'react-router-dom';
import { globalDataContext } from '../../globalContext';

import Arrow from '../../Images/img/Arrow.png';

const NavigatePanel = () => {
    const navigationReducer = (state, action) => {
        switch (action.type) {
            case 'back':    history.goBack();    break;
            case 'forward': history.goForward(); break;
            default: throw new Error();
        }
    }

    const [ , dispatch ] = useReducer(navigationReducer);
    const history = useHistory();

    return (
        <div className="navigate-buttons">
            <img src={Arrow} alt="LeftArrow" title="Go Back" onClick={() => dispatch({type: "back"})} />
            <img src={Arrow} alt="RightArrow" title="Go Forward" onClick={() => dispatch({type: "forward"})} />
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