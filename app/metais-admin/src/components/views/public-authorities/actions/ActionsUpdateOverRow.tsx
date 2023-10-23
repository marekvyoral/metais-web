import { ButtonLink, ButtonPopup } from '@isdd/idsk-ui-kit/index'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/iam-swagger'
import { CellContext } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

type Props = {
    ctx: CellContext<ConfigurationItemUi, unknown>
    onApprove: (uuid: string) => void
    onReject: (uuid: string) => void
}

export const ActionsUpdateOverRow = ({ ctx, onApprove, onReject }: Props) => {
    const { t } = useTranslation()

    return (
        <>
            <ButtonPopup
                key={ctx?.row?.index}
                popupPosition="right"
                buttonLabel={t('actionsInTable.moreActions')}
                popupContent={(closePopup) => {
                    return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <ButtonLink
                                type="button"
                                onClick={() => {
                                    onApprove(ctx?.row.original.metaAttributes?.owner || '')
                                    closePopup()
                                }}
                                label={t('publicAuthorities.massUpdate.actions.approve')}
                            />
                            <ButtonLink
                                type="button"
                                onClick={() => {
                                    onReject(ctx?.row.original.metaAttributes?.owner || '')
                                    closePopup()
                                }}
                                label={t('publicAuthorities.massUpdate.actions.reject')}
                            />
                        </div>
                    )
                }}
            />
        </>
    )
}
