import { ISelectColumnType, ISelectSectionType } from '@isdd/idsk-ui-kit'
import uniq from 'lodash/uniq'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { EnumType, useGetEnumHook } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Attribute, AttributeConstraintEnum, useGetAttributeProfileHook } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { IAttributeEnum, useGetRelationColumnsHook, useUpdateRelationColumnsHook } from '@isdd/metais-common/api/userConfigKvRepo'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

const PROFILE_LIST = [ATTRIBUTE_NAME.Gen_Profil_Rel, ATTRIBUTE_NAME.EA_Profil_Rel, ATTRIBUTE_NAME.Profil_Rel_FazaZivotnehoCyklu]

export enum GENERIC_NAMES {
    CI_TYPE = 'CI+type',
    CI_NAME = 'CI+name',
    CI_OWNER = 'CI+owner',
    RELATION_TYPE = 'REL+type',
    RELATION_STATE = 'REL+state',
}

const defaultColumns = [
    {
        name: GENERIC_NAMES.CI_TYPE,
        order: 1,
    },
    {
        name: GENERIC_NAMES.CI_NAME,
        order: 2,
    },
    {
        name: GENERIC_NAMES.RELATION_TYPE,
        order: 3,
    },
    {
        name: GENERIC_NAMES.RELATION_STATE,
        order: 4,
    },
]

export const useGetRelationColumnData = (entityName: string, isSource: boolean) => {
    const { t, i18n } = useTranslation()

    const {
        state: { user },
    } = useAuth()

    const infoSection: ISelectSectionType = useMemo(
        () => ({
            name: t('relationshipsTab.select.sectionInfo'),
            columns: [
                {
                    technicalName: GENERIC_NAMES.CI_TYPE,
                    name: isSource ? t('relationshipsTab.table.target') : t('relationshipsTab.table.source'),
                    selected: true,
                },
                {
                    technicalName: GENERIC_NAMES.CI_NAME,
                    name: isSource ? t('relationshipsTab.table.targetItemName') : t('relationshipsTab.table.sourceItemName'),
                    selected: true,
                },
                { technicalName: GENERIC_NAMES.RELATION_TYPE, name: t('relationshipsTab.table.relationshipType'), selected: true },
            ],
        }),
        [t, isSource],
    )
    const metaSection: ISelectSectionType = useMemo(
        () => ({
            name: t('relationshipsTab.select.sectionMeta'),
            columns: [
                { technicalName: GENERIC_NAMES.CI_OWNER, name: t('relationshipsTab.table.owner'), selected: false },
                { technicalName: GENERIC_NAMES.RELATION_STATE, name: t('relationshipsTab.table.relationState'), selected: true },
            ],
        }),
        [t],
    )

    const relationDefaultSelectedColumns = useMemo(() => [...infoSection.columns, ...metaSection.columns], [infoSection.columns, metaSection.columns])

    const [configSections, setConfigSections] = useState<ISelectSectionType[]>([])
    const [columnEnumList, setColumnEnumList] = useState<IAttributeEnum[]>([])
    const [enumData, setEnumData] = useState<EnumType[]>([])

    const [selectedColumns, setSelectedColumns] = useState<ISelectColumnType[]>(relationDefaultSelectedColumns)
    const getRelationColumnData = useGetRelationColumnsHook()
    const storeAttributeProfile = useUpdateRelationColumnsHook()
    const getAttributeProfile = useGetAttributeProfileHook()

    const getEnum = useGetEnumHook()

    const apiUrlParam = useMemo(() => (isSource ? 'start' : 'end'), [isSource])

    const url = `cidetail/${entityName}/relation/${apiUrlParam}`

    const loadGenericAttributes = async () => {
        const filteredAttributes =
            (await Promise.all(PROFILE_LIST.map(async (profile) => getAttributeProfile(profile))).then((response) => {
                return response.map((item) => {
                    const attributes = item.attributes?.filter((attribute) => attribute.valid && !attribute.invisible)
                    return { ...item, attributes }
                })
            })) || []

        const attributes: Attribute[] = filteredAttributes.reduce((accumulator: Attribute[], value) => {
            accumulator = [...accumulator, ...(value.attributes ?? [])]
            return accumulator
        }, [])

        const enums: IAttributeEnum[] = []
        attributes.forEach((attribute) =>
            attribute.constraints?.forEach((constraint: AttributeConstraintEnum) => {
                if (constraint.type === 'enum') enums.push({ technicalName: attribute.technicalName ?? '', enumCode: constraint?.enumCode ?? '' })
            }),
        )

        return Promise.resolve({ attributes, enums })
    }

    useEffect(() => {
        if (!user) return
        loadGenericAttributes()
            .then(async ({ attributes, enums }) => {
                const mappedAttributes: ISelectColumnType[] = attributes.map((attribute) => ({
                    technicalName: attribute.technicalName ?? '',
                    name: attribute.name ?? '',
                    selected: false,
                }))
                const genericSection = {
                    name: t('relationshipsTab.select.sectionGeneric'),
                    columns: mappedAttributes,
                }

                const enumCodes = enums.map((item) => item.enumCode)
                const uniqEnumCodes = uniq(enumCodes)
                await Promise.all(uniqEnumCodes.map((enumCode) => getEnum(enumCode))).then((data) => {
                    setEnumData(data)
                    setColumnEnumList(enums)
                })

                return Promise.resolve(genericSection)
            })
            .then((genericSection) => {
                const configData = [infoSection, genericSection, metaSection]
                const columnList = [...infoSection.columns, ...genericSection.columns, ...metaSection.columns]

                setConfigSections(configData)
                getRelationColumnData(url).then(
                    (response) => {
                        const selectedFromResponse = response.map((i) => i.name)
                        const mappedColumnList = columnList.map((column) => {
                            if (selectedFromResponse.includes(column.technicalName)) {
                                return { ...column, selected: true }
                            }
                            return column
                        })
                        setSelectedColumns(mappedColumnList)
                    },
                    () => {
                        setSelectedColumns(columnList)
                    },
                )
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, i18n.language])

    const restoreColumns = (): Promise<void> => {
        const defaultSelectedNames = relationDefaultSelectedColumns.filter((i) => i.selected).map((i) => i.technicalName)

        setSelectedColumns((prev) =>
            prev.map((i) => {
                if (defaultSelectedNames.includes(i.technicalName))
                    return {
                        ...i,
                        selected: true,
                    }
                else {
                    return {
                        ...i,
                        selected: false,
                    }
                }
            }),
        )
        storeAttributeProfile(url, defaultColumns)
        return Promise.resolve()
    }
    const storeColumns = (columns: ISelectColumnType[]) => {
        const requestData = columns.filter((column) => column.selected).map((column, index) => ({ name: column.technicalName, order: index + 1 }))
        storeAttributeProfile(url, requestData)
        setSelectedColumns(columns)
    }

    return { selectedColumns, configSections, enumData, columnEnumList, storeColumns, restoreColumns }
}
