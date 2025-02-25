import { FC, useState } from "react";
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

interface WorldMapProps {
    //callback function
    onSelectLocation: (lat: number, lon: number, address: string) => void
}

const WorldMap: FC<WorldMapProps> = ({ onSelectLocation }) => {
    const [pinPosition, setPinPosition] = useState<[number, number] | null>(null);

    // Component to handle map click events
    const MapClickHandler = ({ onSelectLocation }:
        { onSelectLocation: (lat: number, lng: number, address: string) => void }) => {
        useMapEvents({
            click: async (event: L.LeafletMouseEvent) => {
                const { lat, lng } = event.latlng;
                setPinPosition([lat, lng]);
                const address = await fetchAddress(lat, lng);
                //return values
                onSelectLocation(lat, lng, address)
                // console.log("Pin set at:", { lat, lng });
            },
        });

        return null; //component doesn't render anything visually
    };

    //Reverse Geocode: get address from latitude and longitude using openstreemaps API
    const fetchAddress = async (lat: number, lng: number): Promise<string> => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            return data.display_name || "";
        } catch (error) {
            console.error("Error fetching address:", error);
            return "Error fetching address";
        }
    };

    return (
        <MapContainer
            center={[20, 0]} //centered on the world map
            zoom={2}
            style={{ height: "100%", width: "100%" }}
        >
            {/* Add OpenStreetMap tiles */}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Handle map clicks */}
            <MapClickHandler onSelectLocation={onSelectLocation} />

            {/* Display a marker if a pinPosition is set */}
            {pinPosition && (
                <Marker position={pinPosition}>
                    <Popup>
                        Latitude: {pinPosition[0].toFixed(4)}, Longitude: {pinPosition[1].toFixed(4)}
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
};

export default WorldMap;
