// GHG Protocol & SEBI BRSR Standard Calculation Engine
// Reference: SEBI Circular May 2021 & July 2023, CEA CO2 Baseline Database, GHG Protocol Corporate Standard

export const EMISSION_FACTORS = {
  dieselKgCo2ePerLitre: 2.68,
  petrolKgCo2ePerLitre: 2.31,
  naturalGasKgCo2ePerCubicMeter: 2.03,
  gridElectricityKgCo2ePerKwh: 0.716, // India Grid Average (CEA Baseline v19)
  renewableElectricityKgCo2ePerKwh: 0.00,
  cementScope3KgCo2ePerTonne: 820,
  steelScope3KgCo2ePerTonne: 1850,
  dieselEnergyMjPerLitre: 35.8,
  gridElectricityMjPerKwh: 3.6
};

/**
 * Calculate Scope 1 (Direct Fuel Combustion) in metric tonnes CO2e
 */
export function calculateScope1(dieselLitres, petrolLitres = 0, naturalGasM3 = 0) {
  const dieselKg = (Number(dieselLitres) || 0) * EMISSION_FACTORS.dieselKgCo2ePerLitre;
  const petrolKg = (Number(petrolLitres) || 0) * EMISSION_FACTORS.petrolKgCo2ePerLitre;
  const gasKg = (Number(naturalGasM3) || 0) * EMISSION_FACTORS.naturalGasKgCo2ePerCubicMeter;
  return Number(((dieselKg + petrolKg + gasKg) / 1000).toFixed(2));
}

/**
 * Calculate Scope 2 (Purchased Electricity) in metric tonnes CO2e
 */
export function calculateScope2(gridKwh, renewableKwh = 0) {
  const gridKg = (Number(gridKwh) || 0) * EMISSION_FACTORS.gridElectricityKgCo2ePerKwh;
  const renewKg = (Number(renewableKwh) || 0) * EMISSION_FACTORS.renewableElectricityKgCo2ePerKwh;
  return Number(((gridKg + renewKg) / 1000).toFixed(2));
}

/**
 * Calculate Total Energy in GigaJoules (GJ)
 */
export function calculateTotalEnergyGJ(dieselLitres, gridKwh, solarKwh = 0) {
  const dieselGj = ((Number(dieselLitres) || 0) * EMISSION_FACTORS.dieselEnergyMjPerLitre) / 1000;
  const electricityGj = (((Number(gridKwh) || 0) + (Number(solarKwh) || 0)) * EMISSION_FACTORS.gridElectricityMjPerKwh) / 1000;
  return Number((dieselGj + electricityGj).toFixed(1));
}

/**
 * Calculate GHG Emission Intensity per Crore Turnover (SEBI BRSR Core Metric 1)
 */
export function calculateGhgIntensity(scope1Tonne, scope2Tonne, turnoverInrCr) {
  if (!turnoverInrCr || turnoverInrCr <= 0) return 0;
  const totalGhg = (Number(scope1Tonne) || 0) + (Number(scope2Tonne) || 0);
  return Number((totalGhg / turnoverInrCr).toFixed(2));
}

/**
 * Calculate Water Consumption Intensity (KL / Cr Turnover)
 */
export function calculateWaterIntensity(waterWithdrawalKl, turnoverInrCr) {
  if (!turnoverInrCr || turnoverInrCr <= 0) return 0;
  return Number(((Number(waterWithdrawalKl) || 0) / turnoverInrCr).toFixed(2));
}

/**
 * Calculate Water Recycled Percentage
 */
export function calculateWaterRecycledPct(waterRecycledKl, waterWithdrawalKl) {
  const withdrawal = Number(waterWithdrawalKl) || 0;
  if (withdrawal <= 0) return 100;
  const recycled = Number(waterRecycledKl) || 0;
  return Number(Math.min(100, (recycled / withdrawal) * 100).toFixed(1));
}

/**
 * Calculate Lost Time Injury Frequency Rate (LTIFR)
 * Formula: (Lost Time Injuries * 1,000,000) / Total Man-Hours Worked
 */
export function calculateLTIFR(lostTimeInjuries, totalManHoursWorked) {
  const hours = Number(totalManHoursWorked) || 0;
  if (hours <= 0) return 0;
  const injuries = Number(lostTimeInjuries) || 0;
  return Number(((injuries * 1000000) / hours).toFixed(2));
}

/**
 * Aggregate project sites metrics for any filter (e.g. Group, Subsidiary, BU)
 */
export function aggregateSiteMetrics(sites) {
  if (!sites || sites.length === 0) {
    return {
      totalSites: 0,
      totalWorkforce: 0,
      totalDieselLtrsMonth: 0,
      totalGridKwhMonth: 0,
      totalScope1TonnesMonth: 0,
      totalScope2TonnesMonth: 0,
      totalGhgTonnesMonth: 0,
      totalWaterWithdrawalKl: 0,
      totalWaterRecycledKl: 0,
      avgWaterRecycledPct: 0,
      totalSafeManHours: 0,
      avgLtifr: 0,
      totalFatalities: 0,
      statusCounts: {
        submitted: 0,
        buVerified: 0,
        subsidiaryApproved: 0,
        groupAudited: 0
      }
    };
  }

  const totals = sites.reduce(
    (acc, site) => {
      acc.totalWorkforce += site.workforceTotal || 0;
      acc.totalDieselLtrsMonth += site.dieselConsLtrsMonth || 0;
      acc.totalGridKwhMonth += site.gridKwhMonth || 0;
      acc.totalWaterWithdrawalKl += site.waterWithdrawalKlMonth || 0;
      acc.totalWaterRecycledKl += site.waterRecycledKlMonth || 0;
      acc.totalSafeManHours += site.safeManHoursYtd || 0;
      acc.totalFatalities += site.fatalitiesYtd || 0;

      // Approval breakdown
      if (site.approvalStatus === "Draft Submitted") acc.statusCounts.submitted++;
      else if (site.approvalStatus === "BU Verified") acc.statusCounts.buVerified++;
      else if (site.approvalStatus === "Subsidiary Approved") acc.statusCounts.subsidiaryApproved++;
      else if (site.approvalStatus === "Group Audited") acc.statusCounts.groupAudited++;

      return acc;
    },
    {
      totalWorkforce: 0,
      totalDieselLtrsMonth: 0,
      totalGridKwhMonth: 0,
      totalWaterWithdrawalKl: 0,
      totalWaterRecycledKl: 0,
      totalSafeManHours: 0,
      totalFatalities: 0,
      statusCounts: {
        submitted: 0,
        buVerified: 0,
        subsidiaryApproved: 0,
        groupAudited: 0
      }
    }
  );

  const scope1Month = calculateScope1(totals.totalDieselLtrsMonth);
  const scope2Month = calculateScope2(totals.totalGridKwhMonth);
  const totalGhgMonth = Number((scope1Month + scope2Month).toFixed(2));
  const waterRecycledPct = calculateWaterRecycledPct(totals.totalWaterRecycledKl, totals.totalWaterWithdrawalKl);

  const avgLtifr = sites.length > 0
    ? Number((sites.reduce((sum, s) => sum + (s.ltifr || 0), 0) / sites.length).toFixed(2))
    : 0;

  return {
    totalSites: sites.length,
    ...totals,
    totalScope1TonnesMonth: scope1Month,
    totalScope2TonnesMonth: scope2Month,
    totalGhgTonnesMonth: totalGhgMonth,
    avgWaterRecycledPct: waterRecycledPct,
    avgLtifr
  };
}
