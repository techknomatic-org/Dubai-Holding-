// AUTO-GENERATED DIRECTLY FROM DH_TechM_Managed_Services_BI_Source.xlsx
// 100% Sourced from Excel Sheets

export interface RawExcelMomAction {
  Action_No: number;
  Action: string;
  Type: 'I' | 'A';
  Type_Description: string;
  Owner: string;
  Original_Due_Date: string;
  Revised_Due_Date: string | null;
  Status: 'Closed' | 'On going' | 'Open';
  Remarks: string | null;
  Source_Page: number;
}

export interface ExcelQualysSummary {
  reportingMonth: string;
  completionPct: number;
  completedTaskCount: number;
  ongoingTaskCount: number;
  planStartDate: string;
  planEndDate: string;
}

export const EXCEL_MOM_ACTIONS: RawExcelMomAction[] = [
  {
    "Action_No": 1,
    "Action": "New Contract commenced w.e.f 1st Apr\u20192026. Last two months MS support highlights and efforts consumed in value co-creation, presented by TechM Delivery Head (Sudesh)",
    "Type": "I",
    "Type_Description": "Information",
    "Owner": "TechM",
    "Original_Due_Date": "2026-06-29",
    "Revised_Due_Date": null,
    "Status": "Closed",
    "Remarks": null,
    "Source_Page": 3
  },
  {
    "Action_No": 2,
    "Action": "TechM to present the Automation and AI Progress w.r.t 32 USE CASE presented during RFP defence proposal, in next review meeting.",
    "Type": "A",
    "Type_Description": "Action",
    "Owner": "TechM",
    "Original_Due_Date": "2026-07-27",
    "Revised_Due_Date": null,
    "Status": "On going",
    "Remarks": "Included in deck",
    "Source_Page": 3
  },
  {
    "Action_No": 3,
    "Action": "Patching through Qualys TOOL has been tested successfully. TechM to present the Qualys Patching status in next review meeting.",
    "Type": "A",
    "Type_Description": "Action",
    "Owner": "TechM",
    "Original_Due_Date": "2026-07-27",
    "Revised_Due_Date": null,
    "Status": "On going",
    "Remarks": "Project Progress included in deck.",
    "Source_Page": 3
  },
  {
    "Action_No": 4,
    "Action": "TechM to present the Open Ticket Summary and Ticket Resolution Trend through Automation. Purpose is to review the progress",
    "Type": "A",
    "Type_Description": "Action",
    "Owner": "TechM",
    "Original_Due_Date": "2026-07-27",
    "Revised_Due_Date": null,
    "Status": "Closed",
    "Remarks": "Included in deck",
    "Source_Page": 3
  },
  {
    "Action_No": 5,
    "Action": "On Hold Tickets will be audited for proper justification and update compliance on ITSM TOOL",
    "Type": "A",
    "Type_Description": "Action",
    "Owner": "TechM",
    "Original_Due_Date": "2026-07-27",
    "Revised_Due_Date": null,
    "Status": "Closed",
    "Remarks": "Pending Tickets Analysis updated in deck",
    "Source_Page": 3
  },
  {
    "Action_No": 6,
    "Action": "Explore possibility to create single pane of glass using Azure Foundry capabilities, instead of multiple Power BI Dash-boards currently used for Operational purpose",
    "Type": "A",
    "Type_Description": "Action",
    "Owner": "TechM",
    "Original_Due_Date": "2026-07-27",
    "Revised_Due_Date": "2026-09-30",
    "Status": "Open",
    "Remarks": "03 Foundry SMEs on-boarded, USE CASE identification and approval in progress",
    "Source_Page": 3
  }
];

export const EXCEL_QUALYS_SUMMARY: ExcelQualysSummary = {
  "reportingMonth": "2026-08",
  "completionPct": 24,
  "completedTaskCount": 7,
  "ongoingTaskCount": 22,
  "planStartDate": "2026-07-13",
  "planEndDate": "2026-10-09"
};

