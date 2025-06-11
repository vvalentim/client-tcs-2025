/**
 * Decode a base64 url string
 * @param {string} str
 * @returns {string}
 */
const base64UrlDecode = (str: string): string => {
    str = str.replace(/_/g, "/");
    str = str.replace(/-/g, "+");

    return atob(str);
};

/**
 * Decodes a JWT token and returns the payload.
 * @param {string} token
 * @returns {object|null}
 */
export const parseJwt = (token: string): object | null => {
    try {
        const encodedPayload = token.split(".")[1];
        const payload = JSON.parse(base64UrlDecode(encodedPayload));

        return payload;
    } catch {
        return null;
    }
};
