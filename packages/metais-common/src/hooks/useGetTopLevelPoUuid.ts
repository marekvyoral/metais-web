import { useReadCiList1 } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ATTRIBUTE_NAME, TOP_LEVEL_PO_ICO } from '@isdd/metais-common/api/constants'

export const useGetTopLevelPoUuid = () => {
    const { data } = useReadCiList1({
        filter: {
            attributes: [
                {
                    name: ATTRIBUTE_NAME.EA_Profil_PO_ico,
                    filterValue: [{ equality: 'EQUAL', value: TOP_LEVEL_PO_ICO }],
                },
            ],
            metaAttributes: { state: ['DRAFT'] },
            type: ['PO'],
        },
    })

    return {
        uuid: data?.configurationItemSet?.[0].uuid,
    }
}
