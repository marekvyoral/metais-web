import { ATTRIBUTE_NAME, DMS_DOWNLOAD_FILE } from '@isdd/metais-common/api'
import { useGetMeta1Hook } from '@isdd/metais-common/api/generated/dms-swagger'
import { ApiStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { getInfoGuiProfilStandardRequest, getLabelGuiProfilStandardRequest } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { AttachmentIcon, DownloadIcon } from '@isdd/metais-common/assets/images'
import { useStateMachine } from '@isdd/metais-common/components/state-machine/hooks/useStateMachine'
import { IS_KOORDINATOR } from '@isdd/metais-common/constants'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { InformationGridRow } from '@isdd/metais-common/src/components/info-grid-row/InformationGridRow'
import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { PromiseStatus } from '@isdd/metais-common/types/api'

import styles from '@/components/entities/draftslist/draftsListCreateForm.module.scss'
import { StandardDraftsStateMachine } from '@/pages/standardization/draftslist/[entityId]/form'

interface Props {
    data: {
        requestData?: ApiStandardRequest
        guiAttributes?: Attribute[]
    }
}
export const DraftListRelatedDocuments: React.FC<Props> = ({ data }) => {
    const { requestData, guiAttributes } = data
    const { t } = useTranslation()
    const stateContext = useContext(StandardDraftsStateMachine)
    const stateMachine = useStateMachine({ stateContext })
    const ability = useAbilityContext()
    const isKoordinator = ability?.can(Actions.HAS_ROLE, IS_KOORDINATOR)
    const getMeta = useGetMeta1Hook()
    const currentState = stateMachine?.getCurrentState()
    const [existingFiles, setExistingFiles] = useState<string[]>([])
    const showLinks = isKoordinator && currentState !== 'REQUESTED' && requestData?.links && requestData?.links?.length > 0
    const showAttachments = existingFiles && existingFiles.length > 0

    useEffect(() => {
        const filterFiles = async () => {
            const success: string[] = [...existingFiles]

            if (requestData && requestData?.attachments) {
                const promises = requestData?.attachments
                    ?.filter((a) => a.attachmentId && !success.includes(a.attachmentId))
                    .map((d) => {
                        if (d.attachmentId) {
                            return getMeta(d.attachmentId)
                        }
                    })
                Promise.allSettled(promises).then((resps) => {
                    resps.map((r) => {
                        if (r.status == PromiseStatus.FULFILLED && r.value?.uuid) {
                            success.push(r.value?.uuid)
                        }
                    })
                    if (success.length != existingFiles.length) {
                        setExistingFiles(success)
                    }
                })
            }
        }
        filterFiles()
    }, [requestData?.attachments, data, requestData, existingFiles, getMeta])

    const linkElements = showLinks
        ? requestData?.links?.map((link) => (
              <div key={link.id} className={styles.displayFlexCenter}>
                  <img src={AttachmentIcon} alt="" />
                  <Link to={link?.url ?? ''} state={{ from: location }} target="_blank" className="govuk-link">
                      {link?.name as string}
                      <br />
                  </Link>
              </div>
          ))
        : undefined

    const attachmentElements = showAttachments
        ? requestData?.attachments
              ?.filter((a) => existingFiles.includes(a.attachmentId ?? ''))
              .map((attachment) => (
                  <div key={attachment.id} className={styles.displayFlexCenter}>
                      <img src={DownloadIcon} alt="" />
                      <Link to={`${DMS_DOWNLOAD_FILE}${attachment?.attachmentId}`} state={{ from: location }} target="_blank" className="govuk-link">
                          {attachment?.attachmentName as string}
                          <br />
                      </Link>
                  </div>
              ))
        : undefined
    const relatedDocuments = [...(linkElements ?? []), ...(attachmentElements ?? [])]

    return (
        <InformationGridRow
            key={ATTRIBUTE_NAME.relatedDocuments}
            label={getLabelGuiProfilStandardRequest(ATTRIBUTE_NAME.relatedDocuments, guiAttributes) ?? ''}
            value={relatedDocuments && relatedDocuments?.length > 0 ? <>{relatedDocuments}</> : <> {t('DraftsList.detail.noDocuments')}</>}
            tooltip={getInfoGuiProfilStandardRequest(ATTRIBUTE_NAME.relatedDocuments, guiAttributes) ?? ''}
        />
    )
}
