import React from 'react'

interface ColorRowProps {
    color?: string
}

export const ColorRow = ({ color }: ColorRowProps) => {
    return <span style={{ backgroundColor: color, width: '25px', height: '25px', borderRadius: '50%', display: 'inline-block' }} />
}