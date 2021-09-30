import React, { useState } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import Titlebar from './Components/TitleBar/titleBar';
import LoginForm from './Components/Login/loginForm';
import { globalDataContext } from './globalContext';
import Panel from './Components/Panel/panel';
import AllCalendarWidgets from './Components/Panel/AllCalendarWidgets/allCalendarWidgets';
import Schedule from './Components/Panel/Schedule/schedule';
import Grades from './Components/Panel/Grades/grades';
import Messages from './Components/Panel/Messages/messages';
import Notifications from './Components/Panel/Notifications/notifications';

const App = () => {
  const [ dataContext, setDataContext ] = useState({
    librusData: {},
    loginData: {
      rememberMe: false,
      isLogged: false,
      username: ""
    }
  });

  return (
    <Router>
      <Switch>
        <globalDataContext.Provider value={[dataContext, setDataContext]}>
          <Titlebar />
          <Route exact path="/" component={LoginForm} />
          <Route exact path="/panel" component={Panel} />

          <Route exact path="/panel/allCalendarWidgets" component={AllCalendarWidgets} />
          <Route exact path="/panel/schedule" component={Schedule} />
          <Route exact path="/panel/grades" component={Grades} />
          <Route exact path="/panel/messages" component={Messages} />
          <Route exact path="/panel/notifications" component={Notifications} />
        </globalDataContext.Provider>
      </Switch>
    </Router>
  )
}

export default App;
