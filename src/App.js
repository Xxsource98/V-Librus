import React, { useState } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { GlobalDataContext, ShortcutsPanelContext, MessagesContext } from './globalContext';
import PanelShortcuts from './Components/Panel/panelShortcuts';

import HandleRefresh from './Components/handleRefresh';
import Titlebar from './Components/TitleBar/titleBar';
import LoginForm from './Components/Login/loginForm';
import Panel from './Components/Panel/panel';
import AllCalendarWidgets from './Components/Panel/AllCalendarWidgets/allCalendarWidgets';
import Schedule from './Components/Panel/Schedule/schedule';
import Grades from './Components/Panel/Grades/grades';
import Messages from './Components/Panel/Messages/messages';
import Notifications from './Components/Panel/Notifications/notifications';
import Absences from './Components/Panel/Absences/absences';

const App = () => {
  const [ dataContext, setDataContext ] = useState({
    librusData: {},
    loginData: {
      rememberMe: false,
      isLogged: false,
      username: ""
    }
  });
  const [ currentPanel, setCurrentPanel ] = useState('Home');
  const [ messagesContext, setMessagesContext ] = useState([]);

  return (
    <Router>
      <AnimatePresence exitBeforeEnter>
        <Switch>
          <GlobalDataContext.Provider value={[dataContext, setDataContext]}>
            <ShortcutsPanelContext.Provider value={[currentPanel, setCurrentPanel]}>
              <MessagesContext.Provider value={[messagesContext, setMessagesContext]}>
                <HandleRefresh />
                <Titlebar />
                <Route exact path="/" component={LoginForm} />
                <Route exact path="/panel" component={Panel} />

                <Route exact path="/panel/allCalendarWidgets/:type" component={AllCalendarWidgets} />
                <Route exact path="/panel/schedule" component={Schedule} />
                <Route exact path="/panel/grades" component={Grades} />
                <Route exact path="/panel/messages" component={Messages} />
                <Route exact path="/panel/notifications" component={Notifications} />
                <Route exact path="/panel/absences" component={Absences} /> 
                <PanelShortcuts />
              </MessagesContext.Provider>
            </ShortcutsPanelContext.Provider>
          </GlobalDataContext.Provider>
        </Switch>
      </AnimatePresence>
    </Router>
  )
}

export default App;
