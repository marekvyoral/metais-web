import React from 'react'
import {
    ATTRIBUTE_NAME,
    ConfigurationItemUi,
    EnumItem,
    EnumType,
    GET_ENUM,
    STATUTAR_NAME,
    useGetEnum,
    useInvalidateConfigurationItem,
    useReadCiList1,
} from '@isdd/metais-common'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'

export interface ParsedAttribute {
    label: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
}

export interface IPublicAuthoritiesDetail {
    configurationItem?: ConfigurationItemUi | undefined
    personTypesCategories?: EnumType | undefined
    personCategories?: EnumType | undefined
    sources?: EnumType | undefined
    parsedAttributes?: ParsedAttribute[]
    statutarAttributes?: ParsedAttribute[]
    setInvalid?: (entityId: string | undefined, configurationItem: ConfigurationItemUi | undefined) => Promise<void>
}
export interface IAttributesContainerView {
    data: IPublicAuthoritiesDetail
    isError: boolean
    isLoading: boolean
}

interface AttributesContainer {
    entityId: string
    View: React.FC<IAttributesContainerView>
}

const allAttributes = Object.values(ATTRIBUTE_NAME)
const allStatutarAttributes = Object.values(STATUTAR_NAME)

export const PublicAuthoritiesDetailContainer: React.FC<AttributesContainer> = ({ entityId, View }) => {
    const { data: personTypesCategories } = useGetEnum(GET_ENUM.TYP_OSOBY)
    const { data: personCategories } = useGetEnum(GET_ENUM.KATEGORIA_OSOBA)
    const { data: sources } = useGetEnum(GET_ENUM.ZDROJ)

    const { currentPreferences } = useUserPreferences()

    const metaAttributes = currentPreferences.showInvalidatedItems
        ? { state: ['DRAFT', 'AWAITING_APPROVAL', 'APPROVED_BY_OWNER', 'INVALIDATED'] }
        : { state: ['DRAFT', 'AWAITING_APPROVAL', 'APPROVED_BY_OWNER'] }

    const defaultRequestApi = {
        filter: {
            type: ['PO'],
            uuid: [entityId],
            metaAttributes,
        },
    }

    const { data, isLoading, isError } = useReadCiList1({
        ...defaultRequestApi,
    })

    const attributesPO = data?.configurationItemSet?.[0].attributes

    const getValueFromEnumItems = (enumItems: EnumItem[], attribute: ATTRIBUTE_NAME) => {
        return enumItems?.find((item) => item.code === attributesPO?.[attribute])?.description
    }

    const getValueFromEnumItemsSource = (enumItems: EnumItem[], attribute: ATTRIBUTE_NAME) => {
        return enumItems?.find((item) => item.code === attributesPO?.[attribute])?.value
    }
    const translatePrefix = 'PO_Attributes.'

    const parsedAttributes = allAttributes.map((attribute) => {
        if (attribute === ATTRIBUTE_NAME.EA_Profil_PO_kategoria_osoby)
            return { label: translatePrefix + attribute, value: getValueFromEnumItems(personCategories?.enumItems ?? [], attribute) }
        if (attribute === ATTRIBUTE_NAME.EA_Profil_PO_typ_osoby)
            return { label: translatePrefix + attribute, value: getValueFromEnumItems(personTypesCategories?.enumItems ?? [], attribute) }

        if (attribute === ATTRIBUTE_NAME.Gen_Profil_zdroj) {
            return { label: translatePrefix + attribute, value: getValueFromEnumItemsSource(sources?.enumItems ?? [], attribute) }
        }

        return { label: translatePrefix + attribute, value: attributesPO?.[attribute] }
    })

    const statutarAttributes = allStatutarAttributes.map((relation) => {
        return { label: translatePrefix + relation, value: attributesPO?.[relation] }
    })

    const { mutateAsync: setInvalid } = useInvalidateConfigurationItem()

    const InvalidateConfigurationItem = async (uuid: string | undefined, configurationItem: ConfigurationItemUi | undefined) => {
        const attributes = configurationItem?.attributes
        if (!attributes) return
        await setInvalid({
            data: {
                attributes: Object.keys(attributes).map((key) => ({ value: attributes[key], name: key })),
                invalidateReason: { comment: '' },
                type: 'PO',
                uuid: uuid,
            },
        })
    }

    return (
        <View
            data={{
                configurationItem: data?.configurationItemSet?.[0],
                personTypesCategories,
                personCategories,
                sources,
                parsedAttributes,
                statutarAttributes,
                setInvalid: InvalidateConfigurationItem,
            }}
            isError={isError}
            isLoading={isLoading}
        />
    )
}
