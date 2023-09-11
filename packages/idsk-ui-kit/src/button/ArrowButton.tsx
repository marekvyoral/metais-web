import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface IArrowButton {
    label: string
    path: string
}

export const ArrowButton: React.FC<IArrowButton> = ({ path, label }) => {
    const location = useLocation()
    return (
        <Link
            to={path}
            state={{ from: location }}
            role="button"
            draggable="false"
            className="idsk-button idsk-button--start"
            data-module="idsk-button"
        >
            {label}
            <svg
                className="idsk-button__start-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="17.5"
                height="19"
                viewBox="0 0 33 40"
                role="presentation"
                focusable="false"
            >
                <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
            </svg>
        </Link>
    )
}
