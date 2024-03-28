import {
    PortalSearchSectionsItem,
    PortalSearchResultTypesItem,
    PortalSearchDmsDocumentExtensionsItem,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { DateTime } from 'luxon'

export enum DateRanges {
    TODAY = 'today',
    THIS_WEEK = 'thisWeek',
    THIS_MONTH = 'thisMonth',
    THIS_YEAR = 'thisYear',
    CUSTOM_RANGE = 'customRange',
}

export enum CustomDateRange {
    FROM_UPDATE = 'fromUpdate',
    TO_UPDATE = 'toUpdate',
}

export enum GlobalSearchSubSections {
    RESULT_TYPES = 'resultTypes',
    SECTIONS = 'sections',
    DATE_RANGE = 'dateRange',
    OWNER = 'owner',
    DOC_TYPES = 'docTypes',
}

export interface IGlobalSearchForm {
    [GlobalSearchSubSections.DATE_RANGE]?: DateRanges
    [GlobalSearchSubSections.SECTIONS]?: {
        [PortalSearchSectionsItem.EGOV_COMPONENT]?: boolean
        [PortalSearchSectionsItem.DATA_OBJECTS]?: boolean
        [PortalSearchSectionsItem.STANDARDIZATION]?: boolean
        [PortalSearchSectionsItem.SLA_TCO_EKO]?: boolean
    }
    [GlobalSearchSubSections.RESULT_TYPES]?: {
        [PortalSearchResultTypesItem.ATTRIBUTE]?: boolean
        [PortalSearchResultTypesItem.DOCUMENT]?: boolean
        [PortalSearchResultTypesItem.RELATIONSHIP]?: boolean
    }
    [GlobalSearchSubSections.OWNER]?: string | null
    [GlobalSearchSubSections.DOC_TYPES]?: {
        [PortalSearchDmsDocumentExtensionsItem.DOCX]?: boolean
        [PortalSearchDmsDocumentExtensionsItem.ODT]?: boolean
        [PortalSearchDmsDocumentExtensionsItem.PDF]?: boolean
        [PortalSearchDmsDocumentExtensionsItem.RTF]?: boolean
    }
    [CustomDateRange.FROM_UPDATE]?: string
    [CustomDateRange.TO_UPDATE]?: string
}

export const getDateRange = (range: DateRanges): { lastModifiedAtFrom: string; lastModifiedAtTo: string } => {
    switch (range) {
        case DateRanges.TODAY:
            return {
                lastModifiedAtFrom: DateTime.utc().startOf('day').toISO() ?? '',
                lastModifiedAtTo: DateTime.utc().endOf('day').toISO() ?? '',
            }
        case DateRanges.THIS_WEEK:
            return {
                lastModifiedAtFrom: DateTime.utc().startOf('week').toISO() ?? '',
                lastModifiedAtTo: DateTime.utc().endOf('week').toISO() ?? '',
            }
        case DateRanges.THIS_MONTH:
            return {
                lastModifiedAtFrom: DateTime.utc().startOf('month').toISO() ?? '',
                lastModifiedAtTo: DateTime.utc().endOf('month').toISO() ?? '',
            }
        case DateRanges.THIS_YEAR:
            return {
                lastModifiedAtFrom: DateTime.utc().startOf('year').toISO() ?? '',
                lastModifiedAtTo: DateTime.utc().endOf('year').toISO() ?? '',
            }
        default:
            return {
                lastModifiedAtFrom: DateTime.utc().startOf('year').toISO() ?? '',
                lastModifiedAtTo: DateTime.utc().endOf('year').toISO() ?? '',
            }
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filterTrueObjectValues = (obj: any): any => {
    return Object.keys(Object.fromEntries(Object.entries(obj).filter(([, val]) => val === true)))
}

export const deserializeParams = (urlParams: URLSearchParams): { [key: string]: string } => {
    const params: { [key: string]: string } = {}

    for (const param of urlParams) {
        params[param[0]] = param[1]
    }
    return params
}
