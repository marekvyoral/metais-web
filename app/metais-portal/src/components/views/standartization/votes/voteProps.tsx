import { TFunction } from 'i18next'

export enum VoteStateEnum {
    CREATED = 'CREATED',
    CANCELED = 'CANCELED',
    SUMMARIZED = 'SUMMARIZED',
    VETOED = 'VETOED',
}

export enum VoteStateOptionEnum {
    planned = 'planned',
    ended = 'ended',
    upcomming = 'upcomming',
    canceled = 'canceled',
    summarized = 'summarized',
    vetoed = 'vetoed',
}

export enum VotesListColumnsEnum {
    name = 'name',
    effectiveFrom = 'effectiveFrom',
    effectiveTo = 'effectiveTo',
    voteState = 'voteState',
    canCast = 'canCast',
    hasCast = 'hasCast',
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
                return VoteStateOptionEnum.planned
            }
            if (dateToDiff < 0) {
                return VoteStateOptionEnum.ended
            }
            if (dateFromDiff < 0 && dateToDiff > 0) {
                return VoteStateOptionEnum.upcomming
            }
            return ''
        case VoteStateEnum.CANCELED:
            return VoteStateOptionEnum.canceled
        case VoteStateEnum.SUMMARIZED:
            return VoteStateOptionEnum.summarized
        case VoteStateEnum.VETOED:
            return VoteStateOptionEnum.vetoed
        default:
            return ''
    }
}

export const getVoteStateExplanation = (originalState: string | undefined, effectiveFrom: string, effectiveTo: string, t: TFunction): string => {
    return t('votes.type.state.' + getVoteStateEnum(originalState, effectiveFrom, effectiveTo))
}
