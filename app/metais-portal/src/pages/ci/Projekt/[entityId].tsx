import React from 'react'
import { Outlet } from 'react-router-dom'

const ProjectDetail: React.FC = () => {
    return (
        <>
            <h1>PROJEKT DETAIL</h1>
            <Outlet />
        </>
    )
}

export default ProjectDetail
