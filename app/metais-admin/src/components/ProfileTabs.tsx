import React from 'react'
import { Tab, Tabs } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'

interface IEntityList {
    tabList?: Tab[]
    withoutHeading?: boolean
}

export const ProfileTabs = ({ tabList, withoutHeading }: IEntityList) => {
    const { t } = useTranslation()
    return (
        <div>
            {!withoutHeading && <h3 className="govuk-heading-m">{t('egov.detail.profiles')}</h3>}
            {tabList && tabList?.length > 0 && <Tabs tabList={tabList} />}
        </div>
    )
}
