import React from 'react'

import { AttributeConstraintEnumAllOf, CiType, useGetCiTypeUsingGET } from '../../api/generated/types-repo-swagger'

import { ReadConfigurationItemUsingGET200, useReadConfigurationItemUsingGET } from '@/api/generated/cmdb-swagger'
import { IEnumData, useHowToDisplayConstraints, useHowToDisplayUnits } from '@/hooks/useHowToDisplay'

export interface IEntityCiContainerView {
    data: {
        ciTypeData: CiType | undefined
        ciItemData: ReadConfigurationItemUsingGET200 | undefined
        constraintsData: (IEnumData | undefined)[]
        unitsData: IEnumData | undefined
    }
}

interface IEntityCiContainer {
    entityName: string
    entityId: string
    View: React.FC<IEntityCiContainerView>
}

export const EntityCiContainer: React.FC<IEntityCiContainer> = ({ entityId, entityName, View }) => {
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiTypeUsingGET(entityName)
    const { data: ciItemData, isLoading: isCiItemLoading, isError: isCiItemError } = useReadConfigurationItemUsingGET(entityId)

    const units = ciTypeData?.attributes?.some((attribute) => attribute.units !== null) ?? false
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

    const { isLoading: isUnitsLoading, isError: isUnitsError, data: unitsData } = useHowToDisplayUnits(units)
    const { isLoading: isConstraintLoading, isError: isConstraintError, resultList } = useHowToDisplayConstraints(constraints)

    const constraintsData = resultList.map((item) => item.data)
    const isLoading = [isCiTypeDataLoading, isCiItemLoading, isUnitsLoading, isConstraintLoading].some((item) => item)
    const isError = [isCiTypeDataError, isCiItemError, isUnitsError, isConstraintError].some((item) => item)

    return <View data={{ ciTypeData, ciItemData, constraintsData, unitsData }} />
}
