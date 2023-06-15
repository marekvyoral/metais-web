import React from 'react'

import {
    ReadConfigurationItemUsingGET200,
    useReadConfigurationItemUsingGET,
    useGetEnumUsingGET,
    EnumType,
    AttributeConstraintEnumAllOf,
    CiType,
    useGetCiTypeUsingGET,
} from '@/api'
import { useHowToDisplayConstraints } from '@/hooks/useHowToDisplay'

export interface ICiContainerView {
    data: {
        ciTypeData: CiType | undefined
        ciItemData: ReadConfigurationItemUsingGET200 | undefined
        constraintsData: (EnumType | undefined)[]
        unitsData: EnumType | undefined
    }
}

interface ICiContainer {
    entityName: string
    entityId: string
    View: React.FC<ICiContainerView>
}

export const CiContainer: React.FC<ICiContainer> = ({ entityId, entityName, View }) => {
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiTypeUsingGET(entityName)
    const { data: ciItemData, isLoading: isCiItemLoading, isError: isCiItemError } = useReadConfigurationItemUsingGET(entityId)

    const constraintsAttributes =
        ciTypeData?.attributes
            ?.map((attribute) =>
                attribute?.constraints
                    ?.filter((item) => item.type === 'enum')
                    .map((constraint: AttributeConstraintEnumAllOf) => constraint?.enumCode),
            )
            .flat() ?? []

    const constraintsAttributesProfiles =
        ciTypeData?.attributeProfiles
            ?.map((profile) =>
                profile?.attributes?.map((attribute) =>
                    attribute?.constraints
                        ?.filter((item) => item.type === 'enum')
                        .map((constraint: AttributeConstraintEnumAllOf) => constraint?.enumCode),
                ),
            )
            .flat(2) ?? []

    const constraints = [...constraintsAttributes, ...constraintsAttributesProfiles]

    const { isLoading: isUnitsLoading, isError: isUnitsError, data: unitsData } = useGetEnumUsingGET('MERNA_JEDNOTKA')
    const { isLoading: isConstraintLoading, isError: isConstraintError, resultList } = useHowToDisplayConstraints(constraints)

    const constraintsData = resultList.map((item) => item.data)
    const isLoading = [isCiTypeDataLoading, isCiItemLoading, isUnitsLoading, isConstraintLoading].some((item) => item)
    const isError = [isCiTypeDataError, isCiItemError, isUnitsError, isConstraintError].some((item) => item)

    if (isLoading) {
        return <div>Loading</div>
    }
    if (isError) {
        return <div>Error</div>
    }

    return <View data={{ ciTypeData, ciItemData, constraintsData, unitsData }} />
}
