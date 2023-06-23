import React from 'react'

export const closeOnClickOutside = <T>(
    event: React.FocusEvent<HTMLElement, Element>,
    setState: React.Dispatch<React.SetStateAction<T>>,
    newValue: T,
) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
        setState(newValue)
    }
}

export const closeOnEscapeKey = <T>(event: React.KeyboardEvent<HTMLElement>, setState: React.Dispatch<React.SetStateAction<T>>, newValue: T) => {
    if (event.code == 'Escape') {
        setState(newValue)
    }
}
