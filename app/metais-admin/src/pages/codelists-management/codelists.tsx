import { Filter, Input, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'

import { CodelistsFeedback } from '@/components/codelists/CodelistsFeedback'
import { CodelistsTable } from '@/components/codelists/codelistsTable/CodelistsTable'
import { CodelistContainer, CodelistFilterInputs } from '@/components/containers/Codelist/CodelistContainer'

const Codelists = () => {
    const { t } = useTranslation()
    const defaultFilterValues = {
        [CodelistFilterInputs.NAME]: '',
        [CodelistFilterInputs.VALUE]: '',
        [CodelistFilterInputs.VALUE_DESCRIPTION]: '',
    }
    return (
        <CodelistContainer
            defaults={defaultFilterValues}
            View={({ filteredData, mutations, isError, isLoading }) => {
                return (
                    <>
                        <CodelistsFeedback mutations={mutations} isFetchError={isError} isFetchLoading={isLoading} />
                        <TextHeading size="L">{t('codelists.heading')}</TextHeading>
                        <Filter
                            defaultFilterValues={defaultFilterValues}
                            form={({ register }) => (
                                <div>
                                    <Input label={t('codelists.name')} id={CodelistFilterInputs.NAME} {...register(CodelistFilterInputs.NAME)} />
                                    <Input label={t('codelists.value')} id={CodelistFilterInputs.VALUE} {...register(CodelistFilterInputs.VALUE)} />
                                    <Input
                                        label={t('codelists.valueDescription')}
                                        id={CodelistFilterInputs.VALUE_DESCRIPTION}
                                        {...register(CodelistFilterInputs.VALUE_DESCRIPTION)}
                                    />
                                </div>
                            )}
                        />
                        {filteredData.results && (
                            <CodelistsTable filteredData={filteredData} mutations={mutations} isLoading={isLoading} isError={isError} />
                        )}
                    </>
                )
            }}
        />
    )
}

export default Codelists
