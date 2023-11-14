import React from 'react'
import { ButtonLink, ButtonPopup } from '@isdd/idsk-ui-kit/index'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { CellContext } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { IActions } from '@/components/containers/Egov/Entity/PublicAuthoritiesListContainer'

type Props = {
    ctx: CellContext<ConfigurationItemUi, unknown>
}

export const MoreActionsOverRow = ({ ctx, setInvalid }: Props & IActions) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

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
                                    setInvalid?.(ctx?.row.original?.uuid, ctx?.row?.original?.attributes)
                                    closePopup()
                                }}
                                label={t('egov.detail.validityChange.setInvalid')}
                            />
                            <ButtonLink
                                type="button"
                                onClick={() => {
                                    navigate(`/organizations/${ctx?.row?.original?.uuid}/edit`, { state: { from: location } })
                                    closePopup()
                                }}
                                label={t('egov.edit')}
                            />
                            <ButtonLink
                                type="button"
                                onClick={() => {
                                    navigate(`/organizations/${ctx?.row?.original?.uuid}/assigned`, { state: { from: location } })
                                    closePopup()
                                }}
                                label={t('egov.assigned')}
                            />
                        </div>
                    )
                }}
            />
        </>
    )
}
