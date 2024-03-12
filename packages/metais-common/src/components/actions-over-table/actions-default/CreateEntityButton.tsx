import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@isdd/idsk-ui-kit/src/button/Button'

import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { IconLabel } from '@isdd/metais-common/components/actions-over-table/icon-label/IconLabel'
import { PlusIcon } from '@isdd/metais-common/assets/images'
export interface ICreateEntityButtonProps {
    onClick: () => void
    icon?: string
    label?: string
    ciTypeName?: string
}

export const CreateEntityButton: React.FC<ICreateEntityButtonProps> = ({ onClick, label, icon = PlusIcon, ciTypeName = '' }) => {
    const { t } = useTranslation()
    return (
        <Button
            className={(styles.mobileOrder1, 'marginBottom0')}
            onClick={onClick}
            label={<IconLabel icon={icon} label={label ?? t('actionOverTable.addItem', { ciTypeName })} />}
        />
    )
}
