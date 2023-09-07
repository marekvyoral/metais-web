import { Button, Tabs, TextBody } from '@isdd/idsk-ui-kit'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { IEkoDetailView } from '@/components/views/eko/ekoCodes'
import styles from '@/components/views/eko/ekoView.module.scss'

export const EkoDetailView = ({ data }: IEkoDetailView) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    return (
        <>
            <div>
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
                <Tabs
                    tabList={[
                        {
                            id: '1',
                            title: t('eko.tabTitle'),
                            content: (
                                <>
                                    <div>
                                        <InformationGridRow key={'name'} label={t('eko.detailName')} value={data?.name} hideIcon />
                                    </div>
                                    <div>
                                        <InformationGridRow key={'ekoCode'} label={t('eko.ekoCode')} value={data?.ekoCode} hideIcon />
                                    </div>
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
        </>
    )
}
