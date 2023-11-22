import { useRef } from 'react'

interface IScrollParams {
    behavior?: 'auto' | 'smooth'
    block?: 'center' | 'end' | 'nearest' | 'start'
    inline?: 'center' | 'end' | 'nearest' | 'start'
}

export const useScroll = (scrollOptions?: IScrollParams) => {
    const wrapperRef = useRef<HTMLTableSectionElement>(null)

    const scrollToMutationFeedback = () => {
        wrapperRef.current?.scrollIntoView({
            behavior: scrollOptions?.behavior ?? 'smooth',
            block: scrollOptions?.block ?? 'center',
            inline: scrollOptions?.inline ?? 'nearest',
        })
    }
    return { wrapperRef, scrollToMutationFeedback }
}
