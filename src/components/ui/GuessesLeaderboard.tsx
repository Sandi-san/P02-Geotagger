import { Box, DialogContent, Modal, Typography } from "@mui/material"
import { FC, useEffect, useState } from "react";
import { useGetGuessesQuery } from "../../slices/api/location.slice";
import { FetchGuessType } from "../../models/guess";
import isApiError from "../../utils/apiErrorChecker";
import Loading from "./Loading";
import ErrorDisplay from "../modals/ErrorDisplay";
import GuessItem from "./GuessItem";
import userStore from "../../stores/user.store";

interface GuessesLeaderboardProps {
    locationId: number,
    refreshKey?: number,
}

const GuessesLeaderboard: FC<GuessesLeaderboardProps> = ({ locationId, refreshKey }) => {
    //states for opening Error Modal
    const [apiError, setApiError] = useState('')
    const [apiStatus, setApiStatus] = useState('')
    const [showError, setShowError] = useState(false)

    //states for Guesses
    const [guesses, setGuesses] = useState<FetchGuessType[]>([]); //array to hold fetched guesses

    const { data: dataGuesses, error: guessesError, isLoading: isLoadingGuess, refetch } = useGetGuessesQuery({ id: locationId })

    useEffect(() => {
        if (dataGuesses) {
            setGuesses(dataGuesses)
            console.log("Guesses: ", dataGuesses)
        }
    }, [dataGuesses])

    //refetch guesses when refreshKey changes (passed as prop)
    useEffect(() => {
        if (refreshKey !== undefined) {
            if (refreshKey > 0)
                refetch()
        }
    }, [refreshKey, refetch])

    if (isLoadingGuess) {
        return <Loading />
    }

    if (guessesError) {
        if (isApiError(guessesError)) {
            setApiError(guessesError.data.message);
            setApiStatus(guessesError.status.toString());
            setShowError(true);
        }
    }

    if (guessesError) {
        return <Modal
            open={showError}
            onClose={() => setShowError(false)}
            aria-labelledby="error-modal-title"
            aria-describedby="error-modal-description"
        >
            <DialogContent>
                <ErrorDisplay message={apiError} errorStatus={apiStatus} handleClose={() => setShowError(false)} />
            </DialogContent>
        </Modal>
    }

    return (
        <>
            <Typography variant="h4" component="span" sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '2vh' }}>
                Leaderboard
            </Typography>
            <Box
                sx={{
                    maxHeight: '90vh', //same as parent height, minus above typography height
                    overflowY: 'auto', //enable vertical scrolling
                    scrollbarWidth: 'thin', // Firefox scrollbar styling
                    '&::-webkit-scrollbar': {
                        width: '8px', // Set scrollbar width
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#888', // Scrollbar thumb color
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#555', // Darker on hover
                    },
                }}
            >
                {guesses.map((guess, index) => (
                    <GuessItem key={index}
                        itemNumber={index + 1}
                        userFirstName={guess.user.firstName || undefined}
                        userLastName={guess.user.lastName || undefined}
                        userAvatarImage={guess.user.image || undefined}
                        errorDistance={guess.errorDistance}
                        creationDate={guess.createdAt as Date}
                        isUser={guess.user.id === userStore.user?.id}
                    />
                ))}
            </Box>
        </>
    )
}
export default GuessesLeaderboard;