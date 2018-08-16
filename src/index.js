import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch,Redirect } from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import lowalarm from './lowalarm/lowalarm';
import alarmsetting from './alarmsetting/alarmsetting';
import devInfo from './devInfo/devInfo';
import management from './management/management';
import process from './process/process';
import contact from './contact/contact';
import journal from './journal/journal';
import newadd from './newadd/newadd';
import highset from './highset/highset';
import login from './login/login';
import newaccount from './newaccount/newaccount';
import school from './school/school';
import addschool from './addschool/addschool';
import offline from './offline/offline';
import home from './home/home';
import homepage from './homepage/homepage';
import mobile from './mobile/mobile';
import NoaMatch from './NoaMatch/NoaMatch';


require('./mock/mock.js')


ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/" exact render={() => (
        <Redirect to={'/login'} />)} />
      <Route path="/login" component={login} />
      <Route path='/app' component={App} />
      <Route path="/lowalarm" component={lowalarm} />
      <Route path="/alarmsetting" component={alarmsetting} />
      <Route path="/devInfo" component={devInfo} />
      <Route path="/management" component={management} />
      <Route path="/process" component={process} />
      <Route path="/contact" component={contact} />
      <Route path="/journal" component={journal} />
      <Route path="/newadd" component={newadd} />
      <Route path="/highset" component={highset} />
      <Route path="/newaccount" component={newaccount} />
      <Route path="/school" component={school} />
      <Route path="/addschool" component={addschool} />
      <Route path="/offline" component={offline} />
      <Route path="/home" component={home} />
      <Route path="/homepage" component={homepage} />
      <Route path="/mobile" component={mobile} />
      <Route component={NoaMatch}/>
    </Switch>
  </Router>,
  document.getElementById('root'));
registerServiceWorker();
