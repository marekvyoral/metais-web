import { FileExtensionEnum } from '@isdd/metais-common/components/actions-over-table'
import { ReportExecute } from '@isdd/metais-common/api/generated/report-swagger'
import { useExportXml5Hook, useExportCsv5Hook, useExportExcel5Hook } from '@isdd/metais-common/api/generated/impexp-cmdb-swagger'

export const useReportOnExportStart = () => {
    const exportCsv = useExportCsv5Hook()
    const exportXml = useExportXml5Hook()
    const exportExcel = useExportExcel5Hook()

    return (entityId: number, filter: ReportExecute) => {
        return (exportValue: string, extension: FileExtensionEnum) => {
            if (exportValue === 'items')
                switch (extension) {
                    case FileExtensionEnum.XML:
                        exportXml(entityId, filter)
                        break
                    case FileExtensionEnum.CSV:
                        exportCsv(entityId, filter)
                        break
                    case FileExtensionEnum.XLSX:
                        exportExcel(entityId, filter)
                        break
                }
        }
    }
}
