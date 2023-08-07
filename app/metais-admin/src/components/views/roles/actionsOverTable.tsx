import { Button, ButtonGroupRow, SimpleSelect, TextBody } from '@isdd/idsk-ui-kit'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import styles from './roles.module.scss'

import { Pagination } from '@/pages/roles'

interface RoleTableActionsProps {
    pagination: Pagination
    setPagination: React.Dispatch<React.SetStateAction<Pagination>>
}

const RolesTableActions: React.FC<RoleTableActionsProps> = ({ pagination, setPagination }) => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    return (
        <ButtonGroupRow className={styles.flexEnd}>
            <Button label={t('adminRolesPage.addNewRole')} onClick={() => navigate(AdminRouteNames.ROLE_NEW)} />
            <TextBody className={styles.marginLeftAuto}>{t('adminRolesPage.show')}</TextBody>
            <SimpleSelect
                onChange={(label) => {
                    setPagination({ ...pagination, pageSize: Number(label.target.value) })
                }}
                id="select"
                label=""
                options={[
                    { label: '10', value: '10' },
                    { label: '20', value: '20' },
                    { label: '50', value: '50' },
                    { label: '100', value: '100' },
                ]}
            />
            <TextBody className={styles.marginLeftAuto}>{t('adminRolesPage.entities')}</TextBody>
        </ButtonGroupRow>
    )
}

export default RolesTableActions
