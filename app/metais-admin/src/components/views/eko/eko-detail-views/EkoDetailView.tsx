import { Button, Tabs, TextBody } from '@isdd/idsk-ui-kit'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'

import { IEkoDetailView } from '@/components/views/eko/ekoCodes'
import styles from '@/components/views/eko/ekoView.module.scss'

export const EkoDetailView = ({ data, isError, isLoading }: IEkoDetailView) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    return (
        <QueryFeedback loading={isLoading} error={false} withChildren>
            <div>
                <FlexColumnReverseWrapper>
                    <div className={styles.spaceBetween}>
                        <h2 className="govuk-heading-l">{data?.name}</h2>
                        <div>
                            <Button
                                label={t('eko.edit')}
                                onClick={() => {
                                    navigate('/eko/' + data?.ekoCode + '/edit')
                                }}
                            />
                        </div>
                    </div>
                    {isError && <QueryFeedback error loading={false} />}
                </FlexColumnReverseWrapper>
                <Tabs
                    tabList={[
                        {
                            id: '1',
                            title: t('eko.tabTitle'),
                            content: (
                                <>
                                    <DefinitionList>
                                        <InformationGridRow key={'name'} label={t('eko.detailName')} value={data?.name} hideIcon />

                                        <InformationGridRow key={'ekoCode'} label={t('eko.ekoCode')} value={data?.ekoCode} hideIcon />
                                    </DefinitionList>
                                </>
                            ),
                        },
                    ]}
                />
            </div>
            <div>
                <div className={styles.spaceBetween}>
                    <div>
                        <TextBody className="govuk-!-font-weight-bold">{t('eko.lastModifiedAt', { date: data?.metaData?.lastModifiedAt })}</TextBody>
                    </div>
                    <div>
                        <TextBody className="govuk-!-font-weight-bold">{t('eko.createdAt', { date: data?.metaData?.createdAt })}</TextBody>
                    </div>
                </div>
            </div>
        </QueryFeedback>
    )
}
