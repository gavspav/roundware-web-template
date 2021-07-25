import React, { useEffect } from "react";
import {
  Marker,
  useGoogleMap,
} from "@react-google-maps/api";
import { useRoundwareDraft } from "../hooks";

const LocationSelectMarker = () => {
  const draftRecording = useRoundwareDraft();
  const map = useGoogleMap();

  useEffect(() => {
    if (draftRecording.location.latitude && draftRecording.location.longitude) {
      map.panTo({
        lat: draftRecording.location.latitude,
        lng: draftRecording.location.longitude,
      });
    }
  }, [draftRecording.location.latitude, draftRecording.location.longitude]);

  return (
    <Marker
      draggable={true}
      position={{
        lat: draftRecording.location.latitude,
        lng: draftRecording.location.longitude,
      }}
      onDragEnd={(evt) => {
        draftRecording.setLocation({
          latitude: evt.latLng.lat(),
          longitude: evt.latLng.lng(),
        });
      }}
    />
  );
}

export default LocationSelectMarker;
