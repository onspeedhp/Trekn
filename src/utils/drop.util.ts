export const isVideo = (url: string) => {
    const fileExt = url.split('.').pop()?.toLowerCase() || ''
    return ['mp4', 'mov'].includes(fileExt);
}