import { FC, useEffect, useState } from "react";
import Layout from "../../components/ui/Layout";
import { Avatar, Box, DialogContent, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import userStore from "../../stores/user.store";
import { useNavigate } from "react-router-dom";
import { FetchActionType } from "../../models/action";
import { useGetActionsQuery } from "../../slices/api/user.slice";
import getValidImagePath from "../../utils/validImagePath";
import Loading from "../../components/ui/Loading";
import ErrorDisplay from "../../components/modals/ErrorDisplay";
import isApiError from "../../utils/apiErrorChecker";

const ActivityLog: FC = () => {
    //states for opening Error Modal
    const [apiError, setApiError] = useState('')
    const [apiStatus, setApiStatus] = useState('')
    const [showError, setShowError] = useState(false)

    //states for User Actions
    const [actions, setActions] = useState<FetchActionType[]>([]); //array to hold fetched actions

    const { data: actionData, error: actionsError, isLoading: isLoadingActions } = useGetActionsQuery()

    useEffect(() => {
        if (actionData) {
            setActions(actionData)
            // console.log("Actions: ", actionData)
        }
    }, [actionData])

    const navigate = useNavigate()
    useEffect(() => {
        if (userStore.user?.role !== "admin") {
            console.error("Unauthorized user. Redirecting to home page.")
            navigate('/')
        }
    }, []);

    if (isLoadingActions) {
        return <Loading />
    }

    if (actionsError) {
        if (isApiError(actionsError)) {
            setApiError(actionsError.data.message);
            setApiStatus(actionsError.status.toString());
            setShowError(true);
        }
    }

    return (
        <Layout>
            <Box sx={{
                padding: 2,
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}>
                <Typography color="primary" variant="h4" sx={{
                    textAlign: 'left',
                    marginBottom: 2,
                }}>Activity log</Typography>
                {actions.length > 0 ? (
                    <TableContainer component={Paper} sx={{
                        alignContent: 'center',
                    }}>
                        <Table stickyHeader>
                            {/* Table Head */}
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">User</TableCell>
                                    <TableCell align="center">Date/Time</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                    <TableCell align="center">Component Type</TableCell>
                                    <TableCell align="center">New Value</TableCell>
                                    <TableCell align="center">Location</TableCell>
                                </TableRow>
                            </TableHead>

                            {/* Table Body */}
                            <TableBody>
                                {actions.map((action, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box
                                                    sx={{
                                                        width: '6vh',
                                                        height: '6vh',
                                                        borderRadius: '50%',
                                                        overflow: 'hidden',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        bgcolor: 'grey.400',
                                                    }}>
                                                    <img
                                                        src={getValidImagePath(action.user?.image) || '/placeholder-avatar.png'}
                                                        alt="User Avatar"
                                                        style={{
                                                            width: getValidImagePath(action.user?.image) ? '100%' : '80%',
                                                            height: getValidImagePath(action.user?.image) ? '100%' : '80%',
                                                            objectFit: 'cover',
                                                            boxSizing: 'border-box',
                                                            borderRadius: getValidImagePath(action.user?.image) ? '100%' : '50%',
                                                        }}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/placeholder-avatar.png';
                                                        }}
                                                    />
                                                </Box>
                                                <Box sx={{ paddingLeft: 2 }}>
                                                    {(action.user?.firstName && action.user?.lastName) ? (
                                                        <Typography variant="body2" noWrap>{action.user?.firstName} {action.user?.lastName}</Typography>
                                                    ) : (
                                                        <Typography variant="body2" noWrap>{action.user?.email}</Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body1">
                                                {action.createdAt ? (<>
                                                    <Typography>{new Date(action.createdAt as Date).toLocaleDateString()}</Typography>
                                                    <Typography>{new Date(action.createdAt as Date).toLocaleTimeString()}</Typography>
                                                </>) : ("/")}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body1">
                                                {action.action || "/"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body1">
                                                {action.type || "/"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body1">
                                                {action.newValue || "/"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body1">
                                                {action.url || "/"}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <>
                        <TableContainer component={Paper} sx={{
                            alignContent: 'center',
                        }}>
                            <Table stickyHeader>
                                {/* Table Head */}
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">User</TableCell>
                                        <TableCell align="center">Date/Time</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                        <TableCell align="center">Component Type</TableCell>
                                        <TableCell align="center">New Value</TableCell>
                                        <TableCell align="center">Location</TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>
                        </TableContainer>
                        <Box sx={{
                            padding: 4,
                            height: '50vh',
                            textAlign: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignContent: 'center',
                        }}>
                            {/* Display "No results found" when data is empty */}
                            <Box component="img" src="/icon-search.svg" alt="" sx={{ height: 30, padding: 2 }} />
                            <Typography variant="h5" >
                                No activity log found
                            </Typography>
                            <Typography variant="h6" sx={{ color: "gray", }}>
                                No results found. Refresh the page.
                            </Typography>
                        </Box>
                    </>
                )}
            </Box>

            {showError && (
                <Modal
                    open={showError} // Modal visibility tied to the showError state
                    onClose={() => setShowError(false)} // Close the modal on backdrop click
                    aria-labelledby="error-modal-title"
                    aria-describedby="error-modal-description"
                >
                    <DialogContent>
                        <ErrorDisplay message={apiError} errorStatus={apiStatus} handleClose={() => setShowError(false)} />
                    </DialogContent>
                </Modal>
            )}
        </Layout>
    )
}
export default ActivityLog;