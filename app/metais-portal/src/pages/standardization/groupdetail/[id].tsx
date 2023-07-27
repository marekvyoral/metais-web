import {
    BreadCrumbs,
    Button,
    ButtonGroupRow,
    Filter,
    GridRow,
    HomeIcon,
    IconWithText,
    InfoIconWithText,
    Paginator,
    SimpleSelect,
    Table,
    TextBody,
    TextHeading,
} from '@isdd/idsk-ui-kit/index'
import {
    FindRelatedIdentitiesAndCountParams,
    IdentityInGroupData,
    useFindByUuid3,
    useFindRelatedIdentitiesAndCount,
} from '@isdd/metais-common/src/api/generated/iam-swagger'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { GreenCheckOutlineIcon } from '@isdd/idsk-ui-kit/assets/images'

import styles from './styles.module.scss'
import { ColumnDef } from '@tanstack/react-table'

const defaultSearch: FindRelatedIdentitiesAndCountParams = {
    orderBy: 'code',
    desc: false,
    identityState: 'ACTIVATED',
    page: '20',
    perPage: '1',
}

const KSIVSPage = () => {
    const { id } = useParams()
    const { t } = useTranslation()
    const { data: infoData } = useFindByUuid3(id ?? '')
    const { data: identitiesData } = useFindRelatedIdentitiesAndCount(id ?? '', defaultSearch)
    const [successfulUpdatedData, setSuccessfulUpdatedData] = useState(false)

    const columns: ColumnDef<IdentityInGroupData>[] = [
        { technicalName: 'name', name: 'Meno' },
        { technicalName: 'login', name: 'Organizacia' },
        { technicalName: 'email', name: 'Rola' },
        { technicalName: 'obligedPerson', name: 'Email' },
        { technicalName: 'action', name: 'Akcia' },
    ].map((e) => ({ id: e.technicalName, header: e.name, accessorKey: e.technicalName, enableSorting: true }))
    return (
        <>
            <BreadCrumbs
                links={[
                    { href: '/', label: 'Domov', icon: HomeIcon },
                    { href: '/howto/STANDARD.PROCESS/STD_HOWTO', label: 'Štandardizácia' },
                    { href: '/standardization/groupdetail/c552bc9b-3375-4040-b5a0-2da3cd832764', label: 'Komisia pre štandardizáciu ITVS' },
                ]}
            />
            {/* Base info */}
            <GridRow className={styles.row}>
                <TextHeading size="XL">Komisia pre štandardizáciu ITVS</TextHeading>
                <Button label="Upraviť položku" />
            </GridRow>
            <table>
                <tr>
                    <td>
                        <TextBody className={styles.boldText}>Skratka názvu:</TextBody>
                    </td>
                    <td>
                        <TextBody>{infoData?.shortName}</TextBody>
                    </td>
                </tr>
                <tr>
                    <td style={{ verticalAlign: 'baseline' }}>
                        <TextBody className={styles.boldText}>Popis:</TextBody>
                    </td>
                    <td>
                        <TextBody>
                            <div dangerouslySetInnerHTML={{ __html: infoData?.description ?? '' }} />
                        </TextBody>
                    </td>
                </tr>
            </table>
            {/* Filter */}
            <Filter form={() => <></>} defaultFilterValues={{}} />
            {/* Actions */}
            <ButtonGroupRow>
                <Button label="Export" />
                <Button label="Poslať email" variant="secondary" />
                <Button label="+ Pridať člena" />
                <TextBody className={styles.marginLeftAuto}>Zobrazit</TextBody>
                <SimpleSelect
                    onChange={(label) => {
                        // setListParams({ ...listParams, perPage: Number(label.target.value) })
                    }}
                    id="select"
                    label=""
                    options={[
                        { label: '10', value: '10' },
                        { label: '20', value: '20' },
                        { label: '50', value: '50' },
                        { label: '100', value: '100' },
                    ]}
                />
            </ButtonGroupRow>
            {successfulUpdatedData && (
                <IconWithText icon={GreenCheckOutlineIcon}>
                    <TextBody className={styles.greenBoldText}>Člen úspešne pridaný.</TextBody>
                </IconWithText>
            )}
            {/* Table */}
            <Table columns={columns} />
            <Paginator
                pageNumber={1}
                pageSize={10}
                dataLength={identitiesData?.count ?? 0}
                onPageChanged={function (pageNumber: number): void {
                    throw new Error('Function not implemented.')
                }}
            />
        </>
    )
}

export default KSIVSPage
