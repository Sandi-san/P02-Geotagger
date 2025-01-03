//global style theme for the app using MUI
import {createTheme} from '@mui/material/styles'

const theme = createTheme({
    //override individual components
    components:{
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', //remove fully capitalized text
                }
            }
        }
    },
    //global color pallete
    palette:{
        primary:{
            main: '#619B8A',
            contrastText: '#FFFFFF',
            dark: '#233D4D',
        },
        secondary:{
            main: '#659E89',
            contrastText: '#A1C181',
            light: '#FE7F2D'
        },
        typography: {
          fontFamily: 'Roboto, Arial, sans-serif', // Customize fonts
        },
    }
})

export default theme;