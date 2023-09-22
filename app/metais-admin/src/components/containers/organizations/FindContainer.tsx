import React, { useState } from 'react'
import { ConfigurationItemSetUi, useReadCiList1 } from '@isdd/metais-common/api'
import { CsruOrganization, useGetOrganizationFromCsru } from '@isdd/metais-common/api/generated/iam-swagger'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'

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
    const { currentPreferences } = useUserPreferences()

    const metaAttributes = currentPreferences.showInvalidatedItems
        ? { state: ['DRAFT', 'AWAITING_APPROVAL', 'APPROVED_BY_OWNER', 'INVALIDATED'] }
        : { state: ['DRAFT', 'AWAITING_APPROVAL', 'APPROVED_BY_OWNER'] }

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
            metaAttributes,
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
