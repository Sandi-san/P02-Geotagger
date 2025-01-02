import React, { FC } from 'react';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import { Button } from '@mui/material';

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
        <img src="./logo.svg" className="App-logo" alt="logo" />
        <p>Some text</p>
        <Button color='primary' variant='outlined'>Some button</Button>
        <Button color='secondary' variant='contained'>Some button</Button>
    </ThemeProvider>
  );
}

export default App;
