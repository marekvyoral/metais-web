import { EnumType } from '@isdd/metais-common/api'
import {
    AttributeProfile,
    CiType,
    useGetAttributeProfile,
    useStoreExistAttribute,
    useStoreInvisible,
    useStoreUnValid,
    useStoreUnvalid1,
    useStoreValid1,
    useStoreValid2,
    useStoreVisible,
} from '@isdd/metais-common/api/generated/types-repo-swagger'
import { setValidity } from '@isdd/metais-common/componentHelpers/mutationsHelpers/mutation'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import React from 'react'

export interface IAttributesContainerView<T> {
    data: {
        ciTypeData: AttributeProfile | undefined
        constraintsData: (EnumType | undefined)[]
        unitsData?: EnumType | undefined
    }
    setValidityOfProfile: (technicalName?: string) => Promise<void>
    setValidityOfAttributeProfile?: (attributeTechnicalName?: string, oldAttributeValidity?: boolean) => void
    setVisibilityOfAttributeProfile?: (attributeTechnicalName?: string, oldAttributeVisibility?: boolean) => void
    entityName?: string
    saveAttribute: (formData: T) => Promise<void>
    isLoading: boolean
    isError: boolean
}

interface AttributesContainer<T> {
    entityName: string
    View: React.FC<IAttributesContainerView<T>>
}

export const ProfileDetailContainer: React.FC<AttributesContainer<CiType>> = ({ entityName, View }) => {
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError, refetch } = useGetAttributeProfile(entityName)

    const { isLoading, isError, constraintsData } = useDetailData({
        entityStructure: ciTypeData,
        isEntityStructureLoading: isCiTypeDataLoading,
        isEntityStructureError: isCiTypeDataError,
    })

    const { mutateAsync: setProfileAsInvalid } = useStoreUnValid()
    const { mutateAsync: setProfileAsValid } = useStoreValid1()

    const { mutateAsync: setProfileAttributeAsValid } = useStoreValid2()
    const { mutateAsync: setProfileAttributeAsInvalid } = useStoreUnvalid1()
    const { mutateAsync: saveExistingAttribute } = useStoreExistAttribute()

    const { mutateAsync: setProfileAttributeAsVisible } = useStoreVisible()
    const { mutateAsync: setProfileAttributeAsInvisible } = useStoreInvisible()

    const setValidityOfProfile = async (technicalName?: string) => {
        await setValidity(technicalName, ciTypeData?.valid, setProfileAsValid, setProfileAsInvalid, refetch)
    }

    const saveAttribute = async (formData: CiType) => {
        await saveExistingAttribute({
            data: {
                ...formData,
            },
        }).then(() => {
            refetch()
        })
    }

    const setValidityOfAttributeProfile = async (attributeTechnicalName?: string, oldAttributeValidity?: boolean) => {
        if (oldAttributeValidity) {
            setProfileAttributeAsInvalid({
                technicalName: attributeTechnicalName ?? '',
                attrProfileTechnicalName: ciTypeData?.technicalName ?? '',
            }).then(() => {
                refetch()
            })
        } else {
            setProfileAttributeAsValid({
                technicalName: attributeTechnicalName ?? '',
                attrProfileTechnicalName: ciTypeData?.technicalName ?? '',
            }).then(() => {
                refetch()
            })
        }
    }

    const setVisibilityOfAttributeProfile = (attributeTechnicalName?: string, oldAttributeInvisibility?: boolean) => {
        if (!oldAttributeInvisibility) {
            setProfileAttributeAsInvisible({
                technicalName: attributeTechnicalName ?? '',
                attrProfileTechnicalName: ciTypeData?.technicalName ?? '',
            }).then(() => {
                refetch()
            })
        } else {
            setProfileAttributeAsVisible({
                technicalName: attributeTechnicalName ?? '',
                attrProfileTechnicalName: ciTypeData?.technicalName ?? '',
            }).then(() => {
                refetch()
            })
        }
    }

    return (
        <View
            data={{ ciTypeData, constraintsData, unitsData: undefined }}
            setValidityOfProfile={setValidityOfProfile}
            setValidityOfAttributeProfile={setValidityOfAttributeProfile}
            setVisibilityOfAttributeProfile={setVisibilityOfAttributeProfile}
            saveAttribute={saveAttribute}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
