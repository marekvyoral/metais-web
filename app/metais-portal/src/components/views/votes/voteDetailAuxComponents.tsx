import { error } from 'console'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RadioButton, RadioGroupWithLabel, Table, TextBody } from '@isdd/idsk-ui-kit/index'
import { ApiAttachment, ApiVote, useGetContent, useGetContentHook } from '@isdd/metais-common/api'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'
import { ColumnDef } from '@tanstack/react-table'
import { ColumnSort } from '@isdd/idsk-ui-kit/types'
import { downloadBlobAsFile } from '@isdd/metais-common/componentHelpers/download/downloadHelper'

import styles from './voteDetail.module.scss'
import { AttachmentLinks, WebLinks } from './voteDetailProps'

export interface IDetailItemData {
    itemTitleContent: string
    itemValueContent: JSX.Element
    hidden: boolean
}
export interface IDetailItemsData {
    voteData: ApiVote | undefined
}

export const VoteDetailItems: React.FC<IDetailItemsData> = ({ voteData }) => {
    const { t } = useTranslation()
    // const [fileUuId, setfileUuId] = useState<string>('')
    const [isFileError, setFileError] = useState<boolean>(false)
    const [isLoading, setisLoading] = useState<boolean>(true)
    const isFileLoading = useRef<boolean>(false)
    // const {
    //     data: blobData,
    //     isError: downloadError,
    //     isLoading: isFileLoading,
    // } = useGetContent(fileUuId, undefined, {
    //     query: {
    //         refetchOnMount: false,
    //         enabled: fileUuId !== '',
    //     },
    // })
    const downloadAttachmentFile = useGetContentHook()
    const downloadAttachment = useMemo(() => {
        return async (attachment: ApiAttachment) => {
            try {
                const blobData = await downloadAttachmentFile(attachment.attachmentId ?? '')
                downloadBlobAsFile(new Blob([blobData]), attachment.attachmentName ?? '')
            } catch {
                setFileError(true)
            } finally {
                // setFileLoading(false)
                // console.log('Neloadujem')
                // isFileLoading.current = false
            }
        }
    }, [downloadAttachmentFile])

    // useEffect(() => {
    //     if (blobData) {
    //         downloadBlobAsFile(new Blob([blobData]), '123')
    //     }
    // }, [blobData])

    const onAttachmentClickHandler = useMemo(() => {
        return (attachment: ApiAttachment) => {
            // isFileLoading.current = true
            // console.log('Loadujem: ' + isFileLoading.current)
            downloadAttachment(attachment)
            // setfileUuId(attachment.attachmentId ?? '')
        }
    }, [downloadAttachment])

    // console.log('ref: ' + isFileLoading.current)
    // console.log('state: ' + isLoading)
    // if (isFileLoading.current != isLoading) {
    //     console.log('menim')
    //     setisLoading(isFileLoading.current)
    // }

    const tableDataToShow = useMemo(() => {
        const tableData: IDetailItemData[] = [
            {
                itemTitleContent: t('votes.voteDetail.date'),
                itemValueContent: (
                    <TextBody size="L" className={styles.itemsTableCellContent}>
                        {t('date', { date: voteData?.effectiveFrom }) + ' - ' + t('date', { date: voteData?.effectiveTo })}
                    </TextBody>
                ),
                hidden: voteData?.effectiveFrom === undefined || voteData?.effectiveTo === undefined,
            },
            {
                itemTitleContent: t('votes.voteDetail.voteType'),
                itemValueContent: (
                    <TextBody size="L" className={styles.itemsTableCellContent}>
                        {voteData?.secret ? t('votes.voteDetail.secret') : t('votes.voteDetail.public')}
                    </TextBody>
                ),
                hidden: voteData?.secret === undefined,
            },
            {
                itemTitleContent: t('votes.voteDetail.relatedVoteLinks'),
                itemValueContent: <WebLinks links={voteData?.links} />,
                hidden: voteData?.links === undefined || voteData?.links?.length === 0,
            },
            {
                itemTitleContent: t('votes.voteDetail.relatedDocuments'),
                itemValueContent: (
                    <>
                        <QueryFeedback
                            loading={isLoading} //{isFileLoading.current.valueOf()}
                            error={isFileError}
                            withChildren
                            indicatorProps={{ layer: 'parent', transparentMask: true, label: t('votes.voteDetail.downloadingFile') }}
                        >
                            <AttachmentLinks
                                attachments={voteData?.attachments}
                                onClick={(attachment) => {
                                    setisLoading(true)
                                    onAttachmentClickHandler(attachment)
                                }}
                            />
                        </QueryFeedback>
                    </>
                ),
                hidden: voteData?.attachments === undefined || voteData?.attachments?.length === 0,
            },
        ]

        return tableData.filter((data) => data.hidden === false)
    }, [
        isFileError,
        isLoading,
        onAttachmentClickHandler,
        t,
        voteData?.attachments,
        voteData?.effectiveFrom,
        voteData?.effectiveTo,
        voteData?.links,
        voteData?.secret,
    ])
    // console.log({ isFileLoading })
    console.log('som sa refreshol....')
    return (
        <table className={styles.itemsTable}>
            <tbody>
                {tableDataToShow.map((detailItemData, index) => {
                    return (
                        <tr key={'itemData' + index} className={styles.itemsTableRow}>
                            <td>
                                <TextBody size="L" className={styles.itemTitle}>
                                    {detailItemData.itemTitleContent}:
                                </TextBody>
                            </td>
                            <td>{detailItemData.itemValueContent}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export const votedTabContent = <T,>(tableData: Array<T>, tableColumns: Array<ColumnDef<T>>, sort: ColumnSort[] | undefined): JSX.Element => {
    return (
        <>
            <Table
                data={tableData}
                columns={tableColumns}
                sort={sort ?? []}
                // onSortingChange={(columnSort) => {
                //     handleFilterChange({ sort: columnSort })
                // }}
                isLoading={false}
                error={undefined}
            />
        </>
    )
}

interface ICastVote {
    voteProcessing: boolean
    voteData: ApiVote | undefined
    handleCastVote: (voteId: number | undefined, choiceId: number | undefined, description: string | undefined) => Promise<void>
    handleVetoVote: (voteId: number | undefined, description: string | undefined) => Promise<void>
    canCast: boolean
    canVeto: boolean
}

interface IChoise {
    id: number
    value: string
    description: string
    isVeto: boolean
    disabled: boolean
    handleOnChange: () => void
}

export const VotesHandling: React.FC<ICastVote> = ({ voteData, handleCastVote, handleVetoVote, canCast, canVeto, voteProcessing }) => {
    const { t } = useTranslation()
    const [votesProcessingError, setVotesProcessingError] = useState<boolean>(false)
    const handleOnChange = useCallback(
        async (voteId: number | undefined, choiceId: number | undefined, description: string | undefined, isVeto: boolean) => {
            try {
                setVotesProcessingError(false)
                if (isVeto) {
                    await handleVetoVote(voteId, description)
                    return
                }
                await handleCastVote(voteId, choiceId, description)
            } catch {
                setVotesProcessingError(true)
            }
        },
        [handleCastVote, handleVetoVote],
    )
    const vetoId = useMemo((): number => {
        return 99999 + Math.random() * 1000
    }, [])

    const choisesDataArrayFactory = useCallback(
        (voteApiData: ApiVote | undefined, canDoCast: boolean, canDoVeto: boolean): Array<IChoise> => {
            const voteChoisesFromApi = voteApiData?.voteChoices?.map((choise, index) => {
                const choiseData: IChoise = {
                    id: choise.id ?? index,
                    value: choise.value ?? '',
                    description: choise.description ?? '',
                    isVeto: false,
                    disabled: !canDoCast,
                    handleOnChange: () => {
                        handleOnChange(voteApiData?.id, choise?.id, choise?.description, false)
                    },
                }
                return choiseData
            })
            if (!canDoVeto) {
                return voteChoisesFromApi ?? []
            }

            const vetoChoiseData: IChoise = {
                id: vetoId,
                value: t('votes.voteDetail.voteVetoChoiseLabel'),
                description: 'veto',
                isVeto: true,
                disabled: !canDoVeto,
                handleOnChange: () => {
                    handleOnChange(voteApiData?.id, undefined, undefined, true)
                },
            }
            const voteHandlingChoisesData = voteChoisesFromApi?.concat(vetoChoiseData)
            return voteHandlingChoisesData ?? []
        },
        [handleOnChange, t, vetoId],
    )

    const choisesDataArray = useMemo((): IChoise[] => {
        return choisesDataArrayFactory(voteData, canCast, canVeto)
    }, [canCast, canVeto, choisesDataArrayFactory, voteData])

    return (
        <>
            <QueryFeedback
                withChildren
                loading={voteProcessing}
                error={votesProcessingError}
                indicatorProps={{ transparentMask: true, layer: 'dialog', label: t('votes.voteDetail.voteProcessing') }}
            >
                <RadioGroupWithLabel hint={!canCast ? t('votes.voteDetail.voteChoiseLabel.cannotCast') : ''}>
                    <>
                        {choisesDataArray.map((choise) => {
                            return (
                                <RadioButton
                                    key={choise.id}
                                    id={choise.id.toString()}
                                    value={choise.value ?? ''}
                                    label={choise.value ?? ''}
                                    name={'voteHandling'}
                                    onChange={() => handleOnChange(voteData?.id, choise?.id, choise?.description, choise.isVeto)}
                                    disabled={choise.disabled}
                                />
                            )
                        })}
                    </>
                </RadioGroupWithLabel>
            </QueryFeedback>
        </>
    )
}
