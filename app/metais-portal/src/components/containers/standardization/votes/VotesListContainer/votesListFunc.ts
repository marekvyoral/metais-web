import { formatDateForDefaultValue } from '@isdd/metais-common/index'
import { DateTime } from 'luxon'

import { VoteStateEnum, VoteStateOptionEnum } from '@/components/views/standardization/votes/voteProps'

export interface IVotesParamsData {
    state: string | undefined
    dateFrom: string | undefined
    dateTo: string | undefined
}

export const getVoteParamsData = (voteStateOption: string, effectiveFrom: string, effectiveTo: string): IVotesParamsData => {
    const dateForPlaned = formatDateForDefaultValue(DateTime.now().plus({ days: 1 }).toString())
    const dateForEnded = formatDateForDefaultValue(DateTime.now().minus({ days: 1 }).toString())
    const dateForUpcomingFrom = formatDateForDefaultValue(DateTime.now().minus({ days: 2 }).toString())
    const dateForUpcomingTo = formatDateForDefaultValue(DateTime.now().plus({ days: 2 }).toString())
    switch (voteStateOption) {
        case VoteStateOptionEnum.PLANNED:
            return {
                state: effectiveFrom ? undefined : VoteStateEnum.CREATED,
                dateFrom: effectiveFrom ? effectiveFrom : dateForPlaned,
                dateTo: effectiveTo,
            }
        case VoteStateOptionEnum.ENDED:
            return {
                state: effectiveTo ? undefined : VoteStateEnum.CREATED,
                dateFrom: effectiveFrom,
                dateTo: effectiveTo ? effectiveTo : dateForEnded,
            }
        case VoteStateOptionEnum.UPCOMING:
            return {
                state: VoteStateEnum.CREATED,
                dateFrom: effectiveFrom ? effectiveFrom : dateForUpcomingFrom,
                dateTo: effectiveTo ? effectiveTo : dateForUpcomingTo,
            }
        case VoteStateOptionEnum.CANCELED:
            return { state: VoteStateEnum.CANCELED, dateFrom: effectiveFrom, dateTo: effectiveTo }
        case VoteStateOptionEnum.SUMMARIZED:
            return { state: VoteStateEnum.SUMMARIZED, dateFrom: effectiveFrom, dateTo: effectiveTo }
        case VoteStateOptionEnum.VETOED:
            return { state: VoteStateEnum.VETOED, dateFrom: effectiveFrom, dateTo: effectiveTo }
        default:
            return { state: '', dateFrom: effectiveFrom, dateTo: effectiveTo }
    }
}
