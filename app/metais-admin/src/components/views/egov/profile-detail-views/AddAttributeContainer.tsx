import { Attribute, EnumType, EnumTypePreviewList, useGetEnum, useListEnums, useStoreNewAttribute } from '@isdd/metais-common/api'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import React from 'react'

export interface IAddAttributeView {
    data: {
        measureUnit?: EnumType | undefined
        allEnumsData?: EnumTypePreviewList | undefined
        entityName?: string
    }
    storeAttribute: UseMutateAsyncFunction<
        void,
        unknown,
        {
            atrProfTechnicalName: string
            data: Attribute
        },
        unknown
    >
}

export interface IAddAttributeContainer {
    View: React.FC<IAddAttributeView>
}

const AddAttributeContainer = ({ View }: IAddAttributeContainer) => {
    const { data } = useGetEnum('MERNA_JEDNOTKA')
    const { data: allEnumsData } = useListEnums()

    const { mutateAsync: storeAttribute } = useStoreNewAttribute()
    return (
        <View
            data={{
                measureUnit: data,
                allEnumsData,
            }}
            storeAttribute={storeAttribute}
        />
    )
}

export default AddAttributeContainer
