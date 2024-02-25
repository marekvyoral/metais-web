import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { AttributeProfile, CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { InformationGridRow } from '@isdd/metais-common/src/components/info-grid-row/InformationGridRow'
import { useTranslation } from 'react-i18next'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { FindAll11200 } from '@isdd/metais-common/api/generated/iam-swagger'
import { EntityColorEnumTranslateKeys } from '@isdd/metais-common'

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

export const BasicInformation = ({ data: { ciTypeData }, roles }: ProjectInformationData) => {
    const { t } = useTranslation()
    const colorKey = Object.keys(EntityColorEnumTranslateKeys).indexOf(ciTypeData?.color ?? '')

    return (
        <DefinitionList>
            <InformationGridRow key={'name'} label={t('egov.name')} value={ciTypeData?.name} hideIcon />
            {ciTypeData?.engName && <InformationGridRow key={'engName'} label={t('egov.engName')} value={ciTypeData?.engName} hideIcon />}
            <InformationGridRow key={'technicalName'} label={t('egov.technicalName')} value={ciTypeData?.technicalName} hideIcon />
            {ciTypeData?.codePrefix && <InformationGridRow key={'codePrefix'} label={t('egov.codePrefix')} value={ciTypeData?.codePrefix} hideIcon />}
            {ciTypeData?.uriPrefix && <InformationGridRow key={'uriPrefix'} label={t('egov.uriPrefix')} value={ciTypeData?.uriPrefix} hideIcon />}
            <InformationGridRow key={'type'} label={t('egov.type')} value={ciTypeData?.type ? t(`tooltips.type.${ciTypeData.type}`) : ''} hideIcon />
            <InformationGridRow key={'valid'} label={t('egov.valid')} value={t(`validity.${ciTypeData?.valid}`)} hideIcon />
            <InformationGridRow key={'description'} label={t('egov.description')} value={ciTypeData?.description} hideIcon />
            {ciTypeData?.engDescription && (
                <InformationGridRow key={'engDescription'} label={t('egov.engDescription')} value={ciTypeData?.engDescription} hideIcon />
            )}
            {ciTypeData?.color && (
                <InformationGridRow
                    key={'color'}
                    label={t('egov.color')}
                    value={
                        <ColorRow
                            color={ciTypeData?.color}
                            label={t(`egov.colorSelect.${Object.values(EntityColorEnumTranslateKeys)[colorKey]}`, '')}
                        />
                    }
                    hideIcon
                />
            )}
            {Array.isArray(roles) ? (
                ciTypeData?.roleList?.map((role, index) => (
                    <InformationGridRow
                        key={'roles' + index}
                        label={index == 0 ? t('egov.roles') : ''}
                        hideIcon
                        value={<>{roles.find((r) => r.name == role)?.description}</>}
                    />
                ))
            ) : (
                <InformationGridRow key={'roles'} label={t('egov.roles')} value={<>{roles?.description}</>} hideIcon />
            )}
        </DefinitionList>
    )
}
