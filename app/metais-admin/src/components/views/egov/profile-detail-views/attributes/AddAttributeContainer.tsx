import React from 'react'
import { EnumType, EnumTypePreviewList, useGetEnum, useListEnums } from '@isdd/metais-common/api'
import { Attribute, useStoreNewAttribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

export interface IAddAttributeView {
    data: {
        measureUnit?: EnumType | undefined
        allEnumsData?: EnumTypePreviewList | undefined
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

    const storeNewAttribute = async (attributeTechnicalName?: string, newAttribute?: Attribute) => {
        await storeAttribute({
            atrProfTechnicalName: attributeTechnicalName ?? '',
            data: {
                ...newAttribute,
                technicalName: attributeTechnicalName + underscore + newAttribute?.technicalName,
            },
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
