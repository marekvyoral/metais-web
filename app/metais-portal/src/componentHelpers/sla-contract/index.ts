import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ApiSlaContractRead } from '@isdd/metais-common/api/generated/monitoring-swagger'

export const getSlaKeys = (slaContractData: ApiSlaContractRead) => {
    const slaKeys = Object.keys(slaContractData ?? {})?.reduce((acc, key) => {
        const typedKey = key as keyof ApiSlaContractRead
        acc[typedKey] = typedKey
        return acc
    }, {} as Record<keyof ApiSlaContractRead, keyof ApiSlaContractRead>)

    return slaKeys
}

export const findEnumValueByCode = (enumType: EnumType | undefined, itemCode: string | undefined) => {
    const value = enumType?.enumItems?.find((item) => item.code == itemCode)?.value
    return value
}
export const findEnumByCode = (enumTypes: (EnumType | undefined)[], itemCode: string | undefined) => {
    return enumTypes?.find((item) => item?.code == itemCode)
}
