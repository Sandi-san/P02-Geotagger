import { Avatar, Box, Typography } from "@mui/material"
import { FC, useEffect, useState } from "react";
import theme from "../../theme";
import getValidImagePath from "../../utils/validImagePath";
import useMediaQuery from "../../hooks/useMediaQuery";

interface GuessItemProps {
    itemNumber: number,
    userFirstName?: string,
    userLastName?: string,
    userAvatarImage?: string,
    creationDate: Date,
    errorDistance: number,
    isUser: boolean, //for identification
}

const GuessItem: FC<GuessItemProps> = ({
    itemNumber,
    userFirstName,
    userLastName,
    userAvatarImage,
    creationDate,
    errorDistance,
    isUser,
}) => {
    const [validImage, setValidImage] = useState(false);
    const userImage = getValidImagePath(userAvatarImage)

    useEffect(() => {
        // console.log("Valid: ", userImage)
        if (userImage !== undefined)
            setValidImage(true)
        else
            setValidImage(false)
    }, []);

    //get dynamic background color of rank image
    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1: return 'linear-gradient(to right, #FE7F2D, #FCCA46)'; // Gold
            case 2: return 'linear-gradient(to right, #B3AEAE, #D6D6D6)'; // Silver
            case 3: return 'linear-gradient(to right, #924107, #E8913A)'; // Bronze
            default: return '#233D4D'; // Default color for ranks 4 and beyond
        }
    };

    //convert date of guess to display
    const formatDate = (creationDate: Date) => {
        const convertedDate = new Date(creationDate)
        const now = new Date()
        const diffMs = now.getTime() - convertedDate.getTime() // Difference in milliseconds
        const diffMinutes = Math.floor(diffMs / (1000 * 60)) // Convert to minutes
        const diffHours = Math.floor(diffMinutes / 60) // Convert to hours

        //return text
        if (diffMinutes < 60) {
            return `${diffMinutes} min ago`;
        } else if (diffHours < 24) {
            return `${diffHours} h ago`;
        } else {
            //show creation date if older than 24 hours
            return convertedDate.toLocaleDateString();
        }
    }

    const formatDistance = (errorDistance: number) => {
        if(errorDistance<1000)
            return `${errorDistance} m`
        const errorKm = errorDistance/1000
        return `${errorKm.toFixed()} km`
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 1,
            borderRadius: 2,
            marginY: '2px',
            backgroundColor: isUser ? (`${theme.palette.primary.main}`) : (`${theme.palette.background}`)
        }}>
            <Box sx={{
                flex: 1,
                justifyContent: 'flex-start',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                {/* Rank */}
                <Avatar sx={{
                    background: getRankColor(itemNumber),
                    marginRight: 3,
                    width: '6vh',
                    height: '6vh',
                }} >{itemNumber}</Avatar>
                {/* Image */}
                <Box
                    sx={{
                        width: '10vh',
                        height: '10vh',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'grey.400',
                    }}>
                    <img
                        src={userImage || '/placeholder-avatar.png'}
                        alt="User Avatar"
                        style={{
                            //if user does not have an image, display placeholder with different styling
                            width: validImage ? '100%' : '80%',
                            height: validImage ? '100%' : '80%',
                            objectFit: 'cover',
                            boxSizing: 'border-box', //ensures padding is accounted inside the box
                            borderRadius: validImage ? '100%' : '50%', //ensures the placeholder image remains circular
                        }}
                        onError={(e) => {
                            setValidImage(false);
                            (e.target as HTMLImageElement).src = '/placeholder-avatar.png';
                        }}
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: 3,
                    textAlign: 'left'
                }}>
                    {isUser ? (
                        <Typography variant="h5" sx={{
                            flex: 1,
                            color: 'white',
                        }}>You</Typography>
                    ) : (
                        <Typography variant="h5" noWrap sx={{
                            flex: 1,
                            color: 'black',
                        }}>{userFirstName} {userLastName}</Typography>
                    )}
                    <Typography variant="body1" noWrap sx={{
                        flex: 1,
                        color: isUser ? 'white' : 'black',
                    }}>{formatDate(creationDate)}</Typography>
                </Box>
            </Box>
            <Box sx={{
                flex: 1,
                justifyContent: 'flex-end',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 2,
            }}>
                <Typography variant="h5" noWrap sx={{
                        color: isUser ? 'white' : 'black',
                    }}>{formatDistance(errorDistance)}</Typography>
            </Box>
        </Box>
    )
}
export default GuessItem;