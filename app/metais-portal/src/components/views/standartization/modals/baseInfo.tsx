import { Button, GridRow, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useFindByUuid3 } from '@isdd/metais-common/src/api/generated/iam-swagger'
import { useNavigate, useParams } from 'react-router-dom'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { useTranslation } from 'react-i18next'

import styles from '../styles.module.scss'

interface KSICSBaseInfoProps {
    isAdmin: boolean
}

const KSIVSBaseInfo: React.FC<KSICSBaseInfoProps> = ({ isAdmin }) => {
    const { id } = useParams()
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { data: infoData } = useFindByUuid3(id ?? '')

    return (
        <>
            <GridRow className={styles.row}>
                <TextHeading size="XL">{t('KSIVSPage.title')}</TextHeading>
                {isAdmin && <Button label={t('KSIVSPage.editItem')} onClick={() => navigate(NavigationSubRoutes.KOMISIA_NA_STANDARDIZACIU_EDIT)} />}
            </GridRow>
            <table>
                <tr>
                    <td>
                        <TextBody className={styles.boldText}>{t('KSIVSPage.shortName')}</TextBody>
                    </td>
                    <td>
                        <TextBody>{infoData?.shortName}</TextBody>
                    </td>
                </tr>
                <tr>
                    <td className={styles.verticalAlignBaseline}>
                        <TextBody className={styles.boldText}>{t('KSIVSPage.description')}</TextBody>
                    </td>
                    <td>
                        <TextBody>
                            <div dangerouslySetInnerHTML={{ __html: infoData?.description ?? '' }} />
                        </TextBody>
                    </td>
                </tr>
            </table>
        </>
    )
}

export default KSIVSBaseInfo
