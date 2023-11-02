import { useMemo } from 'react'

import { useWindowSize } from './useWindowSize'
interface IWidthBreakpoints {
    mobile: boolean
    tablet: boolean
    desktop: boolean
}

export const useWindowWidthBreakpoints = (): IWidthBreakpoints | undefined => {
    const windowSize = useWindowSize()

    const breakpoints = useMemo<IWidthBreakpoints | undefined>(() => {
        if (windowSize.width == null) {
            return undefined
        }
        const width = windowSize.width
        return {
            mobile: width >= 320,
            tablet: width >= 641,
            desktop: width >= 769,
        }
    }, [windowSize.width])

    return breakpoints
}
