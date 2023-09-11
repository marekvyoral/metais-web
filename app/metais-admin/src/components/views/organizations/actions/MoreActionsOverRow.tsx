import React from 'react'
import { Button, ButtonPopup } from '@isdd/idsk-ui-kit/index'
import { ConfigurationItemUi } from '@isdd/metais-common/api'
import { CellContext } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { IActions } from '@/components/containers/Egov/Entity/OrganizationsListContainer'

type Props = {
    ctx: CellContext<ConfigurationItemUi, unknown>
}

export const MoreActionsOverRow = ({ ctx, setInvalid }: Props & IActions) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <>
            <ButtonPopup
                popupPosition="right"
                buttonLabel={t('actionsInTable.moreActions')}
                popupContent={(closePopup) => {
                    return (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Button
                                onClick={() => {
                                    setInvalid?.(ctx?.row.original?.uuid, ctx?.row?.original?.attributes)
                                    closePopup()
                                }}
                                label={t('egov.detail.validityChange.setInvalid')}
                            />
                            <Button
                                onClick={() => {
                                    navigate(`/organizations/${ctx?.row?.original?.uuid}/edit`, { state: { from: location } })
                                    closePopup()
                                }}
                                label={t('egov.edit')}
                            />
                            <Button
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
