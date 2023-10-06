import { TFunction } from 'i18next'

export enum VoteStateEnum {
    CREATED = 'CREATED',
    CANCELED = 'CANCELED',
    SUMMARIZED = 'SUMMARIZED',
    VETOED = 'VETOED',
}

export enum VoteStateOptionEnum {
    PLANNED = 'Planned',
    ENDED = 'ended',
    UPCOMING = 'upcoming',
    CANCELED = 'canceled',
    SUMMARIZED = 'summarized',
    VETOED = 'vetoed',
}

export enum VotesListColumnsEnum {
    NAME = 'name',
    EFFECTIVE_FROM = 'effectiveFrom',
    EFFECTIVE_TO = 'effectiveTo',
    VOTE_STATE = 'voteState',
    CAN_CAST = 'canCast',
    HAS_CAST = 'hasCast',
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
                return VoteStateOptionEnum.UPCOMING
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
