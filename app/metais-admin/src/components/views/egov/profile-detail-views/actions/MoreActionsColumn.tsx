import React from 'react'
import { Button, ButtonPopup } from '@isdd/idsk-ui-kit'
import { CellContext } from '@tanstack/react-table'
import { Attribute } from '@isdd/metais-common/api'
import { TFunction } from 'i18next'

interface iMoreActionsColumn {
    ctx: CellContext<Attribute, unknown>
    t: TFunction<'translation', undefined, 'translation'>
    editRow: (rowIndex: number) => void
    setValidityOfAttributeProfile?: (attributeTechnicalName?: string, oldAttributeValidity?: boolean) => void
    setVisibilityOfAttributeProfile?: (attributeTechnicalName?: string, oldAttributeVisibility?: boolean) => void
}

export const MoreActionsColumn = ({ ctx, t, setValidityOfAttributeProfile, setVisibilityOfAttributeProfile, editRow }: iMoreActionsColumn) => {
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
                                    setValidityOfAttributeProfile?.(ctx?.row?.original?.technicalName, ctx?.row?.original?.valid)
                                    closePopup()
                                }}
                                label={
                                    ctx?.row?.original?.valid ? t('egov.detail.validityChange.setInvalid') : t('egov.detail.validityChange.setValid')
                                }
                            />
                            <Button
                                onClick={() => {
                                    setVisibilityOfAttributeProfile?.(ctx?.row?.original?.technicalName, ctx?.row?.original?.invisible)
                                    closePopup()
                                }}
                                label={
                                    ctx?.row?.original?.invisible
                                        ? t('egov.detail.visibilityChange.setVisible')
                                        : t('egov.detail.visibilityChange.setInvisible')
                                }
                            />
                        </div>
                    )
                }}
            />

            <Button onClick={() => editRow(ctx?.row?.index)} label={t('actionsInTable.edit')} />
        </>
    )
}