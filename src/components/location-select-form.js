import React, { useEffect, useState } from "react";
import { useRoundwareDraft } from "../hooks";
import LocationSelectMarker from "./location-select-marker";
import { RoundwareMapStyle } from "../map-style";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography, useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import ErrorDialog from "./error-dialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useHistory } from "react-router-dom";

const getPosition = function (options) {
  return new Promise(function (resolve, reject) {
    return navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

const useStyles = makeStyles((theme) => {
  return {
    container: {
      flexGrow: 1,
      margin: "auto"
    },
    button: {
      margin: "auto"
    },
    cardActionButton: {
      margin: {
        right: theme.spacing(2),
      },
      [theme.breakpoints.down('xs')]: {
        paddingRight: theme.spacing(1),
        paddingLeft: theme.spacing(1),
      },
    },
    locationHeaderLabel: {
      fontSize: "2rem",
      [theme.breakpoints.down('sm')]: {
        fontSize: "1.2rem",
      },
    },
  }
})


const LocationSelectForm = () => {
  const draftRecording = useRoundwareDraft();
  const theme = useTheme();
  const mapContainerStyle = {
    height: "60vh",
    margin: theme.spacing(2, 0),
  }
  const classes = useStyles();
  const history = useHistory();
  const [error, set_error] = useState( null );
  const [errorMessage, setErrorMessage] = useState( null );
  const [geolocating, set_geolocating] = useState( null );

  useEffect(() => {
    if (draftRecording.tags.length === 0) {
      history.replace('/speak/tags/0')
    }
  }, [draftRecording.tags])

  if (!draftRecording.location.latitude || !draftRecording.location.longitude) {
    return null;
  }

  const getGeolocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
    } else {
      set_geolocating(true);
      const options = {
        timeout: 5000,
      };
      getPosition(options)
        .then((position) => {
          draftRecording.setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        })
        .catch(err => {
          console.log(err);
          if (err.message == "Timeout expired") {
            setErrorMessage("Your location is unavailable. Please move the pin to manually select a location for your contribution. Thanks!");
          }
          set_error(err);
        }).finally( () => {
        set_geolocating(false);
      });
    }
  };

  return (
    <Card style={{margin: "auto"}} className={classes.container}>
      <ErrorDialog
        error={error}
        set_error={set_error}
        errorMessage={errorMessage}
      />
      <CardContent>
        <Typography
          variant={"h4"}
          className={classes.locationHeaderLabel}
        >
          Where would you like to place your recording?
        </Typography>
        <LoadScript
          id="script-loader"
          googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            onLoad={(map) => {
              const styledMapType = new google.maps.StyledMapType(
                RoundwareMapStyle,
                { name: "Street Map" }
              );
              map.mapTypes.set("styled_map", styledMapType);
              map.setOptions({
                center: {
                  lat: draftRecording.location.latitude,
                  lng: draftRecording.location.longitude,
                },
                zoom: 5,
                zoomControl: true,
                draggable: true,
                mapTypeControl: false,
                streetViewControl: false,
                draggableCursor: "cursor",
                fullscreenControl: false,
                zoomControlOptions: {
                  style: google.maps.ZoomControlStyle.SMALL,
                },
                rotateControl: false,
                mapTypeId: "styled_map",
                mapTypeControlOptions: {
                  mapTypeIds: [google.maps.MapTypeId.SATELLITE, "styled_map"],
                  style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                  position: google.maps.ControlPosition.BOTTOM_LEFT,
                },
              });
            }}
          >
            <LocationSelectMarker />
          </GoogleMap>
        </LoadScript>
      </CardContent>
      <CardActions variant={"contained"} style={{}}>
        <Button
          className={classes.cardActionButton}
          aria-label="back"
          onClick={history.goBack}
          variant={"contained"}
        >
          Back
        </Button>
        <Button
          className={classes.cardActionButton}
          variant={"contained"}
          aria-label="use my location"
          onClick={getGeolocation}
        >
          {geolocating ? <CircularProgress /> : "Use My Location" }
        </Button>
        <Button
          className={classes.cardActionButton}
          color="primary"
          variant={"contained"}
          onClick={() => {
            history.push('/speak/recording')
          }}
        >
          Next
        </Button>
      </CardActions>
    </Card>
  );
};

export default LocationSelectForm;
