//get valid path of User avatar image file
//NOTE: if registration is done with OAuth, the image path is copied from Google servers
//sometimes the file may become inaccessible and the user must manually change their profile image  
const getValidImagePath = (imageName: string | undefined): string | undefined => {
    if(imageName === undefined) return undefined
    //check if User image path name contains full path, if yes, return
    const isFullPath = imageName.startsWith('http://') || imageName.startsWith('https://');
    if (isFullPath)
        return imageName

    //if image is not full path (usually local file), append folder name and return 
    const baseFileFolder = `${process.env.REACT_APP_BACKEND_DOMAIN}/files`
    return `${baseFileFolder}/${imageName}`
}

export default getValidImagePath