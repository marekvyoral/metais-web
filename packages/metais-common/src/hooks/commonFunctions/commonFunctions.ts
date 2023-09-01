export const removeDuplicates = <T>(arr: T[], by: keyof T | undefined = undefined) => {
    const propertyList = by && arr.map((item) => item[by])
    const filtered = propertyList
        ? arr.filter((item, index) => !propertyList.includes(item[by], index + 1))
        : arr.filter((item, index, array) => !array.includes(item, index + 1))
    return filtered
}
