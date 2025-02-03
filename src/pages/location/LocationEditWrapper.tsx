import { useParams } from "react-router-dom";
import LocationEdit from "./LocationEdit";

//class to wrap LocationEdit with id in url and pass as prop
const LocationEditWrapper = () => {
    const { id } = useParams<{ id: string }>();
    return <LocationEdit id={Number(id)} />
};
export default LocationEditWrapper