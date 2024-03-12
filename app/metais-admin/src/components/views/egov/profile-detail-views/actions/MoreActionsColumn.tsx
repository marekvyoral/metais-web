import React from 'react'
import { ButtonLink, ButtonPopup } from '@isdd/idsk-ui-kit'
import { CellContext } from '@tanstack/react-table'
import { Attribute, AttributeProfile, AttributeProfileType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { TFunction } from 'i18next'

import styles from './moreActionsColumn.module.scss'

interface iMoreActionsColumn {
    ctx: CellContext<Attribute, unknown>
    t: TFunction<'translation', undefined, 'translation'>
    editRow: (rowIndex: number) => void
    setValidityOfAttributeProfile?: (attributeTechnicalName?: string, oldAttributeValidity?: boolean) => void
    setVisibilityOfAttributeProfile?: (attributeTechnicalName?: string, oldAttributeVisibility?: boolean) => void
    profile?: AttributeProfile
}

export const MoreActionsColumn = ({
    ctx,
    t,
    setValidityOfAttributeProfile,
    setVisibilityOfAttributeProfile,
    editRow,
    profile,
}: iMoreActionsColumn) => {
    return (
        <>
            <ButtonPopup
                popupPosition="right"
                buttonLabel={t('actionsInTable.moreActions')}
                popupContent={(closePopup) => {
                    return (
                        <div className={styles.actions}>
                            <ButtonLink onClick={() => editRow(ctx?.row?.original.id ?? 0)} label={t('actionsInTable.edit')} />
                            {profile?.type === AttributeProfileType.application && (
                                <ButtonLink
                                    onClick={() => {
                                        setValidityOfAttributeProfile?.(ctx?.row?.original?.technicalName, ctx?.row?.original?.valid)
                                        closePopup()
                                    }}
                                    label={
                                        ctx?.row?.original?.valid
                                            ? t('egov.detail.validityChange.setInvalid')
                                            : t('egov.detail.validityChange.setValid')
                                    }
                                />
                            )}
                            <ButtonLink
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
        </>
    )
}
