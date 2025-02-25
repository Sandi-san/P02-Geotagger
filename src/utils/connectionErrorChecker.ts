//utility function for checking if error (returned from api) is a connection error
const isConnectionError = (err: unknown):
    err is { error: string; status: string } => {
    return (
        typeof err === 'object' &&
        err !== null && err !== undefined && 
        'error' in err &&
        typeof (err as any).error === 'string' && 
        'status' in err &&
        typeof (err as any).status === 'string'
    )
};
export default isConnectionError