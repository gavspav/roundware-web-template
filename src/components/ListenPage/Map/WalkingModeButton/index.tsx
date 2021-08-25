import React, { useState, useEffect } from 'react';
import { useRoundware } from '../../../../hooks';
import { GeoListenMode } from 'roundware-web-framework';
import { useGoogleMap } from '@react-google-maps/api';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import MapIcon from '@material-ui/icons/Map';
import ListenerLocationMarker from './ListenerLocationMarker';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => {
	return {
		walkingModeButton: {
			position: 'fixed',
			zIndex: 100,
			left: 20,
			bottom: 68,
			backgroundColor: '#cccccc',
			'&:hover': {
				backgroundColor: '#aaaaaa',
			},
		},
		hidden: {
			display: 'none',
		},
	};
});

const walkingModeButton = () => {
	const { roundware, forceUpdate, geoListenMode, setGeoListenMode } = useRoundware();
	const [busy, setBusy] = useState(false);
	const map = useGoogleMap();
	const classes = useStyles();
	// const [walkingMode, setwalkingMode] = useState(false);
	const loc = roundware.listenerLocation;
	const lat = loc && loc.latitude;
	const lng = loc && loc.longitude;
	const center = { lat: lat!, lng: lng! };
	const ready = typeof lat === 'number' && typeof lng === 'number';

	const availableListenModes = process.env.AVAILABLE_LISTEN_MODES || 'map, walking';
	const availableListenModesArray = availableListenModes.split(',').map(String);

	const displayListenModeButton = availableListenModesArray.length == 2 ? true : false;

	// set default GeoListenMode
	useEffect(() => {
		if (availableListenModesArray[0] == 'map') {
			console.log('default to map mode');
			setGeoListenMode(GeoListenMode.MANUAL);
		} else {
			console.log('default to walking mode');
			setGeoListenMode(GeoListenMode.AUTOMATIC);
		}
	}, []);

	// when the listenerLocation is updated, center the map
	useEffect(() => {
		if (ready && map !== null) {
			const c = map.getCenter();
			console.log('new location provided by framework');
			if (center.lat !== c.lat() || center.lng !== c.lng()) {
				map.panTo(center);
			}
		}
	}, [lat, lng]);

	const enterMapMode = () => {
		if (!map) return;
		console.log('switching to map mode');
		// zoom out
		map.setZoom(5);
		// enable map panning
		map.setOptions({ gestureHandling: 'cooperative' });
		// stop listening for location updates
		setGeoListenMode(GeoListenMode.MANUAL);
		// update text instructions?
	};

	const enterWalkingMode = () => {
		if (!map) return;
		console.log('switching to walking mode');
		// disable map panning
		map.setOptions({ gestureHandling: 'none' });
		// zoom in
		map.setZoom(19);
		// determine user location and listen for updates
		setGeoListenMode(GeoListenMode.AUTOMATIC);
		// update text instructions?
		// use spinner to indicate location is being determined initially?
	};

	const toggleWalkingMode = () => {
		setBusy(true);
		if (geoListenMode === GeoListenMode.AUTOMATIC && map !== null) {
			enterMapMode();
		} else if ([GeoListenMode.MANUAL, GeoListenMode.DISABLED].includes(geoListenMode) && map !== null) {
			enterWalkingMode();
		}
		if (roundware.mixer) {
			const trackIds = Object.keys(roundware.mixer?.playlist?.trackIdMap || {}).map((id) => parseInt(id));
			trackIds.forEach((audioTrackId) => roundware.mixer.skipTrack(audioTrackId));
		}
		setBusy(false);
	};

	return (
		<div>
			<Button className={clsx(classes.walkingModeButton, displayListenModeButton ? null : classes.hidden)} color='primary' disabled={busy || roundware?.mixer?.playing} onClick={toggleWalkingMode}>
				{geoListenMode === GeoListenMode.AUTOMATIC ? <MapIcon fontSize='large' /> : <DirectionsWalkIcon fontSize='large' />}
			</Button>
			{geoListenMode === GeoListenMode.AUTOMATIC ? <ListenerLocationMarker /> : null}
		</div>
	);
};

export default walkingModeButton;
