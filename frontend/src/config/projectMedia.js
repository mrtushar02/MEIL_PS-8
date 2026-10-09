/**
 * MEIL Project & Operations Real Media Configuration
 * 
 * Aap yahan kisi bhi image ka path (src), title, subtitle ya tag change kar sakte hain.
 * Sabhi dashboards aur pages yahan se real photos load karte hain.
 */

export const MEIL_MEDIA = {
  // 1. Zojila Tunnel / Underground Highway (Site-102)
  zojilaTunnel: {
    id: 'zojila-tunnel',
    src: '/meil_zojila_tunnel.jpg',
    title: 'Zojila Tunnel Construction Site',
    subtitle: 'Jammu & Kashmir · PKG-2 (13.1 km Strategic High-Altitude Tunnel)',
    bu: 'Transportation & Infrastructure',
    tag: 'Active Strategic Site'
  },

  // 2. Polavaram Irrigation & Hydroelectric Dam
  polavaramDam: {
    id: 'polavaram-dam',
    src: '/meil_polavaram_dam.jpg',
    title: 'Polavaram National Multi-Purpose Irrigation Project',
    subtitle: 'Godavari Basin · ECRF Dam, Spillway & 960 MW Hydroelectric Power House',
    bu: 'Water & Hydro Infrastructure',
    tag: 'National Milestone'
  },

  // 3. Ultra Mega Solar Power Farm & BESS
  solarMegaPark: {
    id: 'solar-mega-park',
    src: '/meil_solar_mega_park.jpg',
    title: 'Ultra Mega Solar Power Park & Clean Grid',
    subtitle: '500 MW Solar Photovoltaic Utility Farm & Battery Energy Storage (BESS)',
    bu: 'Renewable Energy',
    tag: 'Zero Emission Generation'
  },

  // 4. Water Treatment Plant & Effluent Reservoirs
  waterTreatmentPlant: {
    id: 'water-treatment-plant',
    src: '/meil_water_treatment_plant.jpg',
    title: 'Integrated Water Treatment & ZLD Reservoirs',
    subtitle: 'Industrial Effluent Treatment, Clariflocculator & Zero Liquid Discharge',
    bu: 'Water & Environmental Engineering',
    tag: 'Water Positive Circularity'
  },

  // 5. Coastal Thermal Power & Industrial Chimney Facility
  coastalPowerPlant: {
    id: 'coastal-power-plant',
    src: '/meil_coastal_power_plant.jpg',
    title: 'Coastal Thermal & Super-Critical Power Station',
    subtitle: 'Flue Gas Desulfurization (FGD), Online CEMS & Marine Cooling Telemetry',
    bu: 'Energy & Thermal BU',
    tag: 'Clean Combustion Telemetry'
  },

  // 6. Thermal Power & Cooling Towers
  thermalPowerPlant: {
    id: 'thermal-power',
    src: '/meil_thermal_power_plant.jpg',
    title: 'Thermal Energy & Power Generation Station',
    subtitle: 'CEMS Continuous Stack Emission & Cooling Water Circulation Monitoring',
    bu: 'Energy & Thermal BU',
    tag: 'EHS Environmental Audit'
  },

  // 7. Hydrocarbons, Refinery & Process Pipelines
  hydrocarbonPlant: {
    id: 'hydrocarbon-refinery',
    src: '/meil_hydrocarbon_refinery.jpg',
    title: 'Hydrocarbon Refinery & Gas Pipeline Network',
    subtitle: 'Industrial Process Pipelines & Real-time Fugitive Emission Controls',
    bu: 'Hydrocarbons BU',
    tag: 'Industrial Facility'
  },

  // 8. Heavy Logistics, Cargo & Supply Chain Transport
  logisticsCargo: {
    id: 'logistics-cargo',
    src: '/meil_logistics_cargo.jpg',
    title: 'MEIL Heavy Transport & Air Cargo Fleet',
    subtitle: 'Scope 3 Supply Chain Logistics & Strategic Material Mobilization',
    bu: 'Sustainable Procurement & Supply Chain',
    tag: 'Fleet Logistics'
  },

  // 9. CSR Community Engagement & Dignitary Ceremony
  csrInauguration: {
    id: 'csr-inauguration',
    src: '/meil_csr_community_inauguration.jpg',
    title: 'Community Welfare & Infrastructure Foundation',
    subtitle: 'MEIL Foundation Rural Healthcare & Education Inauguration Ceremony',
    bu: 'CSR & Social Development',
    tag: 'Social Impact Verified'
  }
};

export default MEIL_MEDIA;
