import { Button } from '@isdd/idsk-ui-kit/src/button/Button'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { PlusIcon } from '@isdd/metais-common/assets/images'
import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { IconLabel } from '@isdd/metais-common/components/actions-over-table/icon-label/IconLabel'
export interface ICreateReportButtonProps {
    path: string
    icon?: string
    label?: string
}

export const CreateReportButton: React.FC<ICreateReportButtonProps> = ({ path, label, icon = PlusIcon }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    return (
        <Button
            className={(styles.mobileOrder1, 'marginBottom0')}
            onClick={() => {
                navigate(path)
            }}
            label={<IconLabel label={label ?? t('report.newReport')} icon={icon} />}
        />
    )
}
