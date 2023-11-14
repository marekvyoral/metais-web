type Pages = {
    leftDots: boolean
    range: number[]
    rightDots: boolean
}

const pageRange = (from: number, to: number): number[] => Array.from({ length: to - from + 1 }, (_, i) => i + from)

//firstPage + dots + (currentPage-1) + currentPage + (currentPage+1) + dots + lastPage
const maxNumberOfItems = 7

export const computePageModel = (totalPageCount: number, pageNumber: number): Pages => {
    const firstItem = 2
    const lastItem = totalPageCount - 1

    if (totalPageCount <= maxNumberOfItems) {
        const range = pageRange(firstItem, lastItem)
        return { leftDots: false, range, rightDots: false }
    }

    const shouldShowLeftDots = Math.max(pageNumber - 1, firstItem) > firstItem
    const shouldShowRightDots = Math.min(pageNumber + 1, lastItem) < lastItem

    if (!shouldShowLeftDots && shouldShowRightDots) {
        const range = pageRange(firstItem, firstItem + 2)
        return { leftDots: false, range, rightDots: true }
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
        const range = pageRange(lastItem - 2, lastItem)
        return { leftDots: true, range, rightDots: false }
    }

    const range = pageRange(pageNumber - 1, pageNumber + 1)
    return { leftDots: true, range, rightDots: true }
}
