//get valid path of User avatar image file
//NOTE: if registration is done with OAuth, the image path is copied from Google servers
//sometimes the file may become inaccessible  
const getValidImagePath = (imageName: string | undefined): string | undefined => {
    if (imageName === undefined) return undefined
    //check if image path name contains full path, if yes, return (for remote images)
    const isFullPath = imageName.startsWith('http://') || imageName.startsWith('https://');
    if (isFullPath)
        return imageName

    //check if image path name contains public, if yes, the image is from the local /public folder
    const isLocalPath = imageName.startsWith('/public/')
    //return image without '/public/' prefix to access correct folder
    if (isLocalPath)
        return imageName.substring(8)

    //if image is not full path (usually local file), append folder name and return 
    const baseFileFolder = `${process.env.REACT_APP_BACKEND_DOMAIN}/files`
    return `${baseFileFolder}/${imageName}`
}

export default getValidImagePath