import { Box, Button, Typography } from '@mui/material';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import theme from '../theme';

//404 Not Found Page, displays when no page for url is found
const Page404: FC = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: (`${theme.palette.background}`)
      }}
    >
      <Typography variant="h1" color="error" sx={{ fontWeight: "bold" }}>
        404
      </Typography>
      <Typography variant="h5" color='secondary' sx={{ marginBottom: 2 }}>
        Nothing found
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/"
        sx={{
          paddingX: 3,
          paddingY: 1,
          borderRadius: "8px",
          textTransform: "none",
        }}
      >
        Go Home
      </Button>
    </Box>
  );
};

export default Page404;
