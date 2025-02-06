import { Avatar, Box, Typography } from "@mui/material"
import { FC, useEffect, useState } from "react";
import theme from "../../theme";
import getValidImagePath from "../../utils/validImagePath";

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
    //TODO: get guesses data here

    const dateText = new Date(creationDate).toLocaleDateString()

    const [validImage, setValidImage] = useState(false);
    const userImage = getValidImagePath(userAvatarImage)

    useEffect(() => {
        console.log("Valid: ", userImage)
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

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 1,
            borderRadius: 2,
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
                        height: '100%',
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
                        <Typography variant="h5" sx={{
                            flex: 1,
                            color: 'black',
                        }}>{userFirstName}&nbsp;{userLastName}</Typography>
                    )}
                    <Typography variant="body1" 
                    sx={{
                        flex: 1,
                        color: isUser ? 'white' : 'black',
                    }}>{dateText}</Typography>
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
                <Typography variant="h5"
                    sx={{
                        color: isUser ? 'white' : 'black',
                    }}>{errorDistance}&nbsp;m</Typography>
            </Box>
        </Box>
    )
}
export default GuessItem;