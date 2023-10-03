import { ButtonLink } from '@isdd/idsk-ui-kit/index'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { StandardDraftsDraftAction, StandardDraftsDraftStates } from '@isdd/metais-common/types/api'
import { TFunction } from 'i18next'

export const getPopupContentWithPermissions = (
    allPosibleOptions: StandardDraftsDraftStates[],
    t: TFunction<'translation', undefined, 'translation'>,
    onClick: (incomingState: StandardDraftsDraftStates) => void,
) => {
    return allPosibleOptions?.map((option) => {
        return (
            <Can I={Actions.CREATE} a={`DraftsList.${option}`} key={option}>
                <ButtonLink key={option.toString()} label={t(`DraftsList.header.${option}`)} onClick={() => onClick(option)} />
            </Can>
        )
    })
}

export const transformTargetStateIntoAction = (incomingState: StandardDraftsDraftStates) => {
    switch (incomingState) {
        case StandardDraftsDraftStates.ASSIGNED:
            return StandardDraftsDraftAction.ASSIGNED
        case StandardDraftsDraftStates.ACCEPTED:
            return StandardDraftsDraftAction.ACCEPTED
        case StandardDraftsDraftStates.REJECTED:
            return StandardDraftsDraftAction.REJECTED
        case StandardDraftsDraftStates.REQUESTED:
            return StandardDraftsDraftAction.REQUESTED
    }
}
