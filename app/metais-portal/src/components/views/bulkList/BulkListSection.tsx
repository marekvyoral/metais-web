import { TextHeading, TextBody } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { useReadNeighboursConfigurationItems } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { QueryFeedback } from '@isdd/metais-common/index'
import { useTranslation } from 'react-i18next'

type BulkListSectionProps = {
    uuid: string
}

export const BulkListSection: React.FC<BulkListSectionProps> = ({ uuid }) => {
    const { t } = useTranslation()
    const { data, isLoading, isError } = useReadNeighboursConfigurationItems(uuid)

    return (
        <QueryFeedback loading={isLoading} error={isError} errorProps={{ errorMessage: t('bulkList.errorRels') }}>
            {data?.fromCiSet && data.fromCiSet.length > 0 && (
                <>
                    <TextHeading size="M">{t('bulkList.fromCiSet')}</TextHeading>
                    <ul>
                        {data?.fromCiSet?.map((i) => (
                            <li key={i.uuid}>
                                <TextBody>
                                    {i.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ??
                                        i.attributes?.find((att: { name: string; value: string }) => att?.name === ATTRIBUTE_NAME.Gen_Profil_nazov)
                                            ?.value}
                                </TextBody>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {data?.toCiSet && data.toCiSet.length > 0 && (
                <>
                    <TextHeading size="M">{t('bulkList.toCiSet')}</TextHeading>
                    <ul>
                        {data?.toCiSet?.map((i) => (
                            <li key={i.uuid}>
                                <TextBody>
                                    {i.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ??
                                        i.attributes?.find((att: { name: string; value: string }) => att?.name === ATTRIBUTE_NAME.Gen_Profil_nazov)
                                            ?.value}
                                </TextBody>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </QueryFeedback>
    )
}
