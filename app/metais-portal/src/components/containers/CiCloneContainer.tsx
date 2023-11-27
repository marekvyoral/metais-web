import { RelationshipType, useGetRelationshipTypeHook } from '@isdd/metais-common/api/generated/types-repo-swagger'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

export interface ICiTypeRelationData {
    relatedList: RelationshipType[]
}

export interface ISelectedRelationTypeState {
    selectedRelationTypeTechnicalName: string
    setSelectedRelationTypeTechnicalName: Dispatch<SetStateAction<string>>
}

export interface ICiCloneContainerView {
    selectedRelationTypeState: ISelectedRelationTypeState
    data: ICiTypeRelationData
}

interface ICiCloneContainer {
    technicalNames: string[]
    View: React.FC<ICiCloneContainerView>
}

export const CiCloneContainer: React.FC<ICiCloneContainer> = ({ technicalNames, View }) => {
    const [selectedRelationTypeTechnicalName, setSelectedRelationTypeTechnicalName] = useState<string>('')
    const [relationTypes, setRelationTypes] = useState<RelationshipType[]>([])
    const getRelationType = useGetRelationshipTypeHook()

    useEffect(() => {
        const relationPromises = technicalNames.map((technicalName) => getRelationType(technicalName))
        Promise.all(relationPromises).then((types) => {
            setRelationTypes(types)
            setSelectedRelationTypeTechnicalName(types.at(0)?.technicalName ?? '')
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <View
            data={{ relatedList: relationTypes }}
            selectedRelationTypeState={{ selectedRelationTypeTechnicalName, setSelectedRelationTypeTechnicalName }}
        />
    )
}
