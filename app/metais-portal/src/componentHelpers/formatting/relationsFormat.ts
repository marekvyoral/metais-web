import { TFunction } from 'i18next'
import { ReadCiNeighboursWithAllRels200, RelatedCiTypePreview, RoleParticipantUI } from '@isdd/metais-common/api'

export const formatRelationAttributes = (
    ciWithRel: ReadCiNeighboursWithAllRels200,
    entityTypes: RelatedCiTypePreview[] | undefined,
    owners: void | RoleParticipantUI[] | undefined,
    t: TFunction<'translation', undefined, 'translation'>,
) => {
    const ci = ciWithRel?.ci
    const attributes = ci?.attributes
    const owner = owners?.find((o) => o?.gid === ci?.metaAttributes?.owner)
    const relations = ciWithRel?.rels?.map((rel: { type: string | undefined; metaAttributes: { state: string }; uuid: string }) => {
        const entityType = entityTypes?.find((et) => et?.relationshipTypeTechnicalName === rel?.type)
        return {
            title: `${entityType?.relationshipTypeName} : ${t(`metaAttributes.state.${rel?.metaAttributes?.state}`)}`,
            href: `/relation/redirect/${ci?.type}/${ci?.uuid}/${rel?.uuid}`,
        }
    })
    return {
        status: ci?.metaAttributes?.state,
        codeMetaIS: attributes?.Gen_Profil_kod_metais as string,
        label: attributes?.Gen_Profil_nazov as string,
        labelHref: `/ci/redirect/${ci?.type}/${ci?.uuid}`,
        name: attributes?.Gen_Profil_nazov as string,
        admin: owner?.configurationItemUi?.attributes?.Gen_Profil_nazov as string,
        relations,
    }
}
