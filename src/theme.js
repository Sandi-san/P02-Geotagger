//global style theme for the app using MUI
import {createTheme} from '@mui/material/styles'

const theme = createTheme({
    palette:{
        primary:{
            main: '#FE7F2E',
            contrastText: '#FCCA46',
            dark: '#233D4D',
            light: '#619B8A'
        },
        secondary:{
            main: '#659E89',
            contrastText: '#A1C181',
        },
        typography: {
          fontFamily: 'Roboto, Arial, sans-serif', // Customize fonts
        },
    }
})

export default theme;