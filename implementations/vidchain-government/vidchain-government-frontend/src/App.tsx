import React from "react";
import "./App.css";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Home from "./screens/Home/Home";
import Profile from "./screens/Profile/Profile";
import Callback from "./screens/Callback/Callback";
const dotenv = require("dotenv");
// importing .env variables

const publicUrl =
  process.env.REACT_APP_DEMO || "http://localhost:3022/demo/government";
console.log("publicUrl:" + publicUrl);
const basename = publicUrl ? new URL(publicUrl).pathname : "";

function App() {
  dotenv.config();
  return (
    <div className="App">
      <BrowserRouter basename={basename}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/profile" component={Profile} />
          <Route path="/callback" component={Callback} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
