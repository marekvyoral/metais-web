import { useTranslation } from 'react-i18next'
import { EnumType, EnumTypePreviewList } from '@isdd/metais-common/api'
import { AttributeAttributeTypeEnum } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { IOption } from '@isdd/idsk-ui-kit'

interface iUseCreateAttribute {
    measureUnit?: EnumType | undefined
    allEnumsData?: EnumTypePreviewList | undefined
}

interface iUseCreateAttributeOutput {
    attributeTypes: IOption[]
    measureUnits: IOption[]
    allEnumsSelectOptions: IOption[]
    stringConstraints: IOption[]
    integerConstraints: IOption[]
}

export enum StringConstraints {
    ENUM = 'enum',
    REGEX = 'regex',
    INTERVAL = 'interval',
    CI_TYPE = 'ciType',
}

export enum IntegerConstraints {
    INTERVAL = 'interval',
}

export const useCreateAttributeSelectOptions = ({ measureUnit, allEnumsData }: iUseCreateAttribute): iUseCreateAttributeOutput => {
    const { t } = useTranslation()

    const attributeTypes: IOption[] = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        { label: t('egov.create.integer'), value: AttributeAttributeTypeEnum.INTEGER },
        { label: t('egov.create.long'), value: AttributeAttributeTypeEnum.LONG },
        { label: t('egov.create.double'), value: AttributeAttributeTypeEnum.DOUBLE },
        { label: t('egov.create.string'), value: AttributeAttributeTypeEnum.STRING },
        { label: t('egov.create.boolean'), value: AttributeAttributeTypeEnum.BOOLEAN },
        { label: t('egov.create.date'), value: AttributeAttributeTypeEnum.DATE },
    ]

    const measureUnits: IOption[] = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        ...(measureUnit?.enumItems?.map((enumItem) => ({
            label: [enumItem?.description, `(${enumItem?.value})`].join(' '),
            value: enumItem?.code ?? '',
        })) ?? []),
    ]

    const allEnumsSelectOptions: IOption[] = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        ...(allEnumsData?.results?.map((allEnumsEnumItem) => ({
            label: allEnumsEnumItem?.name ?? '',
            value: allEnumsEnumItem?.code ?? '',
        })) ?? []),
    ]

    const stringConstraints: IOption[] = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        { label: t('egov.create.enum'), value: StringConstraints.ENUM },
        { label: t('egov.create.regex'), value: StringConstraints.REGEX },
        { label: t('egov.create.interval'), value: StringConstraints.INTERVAL },
        { label: t('egov.create.ciType'), value: StringConstraints.CI_TYPE },
    ]

    const integerConstraints: IOption[] = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        { label: t('egov.create.interval'), value: IntegerConstraints.INTERVAL },
    ]

    return {
        integerConstraints,
        stringConstraints,
        allEnumsSelectOptions,
        measureUnits,
        attributeTypes,
    }
}
