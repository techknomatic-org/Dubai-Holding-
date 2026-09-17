// ============================================================================
// DUBAI HOLDING MANAGED SERVICES — COST OPTIMIZATION DATA MODEL
// Sourced 100% from Excel Sheet "11.Cost Optimization " & PPT Slide 22
// ============================================================================

export interface LicenseSavingItem {
  licenseType: string;
  count: number;
  unitCostMonthly: number;
  monthlySaving: number;
  annualSaving: number;
}

export interface MonthlyAutomationSaving {
  monthKey: 'APR' | 'MAY' | 'JUNE' | 'JULY';
  monthLabel: string;
  totalLicensesReleased: number;
  annualTotalSaving: number;
  items: LicenseSavingItem[];
}

export interface CsiInitiative {
  month: string;
  initiative: string;
  annualSaving: number;
  description: string;
  remarks: string;
  statusText?: string;
}

export interface MonthlyTotalSaving {
  monthKey: string;
  monthLabel: string;
  monthlyAnnualSaving: number;
  cumulativeAnnualSaving: number;
}

export interface CostOptimizationModel {
  kpis: {
    totalAnnualSavings: number;
    automationSavings: number;
    csiSavings: number;
    highestMonthName: string;
    highestMonthValue: number;
    periodLabel: string;
    footnote: string;
  };
  trendSeries: MonthlyTotalSaving[];
  automation: {
    category: string;
    description: string;
    monthlyBreakdowns: MonthlyAutomationSaving[];
    subtotalAprJul: number;
    remarks: string;
  };
  csi: {
    category: string;
    description: string;
    primaryInitiative: {
      domain: string;
      title: string;
      annualSaving: number;
      benefits: string[];
      remarks: string;
    };
    monthlyStatuses: { month: string; text: string }[];
    subtotalAprJul: number;
    remarks: string;
  };
  grandTotal: {
    totalAnnualSavings: number;
    monthlyBreakdown: { month: string; amount: number }[];
  };
}

export const defaultCostOptimizationData: CostOptimizationModel = {
  kpis: {
    totalAnnualSavings: 485628,
    automationSavings: 454428,
    csiSavings: 31200,
    highestMonthName: 'July',
    highestMonthValue: 257748,
    periodLabel: 'Apr-Jul',
    footnote: 'Monthly values represent annualized savings identified in each month.'
  },
  trendSeries: [
    {
      monthKey: 'Apr',
      monthLabel: 'Apr',
      monthlyAnnualSaving: 103680,
      cumulativeAnnualSaving: 103680
    },
    {
      monthKey: 'May',
      monthLabel: 'May',
      monthlyAnnualSaving: 21000,
      cumulativeAnnualSaving: 124680
    },
    {
      monthKey: 'June',
      monthLabel: 'June',
      monthlyAnnualSaving: 103200,
      cumulativeAnnualSaving: 227880
    },
    {
      monthKey: 'July',
      monthLabel: 'July',
      monthlyAnnualSaving: 257748,
      cumulativeAnnualSaving: 485628
    }
  ],
  automation: {
    category: 'Automation',
    description: 'License Cost Saved - E5..etc',
    monthlyBreakdowns: [
      {
        monthKey: 'APR',
        monthLabel: 'APR',
        totalLicensesReleased: 134,
        annualTotalSaving: 72480,
        items: [
          {
            licenseType: 'SPE-F1',
            count: 40,
            unitCostMonthly: 10,
            monthlySaving: 400,
            annualSaving: 4800
          },
          {
            licenseType: 'SPE-E5',
            count: 94,
            unitCostMonthly: 60,
            monthlySaving: 5640,
            annualSaving: 67680
          }
        ]
      },
      {
        monthKey: 'MAY',
        monthLabel: 'MAY',
        totalLicensesReleased: 70,
        annualTotalSaving: 21000,
        items: [
          {
            licenseType: 'SPE-F1',
            count: 49,
            unitCostMonthly: 10,
            monthlySaving: 490,
            annualSaving: 5880
          },
          {
            licenseType: 'SPE-E5',
            count: 21,
            unitCostMonthly: 60,
            monthlySaving: 1260,
            annualSaving: 15120
          }
        ]
      },
      {
        monthKey: 'JUNE',
        monthLabel: 'JUNE',
        totalLicensesReleased: 149,
        annualTotalSaving: 103200,
        items: [
          {
            licenseType: 'SPE-F1',
            count: 38,
            unitCostMonthly: 10,
            monthlySaving: 380,
            annualSaving: 4560
          },
          {
            licenseType: 'SPE-E5',
            count: 71,
            unitCostMonthly: 60,
            monthlySaving: 4260,
            annualSaving: 51120
          },
          {
            licenseType: 'MICROSOFT_365_E7',
            count: 40,
            unitCostMonthly: 99,
            monthlySaving: 3960,
            annualSaving: 47520
          }
        ]
      },
      {
        monthKey: 'JULY',
        monthLabel: 'JULY',
        totalLicensesReleased: 704,
        annualTotalSaving: 257748,
        items: [
          {
            licenseType: 'SPE-F1',
            count: 533,
            unitCostMonthly: 10,
            monthlySaving: 5330,
            annualSaving: 63960
          },
          {
            licenseType: 'SPE-E5',
            count: 20,
            unitCostMonthly: 60,
            monthlySaving: 1200,
            annualSaving: 14400
          },
          {
            licenseType: 'MICROSOFT_365_E7',
            count: 151,
            unitCostMonthly: 99,
            monthlySaving: 14949,
            annualSaving: 179388
          }
        ]
      }
    ],
    subtotalAprJul: 454428,
    remarks: 'License Details/count presented in monthly deck. Unit cost taken from internet market'
  },
  csi: {
    category: 'CSI (Service Improvement)',
    description: 'Any savings approved & Acknowledged by DH',
    primaryInitiative: {
      domain: 'SharePoint',
      title: 'SIP - DDA SharePoint Site Storage Optimization, Automation',
      annualSaving: 31200,
      benefits: [
        'Operational Efficiency: Streamlined DDA site storage and version management, reducing manual cleanup efforts. Site collection size optimized from 22 TB to 9 TB.',
        'Compliance Boosting: Reduced site risk level, with new data growth same site can be used for long period of time.',
        'Accuracy: Ensured precise identification and removal of redundant version files, with zero data loss.',
        'Cost saving: Reclaimed ~13 TB of storage, cost saving of $31,200 per year.'
      ],
      remarks: "SIP was presented in April'26 monthly deck and cost saving mentioned in slide. Domain - SharePoint"
    },
    monthlyStatuses: [
      { month: 'May', text: 'No SIP having cost saving' },
      { month: 'June', text: 'No SIP having cost saving' },
      { month: 'July', text: 'No SIP having cost saving' }
    ],
    subtotalAprJul: 31200,
    remarks: "SIP was presented in April'26 monthly deck and cost saving mentioned in slide. Domain - SharePoint"
  },
  grandTotal: {
    totalAnnualSavings: 485628,
    monthlyBreakdown: [
      { month: 'Apr', amount: 103680 },
      { month: 'May', amount: 21000 },
      { month: 'June', amount: 103200 },
      { month: 'July', amount: 257748 }
    ]
  }
};
