import React from 'react';
import './App.css';
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Home from "./screens/Home/Home";
import Profile from "./screens/Profile/Profile";
import Registration from "./screens/Registration/Registration";
const dotenv = require('dotenv')
// importing .env variables

function App() {
  dotenv.config();
  return (
    <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              path="/registration"
              component={Registration}
            />
            <Route
              path="/profile"
              component={Profile}
            />
          </Switch>
        </BrowserRouter>
  </div>
  );
}

export default App;
