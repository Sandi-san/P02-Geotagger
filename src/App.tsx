import { FC } from 'react';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import Routes from './routes/Routes';
import { usePageIdentification } from './hooks/usePageIdentification';

//Main App page, prepare theme, run routes
const App: FC = () => {
  //change tab header name based on specific page
  usePageIdentification();
  return (
    <ThemeProvider theme={theme}>
      <Routes/>
    </ThemeProvider>
  );
}

export default App;
