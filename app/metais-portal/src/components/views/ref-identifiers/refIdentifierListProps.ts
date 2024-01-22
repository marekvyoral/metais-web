import { ColumnDef } from '@tanstack/react-table'
import { TFunction } from 'i18next'
import { ATTRIBUTE_NAME, RefIdentifierTypeEnum } from '@isdd/metais-common/api'
import { IOption } from '@isdd/idsk-ui-kit/index'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Languages } from '@isdd/metais-common/localization/languages'

import { ColumnsOutputDefinition } from '@/componentHelpers/ci/ciTableHelpers'

export enum RefIdentifierListShowEnum {
    ALL = 'all',
    ONLY_MY = 'onlyMy',
}

export const refIdentifierTypeOptions = (t: TFunction): IOption<string>[] => {
    return [
        { value: RefIdentifierTypeEnum.DatovyPrvok, label: t(`refIdentifiers.type.${RefIdentifierTypeEnum.DatovyPrvok}`) },
        { value: RefIdentifierTypeEnum.URIDataset, label: t(`refIdentifiers.type.${RefIdentifierTypeEnum.URIDataset}`) },
        { value: RefIdentifierTypeEnum.URIKatalog, label: t(`refIdentifiers.type.${RefIdentifierTypeEnum.URIKatalog}`) },
        { value: RefIdentifierTypeEnum.Individuum, label: t(`refIdentifiers.type.${RefIdentifierTypeEnum.Individuum}`) },
    ]
}

export const refIdentifierStateOptions = (enumData: EnumType | undefined, language: string): IOption<string>[] => {
    return (
        enumData?.enumItems?.map((item) => ({ value: item.code ?? '', label: (language == Languages.SLOVAK ? item.value : item.engValue) ?? '' })) ||
        []
    )
}

export const refIdentifierViewOptions = (t: TFunction): IOption<string>[] => {
    return [
        { value: RefIdentifierListShowEnum.ALL, label: t(`refIdentifiers.filter.all`) },
        { value: RefIdentifierListShowEnum.ONLY_MY, label: t(`refIdentifiers.filter.onlyMy`) },
    ]
}

export const refIdentifierColumns = (t: TFunction, language: string, stateEnum: EnumType | undefined): Array<ColumnDef<ColumnsOutputDefinition>> => [
    {
        id: 'technicalName',
        header: t('refIdentifiers.table.name'),
        accessorFn: (row) => row.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
        enableSorting: true,
        meta: {
            getCellContext: (ctx) => ctx.getValue(),
        },
        cell: (ctx) => ctx.getValue(),
    },
    {
        id: 'uri',
        header: t('refIdentifiers.table.uri'),
        accessorFn: (row) => {
            if (row.type === RefIdentifierTypeEnum.DatovyPrvok) return row.attributes?.[ATTRIBUTE_NAME.Gen_Profil_ref_id]
            if (row.type === RefIdentifierTypeEnum.Individuum) return row.attributes?.[ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri]
            if (row.type === RefIdentifierTypeEnum.URIDataset) return row.attributes?.[ATTRIBUTE_NAME.Profil_URIDataset_uri_datasetu]
            if (row.type === RefIdentifierTypeEnum.URIKatalog) return row.attributes?.[ATTRIBUTE_NAME.Profil_URIKatalog_uri]
        },
        enableSorting: true,
        meta: {
            getCellContext: (ctx) => ctx.getValue(),
        },
        cell: (ctx) => ctx.getValue(),
    },
    {
        id: 'type',
        header: t('refIdentifiers.table.type'),
        accessorFn: (row) => row.type,
        enableSorting: true,
        meta: {
            getCellContext: (ctx) => ctx.getValue(),
        },
        cell: (ctx) => ctx.getValue(),
    },
    {
        id: 'state',
        header: t('refIdentifiers.table.state'),
        accessorFn: (row) => row.attributes?.[ATTRIBUTE_NAME.Gen_Profil_RefID_stav_registracie],
        enableSorting: true,
        meta: {
            getCellContext: (ctx) => ctx.getValue(),
        },
        cell: (ctx) => {
            if (!ctx.getValue()) return ''
            const enumItem = stateEnum?.enumItems?.find((item) => item.code === ctx.getValue())
            if (!enumItem) return ''
            return language == Languages.SLOVAK ? enumItem.value ?? '' : enumItem.engValue ?? ''
        },
    },
]
