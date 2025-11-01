import { LegalEntityOption } from "./types";

export const PRICING = {
  CLEANING_PER_METER: 25, // lei
  INSPECTION_PER_METER: 18, // lei
  TRANSPORT_FEE_PER_KM: 3, // lei
  EMERGENCY_SURCHARGE_PERCENT: 50, // 50% extra
  DIAMETER_OPTIONS: [
    { value: 1.0, label: '75mm' },
    { value: 1.0, label: '110mm' },
    { value: 1.2, label: '160mm' },
    { value: 1.5, label: '200mm' },
    { value: 1.8, label: '250mm' },
    { value: 2.2, label: '315mm' },
    { value: 2.8, label: '400mm' },
    { value: 3.5, label: '500mm' },
    { value: 4.5, label: '600mm' },
    { value: 6.0, label: '800mm' },
    { value: 8.0, label: '1000mm' },
  ],
  MATERIAL_OPTIONS: [
    { value: 1.0, label: 'PVC' },
    { value: 1.0, label: 'Polietilenă' },
    { value: 1.2, label: 'PAFSIN (fibrociment)' },
    { value: 1.5, label: 'Beton' },
  ],
  NETWORK_STATE_OPTIONS: [
    { value: 1.0, label: 'Nouă' },
    { value: 1.1, label: 'În funcțiune' },
    { value: 1.3, label: 'Veche' },
  ],
  NETWORK_TYPE_OPTIONS: [
    { value: 1.0, label: 'Pluvială' },
    { value: 1.1, label: 'Menajeră' },
    { value: 1.2, label: 'Combinată' },
    { value: 1.5, label: 'Industrială' },
  ],
  INSPECTION_TYPE_OPTIONS: [
    { value: 1.2, label: 'Recepție lucrare' },
    { value: 1.0, label: 'Constatare' },
    { value: 1.0, label: 'Inspecție înainte de reabilitare' },
    { value: 1.1, label: 'Inspecție post-reabilitare' },
  ],
  DOMESTIC_SEWAGE_TYPE_OPTIONS: [
    { value: 1.0, label: '🏠 Casă individuală (baie/bucătărie)' },
    { value: 1.2, label: '🏢 Bloc / apartament (coloane/subsol)' },
    { value: 1.1, label: '🏘️ Duplex / ansamblu rezidențial' },
    { value: 1.3, label: '🚿 Fosa septică / ministație' },
    { value: 1.0, label: '🌧️ Canal pluvial (curte / acoperiș)' },
    { value: 1.4, label: '🕳️ Cămine colmatate / drenaje curte' },
    { value: 1.5, label: '🧱 Racord casă – stradă' },
    { value: 1.2, label: '🏊 Canal piscină / drenaj subsol' },
  ],
  LEGAL_ENTITY_OPTIONS: [
    {
      value: 'restaurant',
      label: '🍽️ Restaurant / Fast-food / Bucătărie industrială',
      subOptions: [
        { id: 'resto_kitchen_pipe', label: 'Desfundare / curățare conductă bucătărie', type: 'per_meter', category: 'cleaning', multiplier: 1.5 },
        { id: 'resto_grease_trap', label: 'Vidanjare & spălare separator grăsimi', type: 'fixed', category: 'other_fixed', price: 750 },
        { id: 'resto_inspection_dsp', label: 'Inspecție video cu raport pentru DSP', type: 'per_meter', category: 'inspection', multiplier: 1.4 },
      ],
    },
    {
      value: 'industrial',
      label: '🏭 Hală industrială / Depozit / Service auto',
      subOptions: [
        { id: 'ind_gutters', label: 'Curățare rigole & pluvial parcare', type: 'per_meter', category: 'cleaning', multiplier: 1.3 },
        { id: 'ind_hydrocarbon_sep', label: 'Vidanjare separatoare hidrocarburi', type: 'fixed', category: 'other_fixed', price: 1200 },
        { id: 'ind_internal_inspection', label: 'Inspecție video canalizare internă', type: 'per_meter', category: 'inspection' },
        { id: 'ind_audit_report', label: 'Raport tehnic pentru audit', type: 'fixed', category: 'report', price: 400 },
      ]
    },
    {
      value: 'residential_complex',
      label: '🏘️ Ansamblu rezidențial privat (dezvoltator)',
      subOptions: [
        { id: 'res_main_collector', label: 'Curățare colector principal cartier', type: 'per_meter', category: 'cleaning', multiplier: 1.2 },
        { id: 'res_manholes', label: 'Curățare cămine individuale (preț/buc)', type: 'fixed', category: 'other_fixed', price: 250 },
        { id: 'res_acceptance_inspection', label: 'Inspecție video pentru recepție lucrări', type: 'per_meter', category: 'inspection' },
        { id: 'res_developer_report', label: 'Raport scris pentru dezvoltator', type: 'fixed', category: 'report', price: 350 },
      ]
    },
    {
      value: 'store',
      label: '🛒 Magazin / Supermarket / Mall',
      subOptions: [
        { id: 'store_cleaning', label: 'Curățare canalizare menajeră/pluvială', type: 'per_meter', category: 'cleaning' },
        { id: 'store_inspection', label: 'Inspecție video de mentenanță', type: 'per_meter', category: 'inspection' },
        { id: 'store_grease_trap', label: 'Curățare separator grăsimi (dacă există)', type: 'fixed', category: 'other_fixed', price: 500 },
      ],
    },
    {
      value: 'office',
      label: '🏢 Clădire de birouri / Sediu firmă',
      subOptions: [
        { id: 'office_main', label: 'Curățare rețea principală (subsol)', type: 'per_meter', category: 'cleaning' },
        { id: 'office_vertical', label: 'Curățare coloane verticale', type: 'per_meter', category: 'cleaning', multiplier: 1.4 },
        { id: 'office_inspection', label: 'Inspecție video de mentenanță', type: 'per_meter', category: 'inspection' },
      ],
    },
    {
      value: 'public_institution',
      label: '🏫 Instituție publică (școală/spital/primărie)',
      subOptions: [
        { id: 'public_main', label: 'Curățare rețea principală', type: 'per_meter', category: 'cleaning', multiplier: 1.1 },
        { id: 'public_inspection_constatare', label: 'Inspecție video - Constatare', type: 'per_meter', category: 'inspection', multiplier: 1.2 },
        { id: 'public_inspection_receptie', label: 'Inspecție video - Recepție', type: 'per_meter', category: 'inspection', multiplier: 1.3 },
        { id: 'public_inspection_expertiza', label: 'Inspecție video - Expertiză', type: 'per_meter', category: 'inspection', multiplier: 1.6 },
        { id: 'public_grease_trap', label: 'Curățare separator grăsimi (cantină)', type: 'fixed', category: 'other_fixed', price: 600 },
      ],
    },
    {
      value: 'street_network',
      label: '🛣️ Rețea stradală / municipală',
      subOptions: [
        { id: 'street_main', label: 'Curățare canal colector stradal', type: 'per_meter', category: 'cleaning', multiplier: 1.8 },
        { id: 'street_inspection', label: 'Inspecție video rețea publică', type: 'per_meter', category: 'inspection', multiplier: 1.3 },
        { id: 'street_manholes', label: 'Curățare cămine stradale (preț/buc)', type: 'fixed', category: 'other_fixed', price: 300 },
      ],
    },
    {
      value: 'gas_station',
      label: '⛽ Stație Peco / Spălătorie auto',
      subOptions: [
        { id: 'gas_separators', label: 'Vidanjare separatoare hidrocarburi', type: 'fixed', category: 'other_fixed', price: 1500 },
        { id: 'gas_gutters', label: 'Curățare rigole și pluvial', type: 'per_meter', category: 'cleaning' },
        { id: 'gas_inspection', label: 'Inspecție video cu raport de conformitate', type: 'per_meter', category: 'inspection', multiplier: 1.5 },
      ],
    },
  ] as LegalEntityOption[],
};

export const MAX_LENGTH = 100; // metri
export const MAX_DISTANCE = 150; // km