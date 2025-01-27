import { FC, useEffect, useState } from 'react';
import { Avatar, Box, Button, FormControl, TextField, Typography } from '@mui/material';
import GuessCard from '../../components/ui/GuessCard';
import { FetchGuessType } from '../../models/guess';
import { LocationType } from '../../models/location';
import useMediaQuery from '../../hooks/useMediaQuery';
import Layout from '../../components/ui/Layout';
import theme from '../../theme';
import { Controller } from 'react-hook-form';
import { CreateLocationFields, useCreateUpdateLocationForm } from '../../hooks/react-hook-form/useCreateUpdateLocation';

const LocationAdd: FC = () => {
    const { isMobile } = useMediaQuery(720)

    //form for creating/updating Location 
    const { handleSubmit, errors, control } = useCreateUpdateLocationForm({});

    //set state for image file
    const [imageFile, setImageFile] = useState<File | null>(null)
    //upload image for Location api route
    // const [uploadImage] = useUploadImageMutation()

    //method for changing Location image
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file)
        }
    };
    //call handleAvatarChange function but triggered by foreign element (Button)
    const triggerFileInput = () => {
        //call on click event on Image (by id) from diffirent element
        const fileInput = document.getElementById('image-upload');
        if (fileInput) {
            fileInput.click();
        }
    };

    //TODO //CreateLocationFields
    const onSubmit = async (formData: any) => {
        console.log('Form Data:', formData);
        console.log('Image:', imageFile);
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
                    overflow: 'hidden', //prevent accidental overflow
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
                    {/* Add map here */}
                    <Box
                        component="img"
                        src='/placeholder-image.png'
                        alt="Selected preview"
                        sx={{
                            width: '66%',
                            height: '30vh',
                            objectFit: 'cover',
                            // border: '2px solid #ccc', // Optional border for styling
                            backgroundColor: '#f0f0f0', // Fallback color if no image
                        }}
                    />

                    <FormControl fullWidth
                        sx={{ width: '66%' }}
                    >
                        {/* Location address */}
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
        </Layout>
    );
};

export default LocationAdd;