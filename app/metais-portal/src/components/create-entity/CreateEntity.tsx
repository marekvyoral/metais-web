import { CiType, EnumType, useStoreConfigurationItem } from '@isdd/metais-common/api'
import React, { useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { v4 as uuidV4 } from 'uuid'

import { CiCreateEntityContainerData, ISelectedOrg } from '../containers/CiCreateEntityContainer'

import { CreateCiEntityForm } from './CreateCiEntityForm'
import { CreateCiEntitySelect } from './CreateCiEntitySelect'

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
    selectedOrgState: ISelectedOrg
}

export const CreateEntity: React.FC<ICreateEntity> = ({ data, selectedOrgState, entityName }) => {
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

    const storeConfigurationItem = useStoreConfigurationItem()

    const onSubmit = (formAttributes: FieldValues) => {
        setUploadError(false)
        const formAttributesKeys = Object.keys(formAttributes)

        const formatedAttributesToSend = formAttributesKeys.map((key) => ({ name: key, value: formAttributes[key] }))
        const type = entityName
        const ownerId = selectedRoleId
        const uuid = uuidV4()
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
            <CreateCiEntitySelect rightsForPOData={rightsForPOData} setSelectedRoleId={setSelectedRoleId} selectedOrgState={selectedOrgState} />
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
