import { alpha, Box, CircularProgress, Typography } from '@mui/material';
import { FC } from 'react';
import theme from '../../theme';

interface LoadingProps {
  backgroundColor?: string, //option to pass background color for widget
  backgroundOpacity?: number, //option to pass background opacity for widget
}

//custom loading spinner widget for when data is loading
const Loading: FC<LoadingProps> = ({
  backgroundColor,
  backgroundOpacity,
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", //full-page height
        // background: "linear-gradient(135deg, #667eea, #764ba2)",
        bgcolor: backgroundColor
          ? alpha(backgroundColor, backgroundOpacity ?? 1) //default to full opacity
          : "transparent", //default if no color is provided
      }}
    >
      {/* Animated Loading Spinner */}
      <CircularProgress
        size={70}
        thickness={4}
        sx={{
          color: "primary.main",
          marginBottom: 2,
          animation: "pulse 1.5s infinite alternate",
          "@keyframes pulse": {
            "0%": { transform: "scale(1)" },
            "100%": { transform: "scale(1.1)" },
          },
        }}
      />

      {/* Loading Text */}
      <Typography variant="h6" color='primary.main' sx={{ fontWeight: "bold", textShadow: `0px 0px 2px ${theme.palette.primary.light}` }}>
        Loading...
      </Typography>
    </Box>
  );
};
export default Loading;
