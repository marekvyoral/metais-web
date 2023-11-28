import React from 'react'
import { EnumType, EnumTypePreviewList, useGetEnum, useListEnums } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { useDeleteCacheForCi } from '@isdd/metais-common/src/hooks/be-cache/useDeleteCacheForCi'
import { Attribute, useStoreNewAttribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

export interface IAddAttributeView {
    data: {
        measureUnit?: EnumType
        allEnumsData?: EnumTypePreviewList
        entityName?: string
    }
    storeNewAttribute: (attributeTechnicalName?: string, newAttribute?: Attribute) => Promise<void>
    isLoading: boolean
}

export interface IAddAttributeContainer {
    View: React.FC<IAddAttributeView>
    onClose: () => void
    refetch: () => void
    entityName: string
}

const AddAttributeContainer = ({ View, onClose, refetch, entityName }: IAddAttributeContainer) => {
    const { data } = useGetEnum('MERNA_JEDNOTKA')
    const underscore = '_'
    const { data: allEnumsData } = useListEnums()
    const { setIsActionSuccess } = useActionSuccess()

    const { mutateAsync: storeAttribute, isLoading: isCreatingAttr } = useStoreNewAttribute()
    const deleteCacheMutation = useDeleteCacheForCi()

    const storeNewAttribute = async (attributeTechnicalName?: string, newAttribute?: Attribute) => {
        const handleStoreAttribute = async () => {
            await storeAttribute({
                atrProfTechnicalName: attributeTechnicalName ?? '',
                data: {
                    ...newAttribute,
                    constraints: newAttribute?.constraints?.filter((constraint) => constraint.type && constraint.type.length > 0) ?? [],
                    technicalName: attributeTechnicalName + underscore + newAttribute?.technicalName,
                },
            })
            setIsActionSuccess({
                value: true,
                path: `${AdminRouteNames.EGOV_PROFILE}/${entityName}`,
                additionalInfo: { type: 'create', entity: 'attribute' },
            })
            onClose()
            refetch()
        }

        deleteCacheMutation.mutateAsync(undefined, {
            onSuccess: () => handleStoreAttribute(),
        })
    }

    return (
        <View
            data={{
                measureUnit: data,
                allEnumsData,
            }}
            storeNewAttribute={storeNewAttribute}
            isLoading={isCreatingAttr}
        />
    )
}

export default AddAttributeContainer
