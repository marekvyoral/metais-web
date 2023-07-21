import React from 'react'
import { EnumType, useGetAttributeProfile, AttributeProfile, useStoreUnValid, useStoreValid } from '@isdd/metais-common/api'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import { setValidity } from '@isdd/metais-common/componentHelpers/mutationsHelpers/mutation'
import { QueryFeedback } from '@isdd/metais-common'

export interface IAtrributesContainerView {
    data: {
        ciTypeData: AttributeProfile | undefined
        constraintsData: (EnumType | undefined)[]
        unitsData?: EnumType | undefined
    }
    setValidityOfProfile: (technicalName?: string) => Promise<void>
    entityName?: string
}

interface AttributesContainer {
    entityName: string
    View: React.FC<IAtrributesContainerView>
}

export const ProfileDetailContainer: React.FC<AttributesContainer> = ({ entityName, View }) => {
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError, refetch } = useGetAttributeProfile(entityName)

    const { isLoading, isError, constraintsData } = useDetailData({
        entityStructure: ciTypeData,
        isEntityStructureLoading: isCiTypeDataLoading,
        isEntityStructureError: isCiTypeDataError,
    })

    const { mutateAsync: setProfileAsInvalid } = useStoreUnValid()
    const { mutateAsync: setProfileAsValid } = useStoreValid()

    const setValidityOfProfile = async (technicalName?: string) => {
        await setValidity(technicalName, ciTypeData?.valid, setProfileAsValid, setProfileAsInvalid, refetch)
    }

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View data={{ ciTypeData, constraintsData, unitsData: undefined }} setValidityOfProfile={setValidityOfProfile} />
        </QueryFeedback>
    )
}
