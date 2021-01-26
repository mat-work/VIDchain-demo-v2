import React, { Component } from "react";
import Typography from '@material-ui/core/Typography';
import {Grid} from '@material-ui/core';
import "./Footer.css";

class Footer extends Component {
  render() {
    return (
        <Grid container className="footer" spacing={6}>
          <Grid item xs={1} sm={1}></Grid>
          <Grid item xs={3} sm={3} className="logoFooterDiv">
              <img
                className="logoFooter"
                src={require("../../assets/images/logoFooter.svg")}
                alt="City"
              />
            </Grid>
            <Grid item xs={1} sm={4}></Grid>
            <Grid item xs={3} sm={3}>
              <p className="textFooter">This is not an official website of any University.</p>
            </Grid>
        </Grid>
    );
  }
}

export default Footer;
