import React from 'react'

interface IView {
    data: object
}

interface IProjectListContainer {
    entityName: string
    entityId: string
    View: React.FC<IView>
}

export const ProjectListContainer: React.FC<IProjectListContainer> = ({ entityId, entityName, View }) => {
    return <View data={{ key: 'value' }} />
}
