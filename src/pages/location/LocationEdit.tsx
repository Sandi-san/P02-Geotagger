import { FC, useEffect, useState } from 'react';
import { Box, Button, DialogContent, FormControl, Modal, TextField, Typography } from '@mui/material';
import useMediaQuery from '../../hooks/useMediaQuery';
import Layout from '../../components/ui/Layout';
import theme from '../../theme';
import { CreateLocationFields, useCreateLocationForm } from '../../hooks/react-hook-form/useCreateLocation';
import { useGetLocationQuery, useUpdateLocationMutation, useUploadImageMutation } from '../../slices/api/location.slice';
import isApiError from '../../utils/apiErrorChecker';
import ErrorDisplay from '../../components/modals/ErrorDisplay';
import { LocationType } from '../../models/location';
import Loading from '../../components/ui/Loading';
import userStore from '../../stores/user.store';
import { useNavigate } from 'react-router-dom';
import getValidImagePath from '../../utils/validImagePath';
import { Controller } from 'react-hook-form';
import { UpdateLocationFields, useUpdateLocationForm } from '../../hooks/react-hook-form/useUpdateLocation';

interface LocationEditProps {
    id: number
}

const LocationEdit: FC<LocationEditProps> = ({ id }) => {
    const { isMobile } = useMediaQuery(720)
    const navigate = useNavigate()

    //method for updating location
    const [updateLocation] = useUpdateLocationMutation()
    //method for fetching location with id
    const { data: dataLocation, error: locationError, isLoading: isLoadingLocation } = useGetLocationQuery({ id });
    //state for saving location
    const [location, setLocation] = useState<LocationType>()

    useEffect(() => {
        if (dataLocation) {
            setLocation(dataLocation)
            // console.log("Fetched: ", dataLocation)
        }
    }, [dataLocation]);

    //value of error returned by api
    const [apiError, setApiError] = useState('')
    //status code returned by api
    const [apiStatus, setApiStatus] = useState('')
    //state if error has occured
    const [showError, setShowError] = useState(false)
    //auth error to show error modal and redirect user from this page
    const [showAuthError, setShowAuthError] = useState(false)

    //set state for image file
    const [imageFile, setImageFile] = useState<File | null>(null)
    //upload image for Location api route
    const [uploadImage] = useUploadImageMutation()

    //method for changing Location image
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file)
        }
    };
    //call handleAvatarChange function but triggered by foreign element (Button)
    const triggerFileInput = () => {
        //call on click event on Image (by id) from different element
        const fileInput = document.getElementById('image-selector');
        if (fileInput) {
            fileInput.click();
        }
    };

    //form for creating/updating Location 
    const { handleSubmit, control, errors, setValue } = useUpdateLocationForm({});

    //update form values when location is fetched
    useEffect(() => {
        if (location) {
            setValue("lat", location.lat);
            setValue("lon", location.lon);
            setValue("address", location.address);
        }
    }, [location, setValue]); //runs when location changes

    const onSubmit = async (formData: UpdateLocationFields) => {
        console.log('Form Data:', formData);
        console.log('Image:', imageFile);

        if (!imageFile && !location?.image) {
            console.log('Please choose image for location!')
            setApiError('Please choose image for location!');
            setApiStatus('404');
            setShowError(true);
            return
        }

        try {
            //call RTK Query mutation with valid formData (update location)
            const locationResponse = await updateLocation({ id, formData }).unwrap();
            console.log('Location updated successfully:', locationResponse);

            //if image file was set, call update
            if (imageFile) {
                const formDataImage = new FormData()
                formDataImage.append('image', imageFile)
                //call api with id from location and image as parameters
                const imageUploadResponse = await uploadImage({
                    id,
                    formData: formDataImage
                });

                if (typeof (imageUploadResponse as any).error === 'object' &&
                    imageUploadResponse.error !== undefined) {
                    const err = imageUploadResponse.error
                    console.error("Error during image upload: ", err)
                    if (isApiError(err)) {
                        setApiError(err.data.message);
                        setApiStatus(err.status.toString());
                        setShowError(true);
                    }
                    else {
                        //force call catch error block
                        throw new Error()
                    }
                }
                else {
                    console.log('Image uploaded successfully:', imageUploadResponse);
                }
            }
        }
        catch (err) {
            console.error("Error during edit of location: ", err)
            if (isApiError(err)) {
                setApiError(err.data.message);
                setApiStatus(err.status.toString());
                setShowError(true);
            }
            else {
                setApiError("An unexpected error has occured.");
                setShowError(true);
            }
        }
    }

    const handleCancel = () => {
        if (window.history.length > 2) {
            navigate(-1); //go back if there's history
        } else {
            navigate('/profile'); //otherwise go to Profile page
        }
    };

    //run when location is loaded or local user changes
    useEffect(() => {
        if (location) {
            const checkAccess = location.userId === userStore.user?.id;
            // console.log("Access: ", checkAccess);
            // console.log(`Loc: ${location.userId} User: ${userStore.user?.id}`);
            //handle unauthorization (user tries to delete location that isn't theirs)
            if (!checkAccess) {
                console.log("Access denied! User unauthorized.");
                setApiError("Access denied! User unauthorized.");
                setApiStatus("401");
                setShowAuthError(true);
            }
        }
    }, [location, userStore.user]);

    //handle data loading
    if (isLoadingLocation || !location) {
        return <Loading />
    }

    //handle error fetching data
    if (locationError) {
        if (isApiError(locationError)) {
            setApiError(locationError.data.message);
            setApiStatus(locationError.status.toString());
            setShowError(true);
        }
        else {
            setApiError("An unexpected error has occured.");
            setShowError(true);
        }
    }

    // Handle unauthorized access
    if (showAuthError) {
        return (
            <Modal
                open={showAuthError}
                onClose={() => navigate('/')} // Redirect on close
                aria-labelledby="error-modal-title"
                aria-describedby="error-modal-description"
            >
                <DialogContent>
                    <ErrorDisplay message={apiError} errorStatus={apiStatus}
                        handleClose={() => {
                            setShowAuthError(false);
                            navigate('/');
                        }} />
                </DialogContent>
            </Modal>
        );
    }

    return (
        <Layout>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* First section - Image */}
                <Box sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                    alignItems: 'center',
                    paddingX: '8vh',
                    overflow: 'hidden',
                    marginTop: isMobile ? 6 : 0,
                }}>
                    {/* Main text */}
                    <Typography variant="h4" component="span" sx={{ display: 'flex', alignItems: 'center', marginBottom: '2vh' }}>
                        <span style={{ color: theme.palette.primary.dark }}>Edit</span>
                        <span style={{ color: theme.palette.primary.main }}>&nbsp;location</span>
                    </Typography>
                    {/* Location image */}
                    <label
                        htmlFor="image-selector"
                        style={{
                            display: 'inline-block', //label behaves like block but only takes up the size of the content
                            cursor: 'pointer',
                            width: isMobile ? '100%' : '66%', //set width relative on parent
                        }}
                    >
                        {/* Hidden file input */}
                        <input
                            id="image-selector"
                            type="file"
                            accept="image/png, image/jpg, image/jpeg"
                            style={{
                                display: 'none', //hide the input
                            }}
                            onChange={handleImageChange}
                        />
                        {/* Display the image */}
                        <Box
                            component="img"
                            src={imageFile ? URL.createObjectURL(imageFile) :
                                (location.image ? (getValidImagePath(location.image)) :
                                    '/placeholder-image.png')}
                            alt="Location image preview"
                            sx={{
                                width: '100%',
                                height: '40vh',
                                objectFit: 'cover',
                                backgroundColor: '#f0f0f0',
                                borderRadius: 2,
                                // border: '2px solid #ccc',
                            }}
                        />
                    </label>

                    {/* Location text-box */}
                    <FormControl sx={{ width: isMobile ? '100%' : '66%' }}>
                        {/* Address field */}
                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type='text'
                                    label="Location"
                                    error={!!errors.address}
                                    helperText={errors.address?.message}
                                    variant="outlined"
                                    fullWidth
                                    sx={{ marginY: 2 }}

                                />
                            )}
                        />
                    </FormControl>
                </Box>

                {/* Buttons */}
                <Box sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'auto' : 'center',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    marginY: 1,
                    marginX: isMobile ? '9.5%' : '20.5%', //in line with text-box
                    marginBottom: 8,
                }}>
                    <Button variant="outlined" color="primary"
                        sx={{
                            marginBottom: 2, border: 2,
                            width: isMobile ? '100%' : 'auto',
                        }}
                        onClick={triggerFileInput}>
                        Upload image
                    </Button>
                    <Box sx={{ alignItems: isMobile ? 'flex-start' : 'auto', }}>
                        <Button type='submit' variant="contained" color="primary"
                            sx={{ marginBottom: 2, marginRight: 2 }}>
                            Save
                        </Button>
                        <Button variant="contained"
                            sx={{ marginBottom: 2, backgroundColor: '#FFF', color: '#000' }}
                            onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </form>
            {showError && (
                <Modal
                    open={showError}
                    onClose={() => setShowError(false)}
                    aria-labelledby="error-modal-title"
                    aria-describedby="error-modal-description"
                >
                    <DialogContent>
                        <ErrorDisplay message={apiError} errorStatus={apiStatus} handleClose={() => setShowError(false)} />
                    </DialogContent>
                </Modal>
            )
            }
        </Layout>
    );
};

export default LocationEdit;