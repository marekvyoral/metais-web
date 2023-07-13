import React from 'react'
import {
    EnumType,
    useGetAttributeProfileUsingGET,
    AttributeProfile,
    useStoreUnValidUsingDELETE,
    useStoreValidUsingPUT1,
} from '@isdd/metais-common/api'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import { setValidity } from '@isdd/metais-common/componentHelpers/mutationsHelpers/mutation'

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
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError, refetch } = useGetAttributeProfileUsingGET(entityName)

    const { isLoading, isError, constraintsData } = useDetailData({
        entityStructure: ciTypeData,
        isEntityStructureLoading: isCiTypeDataLoading,
        isEntityStructureError: isCiTypeDataError,
    })

    const { mutateAsync: setProfileAsInvalid } = useStoreUnValidUsingDELETE()
    const { mutateAsync: setProfileAsValid } = useStoreValidUsingPUT1()

    const setValidityOfProfile = async (technicalName?: string) => {
        await setValidity(technicalName, ciTypeData?.valid, setProfileAsValid, setProfileAsInvalid, refetch)
    }

    if (isLoading) {
        return <div>Loading</div>
    }
    if (isError) {
        return <div>Error</div>
    }

    return <View data={{ ciTypeData, constraintsData, unitsData: undefined }} setValidityOfProfile={setValidityOfProfile} />
}
