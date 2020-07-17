import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom'

import Home from './components/Home'
import NavBar from './components/NavBar'
import Login from './components/Login'
import Signup from './components/Signup'
import Profile from './components/Profile'
import AddPost from './components/AddPost'
import FollowPage from './components/FollowPage'
import FollowerPage from './components/FollowerPage'
import FollowingPage from './components/FollowingPage'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/profile/:userId" component={Profile} />
        <Route path="/addpost" component={AddPost} />
        <Route path='/followpage' component={FollowPage} />
        <Route path='/follower/:userId' component={FollowerPage} />
        <Route path='/following/:userId' component={FollowingPage} />
      </div>
    </BrowserRouter>
  );
}

export default App;
