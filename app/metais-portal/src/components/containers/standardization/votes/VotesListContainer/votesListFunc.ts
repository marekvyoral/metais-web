import { formatDateForDefaultValue } from '@isdd/metais-common/index'
import { DateTime } from 'luxon'

import { VoteStateEnum, VoteStateOptionEnum } from '@/components/views/standartization/votes/voteProps'

export interface IVotesParamsData {
    state: string | undefined
    dateFrom: string | undefined
    dateTo: string | undefined
}

export const getVoteParamsData = (voteStateOption: string, effectiveFrom: string, effectiveTo: string): IVotesParamsData => {
    const dateNow = DateTime.now().toString()
    const formattedDateNow = formatDateForDefaultValue(dateNow)
    switch (voteStateOption) {
        case VoteStateOptionEnum.PLANNED:
            return {
                state: effectiveFrom ? VoteStateEnum.CREATED : undefined,
                dateFrom: effectiveFrom ? formattedDateNow : effectiveFrom,
                dateTo: effectiveTo,
            }
        case VoteStateOptionEnum.ended:
            return {
                state: effectiveTo ? VoteStateEnum.CREATED : undefined,
                dateFrom: effectiveFrom,
                dateTo: effectiveTo ? formattedDateNow : effectiveTo,
            }
        case VoteStateOptionEnum.upcomming:
            return {
                state: VoteStateEnum.CREATED,
                dateFrom: effectiveFrom ? formattedDateNow : effectiveFrom,
                dateTo: effectiveTo ? formattedDateNow : effectiveTo,
            }
        case VoteStateOptionEnum.canceled:
            return { state: VoteStateEnum.CANCELED, dateFrom: effectiveFrom, dateTo: effectiveTo }
        case VoteStateOptionEnum.summarized:
            return { state: VoteStateEnum.SUMMARIZED, dateFrom: effectiveFrom, dateTo: effectiveTo }
        case VoteStateOptionEnum.vetoed:
            return { state: VoteStateEnum.VETOED, dateFrom: effectiveFrom, dateTo: effectiveTo }
        default:
            return { state: '', dateFrom: '', dateTo: '' }
    }
}
