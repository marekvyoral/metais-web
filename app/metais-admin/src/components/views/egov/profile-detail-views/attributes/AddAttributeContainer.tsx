import React from 'react'
import {
    Attribute,
    EnumType,
    EnumTypePreviewList,
    useGetEnumUsingGET,
    useListEnumsUsingGET,
    useStoreNewAttributeUsingPOST,
} from '@isdd/metais-common/api'
import { UseMutateAsyncFunction } from '@tanstack/react-query'

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
    const { data } = useGetEnumUsingGET('MERNA_JEDNOTKA')
    const { data: allEnumsData } = useListEnumsUsingGET()

    const { mutateAsync: storeAttribute } = useStoreNewAttributeUsingPOST()
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
