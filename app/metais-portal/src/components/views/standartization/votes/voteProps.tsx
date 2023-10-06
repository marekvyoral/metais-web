import { TFunction } from 'i18next'

export enum VoteStateEnum {
    CREATED = 'CREATED',
    CANCELED = 'CANCELED',
    SUMMARIZED = 'SUMMARIZED',
    VETOED = 'VETOED',
}

export enum VoteStateOptionEnum {
    PLANNED = 'PLANNED',
    ENDED = 'ENDED',
    UPCOMMING = 'UPCOMMING',
    CANCELED = 'CANCELED',
    SUMMARIZED = 'SUMMARIZED',
    VETOED = 'VETOED',
}

export enum VotesListColumnsEnum {
    NAME = 'NAME',
    EFFECTIVE_FROM = 'EFFECTIVE_FROM',
    EFFECTIVE_TO = 'EFFECTIVE_TO',
    VOTE_STATE = 'VOTESTATE',
    CAN_CAST = 'CAN_CAST',
    HAS_CAST = 'HAS_CAST',
}

export const getVoteStateEnum = (originalState: string | undefined, effectiveFrom: string, effectiveTo: string): string => {
    const dateNow = new Date(Date.now())
    const dateFrom = new Date(effectiveFrom)
    const dateTo = new Date(effectiveTo)

    const dateFromDiff = dateFrom.getTime() - dateNow.getTime()
    const dateToDiff = dateTo.getTime() - dateNow.getTime()

    switch (originalState) {
        case VoteStateEnum.CREATED:
            if (dateFromDiff > 0) {
                return VoteStateOptionEnum.PLANNED
            }
            if (dateToDiff < 0) {
                return VoteStateOptionEnum.ENDED
            }
            if (dateFromDiff < 0 && dateToDiff > 0) {
                return VoteStateOptionEnum.UPCOMMING
            }
            return ''
        case VoteStateEnum.CANCELED:
            return VoteStateOptionEnum.CANCELED
        case VoteStateEnum.SUMMARIZED:
            return VoteStateOptionEnum.SUMMARIZED
        case VoteStateEnum.VETOED:
            return VoteStateOptionEnum.VETOED
        default:
            return ''
    }
}

export const getVoteStateExplanation = (originalState: string | undefined, effectiveFrom: string, effectiveTo: string, t: TFunction): string => {
    return t('votes.type.state.' + getVoteStateEnum(originalState, effectiveFrom, effectiveTo))
}
