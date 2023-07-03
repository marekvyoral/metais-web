import React from 'react'
import { useTranslation } from 'react-i18next'
import { InformationGridRow } from '@isdd/metais-common/src/components/info-grid-row/InformationGridRow'
import { CiType, EnumType } from '@isdd/metais-common/api'

import styles from './basicInformationSection.module.scss'
import ColorRow from './ColorRow'

interface ProjectInformationData {
    data: {
        ciTypeData: CiType | undefined
        constraintsData: (EnumType | undefined)[]
        unitsData?: EnumType | undefined
    }
}

const BasicInformations = ({ data: { ciTypeData } }: ProjectInformationData) => {
    const { t } = useTranslation()
    return (
        <div className={styles.attributeGridRowBox}>
            <InformationGridRow key={'name'} label={t('egov.name')} value={ciTypeData?.name} />
            <InformationGridRow key={'engName'} label={t('egov.engName')} value={ciTypeData?.engName} />
            <InformationGridRow key={'technicalName'} label={t('egov.technicalName')} value={ciTypeData?.technicalName} />
            <InformationGridRow key={'codePrefix'} label={t('egov.codePrefix')} value={ciTypeData?.codePrefix} />
            <InformationGridRow key={'uriPrefix'} label={t('egov.uriPrefix')} value={ciTypeData?.uriPrefix} />
            <InformationGridRow key={'type'} label={t('egov.type')} value={t(`type.${ciTypeData?.type}`)} />
            <InformationGridRow key={'valid'} label={t('egov.valid')} value={t(`state.${ciTypeData?.valid}`)} />
            <InformationGridRow key={'description'} label={t('egov.description')} value={ciTypeData?.description} />
            {ciTypeData?.color && <InformationGridRow key={'color'} label={t('egov.color')} value={<ColorRow color={ciTypeData?.color} />} />}
            <InformationGridRow key={'roles'} label={t('egov.roles')} value={ciTypeData?.roleList} />
        </div>
    )
}

export default BasicInformations
