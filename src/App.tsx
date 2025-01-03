import { FC } from 'react';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import Routes from './routes/Routes';

//Main App page, prepare theme, run routes
const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Routes/>
    </ThemeProvider>
  );
}

export default App;
