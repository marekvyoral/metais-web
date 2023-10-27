import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, PROJECT_DOCUMENTS_SECTIONS_EXPANDABLE } from '@isdd/metais-common/constants'
import { QueryFeedback } from '@isdd/metais-common/index'
import React, { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ProjectDocumentsTable } from './ProjectDocumentsTable'

import { IView } from '@/components/containers/ProjectDocumentListContainer'

export const ProjectDocumentsTab: React.FC<IView> = ({
    data,
    isLoading,
    isError,
    pagination,
    handleFilterChange,
    refetch,
    allDocuments,
    projectData,
}) => {
    const { t } = useTranslation()
    const [pageSize, setPageSize] = useState(BASE_PAGE_SIZE)
    const [page, setPage] = useState(BASE_PAGE_NUMBER)
    return (
        <QueryFeedback loading={isLoading} error={isError} indicatorProps={{ layer: 'parent' }} withChildren>
            <TextHeading size="L">{t('documentsTab.requiredDocs')}</TextHeading>
            {data?.map((section, index: number) => {
                const sectionShowAddBtn =
                    !section.uuid && !section.confluence && Object.keys(PROJECT_DOCUMENTS_SECTIONS_EXPANDABLE).includes(section.name)
                        ? PROJECT_DOCUMENTS_SECTIONS_EXPANDABLE[section.name]
                        : ''
                return (
                    <Fragment key={index}>
                        <TextHeading size="M">{section.name}</TextHeading>
                        <ProjectDocumentsTable
                            projectData={projectData}
                            addButtonSectionName={sectionShowAddBtn}
                            docs={section.docs}
                            pagination={pagination}
                            handleFilterChange={handleFilterChange}
                            isError={isError}
                            isLoading={isLoading}
                            refetch={refetch}
                        />
                    </Fragment>
                )
            })}
            <TextHeading size="M">{t('documentsTab.allDocuments')}</TextHeading>

            <ProjectDocumentsTable
                totalLength={allDocuments?.length}
                pageSize={pageSize}
                setPageSize={setPageSize}
                page={page}
                setPage={setPage}
                selectPageSize
                projectData={projectData}
                addButtonSectionName="all"
                docs={allDocuments?.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)}
                pagination={pagination}
                handleFilterChange={handleFilterChange}
                isError={isError}
                isLoading={isLoading}
                refetch={refetch}
            />
        </QueryFeedback>
    )
}
