import { TFunction, i18n } from 'i18next'

import { Languages } from '@isdd/metais-common/localization/languages'
import { CiWithRelsUi, RoleParticipantUI } from '@isdd/metais-common/api'
import { RelationshipTypePreview } from '@isdd/metais-common/api/generated/types-repo-swagger'

export const formatRelationAttributes = (
    ciWithRel: CiWithRelsUi,
    relationTypes: RelationshipTypePreview[] | undefined,
    owners: void | RoleParticipantUI[] | undefined,
    t: TFunction<'translation', undefined, 'translation'>,
    lng: i18n,
) => {
    const ci = ciWithRel?.ci
    const attributes = ci?.attributes
    const owner = owners?.find((o) => o?.gid === ci?.metaAttributes?.owner)
    const relations = ciWithRel?.rels?.map((rel) => {
        const relationType = relationTypes?.find((et) => et?.technicalName === rel?.type)
        return {
            title: `${lng.language === Languages.SLOVAK ? relationType?.name : relationType?.engName} : ${t(
                `metaAttributes.state.${rel?.metaAttributes?.state}`,
            )}`,
            href: `/relation/${ci?.type}/${ci?.uuid}/${rel?.uuid}`,
        }
    })
    return {
        status: ci?.metaAttributes?.state,
        codeMetaIS: attributes?.Gen_Profil_kod_metais as string,
        label: attributes?.Gen_Profil_nazov as string,
        labelHref: `/ci/${ci?.type}/${ci?.uuid}`,
        name: attributes?.Gen_Profil_nazov as string,
        admin: owner?.configurationItemUi?.attributes?.Gen_Profil_nazov as string,
        relations,
    }
}
