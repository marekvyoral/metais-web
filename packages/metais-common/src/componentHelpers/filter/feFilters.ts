import { FieldValues } from 'react-hook-form'

import { CiTypePreview } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'

export interface EntityFilterData extends IFilterParams, FieldValues {
    name?: string
    technicalName?: string
    type?: string
    valid?: string
}

enum KeysToCompare {
    TECHNICAL_NAME = 'technicalName',
    NAME = 'name',
}

export const DIACRITICS = {
    a: '[aÀÁÂÃÄÅàáâãäå]',
    c: '[cÇçćĆčČ]',
    d: '[dđĐďĎ]',
    e: '[eÈÉÊËèéêëěĚ]',
    i: '[iÌÍÎÏìíîï]',
    l: '[ĺľĹĽ]',
    n: '[nÑñňŇ]',
    o: '[oÒÓÔÕÕÖØòóôõöø]',
    r: '[rřŘŕŔ]',
    s: '[sŠš]',
    t: '[tťŤ]',
    u: '[uÙÚÛÜùúûüůŮ]',
    y: '[yŸÿýÝ]',
    z: '[zŽž]',
}

const escape_regex = (str: string) => {
    return (str + '').replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')
}

export const latiniseString = (str: string) => {
    let escapedText = escape_regex(str).toLowerCase()

    const dialectValues = Object.entries(DIACRITICS)

    dialectValues?.map(([key, value]) => {
        escapedText = escapedText.replace(new RegExp(value, 'g'), key)
    })
    return escapedText
}

const compareStrings = (data: CiTypePreview[] | undefined, valueToFind: string, keyToCompare: KeysToCompare) => {
    const latinizedValueToFind = latiniseString(valueToFind)

    return (
        data?.filter((value) => {
            const latinisedDataName = latiniseString(value?.[keyToCompare] ?? '')
            return latinisedDataName?.includes(latinizedValueToFind)
        }) ?? []
    )
}

const fromStringToBoolean = (val: string) => (val == 'false' || val === '' ? false : true)

export const filterEntityData = (filter: EntityFilterData, data: CiTypePreview[] | undefined) => {
    let newData = [...(data ?? [])]
    if (filter?.name) {
        newData = compareStrings(newData, filter?.name, KeysToCompare.NAME)
    }
    if (filter?.fullTextSearch) {
        newData = compareStrings(newData, filter?.fullTextSearch, KeysToCompare.NAME)
    }
    if (filter?.technicalName) {
        newData = compareStrings(newData, filter?.technicalName, KeysToCompare.TECHNICAL_NAME)
    }
    if (filter?.type) {
        newData = newData?.filter((val) => val?.type === filter?.type)
    }
    if (filter?.valid) {
        const validToBoolean = fromStringToBoolean(filter?.valid)
        newData = newData?.filter((val) => val?.valid === validToBoolean)
    }
    return newData
}
