import { Attribute } from '@isdd/metais-common/api'
import { FieldErrors } from 'react-hook-form'

import { TableData } from '@/pages/standardization/groupdetail/[id]'

export const reduceTableDataToObjectWithUuid = <T extends { uuid?: string }>(array: T[]): Record<string, T> => {
    return array.reduce<Record<string, T>>((result, item) => {
        if (item.uuid) {
            result[item.uuid] = item
        }
        return result
    }, {})
}

export const isUserAdmin = (userRoles: string[] | undefined) => {
    return userRoles?.includes('STD_PSPRE') || userRoles?.includes('STD_PSPODP')
}

export const canUserSendEmails = (userRoles: string[] | undefined) => {
    //TODO: add check from membership api data
    return userRoles?.includes('STD_KSCLEN') || userRoles?.includes('STD_KOORDINATOR_AGENDY')
}

export const canUserEditRoles = (userRoles: string[] | undefined) => {
    return userRoles?.includes('STD_KSPODP') || userRoles?.includes('STD_KSPRE') || userRoles?.includes('STD_KSTAJ')
}

export const sendBatchEmail = (selectedRows: Record<string, TableData>) => {
    const emails = Object.entries(selectedRows).map((item) => item[1].email)
    const emailAddresses = emails.join(';')
    const mailtoLink = `mailto:${emailAddresses}?`
    window.location.href = mailtoLink
}

export const hasAttributeInputError = (
    attribute: Attribute,
    errors: FieldErrors<{
        [x: string]: string | number | boolean | Date | null | undefined
    }>,
) => {
    if (attribute.technicalName != null) {
        const error = Object.keys(errors).includes(attribute.technicalName)
        return error ? errors[attribute.technicalName] : undefined
    }
    return undefined
}
