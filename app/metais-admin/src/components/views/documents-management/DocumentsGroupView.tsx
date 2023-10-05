import { Filter } from '@isdd/idsk-ui-kit/filter'
import { Button, CheckBox, SimpleSelect, Table } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { ActionsOverTable, AttributeProfileType } from '@isdd/metais-common/index'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { DocumentGroup } from '@isdd/metais-common/api/generated/kris-swagger'
import { ColumnDef } from '@tanstack/react-table'
import classNames from 'classnames'

import { IView } from '@/components/containers/documents-management/DocumentsGroupContainer'

export const DocumentsGroupView: React.FC<IView> = ({ data }) => {
    const { id } = useParams()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const entityName = 'documentsGroup'

    const columns: Array<ColumnDef<DocumentGroup>> = [
        {
            header: t('egov.state'),
            accessorFn: (row) => row?.state,
            enableSorting: true,
            id: 'state',
            cell: (ctx) => (
                <Link to={'./' + ctx?.row?.original?.id} state={{ from: location }}>
                    {/* {statuses.find((s) => s.code == (ctx.getValue() as string))?.value} */}
                </Link>
            ),
        },
        {
            header: t('egov.name'),
            accessorFn: (row) => row?.name,
            enableSorting: true,
            id: 'name',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => ctx?.getValue?.() as string,
        },
        {
            header: t('egov.nameEng'),
            accessorFn: (row) => row?.nameEng,
            enableSorting: true,
            id: 'nameEng',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => ctx?.getValue?.() as string,
        },
    ]

    return <>{id}</>
}
