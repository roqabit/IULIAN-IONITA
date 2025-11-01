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
        { id: 'resto_kitchen_pipe', label: 'Desfundare / curățare conductă bucătărie', type: 'per_meter', category: 'cleaning', multiplier: 1.5, description: 'Curățarea mecanizată a conductelor de bucătărie pentru eliminarea depunerilor de grăsimi și resturi alimentare care cauzează blocaje și mirosuri neplăcute.' },
        { id: 'resto_grease_trap', label: 'Vidanjare & spălare separator grăsimi', type: 'fixed', category: 'other_fixed', price: 750, description: 'Golirea completă a separatorului de grăsimi, spălarea sub presiune a pereților și a elementelor interioare pentru o funcționare optimă și conformă.' },
        { id: 'resto_inspection_dsp', label: 'Inspecție video cu raport pentru DSP', type: 'per_meter', category: 'inspection', multiplier: 1.4, description: 'Inspecție video detaliată a canalizării, finalizată cu un raport tehnic necesar pentru avizul Direcției de Sănătate Publică (DSP).' },
      ],
    },
    {
      value: 'industrial',
      label: '🏭 Hală industrială / Depozit / Service auto',
      subOptions: [
        { id: 'ind_gutters', label: 'Curățare rigole & pluvial parcare', type: 'per_meter', category: 'cleaning', multiplier: 1.3, description: 'Curățarea rigolelor de colectare a apelor pluviale și a rețelei aferente din parcări sau zone industriale, pentru prevenirea inundațiilor.' },
        { id: 'ind_hydrocarbon_sep', label: 'Vidanjare separatoare hidrocarburi', type: 'fixed', category: 'other_fixed', price: 1200, description: 'Golirea completă a separatoarelor de uleiuri și hidrocarburi, o operațiune esențială pentru service-uri auto și zone industriale.' },
        { id: 'ind_internal_inspection', label: 'Inspecție video canalizare internă', type: 'per_meter', category: 'inspection', description: 'Verificarea stării rețelei interioare de canalizare pentru identificarea blocajelor, fisurilor sau altor defecte structurale.' },
        { id: 'ind_audit_report', label: 'Raport tehnic pentru audit', type: 'fixed', category: 'report', price: 400, description: 'Întocmirea unui raport tehnic detaliat în urma inspecției video, necesar pentru audituri de mediu, mentenanță sau recepție.' },
      ]
    },
    {
      value: 'residential_complex',
      label: '🏘️ Ansamblu rezidențial privat (dezvoltator)',
      subOptions: [
        { id: 'res_main_collector', label: 'Curățare colector principal cartier', type: 'per_meter', category: 'cleaning', multiplier: 1.2, description: 'Curățarea conductei principale care colectează apele uzate de la toate imobilele din ansamblul rezidențial.' },
        { id: 'res_manholes', label: 'Curățare cămine individuale (preț/buc)', type: 'fixed', category: 'other_fixed', price: 250, description: 'Curățarea și decolmatarea căminelor de vizitare individuale pentru a asigura un flux corespunzător în rețea.' },
        { id: 'res_acceptance_inspection', label: 'Inspecție video pentru recepție lucrări', type: 'per_meter', category: 'inspection', description: 'Inspecție video finală a rețelei de canalizare, necesară pentru procesul verbal de recepție a lucrărilor cu constructorul.' },
        { id: 'res_developer_report', label: 'Raport scris pentru dezvoltator', type: 'fixed', category: 'report', price: 350, description: 'Elaborarea unui raport tehnic scris, cu imagini și constatări, ce poate fi prezentat dezvoltatorului sau autorităților.' },
      ]
    },
    {
      value: 'store',
      label: '🛒 Magazin / Supermarket / Mall',
      subOptions: [
        { id: 'store_cleaning', label: 'Curățare canalizare menajeră/pluvială', type: 'per_meter', category: 'cleaning', description: 'Serviciu de mentenanță sau de urgență pentru curățarea rețelelor de canalizare menajeră (toalete, chiuvete) și pluvială (acoperiș, parcare).' },
        { id: 'store_inspection', label: 'Inspecție video de mentenanță', type: 'per_meter', category: 'inspection', description: 'Verificare periodică a stării canalizării pentru a preveni blocajele și a identifica problemele înainte ca acestea să devină grave.' },
        { id: 'store_grease_trap', label: 'Curățare separator grăsimi (dacă există)', type: 'fixed', category: 'other_fixed', price: 500, description: 'Vidanjarea și curățarea separatorului de grăsimi, specific zonelor de gastronomie din supermarketuri sau mall-uri.' },
      ],
    },
    {
      value: 'office',
      label: '🏢 Clădire de birouri / Sediu firmă',
      subOptions: [
        { id: 'office_main', label: 'Curățare rețea principală (subsol)', type: 'per_meter', category: 'cleaning', description: 'Curățarea colectorului principal al clădirii, localizat de obicei în subsol, pentru a asigura o funcționare fără probleme a întregului sistem.' },
        { id: 'office_vertical', label: 'Curățare coloane verticale', type: 'per_meter', category: 'cleaning', multiplier: 1.4, description: 'Curățarea coloanelor verticale de scurgere care deservesc etajele superioare (toalete, oficii), adesea predispuse la depuneri.' },
        { id: 'office_inspection', label: 'Inspecție video de mentenanță', type: 'per_meter', category: 'inspection', description: 'Inspecție periodică pentru a evalua starea rețelei de canalizare și a planifica eventualele intervenții de reparații.' },
      ],
    },
    {
      value: 'public_institution',
      label: '🏫 Instituție publică (școală/spital/primărie)',
      subOptions: [
        { id: 'public_main', label: 'Curățare rețea principală', type: 'per_meter', category: 'cleaning', multiplier: 1.1, description: 'Curățarea periodică sau de urgență a rețelei de canalizare principale a instituției pentru a asigura igiena și funcționalitatea.' },
        { id: 'public_inspection_constatare', label: 'Inspecție video - Constatare', type: 'per_meter', category: 'inspection', multiplier: 1.2, description: 'Inspecție pentru a identifica cauza unei probleme specifice (ex: blocaj recurent, infiltrații).' },
        { id: 'public_inspection_receptie', label: 'Inspecție video - Recepție', type: 'per_meter', category: 'inspection', multiplier: 1.3, description: 'Inspecție necesară la finalizarea unor lucrări de construcție sau reabilitare a rețelei de canalizare.' },
        { id: 'public_inspection_expertiza', label: 'Inspecție video - Expertiză', type: 'per_meter', category: 'inspection', multiplier: 1.6, description: 'Inspecție amănunțită, cu raport tehnic detaliat, pentru expertize tehnice, litigii sau proiecte de reabilitare complexă.' },
        { id: 'public_grease_trap', label: 'Curățare separator grăsimi (cantină)', type: 'fixed', category: 'other_fixed', price: 600, description: 'Vidanjarea și curățarea separatorului de grăsimi de la cantina sau bucătăria instituției.' },
      ],
    },
    {
      value: 'street_network',
      label: '🛣️ Rețea stradală / municipală',
      subOptions: [
        { id: 'street_main', label: 'Curățare canal colector stradal', type: 'per_meter', category: 'cleaning', multiplier: 1.8, description: 'Curățarea conductelor de diametre mari din rețeaua publică de canalizare, o operațiune de anvergură ce necesită echipamente specializate.' },
        { id: 'street_inspection', label: 'Inspecție video rețea publică', type: 'per_meter', category: 'inspection', multiplier: 1.3, description: 'Inspectarea video a rețelelor stradale pentru identificarea problemelor structurale, a infiltrațiilor sau a gradului de colmatare.' },
        { id: 'street_manholes', label: 'Curățare cămine stradale (preț/buc)', type: 'fixed', category: 'other_fixed', price: 300, description: 'Decolmatarea și curățarea căminelor de vizitare din rețeaua stradală pentru a asigura accesul și funcționarea corectă a sistemului.' },
      ],
    },
    {
      value: 'gas_station',
      label: '⛽ Stație Peco / Spălătorie auto',
      subOptions: [
        { id: 'gas_separators', label: 'Vidanjare separatoare hidrocarburi', type: 'fixed', category: 'other_fixed', price: 1500, description: 'Vidanjarea și curățarea separatoarelor de produse petroliere, conform normelor de mediu. O operațiune obligatorie și esențială.' },
        { id: 'gas_gutters', label: 'Curățare rigole și pluvial', type: 'per_meter', category: 'cleaning', description: 'Curățarea sistemului de colectare a apelor pluviale din zona pompelor și a spălătoriei pentru a preveni acumularea de apă și mizerie.' },
        { id: 'gas_inspection', label: 'Inspecție video cu raport de conformitate', type: 'per_meter', category: 'inspection', multiplier: 1.5, description: 'Inspecție video a întregii rețele, finalizată cu un raport care atestă conformitatea cu normele de mediu și funcționarea corectă.' },
      ],
    },
  ] as LegalEntityOption[],
};

export const MAX_LENGTH = 100; // metri
export const MAX_DISTANCE = 150; // km
