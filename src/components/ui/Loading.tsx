import { Box, CircularProgress, Typography } from '@mui/material';
import { FC } from 'react';

//custom loading spinner widget for when data is loading
const Loading: FC = () => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Full-page height
        // background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      {/* Animated Loading Spinner */}
      <CircularProgress
        size={70}
        thickness={4}
        sx={{
          color: "secondary.main",
          marginBottom: 2,
          animation: "pulse 1.5s infinite alternate",
          "@keyframes pulse": {
            "0%": { transform: "scale(1)" },
            "100%": { transform: "scale(1.1)" },
          },
        }}
      />
      
      {/* Loading Text */}
      <Typography variant="h6" color='secondary.main' sx={{ fontWeight: "bold", textShadow: "0px 0px 8px rgba(255,255,255,0.7)" }}>
        Loading...
      </Typography>
    </Box>
  );
};
export default Loading;