export const EXCEL_ITOPS_MONTHLY = [
  {
    "Month": "2026-04-01",
    "Availability_Pct": 100,
    "Availability_Data_Quality": "Visual approximation (~100); exact value not printed",
    "CSAT": 4.5,
    "Change_Records": 96,
    "Major_Incidents": 2,
    "Availability_Target_Pct": 99,
    "CSAT_Target": 4.5,
    "Change_Avg_Reference": 90,
    "Source_Page": 4
  },
  {
    "Month": "2026-05-01",
    "Availability_Pct": 100,
    "Availability_Data_Quality": "Visual approximation (~100); exact value not printed",
    "CSAT": 4.6,
    "Change_Records": 94,
    "Major_Incidents": 0,
    "Availability_Target_Pct": 99,
    "CSAT_Target": 4.5,
    "Change_Avg_Reference": 90,
    "Source_Page": 4
  },
  {
    "Month": "2026-06-01",
    "Availability_Pct": 100,
    "Availability_Data_Quality": "Visual approximation (~100); exact value not printed",
    "CSAT": 4.6,
    "Change_Records": 96,
    "Major_Incidents": 0,
    "Availability_Target_Pct": 99,
    "CSAT_Target": 4.5,
    "Change_Avg_Reference": 90,
    "Source_Page": 4
  },
  {
    "Month": "2026-07-01",
    "Availability_Pct": 99.81,
    "Availability_Data_Quality": "Explicit KPI tile",
    "CSAT": 4.54,
    "Change_Records": 99,
    "Major_Incidents": 2,
    "Availability_Target_Pct": 99,
    "CSAT_Target": 4.5,
    "Change_Avg_Reference": 90,
    "Source_Page": 4
  },
  {
    "Month": "Key Observations",
    "Availability_Pct": null,
    "Availability_Data_Quality": null,
    "CSAT": null,
    "Change_Records": null,
    "Major_Incidents": null,
    "Availability_Target_Pct": null,
    "CSAT_Target": null,
    "Change_Avg_Reference": null,
    "Source_Page": null
  },
  {
    "Month": "Observation",
    "Availability_Pct": "Source_Page",
    "Availability_Data_Quality": null,
    "CSAT": null,
    "Change_Records": null,
    "Major_Incidents": null,
    "Availability_Target_Pct": null,
    "CSAT_Target": null,
    "Change_Avg_Reference": null,
    "Source_Page": null
  },
  {
    "Month": "Steady INFRA Availability with July at 99.81%.",
    "Availability_Pct": 4,
    "Availability_Data_Quality": null,
    "CSAT": null,
    "Change_Records": null,
    "Major_Incidents": null,
    "Availability_Target_Pct": null,
    "CSAT_Target": null,
    "Change_Avg_Reference": null,
    "Source_Page": null
  },
  {
    "Month": "CSAT maintained at 4.54.",
    "Availability_Pct": 4,
    "Availability_Data_Quality": null,
    "CSAT": null,
    "Change_Records": null,
    "Major_Incidents": null,
    "Availability_Target_Pct": null,
    "CSAT_Target": null,
    "Change_Avg_Reference": null,
    "Source_Page": null
  },
  {
    "Month": "Change success at 99% in July.",
    "Availability_Pct": 4,
    "Availability_Data_Quality": null,
    "CSAT": null,
    "Change_Records": null,
    "Major_Incidents": null,
    "Availability_Target_Pct": null,
    "CSAT_Target": null,
    "Change_Avg_Reference": null,
    "Source_Page": null
  },
  {
    "Month": "No Major Incidents reported in May & June",
    "Availability_Pct": 4,
    "Availability_Data_Quality": null,
    "CSAT": null,
    "Change_Records": null,
    "Major_Incidents": null,
    "Availability_Target_Pct": null,
    "CSAT_Target": null,
    "Change_Avg_Reference": null,
    "Source_Page": null
  }
];

