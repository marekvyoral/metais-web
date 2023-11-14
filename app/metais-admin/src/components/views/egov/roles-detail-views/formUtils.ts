import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { RelatedIdentityWithPo } from '@isdd/metais-common/api/generated/iam-swagger'
import { FieldErrors, FieldValues } from 'react-hook-form'

export const findInputError = (errors: FieldErrors<FieldValues>, name: string): FieldErrors<FieldValues> => {
    const filtered = Object.keys(errors)
        .filter((key) => key.includes(name))
        .reduce((cur, key) => {
            return Object.assign(cur, { error: errors[key] })
        }, {})
    return filtered
}

export const mapRelatedIdentities = (data: RelatedIdentityWithPo[] | undefined) => {
    return (
        data?.map((item) => ({
            name: item.lastName + '' + item.firstName,
            login: item.login,
            email: item.email,
            obligedPerson:
                (item.attributes ?? {}).Gen_Profil_nazov +
                ((item.attributes ?? {}).EA_Profil_PO_ulica ? ' - ' + (item.attributes ?? {}).EA_Profil_PO_ulica : '') +
                ((item.attributes ?? {}).EA_Profil_PO_cislo ? ' - ' + (item.attributes ?? {}).EA_Profil_PO_cislo : '') +
                ((item.attributes ?? {}).EA_Profil_PO_obec ? ' - ' + (item.attributes ?? {}).EA_Profil_PO_obec : '') +
                ((item.attributes ?? {}).EA_Profil_PO_psc ? ' - ' + (item.attributes ?? {}).EA_Profil_PO_psc : ''),
        })) ?? []
    )
}

export const getGroupRoles = (tableRoleGroups: EnumType | undefined) => {
    return tableRoleGroups?.enumItems?.map((item) => ({ value: item.code ?? '', label: item.value ?? '' })) ?? []
}
