export function capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const formatLocation = (str: string) => {
    const arr = str.split(',');
    return arr.length > 3 ? arr.slice(0, 3).join(',') : str;
}