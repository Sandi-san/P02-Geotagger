import { FC, useEffect } from "react";
import Layout from "../../components/ui/Layout";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import userStore from "../../stores/user.store";
import { useNavigate } from "react-router-dom";

const ActivityLog: FC = () => {
    const navigate = useNavigate()

    useEffect(() => {
        if (userStore.user?.role !== "admin") {
            console.error("Unauthorized user. Redirecting to home page.")
            navigate('/')
        }
    }, []);

    const data: any[] = []

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
                {data.length > 0 ? (
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
                                {data.map((log, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">{log.user}</TableCell>
                                        <TableCell align="center">
                                            {new Date(log.dateTime).toLocaleString()}
                                        </TableCell>
                                        <TableCell align="center">{log.action}</TableCell>
                                        <TableCell align="center">{log.componentType}</TableCell>
                                        <TableCell align="center">{log.newValue}</TableCell>
                                        <TableCell align="center">{log.location}</TableCell>
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
                            <Box component="img" src="/icon-search.svg" alt="" sx={{ height: 20, padding: 1 }} />
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
        </Layout >
    )
}
export default ActivityLog;