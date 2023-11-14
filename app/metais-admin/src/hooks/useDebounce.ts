import { useEffect, useState } from 'react'

export const useDebounce = (value: string, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        if (value) {
            const handler = setTimeout(() => {
                setDebouncedValue(value)
            }, delay)

            return () => {
                clearTimeout(handler)
            }
        } else {
            setDebouncedValue(value)
        }
    }, [value, delay])

    return debouncedValue
}
