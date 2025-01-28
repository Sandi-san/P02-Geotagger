import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Default marker icon fix for Leaflet (as it won't display properly in some setups)
// Fix for Leaflet's default marker icons (correct paths for the images)
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const WorldMap = () => {
    const [pinPosition, setPinPosition] = useState<[number, number] | null>(null);

    // Component to handle map click events
    const MapClickHandler = ({ setPinPosition }: { setPinPosition: (pos: [number, number]) => void }) => {
        useMapEvents({
            click: (event: L.LeafletMouseEvent) => {
                const { lat, lng } = event.latlng;
                setPinPosition([lat, lng]);
                console.log("Pin set at:", { lat, lng });
            },
        });

        return null; // This component doesn't render anything visually
    };

    return (
        // <div style={{ height: "100vh", width: "100%" }}>
            <MapContainer
                center={[20, 0]} // Centered on the world map
                zoom={2}
                style={{ height: "100%", width: "100%" }}
            >
                {/* Add OpenStreetMap tiles */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Handle map clicks */}
                <MapClickHandler setPinPosition={setPinPosition} />

                {/* Display a marker if a pinPosition is set */}
                {pinPosition && (
                    <Marker position={pinPosition}>
                        <Popup>
                            Latitude: {pinPosition[0].toFixed(4)}, Longitude: {pinPosition[1].toFixed(4)}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        // </div>
    );
};

export default WorldMap;
