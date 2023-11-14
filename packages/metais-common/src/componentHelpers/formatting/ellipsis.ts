export function truncateWithEllipsis(string: string, length = 20) {
    const ellipsisChar = '\u2026'
    return `${string.substring(0, length)}${string.length > length ? ellipsisChar : ''}`
}
