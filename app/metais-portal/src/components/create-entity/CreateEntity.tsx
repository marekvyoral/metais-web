import React, { SetStateAction, useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

import { CiCreateEntityContainerData, GetImplicitHierarchyFilter, ISelectedOrg } from '../containers/CiCreateEntityContainer'

import { CreateCiEntityForm } from './CreateCiEntityForm'
import { CreateCiEntitySelect } from './CreateCiEntitySelect'

import { CiType, EnumType, useStoreConfigurationItemUsingPOST } from '@/api'

export interface AttrributesData {
    ciTypeData: CiType | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData?: EnumType | undefined
}

export interface CreateEntityData {
    attributesData: AttrributesData
    ciListAndRolesData: CiCreateEntityContainerData
}

interface ICreateEntity {
    entityName: string
    data: CreateEntityData
    filter: GetImplicitHierarchyFilter
    filterCallbacks: {
        setFilter: React.Dispatch<SetStateAction<GetImplicitHierarchyFilter>>
    }
    selectedOrgState: ISelectedOrg
}

export const CreateEntity: React.FC<ICreateEntity> = ({ data, selectedOrgState, entityName, filterCallbacks, filter }) => {
    const { ciListAndRolesData, attributesData } = data
    const { constraintsData, ciTypeData, unitsData } = attributesData
    const { generatedEntityId } = ciListAndRolesData
    const { rightsForPOData } = ciListAndRolesData
    const [selectedRoleId, setSelectedRoleId] = useState<string>('')

    useEffect(() => {
        if (rightsForPOData && rightsForPOData.length > 0 && selectedRoleId === '') {
            setSelectedRoleId(rightsForPOData[0].roleUuid)
        }
    }, [rightsForPOData, selectedRoleId])

    const [uploadError, setUploadError] = useState(false)

    const storeConfigurationItem = useStoreConfigurationItemUsingPOST()

    const onSubmit = (formAttributes: FieldValues) => {
        setUploadError(false)
        const formAttributesKeys = Object.keys(formAttributes)

        const formatedAttributesToSend = formAttributesKeys.map((key) => ({ name: key, value: formAttributes[key] }))
        const type = entityName
        const ownerId = selectedRoleId
        const uuid = uuidv4()
        storeConfigurationItem.mutate({
            data: {
                uuid: uuid,
                owner: ownerId,
                type: type,
                attributes: formatedAttributesToSend,
            },
        })
    }

    if (storeConfigurationItem.isError) {
        setUploadError(true)
    }
    if (storeConfigurationItem.isSuccess) {
        // console.log('navigate after succes')
    }

    return (
        <>
            <CreateCiEntitySelect
                ciListAndRolesData={data.ciListAndRolesData}
                filter={filter}
                filterCallbacks={filterCallbacks}
                setSelectedRoleId={setSelectedRoleId}
                selectedOrgState={selectedOrgState}
            />
            <CreateCiEntityForm
                ciTypeData={ciTypeData}
                generatedEntityId={generatedEntityId ?? { cicode: '', ciurl: '' }}
                constraintsData={constraintsData}
                unitsData={unitsData}
                uploadError={uploadError}
                onSubmit={onSubmit}
            />
        </>
    )
}
