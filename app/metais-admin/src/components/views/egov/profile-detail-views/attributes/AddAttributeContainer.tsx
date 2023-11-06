import React from 'react'
import { EnumType, EnumTypePreviewList, useGetEnum, useListEnums } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { useDeleteCacheForCi } from '@isdd/metais-common/src/hooks/be-cache/useDeleteCacheForCi'
import { Attribute, useStoreNewAttribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

export interface IAddAttributeView {
    data: {
        measureUnit?: EnumType
        allEnumsData?: EnumTypePreviewList
        entityName?: string
    }
    storeNewAttribute: (attributeTechnicalName?: string, newAttribute?: Attribute) => Promise<void>
}

export interface IAddAttributeContainer {
    View: React.FC<IAddAttributeView>
}

const AddAttributeContainer = ({ View }: IAddAttributeContainer) => {
    const { data } = useGetEnum('MERNA_JEDNOTKA')
    const underscore = '_'
    const { data: allEnumsData } = useListEnums()

    const { mutateAsync: storeAttribute } = useStoreNewAttribute()
    const deleteCacheMutation = useDeleteCacheForCi()

    const storeNewAttribute = async (attributeTechnicalName?: string, newAttribute?: Attribute) => {
        const handleStoreAttribute = async () => {
            await storeAttribute({
                atrProfTechnicalName: attributeTechnicalName ?? '',
                data: {
                    ...newAttribute,
                    constraints: newAttribute?.constraints ?? [],
                    technicalName: attributeTechnicalName + underscore + newAttribute?.technicalName,
                },
            })
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
        />
    )
}

export default AddAttributeContainer
