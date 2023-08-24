import { TFunction } from 'i18next'

export enum MetainformationColumns {
    CREATED_AT = 'createdAt',
    LAST_MODIFIED_AT = 'lastModifiedAt',
    STATE = 'state',
    GROUP = 'group',
    OWNER = 'owner',
}

export const getCiDefaultMetaAttributes = (t: TFunction<'translation', undefined, 'translation'>) => {
    const defaultCiMetaAttributes = {
        name: t('ciType.meta.metaInformationsName'),
        attributes: [
            {
                name: t('ciType.meta.lastModifiedAt'),
                technicalName: MetainformationColumns.LAST_MODIFIED_AT,
            },
            {
                name: t('ciType.meta.createdAt'),
                technicalName: MetainformationColumns.CREATED_AT,
            },
            {
                name: t('ciType.meta.owner'),
                technicalName: MetainformationColumns.GROUP,
            },
            {
                name: t('ciType.meta.state'),
                technicalName: MetainformationColumns.STATE,
            },
        ],
    }
    return defaultCiMetaAttributes
}
