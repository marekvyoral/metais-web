import { EnumType } from '@isdd/metais-common/api'
import { AttributeProfile, CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { InformationGridRow } from '@isdd/metais-common/src/components/info-grid-row/InformationGridRow'
import { useTranslation } from 'react-i18next'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { FindAll11200 } from '@isdd/metais-common/api/generated/iam-swagger'

import { ColorRow } from './ColorRow'

interface ICiTypeData extends CiType, AttributeProfile {}

interface ProjectInformationData {
    roles?: FindAll11200
    data: {
        ciTypeData: ICiTypeData | undefined
        constraintsData: (EnumType | undefined)[]
        unitsData?: EnumType | undefined
    }
}

export const BasicInformations = ({ data: { ciTypeData }, roles }: ProjectInformationData) => {
    const { t } = useTranslation()
    return (
        <DefinitionList>
            <InformationGridRow key={'name'} label={t('egov.name')} value={ciTypeData?.name} />
            {ciTypeData?.engName && <InformationGridRow key={'engName'} label={t('egov.engName')} value={ciTypeData?.engName} />}
            <InformationGridRow key={'technicalName'} label={t('egov.technicalName')} value={ciTypeData?.technicalName} />
            {ciTypeData?.codePrefix && <InformationGridRow key={'codePrefix'} label={t('egov.codePrefix')} value={ciTypeData?.codePrefix} />}
            {ciTypeData?.uriPrefix && <InformationGridRow key={'uriPrefix'} label={t('egov.uriPrefix')} value={ciTypeData?.uriPrefix} />}
            <InformationGridRow key={'type'} label={t('egov.type')} value={t(`tooltips.type.${ciTypeData?.type}`)} />
            <InformationGridRow key={'valid'} label={t('egov.valid')} value={t(`validity.${ciTypeData?.valid}`)} />
            <InformationGridRow key={'description'} label={t('egov.description')} value={ciTypeData?.description} />
            {ciTypeData?.engDescription && (
                <InformationGridRow key={'engDescription'} label={t('egov.engDescription')} value={ciTypeData?.engDescription} />
            )}
            {ciTypeData?.color && <InformationGridRow key={'color'} label={t('egov.color')} value={<ColorRow color={ciTypeData?.color} />} />}
            {Array.isArray(roles) ? (
                ciTypeData?.roleList?.map((role, index) => (
                    <InformationGridRow
                        key={'roles' + index}
                        label={index == 0 ? t('egov.roles') : ''}
                        hideIcon={index != 0}
                        value={<>{roles.find((r) => r.name == role)?.description}</>}
                    />
                ))
            ) : (
                <InformationGridRow key={'roles'} label={t('egov.roles')} value={<>{roles?.description}</>} />
            )}
        </DefinitionList>
    )
}
