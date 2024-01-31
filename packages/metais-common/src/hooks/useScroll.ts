import { useCallback, useRef, useState } from 'react'

interface IScrollParams {
    behavior?: 'auto' | 'smooth'
    block?: 'center' | 'end' | 'nearest' | 'start'
    inline?: 'center' | 'end' | 'nearest' | 'start'
}

export const useScroll = (scrollOptions?: IScrollParams) => {
    const wrapperRef = useRef<HTMLTableSectionElement>(null)
    const [scrolled, setScrolled] = useState(false)

    const scrollToMutationFeedback = useCallback(
        (setScrolledParam?: boolean) => {
            if ((!scrolled && setScrolledParam) || setScrolledParam == null)
                wrapperRef.current?.scrollIntoView({
                    behavior: scrollOptions?.behavior ?? 'smooth',
                    block: scrollOptions?.block ?? 'center',
                    inline: scrollOptions?.inline ?? 'nearest',
                })
            if (setScrolledParam) setScrolled(true)
        },
        [scrollOptions?.behavior, scrollOptions?.block, scrollOptions?.inline, scrolled],
    )
    return { wrapperRef, scrollToMutationFeedback }
}
