import { GridCol, GridRow } from '@isdd/idsk-ui-kit/index'
import { ConfigurationItemUi as CmdbConfigurationItemSetUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Attribute, AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { EnumType, formatDateTimeForDefaultValue, pairEnumsToEnumValues } from '@isdd/metais-common/index'
import { ConfigurationItemUi } from '@isdd/metais-common/src/api/generated/iam-swagger'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface PublicAuthoritiesUpdateItemProps {
    oldData: CmdbConfigurationItemSetUi | undefined
    newData: ConfigurationItemUi | undefined
    unitsData: EnumType | undefined
    constraintsData: (EnumType | undefined)[]
    attributes?: Attribute[]
    attributeProfiles?: AttributeProfile[]
}

const PublicAuthoritiesUpdateItemView: React.FC<PublicAuthoritiesUpdateItemProps> = ({
    oldData,
    newData,
    attributes = [],
    attributeProfiles = [],
    constraintsData,
    unitsData,
}) => {
    const { t } = useTranslation()
    const oldMappedData = useMemo(() => {
        const mappedAttribute = Object.entries(oldData?.attributes || {}).map(([key, value]) => ({ name: key, value }))
        return { ...oldData, attributes: mappedAttribute }
    }, [oldData])

    const attributeList = useMemo(() => {
        const mergedAttributeProfiles = attributeProfiles?.reduce((list: Attribute[], item: AttributeProfile) => {
            return [...list, ...(item?.attributes || [])]
        }, [])
        return [...attributes, ...mergedAttributeProfiles]
    }, [attributes, attributeProfiles])

    const actualAttributesList = useMemo(() => {
        return attributeList.filter((att) => newData?.attributes?.find((i) => i.name === att.technicalName))
    }, [newData?.attributes, attributeList])

    const getAttributeName = (name: string | undefined, list: Attribute[]) => {
        return list.find((i) => i?.technicalName === name)?.name || ''
    }

    const renderList = (data: ConfigurationItemUi | undefined, compareData: ConfigurationItemUi | undefined) => {
        return actualAttributesList.map((item, index) => {
            const attribute = data?.attributes?.find((i) => i.name === item.technicalName)

            const compareAttribute = compareData?.attributes?.find((i) => i.name === item.technicalName)
            if (attribute) {
                return (
                    <InformationGridRow
                        key={index}
                        label={getAttributeName(attribute.name ?? '', attributeList)}
                        value={pairEnumsToEnumValues(item, data, constraintsData, t, unitsData, undefined, true)}
                        valueWarning={attribute.value !== compareAttribute?.value}
                        tooltip={item.description}
                    />
                )
            }
            return <InformationGridRow key={index} label={item.name || ''} value={''} tooltip={item.description} />
        })
    }

    const renderAdditionalRows = (data: ConfigurationItemUi | undefined, compareData: ConfigurationItemUi | undefined) => {
        return (
            <>
                <InformationGridRow
                    label={t('actionOverTable.metaColumnName.state')}
                    value={data?.metaAttributes?.state}
                    valueWarning={data?.metaAttributes?.state !== compareData?.metaAttributes?.state}
                />
                <InformationGridRow
                    label={t('actionOverTable.metaColumnName.lastModifiedAt')}
                    value={formatDateTimeForDefaultValue(data?.metaAttributes?.lastModifiedAt || '')}
                />
            </>
        )
    }

    return (
        <GridCol>
            <GridRow>
                <GridCol setWidth="one-half">
                    <DefinitionList>
                        <>
                            {renderList(oldMappedData, newData)}
                            {renderAdditionalRows(oldMappedData, newData)}
                        </>
                    </DefinitionList>
                </GridCol>
                <GridCol setWidth="one-half">
                    <DefinitionList>
                        <>
                            {renderList(newData, oldMappedData)}
                            {renderAdditionalRows(newData, oldMappedData)}
                        </>
                    </DefinitionList>
                </GridCol>
            </GridRow>
        </GridCol>
    )
}

export default PublicAuthoritiesUpdateItemView
