//global style theme for the app using MUI
import {createTheme} from '@mui/material/styles'

const theme = createTheme({
    //override individual components
    components:{
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', //remove fully capitalized text
                    minWidth: 100,
                    height: 30,
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
          fontFamily: 'Roboto, Arial, sans-serif',
        },
        background:{
            default: '#FFFFFF',
        }
    },
    //define typography
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h1: {
            fontFamily: 'Roboto',
            fontWeight: 300, //light
            fontSize: '96px',
        },
        h2: {
            fontFamily: 'Roboto',
            fontWeight: 300, //light
            fontSize: '60px',
        },
        h3: {
            fontFamily: 'Roboto',
            fontWeight: 400, //regular
            fontSize: '48px',
        },
        h4: {
            fontFamily: 'Roboto',
            fontWeight: 400, //regular
            fontSize: '34px',
        },
        h5: {
            fontFamily: 'Roboto',
            fontWeight: 400, //regular
            fontSize: '24px',
        },
        //body
        body1: {
            fontFamily: 'Roboto',
            fontWeight: 400, //regular
            fontSize: '16px',
        },
        //body bold
        body2: {
            fontFamily: 'Roboto',
            fontWeight: 400, //regular
            fontSize: '16px',
            fontWeight: 'bold',
        },
        caption: {
            fontFamily: 'Roboto',
            fontWeight: 400, //regular
            fontSize: '12px',
        }
    }
})

export default theme;