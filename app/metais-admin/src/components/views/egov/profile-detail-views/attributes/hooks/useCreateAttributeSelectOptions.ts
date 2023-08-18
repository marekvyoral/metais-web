import { useTranslation } from 'react-i18next'
import { EnumType, EnumTypePreviewList } from '@isdd/metais-common/api'
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

export const useCreateAttributeSelectOptions = ({ measureUnit, allEnumsData }: iUseCreateAttribute): iUseCreateAttributeOutput => {
    const { t } = useTranslation()

    const attributeTypes: IOption[] = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        { label: 'Integer', value: 'INTEGER' },
        { label: 'Long', value: 'LONG' },
        { label: 'Double', value: 'DOUBLE' },
        { label: 'String', value: 'STRING' },
        { label: 'Boolean', value: 'BOOLEAN' },
        { label: 'Date', value: 'DATE' },
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
        { label: 'Interný čiselník', value: 'enum' },
        { label: 'Regularny vyraz', value: 'regex' },
        { label: 'Intervalove rozlozenie', value: 'interval' },
    ]

    const integerConstraints: IOption[] = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        { label: 'Intervalove rozlozenie', value: 'interval' },
    ]

    return {
        integerConstraints,
        stringConstraints,
        allEnumsSelectOptions,
        measureUnits,
        attributeTypes,
    }
}
