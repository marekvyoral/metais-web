import React from 'react'

interface ColorRowProps {
    color?: string
    label?: string
}

export const ColorRow = ({ color, label }: ColorRowProps) => {
    return label ? (
        <div style={{ alignContent: 'center', display: 'flex', flexDirection: 'row' }}>
            <span style={{ backgroundColor: color, width: '25px', height: '25px', borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ color: 'black', marginLeft: '10px' }}>{label}</span>
        </div>
    ) : (
        <span style={{ backgroundColor: color, width: '25px', height: '25px', borderRadius: '50%', display: 'inline-block' }} />
    )
}
