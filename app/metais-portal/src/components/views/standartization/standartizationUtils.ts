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

export const sendBatchEmail = (selectedRows: Record<string, TableData>) => {
    const emails = Object.entries(selectedRows).map((item) => item[1].email)
    const emailAddresses = emails.join(';')
    const mailtoLink = `mailto:${emailAddresses}?`
    window.location.href = mailtoLink
}
