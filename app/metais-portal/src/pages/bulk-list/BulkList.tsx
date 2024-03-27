import { ATTRIBUTE_NAME, QueryFeedback } from '@isdd/metais-common/index'
import { AccordionContainer, BreadCrumbs, HomeIcon, IAccordionSection, TextHeading } from '@isdd/idsk-ui-kit/index'
import { formatTitleString } from '@isdd/metais-common/utils/utils'
import { useTranslation } from 'react-i18next'
import { useReadCiList1 } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useLocation } from 'react-router-dom'
import { BULK_ACTION_ITEM_SEARCH_KEY, BULK_ACTION_ITEM_SEPARATOR } from '@isdd/metais-common/constants'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { BulkListSection } from '@/components/views/bulkList/BulkListSection'

export const BulkListPage = () => {
    const { t } = useTranslation()
    const location = useLocation()
    document.title = formatTitleString(t('bulkList.title'))

    const bulkItemsUuidList = new URLSearchParams(location.search).get(BULK_ACTION_ITEM_SEARCH_KEY)?.split(BULK_ACTION_ITEM_SEPARATOR)

    const { data, isLoading, isError } = useReadCiList1({
        filter: {
            uuid: bulkItemsUuidList,
        },
    })

    const sections: IAccordionSection[] =
        data?.configurationItemSet?.map((section) => {
            return (
                {
                    title: section?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? '',
                    content: <BulkListSection uuid={section?.uuid ?? ''} />,
                } ?? {}
            )
        }) ?? []

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('bulkList.title'), href: '#' },
                ]}
            />
            <MainContentWrapper>
                <QueryFeedback loading={isLoading} error={isError} withChildren>
                    <TextHeading size="XL">{t('bulkList.title')}</TextHeading>
                    <AccordionContainer sections={sections} sectionsHeadingSize="L" />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
