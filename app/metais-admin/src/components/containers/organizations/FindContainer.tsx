import React, { useState } from 'react'
import { ConfigurationItemSetUi, useReadCiList1 } from '@isdd/metais-common/api'
import { CsruOrganization, useGetOrganizationFromCsru } from '@isdd/metais-common/api/generated/iam-swagger'

export interface iFindView {
    data: {
        foundCiType?: ConfigurationItemSetUi
        csruData?: CsruOrganization
    }
    setIcoToSearch: React.Dispatch<React.SetStateAction<string | undefined>>
}

interface ICreateEntity {
    View: React.FC<iFindView>
}

export const FindContainer: React.FC<ICreateEntity> = ({ View }: ICreateEntity) => {
    const [ico, setIco] = useState<string>()
    const defaultRequestApi = {
        filter: {
            type: ['PO'],
            attributes: [
                {
                    name: 'EA_Profil_PO_ico',
                    filterValue: [
                        {
                            value: ico,
                            equality: 'EQUAL',
                        },
                    ],
                },
            ],
            metaAttributes: {
                state: ['DRAFT', 'AWAITING_APPROVAL', 'APPROVED_BY_OWNER', 'INVALIDATED'],
            },
        },
    }

    const { data } = useReadCiList1(
        {
            ...defaultRequestApi,
        },
        { query: { enabled: ico !== undefined, retry: false } },
    )

    const { data: CSRUData } = useGetOrganizationFromCsru(ico ?? '', { query: { enabled: ico !== undefined } })

    return (
        <View
            data={{
                foundCiType: data,
                csruData: CSRUData,
            }}
            setIcoToSearch={setIco}
        />
    )
}
