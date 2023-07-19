import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { EnumType, EnumTypePreviewList } from '@isdd/metais-common/api'

import { generateSchemaForCreateAttribute } from '../../entity-detail-views/createViewHelpers'

interface iUseCreateAttribute {
    measureUnit?: EnumType | undefined
    allEnumsData?: EnumTypePreviewList | undefined
}

export const useCreateAttribute = ({ measureUnit, allEnumsData }: iUseCreateAttribute) => {
    const { t } = useTranslation()
    const formMethods = useForm({
        shouldUnregister: true,
        resolver: yupResolver(generateSchemaForCreateAttribute(t)),
    })

    const attributeTypes = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        { label: 'Integer', value: 'INTEGER' },
        { label: 'Long', value: 'LONG' },
        { label: 'Double', value: 'DOUBLE' },
        { label: 'String', value: 'STRING' },
        { label: 'Boolean', value: 'BOOLEAN' },
        { label: 'Date', value: 'DATE' },
    ]

    const measureUnits = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        ...(measureUnit?.enumItems?.map((enumItem) => ({
            label: [enumItem?.description, `(${enumItem?.value})`].join(' '),
            value: enumItem?.code ?? '',
        })) ?? []),
    ]

    const allEnumsSelectOptions = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        ...(allEnumsData?.results?.map((allEnumsEnumItem) => ({
            label: allEnumsEnumItem?.name ?? '',
            value: allEnumsEnumItem?.code ?? '',
        })) ?? []),
    ]

    const stringConstraints = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        { label: 'Interný čiselník', value: 'enum' },
        { label: 'Regularny vyraz', value: 'regex' },
        { label: 'Intervalove rozlozenie', value: 'interval' },
    ]

    const integerConstraints = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        { label: 'Intervalove rozlozenie', value: 'interval' },
    ]

    const selectedType = formMethods.watch('type') ?? ''
    const isSelectedTypeNumber = (newSelectedType: string) =>
        newSelectedType === 'INTEGER' || newSelectedType === 'LONG' || newSelectedType === 'DOUBLE'
    const showUnit = isSelectedTypeNumber(selectedType)
    const showConstaint = selectedType === 'INTEGER' || selectedType === 'STRING'
    const getTypeForDefaultValue = (newSelectedType: string) => {
        if (isSelectedTypeNumber(newSelectedType)) return 'number'
        else if (newSelectedType === 'DATE') return 'date'
    }

    const selectedConstraint = formMethods.watch('constraints.[0].type')
    return {
        formMethods,
        selectedConstraint,
        showConstaint,
        showUnit,
        integerConstraints,
        stringConstraints,
        allEnumsSelectOptions,
        measureUnits,
        attributeTypes,
        getTypeForDefaultValue,
        t,
        selectedType,
    }
}
