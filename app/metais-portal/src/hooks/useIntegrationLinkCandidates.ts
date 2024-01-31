import { IOption } from '@isdd/idsk-ui-kit/index'
import { useListProvidingProjectsCandidates, useListConsumingProjectsCandidates } from '@isdd/metais-common/api/generated/provisioning-swagger'
import { useState } from 'react'

export const useIntegrationLinkCandidates = () => {
    const [selectedConsProj, setSelectedConsProj] = useState<string>('')
    const [selectedProvProj, setSelectedProvProj] = useState<string>('')

    const {
        data: providingProjectsCandidates,
        isLoading: isProvProjCandidatesLoading,
        isError: isProvProjCandidatesError,
    } = useListProvidingProjectsCandidates(
        {
            perPageSize: 10000,
            ...(selectedConsProj ? { 'consumingProjects[]': [selectedConsProj] } : {}),
        },
        { query: { refetchOnMount: false } },
    )
    const {
        data: consumingProjectsCandidates,
        isLoading: isConsProjCandidatesLoading,
        isError: isConsProjCandidatesError,
    } = useListConsumingProjectsCandidates(
        {
            perPageSize: 10000,
            ...(selectedProvProj ? { 'providingProjects[]': [selectedProvProj] } : {}),
        },
        { query: { refetchOnMount: false } },
    )

    const provProjOptions: IOption<string>[] =
        providingProjectsCandidates?.results?.map((option) => ({
            value: option.uuid ?? '',
            label: option.name ?? '',
        })) ?? []
    const consProjOptions: IOption<string>[] =
        consumingProjectsCandidates?.results?.map((option) => ({
            value: option.uuid ?? '',
            label: option.name ?? '',
        })) ?? []

    return {
        isLoading: isProvProjCandidatesLoading || isConsProjCandidatesLoading,
        isError: isProvProjCandidatesError || isConsProjCandidatesError,
        provProjOptions,
        consProjOptions,
        setSelectedConsProj,
        setSelectedProvProj,
    }
}
