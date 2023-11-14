export const formatBytes = (bytes: number): string => {
    const kilobyte = 1024
    const megabyte = kilobyte * 1024
    const gigabyte = megabyte * 1024

    if (bytes >= gigabyte) {
        return `${(bytes / gigabyte).toFixed(2)} GB`
    } else if (bytes >= megabyte) {
        return `${(bytes / megabyte).toFixed(2)} MB`
    } else if (bytes >= kilobyte) {
        return `${(bytes / kilobyte).toFixed(2)} KB`
    }

    return `${bytes} bytes`
}
