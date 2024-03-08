import { GetContentParams, Metadata } from '@isdd/metais-common/api/generated/dms-swagger'
import { EnumItem } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ApiOlaContractData } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { downloadBlobAsFile } from '@isdd/metais-common/componentHelpers/download/downloadHelper'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { formatDateForDefaultValue } from '@isdd/metais-common/index'
import { Languages } from '@isdd/metais-common/localization/languages'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface IOlaContractDetailBasicInfo {
    olaContract?: ApiOlaContractData
    document?: Metadata
    downloadVersionFile: (uuid: string, params?: GetContentParams, signal?: AbortSignal) => Promise<Blob>
    setShowHistory: React.Dispatch<React.SetStateAction<boolean>>
    statesEnum?: EnumItem[]
}

export const OlaContractDetailBasicInfo: React.FC<IOlaContractDetailBasicInfo> = ({
    olaContract,
    document,
    downloadVersionFile,
    setShowHistory,
    statesEnum,
}) => {
    const { t, i18n } = useTranslation()
    const downloadFile = async (uuid: string) => {
        const blobData = await downloadVersionFile(uuid ?? '')
        downloadBlobAsFile(new Blob([blobData]), document?.filename ?? '', false)
    }

    const [docName, setDocName] = useState(document?.filename)

    useEffect(() => {
        if ((!docName && document) || docName != document?.filename) {
            setDocName(document?.filename)
        }
    }, [docName, document, olaContract, document?.filename])

    return (
        <>
            <DefinitionList>
                <InformationGridRow
                    label={t('olaContracts.filter.name')}
                    value={
                        (i18n.language == Languages.SLOVAK ? olaContract?.name : olaContract?.nameEnglish ?? olaContract?.name) ??
                        t('olaContracts.detail.notEntered')
                    }
                />
                <InformationGridRow
                    label={t('olaContracts.filter.description')}
                    value={
                        (i18n.language == Languages.SLOVAK
                            ? olaContract?.description
                            : olaContract?.descriptionEnglish ?? olaContract?.description) ?? t('olaContracts.detail.notEntered')
                    }
                />
                <InformationGridRow
                    label={t('olaContracts.filter.contractCode')}
                    value={olaContract?.contractCode ?? t('olaContracts.detail.notEntered')}
                />
                <InformationGridRow label={t('olaContracts.filter.metaIsCode')} value={olaContract?.code} />
                <InformationGridRow
                    label={t('olaContracts.filter.referenceIdentifier')}
                    value={
                        <Link to={olaContract?.referencingIdentifier ?? ''} target="_blank">
                            {olaContract?.referencingIdentifier}
                        </Link>
                    }
                />
                <InformationGridRow label={t('olaContracts.filter.contractorIsvsUuid')} value={olaContract?.contractorIsvsName} />
                <InformationGridRow
                    label={t('olaContracts.filter.intervalStart')}
                    value={
                        olaContract?.validityStartDate
                            ? formatDateForDefaultValue(olaContract?.validityStartDate)
                            : t('olaContracts.detail.notEntered')
                    }
                />
                <InformationGridRow
                    label={t('olaContracts.filter.intervalEnd')}
                    value={
                        olaContract?.validityEndDate ? formatDateForDefaultValue(olaContract?.validityEndDate) : t('olaContracts.detail.notEntered')
                    }
                />
                <InformationGridRow
                    label={t('olaContracts.filter.state')}
                    value={
                        (i18n.language == Languages.SLOVAK
                            ? statesEnum?.find((e) => e.code == olaContract?.profilState)?.value
                            : statesEnum?.find((e) => e.code == olaContract?.profilState)?.engValue) ?? t('olaContracts.detail.notEntered')
                    }
                />
                <InformationGridRow
                    label={t('olaContracts.filter.document')}
                    value={
                        docName ? (
                            <div>
                                <Link to="#" onClick={() => downloadFile(olaContract?.uuid ?? '')}>
                                    {docName}
                                </Link>{' '}
                                {document?.version != '1.0' && (
                                    <Link to="#" onClick={() => setShowHistory(true)}>
                                        {t('olaContracts.detail.history')}
                                    </Link>
                                )}
                            </div>
                        ) : (
                            t('olaContracts.detail.notEntered')
                        )
                    }
                />
                <InformationGridRow label={t('olaContracts.filter.crzLink')} value={olaContract?.crzLink ?? t('olaContracts.detail.notEntered')} />
                <InformationGridRow
                    label={t('olaContracts.filter.vendorLock')}
                    value={(olaContract?.vendorLock ?? t('olaContracts.detail.notEntered')).toString()}
                />
            </DefinitionList>
        </>
    )
}
