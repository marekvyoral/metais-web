import React, { useState } from 'react'
import { ConfigurationItemSetUi, useReadCiList1Hook } from '@isdd/metais-common/api'
import { CsruOrganization, useGetOrganizationFromCsruHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'

export interface iFindView {
    data: {
        foundCiType?: ConfigurationItemSetUi
        csruData?: CsruOrganization
    }
    onSearchIco: (ico: string) => void
    isLoading: boolean
    isSame: boolean
    error?: string
}

interface ICreateEntity {
    View: React.FC<iFindView>
}

export const FindContainer: React.FC<ICreateEntity> = ({ View }: ICreateEntity) => {
    const [CSRUData, setCSRUData] = useState<CsruOrganization>()
    const [data, setData] = useState<ConfigurationItemSetUi>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSame, setSame] = useState<boolean>(false)
    const [error, setError] = useState<string>()
    const hookFromCsru = useGetOrganizationFromCsruHook()
    const { currentPreferences } = useUserPreferences()
    const readCiList1Hook = useReadCiList1Hook()

    const metaAttributes = currentPreferences.showInvalidatedItems
        ? { state: ['DRAFT', 'AWAITING_APPROVAL', 'APPROVED_BY_OWNER', 'INVALIDATED'] }
        : { state: ['DRAFT', 'AWAITING_APPROVAL', 'APPROVED_BY_OWNER'] }

    const onSearchIco = async (ico: string) => {
        try {
            setSame(false)
            setError(undefined)
            setIsLoading(true)

            const dataRes = await readCiList1Hook({
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
            })
            setData(dataRes)
            if (dataRes?.configurationItemSet?.length === 0) {
                const CSRUres = await hookFromCsru(ico)
                setCSRUData(CSRUres)
            } else {
                setSame(true)
            }
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <>
            <View
                data={{
                    foundCiType: data,
                    csruData: CSRUData,
                }}
                onSearchIco={onSearchIco}
                isLoading={isLoading}
                error={error}
                isSame={isSame}
            />
        </>
    )
}
