import React from 'react'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import { useEntityProfiles } from '@isdd/metais-common/hooks/useEntityProfiles'
import { setValidity } from '@isdd/metais-common/componentHelpers/mutationsHelpers/mutation'
import {
    CiType,
    SummarizingCardUi,
    Attribute,
    AttributeProfile,
    useStoreUnvalid,
    useStoreValid,
    useSetSummarizingCard,
    useStoreAttributeTextation1,
    useDeleteAttributeTextation1,
} from '@isdd/metais-common/api/generated/types-repo-swagger'
import { FindAll11200, useFindAll11 } from '@isdd/metais-common/api/generated/iam-swagger'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

export interface IEntityDetailContainerView {
    data: {
        ciTypeData: CiType | undefined
        constraintsData: (EnumType | undefined)[]
        unitsData?: EnumType | undefined
        summarizingCardData?: SummarizingCardUi | undefined
        attributesOverridesData?: Attribute[] | undefined
        keysToDisplay: Map<string, CiType | AttributeProfile | undefined>
    }
    setValidityOfEntity: (technicalName?: string) => Promise<void>
    setSummarizingCardData: (technicalName?: string, newSummarizingCardData?: SummarizingCardUi) => void
    saveExistingAttribute: (attributeTechnicalName?: string, attribute?: Attribute) => void
    resetExistingAttribute: (attributeTechnicalName?: string) => void
    isLoading: boolean
    roles?: FindAll11200
    isError: boolean
    refetch?: () => void
}

interface IEntityDetailContainer {
    entityName: string
    View: React.FC<IEntityDetailContainerView>
}

export const EntityDetailContainer: React.FC<IEntityDetailContainer> = ({ entityName, View }) => {
    const {
        ciTypeData,
        isLoading: isCiTypeDataLoading,
        isError: isCiTypeDataError,
        summarizingCardData,
        attributesOverridesData,
        keysToDisplay,
        refetch,
    } = useEntityProfiles(entityName)
    const { data: roles, isLoading: isRolesLoading, isError: isRolesError } = useFindAll11()
    const { mutateAsync: setEntityAsInvalid } = useStoreUnvalid()
    const { mutateAsync: setEntityAsValid } = useStoreValid()
    const { mutateAsync: setShowOwner } = useSetSummarizingCard()
    const { mutateAsync: saveAttribute } = useStoreAttributeTextation1()
    const { mutateAsync: resetAttribute } = useDeleteAttributeTextation1()

    const { setIsActionSuccess } = useActionSuccess()

    const setValidityOfEntity = async (technicalName?: string) => {
        setValidity(technicalName, ciTypeData?.valid, setEntityAsValid, setEntityAsInvalid, refetch)
    }

    const setSummarizingCardData = (technicalName?: string, newSummarizingCardData?: SummarizingCardUi) => {
        setShowOwner({
            technicalName: technicalName ?? '',
            data: {
                ...newSummarizingCardData,
            },
        })
            .then(() => {
                refetch()
            })
            .catch(() => {
                refetch()
            })
    }

    const saveExistingAttribute = (attributeTechnicalName?: string, attribute?: Attribute) => {
        saveAttribute({
            technicalName: ciTypeData?.technicalName ?? '',
            attTecName: attributeTechnicalName ?? '',
            data: {
                ...attribute,
            },
        })
            .then(() => {
                setIsActionSuccess({
                    value: true,
                    path: `${AdminRouteNames.EGOV_ENTITY}/${ciTypeData?.technicalName}`,
                    additionalInfo: { type: 'attrEdit' },
                })
                refetch()
            })
            .catch(() => {
                refetch()
            })
    }

    const resetExistingAttribute = (attributeTechnicalName?: string) => {
        resetAttribute({
            technicalName: ciTypeData?.technicalName ?? '',
            attTecName: attributeTechnicalName ?? '',
        })
            .then(() => {
                refetch()
            })
            .catch(() => {
                refetch()
            })
    }

    const { isLoading, isError, constraintsData } = useDetailData({
        entityStructure: ciTypeData,
        isEntityStructureLoading: isCiTypeDataLoading,
        isEntityStructureError: isCiTypeDataError,
    })

    return (
        <View
            data={{ ciTypeData, constraintsData, unitsData: undefined, summarizingCardData, keysToDisplay, attributesOverridesData }}
            setValidityOfEntity={setValidityOfEntity}
            setSummarizingCardData={setSummarizingCardData}
            saveExistingAttribute={saveExistingAttribute}
            resetExistingAttribute={resetExistingAttribute}
            isLoading={isLoading || isRolesLoading}
            isError={isError || isRolesError}
            roles={roles}
            refetch={refetch}
        />
    )
}
