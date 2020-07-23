import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom'

import Home from './components/Home'
import NavBar from './components/NavBar'
import Login from './components/Login-Signup/Login'
import Signup from './components/Login-Signup/Signup'
import Profile from './components/Profile/Profile'
import AddPost from './components/Post/AddPost'
import FollowPage from './components/Follow Page/FollowPage'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/profile/:userId" component={Profile} />
        <Route path='/followpage' component={FollowPage} />
      </div>
    </BrowserRouter>
  );
}

export default App;
