import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ActionButton from "./ActionButton";
import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useRoundware } from "../hooks";
import Container from "@material-ui/core/Container";

import landingHeaderImage from '../assets/bg-about.jpg';
import banner from "../assets/rw-icon-cluster.png";

const useStyles = makeStyles((theme) => {
  return {
    topBar: {
      backgroundColor: theme.palette.grey[900],
    },
    bottomBar: {
      top: "auto",
      bottom: 0,
    },
    actionButton: {
      margin: "auto",
    },
    root: {
      margin: theme.spacing(2),
    },
    landingHeader: {
      backgroundImage: `linear-gradient(180deg, #000000ff, #ffffff00), url(${landingHeaderImage})`,
      backgroundSize: "cover",
      height: "100%",
      backgroundPosition: "center",
    },
    landingTitle: {
      fontSize: "6em",
      [theme.breakpoints.down('md')]: {
        fontSize: "4em",
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: "3em",
      },
    },
    landingTagline: {
      textAlign: "center",
      height: "15vh",
      paddingTop: 15,
      [theme.breakpoints.down('xs')]: {
        lineHeight: "1.2em",
      },
    },
    landingBanner: {
      width: "auto",
      height: 100,
      [theme.breakpoints.down("xs")]: {
        width: "70%",
        height: "auto",
      },
    },
  };
});

export const LandingPage = (props) => {
  const { roundware } = useRoundware();
  const classes = useStyles();

  if (!roundware._project || roundware._project.projectName === '(unknown)') {
    return null;
  }
  return (
    <Container
      style={{ "paddingRight": 0, "paddingLeft": 0 }}>
      <Grid
        container
        className={classes.landingHeader}>
        <Grid
          container
          justify="center"
          style={{ height: "100px" }}>
          <Grid
            item
            style={{ margin: 'auto', height: "15vh", "textAlign": "center", "paddingTop": 15 }}
            sm={12}>
            {/*<Typography
              variant={"h2"}
              className={classes.landingTitle}
            >
              {roundware._project && roundware._project.projectName}
            </Typography>*/}
            <img
              src={banner}
              className={classes.landingBanner}
            />
          </Grid>
          <Grid
            item
            sm={12}>
            <Typography
              variant={"subtitle1"}
              className={classes.landingTagline}
              style={{ "textAlign": "center", height: "15vh" }}>
              Contributory Audio Augmented Reality
              <br />
              for Art, Education and Documentary
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          justify="center"
          style={{ height: "200px" }}>
          <Grid item>
            <ActionButton
              label={"Listen"}
              linkTo={"/listen"}
              style={{ width: "100%" }} />
          </Grid>
          <Grid item>
            <ActionButton
              label={"Speak"}
              linkTo={"/speak"} />
          </Grid>
        </Grid>

      </Grid>
    </Container>
  );
};
