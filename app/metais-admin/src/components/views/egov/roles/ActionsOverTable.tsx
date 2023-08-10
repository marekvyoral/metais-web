import { Button, ButtonGroupRow, SimpleSelect, TextBody } from '@isdd/idsk-ui-kit'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/components/constants'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import styles from './roles.module.scss'

import { Pagination } from '@/pages/egov/roles'

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
                options={DEFAULT_PAGESIZE_OPTIONS}
            />
            <TextBody className={styles.marginLeftAuto}>{t('adminRolesPage.entities')}</TextBody>
        </ButtonGroupRow>
    )
}

export default RolesTableActions
