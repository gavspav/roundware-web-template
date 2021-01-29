import React, { useState, useEffect } from "react";
import { defaultTheme } from "../styles";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { LandingPage } from "./LandingPage";
import { BrowserRouter, Switch, Route, NavLink, useLocation } from "react-router-dom";
import Container from '@material-ui/core/Container';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from '@material-ui/core/Typography';
import { ListenPage } from "./ListenPage";
import SpeakPage from "./SpeakPage";
import { useRoundware } from "../hooks";
import DebugPage from "./DebugPage";
import RoundwareMixerControl from "./roundware-mixer-control";
import InfoPopup from "./info-popup";
import Helmet from "react-helmet";
import ReactGA from "react-ga";

import pealeLogoSmall from '../assets/peale-white.png';

ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID);
ReactGA.pageview(window.location.pathname + window.location.search);

const useStyles = makeStyles((theme) => {
  return {
    topBar: {
      backgroundColor: theme.palette.primary,
    },
    bottomBar: {
      top: "auto",
      bottom: 0,
      flexFlow: "row",
      backgroundColor: theme.palette.grey[900],
    },
    actionButton: {
      margin: "auto",
    },
    appContainer: {
      display: "flex",
      flexGrow: 1,
      overflow: "scroll",
    },
    title: {
      flexGrow: 1,
      color: "white",
      textDecoration: "none",
    },
  };
});

export const App = () => {
  const [theme] = useState(defaultTheme);
  const classes = useStyles();
  const { roundware } = useRoundware();
  let locationTest = useLocation();

  useEffect(() => {
      ReactGA.pageview(window.location.pathname + window.location.search)
      console.log(location.pathname);
    },
    [locationTest]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Helmet>
        <meta charSet="utf-8" />
        <title>{roundware._project ? roundware._project.projectName : ""}</title>
      </Helmet>
      <AppBar
        className={classes.topBar}
        position="fixed">
        <Toolbar className={classes.topBar}>
          <Typography variant="h6" className={classes.title}>
            <NavLink to="/" className={classes.title}>
              {roundware._project ? roundware._project.projectName : ""}
            </NavLink>
          </Typography>
          <img
            src={pealeLogoSmall}
            style={{height: 54}} />
        </Toolbar>
      </AppBar>
      <Toolbar/>
      <div className={classes.appContainer}>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/listen" component={ListenPage} />
          <Route path="/speak" component={SpeakPage} />
          <Route path="/debug" component={DebugPage} />
        </Switch>
      </div>
      <Toolbar className={classes.bottomBar} />
      <AppBar position="fixed" className={classes.bottomBar}>
        <Toolbar
          style={{margin: "0 0 0 100px", width: "100%", "justifyContent": "center"}}>
          <Route path="/listen">
            <RoundwareMixerControl />
          </Route>
          mixer: {roundware._mixer && JSON.stringify(roundware._mixer.mixParams)}
        </Toolbar>
        <Toolbar>
          <InfoPopup />
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};
