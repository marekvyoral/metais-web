export const convertBytesToMegaBytes = (contentLength?: number) => {
    return ((contentLength ?? 0) / (1024 * 1024)).toFixed(2)
}
