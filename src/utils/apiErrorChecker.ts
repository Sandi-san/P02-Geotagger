//utility function for checking if error (returned from api) can be displayed
const isApiError = (error: unknown): 
error is {status: number; data: { message: string } } => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'data' in error &&
        typeof (error as any).data === 'object' &&
        'message' in (error as any).data &&
        typeof (error as any).status === 'number'
    );
};
export default isApiError