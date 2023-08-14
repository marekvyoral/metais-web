import React, { useState } from 'react'
import { ConfigurationItemSetUi, useGetUuid, useReadCiList1 } from '@isdd/metais-common/api'
import { QueryFeedback } from '@isdd/metais-common'
import { CsruOrganization, useGetOrganizationFromCsru } from '@isdd/metais-common/api/generated/iam-swagger'

export interface iFindView {
    data: {
        foundCiType?: ConfigurationItemSetUi
        csruData?: CsruOrganization
        generatedUUID?: string
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

    const {
        data: generatedUUID,
        // isLoading: generateUUIDIsLoading,
        // isError: generateUUIDIsError,
    } = useGetUuid({ query: { enabled: ico !== undefined, retry: false } })

    const {
        data,
        isLoading: isCiLoading,
        isError: isCiError,
    } = useReadCiList1(
        {
            ...defaultRequestApi,
        },
        { query: { enabled: ico !== undefined, retry: false } },
    )

    const {
        data: CSRUData,
        // isLoading: CSRUIsLoading,
        // isError: CSRUIsError,
    } = useGetOrganizationFromCsru(ico ?? '', { query: { enabled: ico !== undefined } })

    const isLoading = isCiLoading
    const isError = isCiError
    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View
                data={{
                    foundCiType: data,
                    csruData: CSRUData,
                    generatedUUID,
                }}
                setIcoToSearch={setIco}
            />
        </QueryFeedback>
    )
}