export const EXCEL_AUTOMATION_MONTHLY = [
  {
    "Month": "2026-04-01",
    "Total_Live_Use_Cases": 50,
    "SR_Closed_TechHub": 6519,
    "Orders_Placed": 1408,
    "Automation_Pct": 21.6,
    "Source_Page": 10
  },
  {
    "Month": "2026-05-01",
    "Total_Live_Use_Cases": 52,
    "SR_Closed_TechHub": 4340,
    "Orders_Placed": 978,
    "Automation_Pct": 22.53,
    "Source_Page": 10
  },
  {
    "Month": "2026-06-01",
    "Total_Live_Use_Cases": 54,
    "SR_Closed_TechHub": 5882,
    "Orders_Placed": 1028,
    "Automation_Pct": 17.48,
    "Source_Page": 10
  },
  {
    "Month": "2026-07-01",
    "Total_Live_Use_Cases": 56,
    "SR_Closed_TechHub": 5578,
    "Orders_Placed": 1056,
    "Automation_Pct": 18.93,
    "Source_Page": 10
  },
  {
    "Month": "Business Benefit with Ticket Automation @ Service Desk",
    "Total_Live_Use_Cases": null,
    "SR_Closed_TechHub": null,
    "Orders_Placed": null,
    "Automation_Pct": null,
    "Source_Page": null
  },
  {
    "Month": "Benefit",
    "Total_Live_Use_Cases": "Source_Page",
    "SR_Closed_TechHub": null,
    "Orders_Placed": null,
    "Automation_Pct": null,
    "Source_Page": null
  },
  {
    "Month": "Access and group additions complete in seconds instead of sitting in queues.",
    "Total_Live_Use_Cases": 10,
    "SR_Closed_TechHub": null,
    "Orders_Placed": null,
    "Automation_Pct": null,
    "Source_Page": null
  },
  {
    "Month": "New hires get instant tool access on day one without IT delays.",
    "Total_Live_Use_Cases": 10,
    "SR_Closed_TechHub": null,
    "Orders_Placed": null,
    "Automation_Pct": null,
    "Source_Page": null
  },
  {
    "Month": "Portal requests are fulfilled automatically 24/7 without waiting for business hours.",
    "Total_Live_Use_Cases": 10,
    "SR_Closed_TechHub": null,
    "Orders_Placed": null,
    "Automation_Pct": null,
    "Source_Page": null
  },
  {
    "Month": "Accounts are disabled immediately upon HR approval to close security gaps.",
    "Total_Live_Use_Cases": 10,
    "SR_Closed_TechHub": null,
    "Orders_Placed": null,
    "Automation_Pct": null,
    "Source_Page": null
  },
  {
    "Month": "Every execution is logged automatically to ensure total audit compliance.",
    "Total_Live_Use_Cases": 10,
    "SR_Closed_TechHub": null,
    "Orders_Placed": null,
    "Automation_Pct": null,
    "Source_Page": null
  },
  {
    "Month": "Scripted updates enforce consistent data across Active Directory and Entra ID.",
    "Total_Live_Use_Cases": 10,
    "SR_Closed_TechHub": null,
    "Orders_Placed": null,
    "Automation_Pct": null,
    "Source_Page": null
  }
];

export const EXCEL_RISK_SUMMARY = {
  "Total": 599,
  "Open": 56,
  "Closed": 543,
  "New Risks": 0,
  "Overdue": 6,
  "Requires Attention": 43,
  "Last 30 days risk closure": 4
};

