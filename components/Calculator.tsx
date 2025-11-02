
import React, { useState, useMemo, useEffect } from 'react';
import { ServiceType, CustomerType } from '../types';
import { PRICING, MAX_LENGTH, MAX_DISTANCE } from '../constants';
import { CleaningIcon, InspectionIcon, BothIcon, SettingsIcon, UserIcon, BuildingIcon, WhatsAppIcon, InfoIcon } from './icons';

interface PriceDetails {
  travelCost: number;
  serviceCost: number;
  emergencyFee: number;
  subtotal: number;
  total: number;
  length: number;
  distance: number;
  isEmergency: boolean;
  fixedCosts: { label: string, price: number }[];
}

interface CalculatorProps {
  isEditorMode?: boolean; // New prop to control editor-specific features
}

const ServiceButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const baseClasses = "flex-1 p-4 rounded-lg text-center cursor-pointer transition-all duration-300 transform flex flex-col md:flex-row items-center justify-center gap-3";
  const activeClasses = "bg-orange-600 shadow-lg scale-105";
  const inactiveClasses = "bg-slate-700 hover:bg-slate-600";
  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="font-semibold text-sm md:text-base">{label}</span>
    </div>
  );
};

const Calculator: React.FC<CalculatorProps> = ({ isEditorMode = false }) => { // Default to false
  const [service, setService] = useState<ServiceType>(ServiceType.Cleaning);
  const [customerType, setCustomerType] = useState<CustomerType>(CustomerType.Legal);
  const [length, setLength] = useState<number>(20);
  const [diameterMultiplier, setDiameterMultiplier] = useState<number>(PRICING.DIAMETER_OPTIONS[0].value);
  const [materialMultiplier, setMaterialMultiplier] = useState<number>(PRICING.MATERIAL_OPTIONS[0].value);
  const [networkStateMultiplier, setNetworkStateMultiplier] = useState<number>(PRICING.NETWORK_STATE_OPTIONS[0].value);
  const [networkTypeMultiplier, setNetworkTypeMultiplier] = useState<number>(PRICING.NETWORK_TYPE_OPTIONS[0].value);
  const [inspectionTypeMultiplier, setInspectionTypeMultiplier] = useState<number>(PRICING.INSPECTION_TYPE_OPTIONS[0].value);
  const [domesticSewageTypeMultiplier, setDomesticSewageTypeMultiplier] = useState<number>(PRICING.DOMESTIC_SEWAGE_TYPE_OPTIONS[0].value);
  const [isEmergency, setIsEmergency] = useState<boolean>(false);
  
  // New state for client details and address
  const [clientName, setClientName] = useState('');
  const [workAddressStreet, setWorkAddressStreet] = useState('');
  const [workAddressNumber, setWorkAddressNumber] = useState('');
  const [workAddressCity, setWorkAddressCity] = useState('');
  const [distance, setDistance] = useState(15);
  
  // State for Legal Entity
  const [legalEntityType, setLegalEntityType] = useState(PRICING.LEGAL_ENTITY_OPTIONS[0].value);
  const [selectedSubOptions, setSelectedSubOptions] = useState<Record<string, boolean>>({});

  const [showPriceEditor, setShowPriceEditor] = useState<boolean>(false);
  const [cleaningPricePerMeter, setCleaningPricePerMeter] = useState<number>(PRICING.CLEANING_PER_METER);
  const [inspectionPricePerMeter, setInspectionPricePerMeter] = useState<number>(PRICING.INSPECTION_PER_METER);

  // Reset sub-options when service type or legal entity type changes
  useEffect(() => {
    if (customerType === CustomerType.Legal) {
      setSelectedSubOptions({});
    }
  }, [service, legalEntityType, customerType]);


  const filteredLegalEntitySubOptions = useMemo(() => {
    const selectedLocation = PRICING.LEGAL_ENTITY_OPTIONS.find(opt => opt.value === legalEntityType);
    if (!selectedLocation) return [];

    if (service === ServiceType.Cleaning) {
        return selectedLocation.subOptions.filter(so => so.category === 'cleaning' || so.category === 'other_fixed');
    }
    if (service === ServiceType.Inspection) {
        return selectedLocation.subOptions.filter(so => so.category === 'inspection' || so.category === 'report');
    }
    // if (service === ServiceType.Both)
    return selectedLocation.subOptions;
  }, [legalEntityType, service]);


  const priceDetails = useMemo<PriceDetails>(() => {
    let serviceCost = 0;
    const fixedCosts: { label: string, price: number }[] = [];
    let perMeterCleaningCost = 0;
    let perMeterInspectionCost = 0;

    if (customerType === CustomerType.Legal) {
        const selectedLocation = PRICING.LEGAL_ENTITY_OPTIONS.find(opt => opt.value === legalEntityType);
        let fixedCostSum = 0;

        if (selectedLocation) {
            Object.entries(selectedSubOptions).forEach(([optionId, isSelected]) => {
                if (isSelected) {
                    const subOption = selectedLocation.subOptions.find(so => so.id === optionId);
                    if (subOption) {
                        if (subOption.type === 'fixed' && subOption.price) {
                            fixedCostSum += subOption.price;
                            fixedCosts.push({ label: subOption.label, price: subOption.price });
                        } else if (subOption.type === 'per_meter') {
                            const isInspection = subOption.category === 'inspection';
                            const basePrice = isInspection ? inspectionPricePerMeter : cleaningPricePerMeter;
                            const multiplier = subOption.multiplier || 1.0;
                            const currentServiceCost = length * basePrice * multiplier * diameterMultiplier;

                            if (isInspection) {
                                perMeterInspectionCost += currentServiceCost;
                            } else {
                                perMeterCleaningCost += currentServiceCost;
                            }
                        }
                    }
                }
            });
        }
        
        let totalPerMeterCost = perMeterCleaningCost + perMeterInspectionCost;
        // Apply 10% discount if "Ambele Servicii" is selected
        if (service === ServiceType.Both && perMeterCleaningCost > 0 && perMeterInspectionCost > 0) {
            totalPerMeterCost *= 0.9;
        }

        serviceCost = totalPerMeterCost + fixedCostSum;

    } else { // Physical Person
        const finalDomesticMultiplier = domesticSewageTypeMultiplier;
        const cleaningMultiplier = diameterMultiplier * materialMultiplier * networkStateMultiplier * networkTypeMultiplier * finalDomesticMultiplier;
        const inspectionMultiplier = diameterMultiplier * inspectionTypeMultiplier;

        if (service === ServiceType.Cleaning) {
            serviceCost = length * cleaningPricePerMeter * cleaningMultiplier;
        } else if (service === ServiceType.Inspection) {
            serviceCost = length * inspectionPricePerMeter * inspectionMultiplier;
        } else if (service === ServiceType.Both) {
            const cleaningCost = length * cleaningPricePerMeter * cleaningMultiplier;
            const inspectionCost = length * inspectionPricePerMeter * inspectionMultiplier;
            serviceCost = (cleaningCost + inspectionCost) * 0.9; // 10% discount for both
        }
    }

    const travelCost = distance * PRICING.TRANSPORT_FEE_PER_KM;
    const subtotalBeforeEmergency = serviceCost + travelCost;
    const emergencyFee = isEmergency ? subtotalBeforeEmergency * (PRICING.EMERGENCY_SURCHARGE_PERCENT / 100) : 0;
    const total = subtotalBeforeEmergency + emergencyFee;

    return { travelCost, serviceCost, emergencyFee, subtotal: subtotalBeforeEmergency, total, length, distance, isEmergency, fixedCosts };
  }, [
    service, customerType, length, diameterMultiplier, materialMultiplier, networkStateMultiplier, 
    networkTypeMultiplier, inspectionTypeMultiplier, domesticSewageTypeMultiplier, distance, 
    isEmergency, cleaningPricePerMeter, inspectionPricePerMeter, legalEntityType, selectedSubOptions
  ]);

  const whatsappMessage = useMemo(() => {
    let message = `*Solicitare Ofertă - Calculator Neovid Inspect*\n\n`;

    // Helper to find label from options array
    const findLabel = (options: { value: any, label: string }[], value: any) => 
        options.find(opt => opt.value === value)?.label || 'N/A';
    
    message += `*Nume Client:* ${clientName || 'Nespecificat'}\n`;
    message += `*Adresă Lucrare:*\n`;
    message += `  - Localitate: ${workAddressCity || 'Nespecificat'}\n`;
    message += `  - Strada: ${workAddressStreet || 'Nespecificat'}\n`;
    message += `  - Număr: ${workAddressNumber || 'Nespecificat'}\n`;
    message += `------------------------------------\n`;

    message += `*Tip Client:* ${customerType === CustomerType.Physical ? 'Persoană Fizică' : 'Persoană Juridică'}\n`;
    
    const serviceLabels = {
        [ServiceType.Cleaning]: 'Curățare Canalizare',
        [ServiceType.Inspection]: 'Inspecție Video',
        [ServiceType.Both]: 'Ambele Servicii',
    };
    message += `*Serviciu Principal:* ${serviceLabels[service]}\n`;
    message += `------------------------------------\n`;

    if (customerType === CustomerType.Physical) {
        message += `*Tip Canalizare Casnică:* ${findLabel(PRICING.DOMESTIC_SEWAGE_TYPE_OPTIONS, domesticSewageTypeMultiplier)}\n`;
        if (service === ServiceType.Inspection || service === ServiceType.Both) {
            message += `*Tip Inspecție:* ${findLabel(PRICING.INSPECTION_TYPE_OPTIONS, inspectionTypeMultiplier)}\n`;
        }
        if (service === ServiceType.Cleaning || service === ServiceType.Both) {
            message += `*Material:* ${findLabel(PRICING.MATERIAL_OPTIONS, materialMultiplier)}\n`;
            message += `*Stare Rețea:* ${findLabel(PRICING.NETWORK_STATE_OPTIONS, networkStateMultiplier)}\n`;
            message += `*Tip Rețea:* ${findLabel(PRICING.NETWORK_TYPE_OPTIONS, networkTypeMultiplier)}\n`;
        }
    } else { // Legal Entity
        message += `*Tip Locație:* ${findLabel(PRICING.LEGAL_ENTITY_OPTIONS, legalEntityType)}\n`;
        message += `*Servicii Solicitate:*\n`;
        
        const selectedLocation = PRICING.LEGAL_ENTITY_OPTIONS.find(opt => opt.value === legalEntityType);
        if (selectedLocation) {
            const selectedSubs = filteredLegalEntitySubOptions.filter(sub => selectedSubOptions[sub.id]);
            if (selectedSubs.length > 0) {
                 selectedSubs.forEach(sub => {
                    message += `  - ${sub.label}\n`;
                });
            } else {
                message += `  (Niciun serviciu specific selectat)\n`;
            }
        }
    }
    
    message += `------------------------------------\n`;
    message += `*Lungime Canalizare:* ${length} metri\n`;
    message += `*Diametru Conductă:* ${findLabel(PRICING.DIAMETER_OPTIONS, diameterMultiplier)}\n`;
    message += `*Distanță Estimată:* ${distance} km\n`;
    message += `*Urgență:* ${isEmergency ? 'Da' : 'Nu'}\n`;
    message += `------------------------------------\n`;
    message += `*TOTAL ESTIMATIV:* *${priceDetails.total.toFixed(2)} lei*\n`;
    message += `_(TVA ne-inclus)_`;

    return message;
}, [
    customerType, service, domesticSewageTypeMultiplier, inspectionTypeMultiplier,
    materialMultiplier, networkStateMultiplier, networkTypeMultiplier, legalEntityType,
    selectedSubOptions, length, diameterMultiplier, clientName, workAddressCity, workAddressStreet, workAddressNumber, distance, isEmergency,
    priceDetails.total, filteredLegalEntitySubOptions
]);


  const handleLegalEntityTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLegalEntityType(e.target.value);
  };

  const handleSubOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setSelectedSubOptions(prev => ({ ...prev, [id]: checked }));
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-10 grid md:grid-cols-2 gap-8 md:gap-12 border border-slate-700/50">
      {/* --- CONTROLS --- */}
      <div className="flex flex-col gap-8">
        <div>
          <label className="block text-lg font-medium mb-3 text-slate-300">Tip Client</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <ServiceButton 
              label="Persoană Juridică" 
              icon={<BuildingIcon className="w-6 h-6" />}
              isActive={customerType === CustomerType.Legal} 
              onClick={() => setCustomerType(CustomerType.Legal)} 
            />
            <ServiceButton 
              label="Persoană Fizică" 
              icon={<UserIcon className="w-6 h-6" />}
              isActive={customerType === CustomerType.Physical} 
              onClick={() => setCustomerType(CustomerType.Physical)} 
            />
          </div>
        </div>

        <div>
            <label className="block text-lg font-medium mb-3 text-slate-300">Tip Serviciu</label>
            <div className="flex flex-col sm:flex-row gap-3">
                <ServiceButton label="Curățare Canalizare" icon={<CleaningIcon className="w-6 h-6" />} isActive={service === ServiceType.Cleaning} onClick={() => setService(ServiceType.Cleaning)} />
                <ServiceButton label="Inspecție Video" icon={<InspectionIcon className="w-6 h-6" />} isActive={service === ServiceType.Inspection} onClick={() => setService(ServiceType.Inspection)} />
                <ServiceButton label="Ambele Servicii" icon={<BothIcon className="w-6 h-6" />} isActive={service === ServiceType.Both} onClick={() => setService(ServiceType.Both)} />
            </div>
        </div>

        {/* --- PHYSICAL PERSON FORM --- */}
        {customerType === CustomerType.Physical && (
            <>
                <div>
                    <label htmlFor="domestic-sewage-type-select" className="block text-lg font-medium mb-3 text-slate-300">Tip Canalizare Casnică</label>
                    <select id="domestic-sewage-type-select" value={domesticSewageTypeMultiplier} onChange={(e) => setDomesticSewageTypeMultiplier(Number(e.target.value))} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                        {PRICING.DOMESTIC_SEWAGE_TYPE_OPTIONS.map(opt => (<option key={opt.label} value={opt.value}>{opt.label}</option>))}
                    </select>
                </div>
                {(service === ServiceType.Inspection || service === ServiceType.Both) && (
                    <div>
                        <label htmlFor="inspection-type-select" className="block text-lg font-medium mb-3 text-slate-300">Tip Inspecție</label>
                        <select id="inspection-type-select" value={inspectionTypeMultiplier} onChange={(e) => setInspectionTypeMultiplier(Number(e.target.value))} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                            {PRICING.INSPECTION_TYPE_OPTIONS.map(opt => (<option key={opt.label} value={opt.value}>{opt.label}</option>))}
                        </select>
                    </div>
                )}
                {(service === ServiceType.Cleaning || service === ServiceType.Both) && (
                    <>
                        <div>
                            <label htmlFor="material-select" className="block text-lg font-medium mb-3 text-slate-300">Material conductă</label>
                            <select id="material-select" value={materialMultiplier} onChange={(e) => setMaterialMultiplier(Number(e.target.value))} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                                {PRICING.MATERIAL_OPTIONS.map(opt => (<option key={opt.label} value={opt.value}>{opt.label}</option>))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="network-state-select" className="block text-lg font-medium mb-3 text-slate-300">Stare Rețea</label>
                            <select id="network-state-select" value={networkStateMultiplier} onChange={(e) => setNetworkStateMultiplier(Number(e.target.value))} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                                {PRICING.NETWORK_STATE_OPTIONS.map(opt => (<option key={opt.label} value={opt.value}>{opt.label}</option>))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="network-type-select" className="block text-lg font-medium mb-3 text-slate-300">Tip Rețea</label>
                            <select id="network-type-select" value={networkTypeMultiplier} onChange={(e) => setNetworkTypeMultiplier(Number(e.target.value))} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                                {PRICING.NETWORK_TYPE_OPTIONS.map(opt => (<option key={opt.label} value={opt.value}>{opt.label}</option>))}
                            </select>
                        </div>
                    </>
                )}
            </>
        )}

        {/* --- LEGAL ENTITY FORM --- */}
        {customerType === CustomerType.Legal && (
            <>
                <div>
                    <label htmlFor="legal-entity-type-select" className="block text-lg font-medium mb-3 text-slate-300">Tip locație / activitate</label>
                    <select id="legal-entity-type-select" value={legalEntityType} onChange={handleLegalEntityTypeChange} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                        {PRICING.LEGAL_ENTITY_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                    </select>
                </div>
                 <div>
                    <label className="block text-lg font-medium mb-3 text-slate-300">Servicii Solicitate</label>
                    <div className="space-y-3">
                        {filteredLegalEntitySubOptions.map(subOpt => (
                            <label key={subOpt.id} htmlFor={subOpt.id} className="flex items-center p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors">
                                <input
                                    type="checkbox"
                                    id={subOpt.id}
                                    checked={selectedSubOptions[subOpt.id] || false}
                                    onChange={handleSubOptionChange}
                                    className="h-5 w-5 rounded border-slate-500 text-orange-600 focus:ring-orange-500 bg-slate-800 flex-shrink-0"
                                />
                                <span className="ml-3 text-slate-200 flex-grow">{subOpt.label}</span>
                                {subOpt.description && (
                                    <div className="relative group flex items-center ml-auto pl-2 flex-shrink-0">
                                        <InfoIcon className="w-5 h-5 text-slate-400 group-hover:text-orange-400 transition-colors" />
                                        <div className="absolute bottom-full mb-2 w-64 p-3 bg-slate-900 border border-slate-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 left-1/2 -translate-x-1/2">
                                            {subOpt.description}
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-900"></div>
                                        </div>
                                    </div>
                                )}
                            </label>
                        ))}
                    </div>
                </div>
            </>
        )}

        {/* --- COMMON FIELDS --- */}
        <div>
            <label htmlFor="length-input" className="block text-lg font-medium mb-3 text-slate-300">
                Lungime Canalizare (metri)
            </label>
            <input
                id="length-input"
                type="number"
                min="1"
                max={MAX_LENGTH}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder={`ex: 25`}
            />
        </div>
        <div>
            <label htmlFor="diameter-select" className="block text-lg font-medium mb-3 text-slate-300">Diametru conductă (DN)</label>
            <select id="diameter-select" value={diameterMultiplier} onChange={(e) => setDiameterMultiplier(Number(e.target.value))} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                {PRICING.DIAMETER_OPTIONS.map(opt => (<option key={opt.label} value={opt.value}>{opt.label}</option>))}
            </select>
        </div>

        <div className="border-t border-slate-700 pt-6 space-y-4">
            <div>
                <label htmlFor="client-name" className="block text-lg font-medium mb-3 text-slate-300">Nume / Denumire Firmă</label>
                <input type="text" id="client-name" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="ex: Popescu Ion / SC NEOVID SRL" className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
            </div>
            <div>
                <label className="block text-lg font-medium mb-3 text-slate-300">Adresă Lucrare</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input type="text" value={workAddressCity} onChange={(e) => setWorkAddressCity(e.target.value)} placeholder="Localitate" className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                    <input type="text" value={workAddressStreet} onChange={(e) => setWorkAddressStreet(e.target.value)} placeholder="Strada" className="sm:col-span-2 w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                    <input type="text" value={workAddressNumber} onChange={(e) => setWorkAddressNumber(e.target.value)} placeholder="Număr" className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                </div>
            </div>
            <div>
                <label htmlFor="distance-input" className="block text-lg font-medium mb-3 text-slate-300">Distanța (km)</label>
                <input
                    id="distance-input"
                    type="number"
                    min="0"
                    max={MAX_DISTANCE}
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder="ex: 15"
                />
                <p className="text-xs text-slate-500 mt-2">Calculați distanța de la Mogoșoaia, Str. Livezilor folosind Google Maps.</p>
            </div>
        </div>

        <div>
            <label className="flex items-center justify-between cursor-pointer pt-6 border-t border-slate-700">
                <span className="text-lg font-medium text-slate-300">Intervenție de Urgență?</span>
                <div className="relative">
                    <input type="checkbox" className="sr-only" checked={isEmergency} onChange={() => setIsEmergency(!isEmergency)} />
                    <div className={`block w-14 h-8 rounded-full transition ${isEmergency ? 'bg-orange-500' : 'bg-slate-700'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${isEmergency ? 'translate-x-6' : ''}`}></div>
                </div>
            </label>
        </div>

        {/* Price Adjustment section - only visible in editor mode */}
        {isEditorMode && (
          <div className="border-t border-slate-700 pt-6">
              <button onClick={() => setShowPriceEditor(!showPriceEditor)} className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors w-full">
                  <SettingsIcon className="w-5 h-5" />
                  <span className="font-medium">Ajustare Prețuri</span>
              </button>
              {showPriceEditor && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                          <label htmlFor="cleaning-price" className="block text-sm font-medium text-slate-300 mb-1">Preț Curățare / metru</label>
                          <input type="number" id="cleaning-price" value={cleaningPricePerMeter} onChange={(e) => setCleaningPricePerMeter(Number(e.target.value))} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                      </div>
                      <div>
                          <label htmlFor="inspection-price" className="block text-sm font-medium text-slate-300 mb-1">Preț Inspecție / metru</label>
                          <input type="number" id="inspection-price" value={inspectionPricePerMeter} onChange={(e) => setInspectionPricePerMeter(Number(e.target.value))} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                      </div>
                  </div>
              )}
          </div>
        )}
      </div>

      {/* --- RESULTS --- */}
      <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-6 flex flex-col justify-between border border-slate-700/50">
        <div>
            <h2 className="text-2xl font-bold mb-6 text-slate-200 border-b border-slate-700 pb-4">Cost Estimativ</h2>
            <div className="space-y-4 text-slate-300">
              <div className="flex justify-between items-center"><span>Cost Deplasare ({priceDetails.distance} km)</span> <span className="font-medium">{priceDetails.travelCost.toFixed(2)} lei</span></div>
              <div className="flex justify-between items-center"><span>Cost Servicii</span> <span className="font-medium">{priceDetails.serviceCost.toFixed(2)} lei</span></div>
              {priceDetails.isEmergency && (
                <div className="flex justify-between items-center text-orange-400">
                    <span>Taxă Urgență (+{PRICING.EMERGENCY_SURCHARGE_PERCENT}%)</span>
                    <span className="font-bold">{priceDetails.emergencyFee.toFixed(2)} lei</span>
                </div>
              )}
            </div>
        </div>
        
        <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-700">
            <div className="flex justify-between items-baseline">
                <span className="text-xl font-bold text-slate-200">TOTAL ESTIMATIV</span>
                <span className="text-4xl font-anton text-orange-500 tracking-wide">{priceDetails.total.toFixed(2)} lei</span>
            </div>
            
            <a 
              href={`https://wa.me/40733519148?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full flex items-center justify-center gap-3 bg-green-500 text-white px-6 py-4 rounded-lg hover:bg-green-600 transition-colors duration-300 shadow-lg text-lg font-bold"
            >
                <WhatsAppIcon className="w-6 h-6" />
                <span>Trimite pe WhatsApp</span>
            </a>

            <p className="text-xs text-slate-500 mt-4 text-center">
                *Acesta este un preț estimativ. TVA-ul nu este inclus. Pentru o ofertă exactă, vă rugăm să ne contactați.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
