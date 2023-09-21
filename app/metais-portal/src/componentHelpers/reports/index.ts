import { IOption } from '@isdd/idsk-ui-kit/index'
import { BASE_PAGE_SIZE, CiListFilterContainerUi, ConfigurationItemSetUi, EnumType, Parameter, ParameterType } from '@isdd/metais-common/api'
import { mapReportsCiItemToOptions } from '@isdd/metais-common/componentHelpers'
import { addMethod, boolean, object, string } from 'yup'
import { TFunction } from 'i18next'

export const getDefaultValueForKey = (key?: string, parameters?: Parameter[]) => {
    return parameters?.find((parameter) => parameter.key === key)?.defaultValue
}

export const loadEnumsRepoOptions = (filterData: (EnumType | undefined)[], code?: string): IOption[] => {
    const enumtItems = filterData.find((fD) => fD?.code === code)?.enumItems
    const selectOptions = enumtItems?.map((eI) => {
        return { value: eI.code ?? '', label: eI.description ?? '' }
    })
    return [...(selectOptions ?? [])]
}

export const loadEnumerateOptions = (enumsString?: string): IOption[] => {
    const selectOptions = enumsString
        ?.split(';')
        .filter(Boolean)
        .map((enumOption) => {
            return { value: enumOption, label: enumOption }
        })

    return [...(selectOptions ?? [])]
}

export const loadEnumsCiOptions = async (
    searchQuery: string,
    additional: { page: number } | undefined,
    type: string,
    readCiList1: (ciListFilterContainerUi: CiListFilterContainerUi) => Promise<ConfigurationItemSetUi>,
    showInvalidated: boolean,
) => {
    const page = !additional?.page ? 1 : (additional?.page || 0) + 1

    const metaAttributes = showInvalidated ? { state: ['DRAFT', 'APPROVED_BY_OWNER', 'INVALIDATED'] } : { state: ['DRAFT', 'APPROVED_BY_OWNER'] }
    const queryOptions = {
        filter: {
            type: [type ?? ''],
            metaAttributes,
            fullTextSearch: searchQuery,
        },
        page: page,
        perpage: BASE_PAGE_SIZE,
        sortBy: 'Gen_Profil_nazov',
        sortType: 'ASC',
    }

    const data = await readCiList1(queryOptions)
    const hasMore = page + 1 <= (data.pagination?.totalPages ?? 0)

    const options = mapReportsCiItemToOptions(data.configurationItemSet)
    return {
        options: options || [],
        hasMore: hasMore,
        additional: {
            page: page,
        },
    }
}

export const getReportsFilterParameterYupSchema = (
    t: TFunction<'translation', undefined, 'translation'>,
    parameterKeys?: (string | undefined)[],
    parameters?: Parameter[],
) => {
    addMethod(object, 'atLeastOneOf', function (list) {
        return this.test({
            name: 'atLeastOneOf',
            message: '${path} must have at least one of these keys: ${keys}',
            exclusive: true,
            params: { keys: list.join(', ') },
            test: (value) => value == null || list.some((f: string) => !!value[f]),
        })
    })

    if (parameterKeys) {
        const schema = Object.fromEntries(
            parameterKeys?.map((key) => {
                const type = parameters?.find((parameter) => parameter.key === key)?.type
                if (type === ParameterType.BOOLEAN) return [key, boolean().oneOf([true], t('validation.mustBeChecked'))]

                return [key, string().required(t('validation.required'))]
            }) ?? [],
        )
        return (
            object()
                ?.shape(schema)
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ?.atLeastOneOf([...(parameterKeys ?? [])])
        )
    }
}
