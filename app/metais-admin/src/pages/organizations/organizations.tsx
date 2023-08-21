import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'

import { OraganizationsListContainer } from '@/components/containers/Egov/Entity/OrganizationsListContainer'
import { OrganizationsTable } from '@/components/table/OrganizationsTable'
import OrganizationFilter from '@/components/filters/OrganizationFilter'

export interface KSFilterData extends IFilterParams {
    Gen_Profil_nazov?: string
    EA_Profil_PO_typ_osoby?: string[]
    EA_Profil_PO_ico?: string
}

const Organizations = () => {
    const entityName = 'PO'
    const defaultFilterValues: KSFilterData = { Gen_Profil_nazov: '', EA_Profil_PO_typ_osoby: [], EA_Profil_PO_ico: '' }
    const { t } = useTranslation()
    return (
        <OraganizationsListContainer<KSFilterData>
            entityName={entityName}
            defaultFilterValues={defaultFilterValues}
            ListComponent={({
                data: { tableData },
                handleFilterChange,
                storeUserSelectedColumns,
                resetUserSelectedColumns,
                pagination,
                sort,
                isError,
                isLoading,
                setInvalid,
            }) => (
                <>
                    <TextHeading size="XL">{t('navMenu.organizations')}</TextHeading>
                    <OrganizationFilter defaultFilterValues={defaultFilterValues} />
                    <OrganizationsTable
                        data={tableData}
                        handleFilterChange={handleFilterChange}
                        storeUserSelectedColumns={storeUserSelectedColumns}
                        resetUserSelectedColumns={resetUserSelectedColumns}
                        pagination={pagination}
                        sort={sort}
                        isLoading={isLoading}
                        error={isError}
                        setInvalid={setInvalid}
                    />
                </>
            )}
        />
    )
}

export default Organizations