export const EXCEL_SAVINGS_DATA = [
  {
    "Month": "2026-04-01",
    "Category": "Automation",
    "Saving_Type": "License Cost Saved - E5..etc",
    "License_Type": "SPE-F1",
    "Licenses_Released": 40,
    "Unit_Cost_USD_Per_Month": 10,
    "Reported_Monthly_Saving_USD": 400,
    "Reported_Annual_Saving_USD": 4800,
    "Calculated_Monthly_Saving_USD": 400,
    "Calculated_Annual_Saving_USD": 4800,
    "Annual_Variance_USD": 0,
    "Source_Page": 22
  },
  {
    "Month": "2026-04-01",
    "Category": "Automation",
    "Saving_Type": "License Cost Saved - E5..etc",
    "License_Type": "SPE-E5",
    "Licenses_Released": 94,
    "Unit_Cost_USD_Per_Month": 60,
    "Reported_Monthly_Saving_USD": 5640,
    "Reported_Annual_Saving_USD": 67680,
    "Calculated_Monthly_Saving_USD": 5640,
    "Calculated_Annual_Saving_USD": 67680,
    "Annual_Variance_USD": 0,
    "Source_Page": 22
  },
  {
    "Month": "2026-05-01",
    "Category": "Automation",
    "Saving_Type": "License Cost Saved - E5..etc",
    "License_Type": "SPE-F1",
    "Licenses_Released": 49,
    "Unit_Cost_USD_Per_Month": 10,
    "Reported_Monthly_Saving_USD": 490,
    "Reported_Annual_Saving_USD": 5880,
    "Calculated_Monthly_Saving_USD": 490,
    "Calculated_Annual_Saving_USD": 5880,
    "Annual_Variance_USD": 0,
    "Source_Page": 22
  },
  {
    "Month": "2026-05-01",
    "Category": "Automation",
    "Saving_Type": "License Cost Saved - E5..etc",
    "License_Type": "SPE-E5",
    "Licenses_Released": 21,
    "Unit_Cost_USD_Per_Month": 60,
    "Reported_Monthly_Saving_USD": 1260,
    "Reported_Annual_Saving_USD": 15120,
    "Calculated_Monthly_Saving_USD": 1260,
    "Calculated_Annual_Saving_USD": 15120,
    "Annual_Variance_USD": 0,
    "Source_Page": 22
  },
  {
    "Month": "2026-06-01",
    "Category": "Automation",
    "Saving_Type": "License Cost Saved - E5..etc",
    "License_Type": "SPE-F1",
    "Licenses_Released": 38,
    "Unit_Cost_USD_Per_Month": 10,
    "Reported_Monthly_Saving_USD": 380,
    "Reported_Annual_Saving_USD": 4560,
    "Calculated_Monthly_Saving_USD": 380,
    "Calculated_Annual_Saving_USD": 4560,
    "Annual_Variance_USD": 0,
    "Source_Page": 22
  },
  {
    "Month": "2026-06-01",
    "Category": "Automation",
    "Saving_Type": "License Cost Saved - E5..etc",
    "License_Type": "SPE-E5",
    "Licenses_Released": 71,
    "Unit_Cost_USD_Per_Month": 60,
    "Reported_Monthly_Saving_USD": 4260,
    "Reported_Annual_Saving_USD": 51120,
    "Calculated_Monthly_Saving_USD": 4260,
    "Calculated_Annual_Saving_USD": 51120,
    "Annual_Variance_USD": 0,
    "Source_Page": 22
  },
  {
    "Month": "2026-06-01",
    "Category": "Automation",
    "Saving_Type": "License Cost Saved - E5..etc",
    "License_Type": "MICROSOFT_365_E7",
    "Licenses_Released": 40,
    "Unit_Cost_USD_Per_Month": 99,
    "Reported_Monthly_Saving_USD": 3960,
    "Reported_Annual_Saving_USD": 47520,
    "Calculated_Monthly_Saving_USD": 3960,
    "Calculated_Annual_Saving_USD": 47520,
    "Annual_Variance_USD": 0,
    "Source_Page": 22
  },
  {
    "Month": "2026-07-01",
    "Category": "Automation",
    "Saving_Type": "License Cost Saved - E5..etc",
    "License_Type": "SPE-F1",
    "Licenses_Released": 533,
    "Unit_Cost_USD_Per_Month": 10,
    "Reported_Monthly_Saving_USD": 5330,
    "Reported_Annual_Saving_USD": 63960,
    "Calculated_Monthly_Saving_USD": 5330,
    "Calculated_Annual_Saving_USD": 63960,
    "Annual_Variance_USD": 0,
    "Source_Page": 22
  },
  {
    "Month": "2026-07-01",
    "Category": "Automation",
    "Saving_Type": "License Cost Saved - E5..etc",
    "License_Type": "SPE-E5",
    "Licenses_Released": 20,
    "Unit_Cost_USD_Per_Month": 60,
    "Reported_Monthly_Saving_USD": 1200,
    "Reported_Annual_Saving_USD": 14400,
    "Calculated_Monthly_Saving_USD": 1200,
    "Calculated_Annual_Saving_USD": 14400,
    "Annual_Variance_USD": 0,
    "Source_Page": 22
  },
  {
    "Month": "2026-07-01",
    "Category": "Automation",
    "Saving_Type": "License Cost Saved - E5..etc",
    "License_Type": "MICROSOFT_365_E7",
    "Licenses_Released": 151,
    "Unit_Cost_USD_Per_Month": 99,
    "Reported_Monthly_Saving_USD": 14949,
    "Reported_Annual_Saving_USD": 179388,
    "Calculated_Monthly_Saving_USD": 14949,
    "Calculated_Annual_Saving_USD": 179388,
    "Annual_Variance_USD": 0,
    "Source_Page": 22
  },
  {
    "Month": "CSI (Service Improvement)",
    "Category": null,
    "Saving_Type": null,
    "License_Type": null,
    "Licenses_Released": null,
    "Unit_Cost_USD_Per_Month": null,
    "Reported_Monthly_Saving_USD": null,
    "Reported_Annual_Saving_USD": null,
    "Calculated_Monthly_Saving_USD": null,
    "Calculated_Annual_Saving_USD": null,
    "Annual_Variance_USD": null,
    "Source_Page": null
  },
  {
    "Month": "Month",
    "Category": "Category",
    "Saving_Type": "Initiative",
    "License_Type": "Annual_Saving_USD",
    "Licenses_Released": "Description",
    "Unit_Cost_USD_Per_Month": "Remarks",
    "Reported_Monthly_Saving_USD": "Source_Page",
    "Reported_Annual_Saving_USD": null,
    "Calculated_Monthly_Saving_USD": null,
    "Calculated_Annual_Saving_USD": null,
    "Annual_Variance_USD": null,
    "Source_Page": null
  },
  {
    "Month": "2026-04-01",
    "Category": "CSI (Service Improvement)",
    "Saving_Type": "SIP - DDA SharePoint Site Storage Optimization, Automation",
    "License_Type": 31200,
    "Licenses_Released": "Benefits - 1. Operational Efficiency: Streamlined DDA site storage and version management, reducing manual cleanup efforts. Site collection size optimized from 22 TB to 9 TB 2. Compliance Boosting: Reduced site risk level, with new data growth same site can be used for long period of time 3. Accuracy: Ensured precise identification and removal of redundant version files, with zero data loss 4. Cost saving: Reclaimed ~13 TB of storage, cost saving of $31200 per year",
    "Unit_Cost_USD_Per_Month": "SIP was presented in April'26 monthly deck and cost saving mentioned in slide. Domain - SharePoint",
    "Reported_Monthly_Saving_USD": 22,
    "Reported_Annual_Saving_USD": null,
    "Calculated_Monthly_Saving_USD": null,
    "Calculated_Annual_Saving_USD": null,
    "Annual_Variance_USD": null,
    "Source_Page": null
  },
  {
    "Month": "2026-05-01",
    "Category": "CSI (Service Improvement)",
    "Saving_Type": "No SIP having cost saving",
    "License_Type": 0,
    "Licenses_Released": null,
    "Unit_Cost_USD_Per_Month": null,
    "Reported_Monthly_Saving_USD": 22,
    "Reported_Annual_Saving_USD": null,
    "Calculated_Monthly_Saving_USD": null,
    "Calculated_Annual_Saving_USD": null,
    "Annual_Variance_USD": null,
    "Source_Page": null
  },
  {
    "Month": "2026-06-01",
    "Category": "CSI (Service Improvement)",
    "Saving_Type": "No SIP having cost saving",
    "License_Type": 0,
    "Licenses_Released": null,
    "Unit_Cost_USD_Per_Month": null,
    "Reported_Monthly_Saving_USD": 22,
    "Reported_Annual_Saving_USD": null,
    "Calculated_Monthly_Saving_USD": null,
    "Calculated_Annual_Saving_USD": null,
    "Annual_Variance_USD": null,
    "Source_Page": null
  },
  {
    "Month": "2026-07-01",
    "Category": "CSI (Service Improvement)",
    "Saving_Type": "No SIP having cost saving",
    "License_Type": 0,
    "Licenses_Released": null,
    "Unit_Cost_USD_Per_Month": null,
    "Reported_Monthly_Saving_USD": 22,
    "Reported_Annual_Saving_USD": null,
    "Calculated_Monthly_Saving_USD": null,
    "Calculated_Annual_Saving_USD": null,
    "Annual_Variance_USD": null,
    "Source_Page": null
  },
  {
    "Month": "Reported Apr-Jul Category Totals",
    "Category": null,
    "Saving_Type": null,
    "License_Type": null,
    "Licenses_Released": null,
    "Unit_Cost_USD_Per_Month": null,
    "Reported_Monthly_Saving_USD": null,
    "Reported_Annual_Saving_USD": null,
    "Calculated_Monthly_Saving_USD": null,
    "Calculated_Annual_Saving_USD": null,
    "Annual_Variance_USD": null,
    "Source_Page": null
  },
  {
    "Month": "Category",
    "Category": "Total_Apr_Jul_USD",
    "Saving_Type": "Remarks",
    "License_Type": "Source_Page",
    "Licenses_Released": null,
    "Unit_Cost_USD_Per_Month": null,
    "Reported_Monthly_Saving_USD": null,
    "Reported_Annual_Saving_USD": null,
    "Calculated_Monthly_Saving_USD": null,
    "Calculated_Annual_Saving_USD": null,
    "Annual_Variance_USD": null,
    "Source_Page": null
  },
  {
    "Month": "Automation",
    "Category": 454428,
    "Saving_Type": "License Details/count presented in monthly deck. Unit cost taken from internet market",
    "License_Type": 22,
    "Licenses_Released": null,
    "Unit_Cost_USD_Per_Month": null,
    "Reported_Monthly_Saving_USD": null,
    "Reported_Annual_Saving_USD": null,
    "Calculated_Monthly_Saving_USD": null,
    "Calculated_Annual_Saving_USD": null,
    "Annual_Variance_USD": null,
    "Source_Page": null
  },
  {
    "Month": "CSI (Service Improvement)",
    "Category": 31200,
    "Saving_Type": "Any savings approved & Acknowledged by DH",
    "License_Type": 22,
    "Licenses_Released": null,
    "Unit_Cost_USD_Per_Month": null,
    "Reported_Monthly_Saving_USD": null,
    "Reported_Annual_Saving_USD": null,
    "Calculated_Monthly_Saving_USD": null,
    "Calculated_Annual_Saving_USD": null,
    "Annual_Variance_USD": null,
    "Source_Page": null
  },
  {
    "Month": "Reported Total (USD Annual Savings)",
    "Category": null,
    "Saving_Type": null,
    "License_Type": null,
    "Licenses_Released": null,
    "Unit_Cost_USD_Per_Month": null,
    "Reported_Monthly_Saving_USD": null,
    "Reported_Annual_Saving_USD": null,
    "Calculated_Monthly_Saving_USD": null,
    "Calculated_Annual_Saving_USD": null,
    "Annual_Variance_USD": null,
    "Source_Page": null
  },
  {
    "Month": "Month",
    "Category": "Total_Annual_Savings_USD",
    "Saving_Type": "Source_Page",
    "License_Type": null,
    "Licenses_Released": null,
    "Unit_Cost_USD_Per_Month": null,
    "Reported_Monthly_Saving_USD": null,
    "Reported_Annual_Saving_USD": null,
    "Calculated_Monthly_Saving_USD": null,
    "Calculated_Annual_Saving_USD": null,
    "Annual_Variance_USD": null,
    "Source_Page": null
  },
  {
    "Month": "2026-04-01",
    "Category": 103680,
    "Saving_Type": 22,
    "License_Type": null,
    "Licenses_Released": null,
    "Unit_Cost_USD_Per_Month": null,
    "Reported_Monthly_Saving_USD": null,
    "Reported_Annual_Saving_USD": null,
    "Calculated_Monthly_Saving_USD": null,
    "Calculated_Annual_Saving_USD": null,
    "Annual_Variance_USD": null,
    "Source_Page": null
  },
  {
    "Month": "2026-05-01",
    "Category": 21000,
    "Saving_Type": 22,
    "License_Type": null,
    "Licenses_Released": null,
    "Unit_Cost_USD_Per_Month": null,
    "Reported_Monthly_Saving_USD": null,
    "Reported_Annual_Saving_USD": null,
    "Calculated_Monthly_Saving_USD": null,
    "Calculated_Annual_Saving_USD": null,
    "Annual_Variance_USD": null,
    "Source_Page": null
  },
  {
    "Month": "2026-06-01",
    "Category": 103200,
    "Saving_Type": 22,
    "License_Type": null,
    "Licenses_Released": null,
    "Unit_Cost_USD_Per_Month": null,
    "Reported_Monthly_Saving_USD": null,
    "Reported_Annual_Saving_USD": null,
    "Calculated_Monthly_Saving_USD": null,
    "Calculated_Annual_Saving_USD": null,
    "Annual_Variance_USD": null,
    "Source_Page": null
  },
  {
    "Month": "2026-07-01",
    "Category": 257748,
    "Saving_Type": 22,
    "License_Type": null,
    "Licenses_Released": null,
    "Unit_Cost_USD_Per_Month": null,
    "Reported_Monthly_Saving_USD": null,
    "Reported_Annual_Saving_USD": null,
    "Calculated_Monthly_Saving_USD": null,
    "Calculated_Annual_Saving_USD": null,
    "Annual_Variance_USD": null,
    "Source_Page": null
  },
  {
    "Month": "Apr-Jul Total",
    "Category": 485628,
    "Saving_Type": 22,
    "License_Type": null,
    "Licenses_Released": null,
    "Unit_Cost_USD_Per_Month": null,
    "Reported_Monthly_Saving_USD": null,
    "Reported_Annual_Saving_USD": null,
    "Calculated_Monthly_Saving_USD": null,
    "Calculated_Annual_Saving_USD": null,
    "Annual_Variance_USD": null,
    "Source_Page": null
  }
];
