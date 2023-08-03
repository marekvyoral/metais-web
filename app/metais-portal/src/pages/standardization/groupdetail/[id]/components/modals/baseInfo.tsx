import { Button, GridRow, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useFindByUuid3 } from '@isdd/metais-common/src/api/generated/iam-swagger'
import { useNavigate, useParams } from 'react-router-dom'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'

import styles from '../../styles.module.scss'

const KSIVSBaseInfo = () => {
    const { id } = useParams()
    // const { t } = useTranslation()
    const navigate = useNavigate()

    const { data: infoData } = useFindByUuid3(id ?? '')

    return (
        <>
            <GridRow className={styles.row}>
                <TextHeading size="XL">Komisia pre štandardizáciu ITVS</TextHeading>
                <Button label="Upraviť položku" onClick={() => navigate(NavigationSubRoutes.KOMISIA_NA_STANDARDIZACIU + '/edit')} />
            </GridRow>
            <table>
                <tr>
                    <td>
                        <TextBody className={styles.boldText}>Skratka názvu:</TextBody>
                    </td>
                    <td>
                        <TextBody>{infoData?.shortName}</TextBody>
                    </td>
                </tr>
                <tr>
                    <td style={{ verticalAlign: 'baseline' }}>
                        <TextBody className={styles.boldText}>Popis:</TextBody>
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
