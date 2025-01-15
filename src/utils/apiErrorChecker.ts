//utility function for checking if error (returned from api) can be displayed
const isApiError = (error: unknown): error is { data: { message: string } } => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'data' in error &&
        typeof (error as any).data === 'object' &&
        'message' in (error as any).data
    );
};
export default isApiError