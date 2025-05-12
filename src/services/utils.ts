
export const getFirstErrorMessage = (errors: any) => {
    if (!errors) return null; // Handle missing errors object

    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) return null; // Handle empty errors object

    const firstKey = errorKeys[0];
    const messages = errors[firstKey];

    if (Array.isArray(messages) && messages.length > 0) {
        return messages[0];
    } else if (typeof messages === 'string') {
        return messages;
    }
    return null; // Handle unexpected error structure
};