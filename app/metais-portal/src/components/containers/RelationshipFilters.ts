import { NeighboursFilterContainerUi } from '@/api'

export const defaultSourceRelationshipTabFilter: NeighboursFilterContainerUi = {
    neighboursFilter: {
        ciType: ['ISVS', 'AS', 'InfraSluzba', 'osobitny_postup_ITVS'],
        metaAttributes: { state: ['DRAFT'] },
        relType: ['ISVS_patri_pod_ISVS', 'ISVS_realizuje_AS', 'ISVS_realizuje_infrastrukturnu_sluzbu', 'osobitny_postup_vztah_ISVS'],
    },
}

export const defaultTargetRelationshipTabFilter: NeighboursFilterContainerUi = {
    neighboursFilter: {
        ciType: ['InfraSluzba', 'ISVS', 'PO', 'ISVS'],
        metaAttributes: { state: ['DRAFT'] },
        relType: [
            'InfraSluzba_prevadzkuje_ISVS',
            'ISVS_patri_pod_ISVS',
            'PO_je_spravca_ISVS',
            'Projekt_realizuje_ISVS',
            'PO_je_prevadzkovatel_ISVS',
            'Sluzba_sluzi_ISVS',
        ],
    },
}

export const defaultDocumentsTabFilter: NeighboursFilterContainerUi = {
    neighboursFilter: {
        ciType: ['Dokument'],
        metaAttributes: { state: ['DRAFT'] },
        relType: ['CI_HAS_DOCUMENT', 'Dokument_sa_tyka_KRIS', 'CONTROL_HAS_DOCUMENT', 'PROJECT_HAS_DOCUMENT'],
        usageType: ['system', 'application'],
    },
}
