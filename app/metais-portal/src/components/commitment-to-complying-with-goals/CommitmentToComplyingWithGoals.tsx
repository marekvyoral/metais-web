import { CheckBox, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { ConfigurationItemUi, useStoreConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import React, { useEffect, useState } from 'react'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { useTranslation } from 'react-i18next'

import styles from './commitment.module.scss'

type Props = {
    ciItemData: ConfigurationItemUi | undefined
    isOwner: boolean
    isCiItemInvalidated: boolean
    hasSomeCheckedTableItem: boolean
}

export const CommitmentToComplyingWithGoals: React.FC<Props> = ({ ciItemData, isOwner, isCiItemInvalidated, hasSomeCheckedTableItem }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()

    const [checked, setChecked] = useState<boolean>(false)

    const hasCiData = !!ciItemData?.uuid
    const isLoggedIn = !!user?.uuid

    const hasRightsToEditCommitment = !hasCiData || !isLoggedIn || !isOwner || isCiItemInvalidated || !hasSomeCheckedTableItem
    const canOpenTooltip = !isLoggedIn || !isOwner || !hasSomeCheckedTableItem
    const tooltipMessage = !hasSomeCheckedTableItem ? t('Ciel.noCheckedItems') : t('Ciel.haveNoRights')

    useEffect(() => {
        setChecked(ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_KRIS_Zavazok_ciele_principy_stav])
    }, [ciItemData?.attributes])

    const storeCiItem = useStoreConfigurationItem()

    const handleCheckboxChange = (boolValue: boolean) => {
        setChecked(boolValue)

        const formattedAttForUpdate = Object.keys(ciItemData?.attributes ?? {}).map((key) => ({ name: key, value: ciItemData?.attributes?.[key] }))

        storeCiItem.mutateAsync({
            data: {
                type: ciItemData?.type,
                uuid: ciItemData?.uuid,
                attributes: [...formattedAttForUpdate, { name: ATTRIBUTE_NAME.Profil_KRIS_Zavazok_ciele_principy_stav, value: boolValue }],
            },
        })
    }

    return (
        <Tooltip
            descriptionElement={tooltipMessage}
            position={'center center'}
            disabled={!canOpenTooltip}
            tooltipContent={() => (
                <div className={styles.marginBottom}>
                    <TextHeading size="S">{t('Ciel.commitmentHeader')}</TextHeading>
                    <CheckBox
                        disabled={hasRightsToEditCommitment}
                        id="commitment"
                        label={t('Ciel.commitmentLabel')}
                        name="commitment"
                        onChange={(e) => handleCheckboxChange(e.target.checked)}
                        checked={checked}
                    />
                </div>
            )}
        />
    )
}