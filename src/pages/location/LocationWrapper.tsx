import { useParams } from "react-router-dom";
import Location from "./Location";

//class to wrap Guess with id in url and pass as prop
const LocationWrapper = () => {
    const { id } = useParams<{ id: string }>();
    return <Location locationId={Number(id)} />
};
export default LocationWrapper