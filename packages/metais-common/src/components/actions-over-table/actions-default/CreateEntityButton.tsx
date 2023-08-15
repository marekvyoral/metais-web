import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@isdd/idsk-ui-kit/src/button/Button'

import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { IconLabel } from '@isdd/metais-common/components/actions-over-table/icon-label/IconLabel'
import { PlusIcon } from '@isdd/metais-common/assets/images'
export interface ICreateEntityButtonProps {
    path: string
    icon?: string
    label?: string
}

export const CreateEntityButton: React.FC<ICreateEntityButtonProps> = ({ path, label, icon = PlusIcon }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    return (
        <Button
            className={(styles.mobileOrder1, 'marginBottom0')}
            onClick={() => {
                navigate(path)
            }}
            label={<IconLabel label={label ?? t('actionOverTable.addISVSitem')} icon={icon} />}
        />
    )
}
