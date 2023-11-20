import { MultiSelect } from '@isdd/idsk-ui-kit'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetAllStandardRequests } from '@isdd/metais-common/api/generated/standards-swagger'
import { QueryFeedback } from '@isdd/metais-common/index'

interface ISelectMeetingProposal {
    meetingProposals: string[]
    id: string
    label: string
    setSelectedProposals: React.Dispatch<string[]>
}

export const SelectMeetingProposals = ({ meetingProposals, id, label, setSelectedProposals }: ISelectMeetingProposal) => {
    const { t } = useTranslation()

    const { data: proposalsList, isLoading, isError } = useGetAllStandardRequests()
    const optionsProposals = useMemo(
        () =>
            proposalsList?.standardRequests?.map((proposal) => ({
                value: `${proposal.id}`,
                label: `${proposal.srName}`,
            })) || [],
        [proposalsList],
    )

    return (
        <QueryFeedback loading={isLoading} error={isError} withChildren>
            <MultiSelect
                key={id}
                name={id}
                label={label}
                placeholder={t('filter.chooseValue')}
                options={optionsProposals}
                defaultValue={meetingProposals}
                value={meetingProposals}
                onChange={(value) => {
                    setSelectedProposals(value)
                }}
            />
        </QueryFeedback>
    )
}
