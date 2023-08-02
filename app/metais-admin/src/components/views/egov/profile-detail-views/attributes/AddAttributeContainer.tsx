import React from 'react'
import { Attribute, EnumType, EnumTypePreviewList, useGetEnum, useListEnums, useStoreNewAttribute } from '@isdd/metais-common/api'

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
    const { data: allEnumsData } = useListEnums()

    const { mutateAsync: storeAttribute } = useStoreNewAttribute()

    const storeNewAttribute = async (attributeTechnicalName?: string, newAttribute?: Attribute) => {
        await storeAttribute({
            atrProfTechnicalName: attributeTechnicalName ?? '',
            data: {
                ...newAttribute,
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
