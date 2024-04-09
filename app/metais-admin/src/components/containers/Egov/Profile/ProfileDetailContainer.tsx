import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { FindAll11200, useFindAll11 } from '@isdd/metais-common/api/generated/iam-swagger'
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
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useEffect, useState } from 'react'

export interface IOpenAddAttribudeModalState {
    openAddAttributeModal: boolean
    setOpenAddAttributeModal: React.Dispatch<React.SetStateAction<boolean>>
}

export interface IProfileDetailContainerView<T> {
    data: {
        profileData: AttributeProfile | undefined
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
    openAddAttribudeModalState: IOpenAddAttribudeModalState
    refetch: () => void
    roles?: FindAll11200
}

interface IProfileDetailContainer<T> {
    entityName: string
    View: React.FC<IProfileDetailContainerView<T>>
}

export const ProfileDetailContainer: React.FC<IProfileDetailContainer<CiType>> = ({ entityName, View }) => {
    const { isActionSuccess, setIsActionSuccess } = useActionSuccess()

    const {
        data: profileData,
        isLoading: isProfileLoading,
        isFetching: isProfileFetching,
        isError: isProfileError,
        refetch,
    } = useGetAttributeProfile(entityName)

    useEffect(() => {
        isActionSuccess.value && isActionSuccess.additionalInfo?.type === 'edit' && refetch()
    }, [isActionSuccess, refetch])

    const { isLoading, isError, constraintsData, unitsData } = useDetailData({
        entityStructure: profileData,
        isEntityStructureLoading: isProfileLoading,
        isEntityStructureError: isProfileError,
    })

    const { data: roles, isLoading: isRolesLoading, isError: isRolesError } = useFindAll11()

    const { mutateAsync: setProfileAsInvalid } = useStoreUnValid()
    const { mutateAsync: setProfileAsValid } = useStoreValid1()

    const { mutateAsync: setProfileAttributeAsValid } = useStoreValid2()
    const { mutateAsync: setProfileAttributeAsInvalid } = useStoreUnvalid1()
    const { mutateAsync: saveExistingAttribute, isLoading: savingAttr } = useStoreExistAttribute()

    const { mutateAsync: setProfileAttributeAsVisible } = useStoreVisible()
    const { mutateAsync: setProfileAttributeAsInvisible } = useStoreInvisible()

    const [openAddAttributeModal, setOpenAddAttributeModal] = useState(false)

    const setValidityOfProfile = async (technicalName?: string) => {
        await setValidity(technicalName, profileData?.valid, setProfileAsValid, setProfileAsInvalid, refetch)
    }

    const saveAttribute = async (formData: CiType) => {
        await saveExistingAttribute({
            data: {
                ...formData,
            },
        })
        setIsActionSuccess({
            value: true,
            path: `${AdminRouteNames.EGOV_PROFILE}/${entityName}`,
            additionalInfo: { type: 'edit', entity: 'attribute' },
        })
    }

    const setValidityOfAttributeProfile = async (attributeTechnicalName?: string, oldAttributeValidity?: boolean) => {
        if (oldAttributeValidity) {
            setProfileAttributeAsInvalid({
                technicalName: attributeTechnicalName ?? '',
                attrProfileTechnicalName: profileData?.technicalName ?? '',
            }).then(() => {
                refetch()
            })
        } else {
            setProfileAttributeAsValid({
                technicalName: attributeTechnicalName ?? '',
                attrProfileTechnicalName: profileData?.technicalName ?? '',
            }).then(() => {
                refetch()
            })
        }
    }

    const setVisibilityOfAttributeProfile = (attributeTechnicalName?: string, oldAttributeInvisibility?: boolean) => {
        if (!oldAttributeInvisibility) {
            setProfileAttributeAsInvisible({
                technicalName: attributeTechnicalName ?? '',
                attrProfileTechnicalName: profileData?.technicalName ?? '',
            }).then(() => {
                refetch()
            })
        } else {
            setProfileAttributeAsVisible({
                technicalName: attributeTechnicalName ?? '',
                attrProfileTechnicalName: profileData?.technicalName ?? '',
            }).then(() => {
                refetch()
            })
        }
    }

    return (
        <View
            data={{ profileData, constraintsData, unitsData: unitsData }}
            setValidityOfProfile={setValidityOfProfile}
            setValidityOfAttributeProfile={setValidityOfAttributeProfile}
            setVisibilityOfAttributeProfile={setVisibilityOfAttributeProfile}
            saveAttribute={saveAttribute}
            isLoading={[isLoading, isRolesLoading, isProfileFetching, savingAttr].some((item) => item)}
            isError={[isError, isRolesError].some((item) => item)}
            openAddAttribudeModalState={{ openAddAttributeModal, setOpenAddAttributeModal }}
            refetch={refetch}
            roles={roles}
        />
    )
}
