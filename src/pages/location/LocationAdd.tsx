import { FC, useState } from 'react';
import { Box, Button, DialogContent, FormControl, Modal, TextField, Typography } from '@mui/material';
import useMediaQuery from '../../hooks/useMediaQuery';
import Layout from '../../components/ui/Layout';
import theme from '../../theme';
import { Controller } from 'react-hook-form';
import WorldMap from '../../components/ui/Map';
import { CreateLocationFields, useCreateLocationForm } from '../../hooks/react-hook-form/useCreateLocation';
import { useCreateLocationMutation, useUploadImageMutation } from '../../slices/api/location.slice';
import isApiError from '../../utils/apiErrorChecker';
import ErrorDisplay from '../../components/modals/ErrorDisplay';
import SuccessConformation from '../../components/modals/SuccessConformation';

const LocationAdd: FC = () => {
    const { isMobile } = useMediaQuery(720)

    //form for creating/updating Location 
    const { handleSubmit, control, errors, setValue } = useCreateLocationForm();

    const [createLocation] = useCreateLocationMutation()

    //value of error returned by api
    const [apiError, setApiError] = useState('')
    //status code returned by api
    const [apiStatus, setApiStatus] = useState('')
    //state if error has occured
    const [showError, setShowError] = useState(false)

    //state for opening Successful Creation Modal
    const [showSuccess, setShowSuccess] = useState(false)

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

    const onSubmit = async (formData: CreateLocationFields) => {
        // console.log('Form Data:', formData);
        console.log('Image:', imageFile);

        if ((formData.lat == 0 || null) || (formData.lon == 0 || null)) {
            console.log('Please select a valid location!')
            setApiError('Please select a valid location!');
            setApiStatus('404');
            setShowError(true);
            return
        }
        if (!imageFile) {
            console.log('Please choose image for location!')
            setApiError('Please choose image for location!');
            setApiStatus('404');
            setShowError(true);
            return
        }

        try {
            //call RTK Query mutation with valid formData (create location)
            const locationResponse = await createLocation(formData).unwrap();
            // console.log('Location created successfully:', locationResponse);

            //if created location returned successfully, call uploadFile route
            if (locationResponse.id) {
                const formDataImage = new FormData()
                formDataImage.append('image', imageFile)
                //call api with id from location and image as parameters
                const imageUploadResponse = await uploadImage({
                    id: locationResponse.id,
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
                        setApiError("An unexpected error has occured.");
                        setShowError(true);
                    }
                }
                else {
                    console.log('Image uploaded successfully:', imageUploadResponse);
                    setShowSuccess(true)
                }
            }
        }
        catch (err) {
            console.error("Error during creation of location: ", err)
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

    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number; address: string } | null>(null);

    const handleLocationSelect = (lat: number, lon: number, address: string) => {
        setSelectedLocation({ lat, lon, address })
        console.log("Location:", { lat, lon });
        // console.log("Address:", address);

        //update formData
        setValue("lat", lat, { shouldValidate: true });
        setValue("lon", lon, { shouldValidate: true });
        setValue("address", address, { shouldValidate: true });
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
                }}>
                    {/* Main text */}
                    <Typography variant="h4" component="span" sx={{ display: 'flex', alignItems: 'center', marginBottom: '2vh' }}>
                        <span style={{ color: theme.palette.primary.dark }}>Add a new</span>
                        <span style={{ color: theme.palette.primary.main }}>&nbsp;location</span>
                    </Typography>
                    {/* Location image */}
                    <label
                        htmlFor="image-selector"
                        style={{
                            display: 'inline-block', //label behaves like block but only takes up the size of the content
                            cursor: 'pointer',
                            width: '66%',  //set width relative on parent
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
                            src={imageFile ? URL.createObjectURL(imageFile) : '/placeholder-image.png'}
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
                </Box>
                {/* Button for choosing image */}
                <Box sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    width: '80%', //in line with image
                    overflow: 'hidden',
                    marginY: 1
                }}>
                    <Button variant="outlined" color="primary"
                        sx={{ marginBottom: 2, border: 2 }}
                        onClick={triggerFileInput}>
                        Upload new picture
                    </Button>
                </Box>

                {/* Second section - Map */}
                <Box sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                    alignItems: 'center',
                    paddingX: '8vh',
                    overflow: 'hidden',
                }}>
                    {/* Box for Map component */}
                    <Box
                        sx={{
                            width: '66%',
                            height: '30vh',
                            objectFit: 'cover',
                            // border: '2px solid #ccc', // Optional border for styling
                            backgroundColor: '#f0f0f0', // Fallback color if no image
                        }}
                    >
                        <WorldMap onSelectLocation={handleLocationSelect} />
                    </Box>
                    <FormControl
                        sx={{ width: '66%' }}
                    >
                        {/* Address field */}
                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    onChange={(e) => {
                                        //allow user input after change
                                        field.onChange(e);
                                        //set value from selectedLocation
                                        setSelectedLocation((prev) => prev ? { ...prev, address: e.target.value } : null);
                                    }}
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
                {/* Button for submit */}
                <Box sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    width: '80%', //in line with image
                    overflow: 'hidden',
                    marginY: 1
                }}>
                    <Button type='submit' variant="contained" color="primary"
                        sx={{ marginBottom: 2, }}>
                        Add location
                    </Button>
                </Box>
            </form>
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
            {showSuccess && (
                <Modal
                    open={showSuccess}
                    onClose={() => setShowSuccess(false)}
                    aria-labelledby="success-modal-title"
                    aria-describedby="success-modal-description"
                >
                    <DialogContent>
                        <SuccessConformation 
                            handleClose={() => setShowSuccess(false)} 
                            title={"Location created"} 
                            message={"Your location was created successfully."} />
                    </DialogContent>
                </Modal>
            )}
        </Layout>
    );
};

export default LocationAdd;