import React, { useContext } from 'react'
import { InformationGridRow } from '@isdd/metais-common/src/components/info-grid-row/InformationGridRow'
import { ApiStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { ATTRIBUTE_NAME, DMS_DOWNLOAD_FILE } from '@isdd/metais-common/api'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getInfoGuiProfilStandardRequest, getLabelGuiProfilStandardRequest } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { IS_KOORDINATOR } from '@isdd/metais-common/constants'
import { useStateMachine } from '@isdd/metais-common/components/state-machine/hooks/useStateMachine'
import { AttachmentIcon, DownloadIcon } from '@isdd/metais-common/assets/images'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

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

    const currentState = stateMachine?.getCurrentState()

    const showLinks = isKoordinator && currentState !== 'REQUESTED' && requestData?.links && requestData?.links?.length > 0
    const showAttachments = requestData?.attachments && requestData?.attachments?.length > 0

    const linkElements = showLinks
        ? requestData?.links?.map((link) => (
              <div key={link.id} className={styles.displayFlexCenter}>
                  <img src={AttachmentIcon} alt="link-icon" />
                  <Link to={link?.url ?? ''} state={{ from: location }} target="_blank" className="govuk-link">
                      {link?.name as string}
                      <br />
                  </Link>
              </div>
          ))
        : undefined

    const attachmentElements = showAttachments
        ? requestData?.attachments?.map((attachment) => (
              <div key={attachment.id} className={styles.displayFlexCenter}>
                  <img src={DownloadIcon} alt="download-icon" />
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
