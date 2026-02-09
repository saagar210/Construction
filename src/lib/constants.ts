export const OUTCOME_SEVERITY_LABELS: Record<string, string> = {
  death: 'Death',
  days_away: 'Days Away From Work',
  job_transfer_restriction: 'Job Transfer or Restriction',
  other_recordable: 'Other Recordable Cases',
};

export const INJURY_TYPE_LABELS: Record<string, string> = {
  injury: 'Injury',
  skin_disorder: 'Skin Disorder',
  respiratory: 'Respiratory Condition',
  poisoning: 'Poisoning',
  hearing_loss: 'Hearing Loss',
  other_illness: 'All Other Illnesses',
};

export const INCIDENT_STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  in_review: 'In Review',
  closed: 'Closed',
};

export const FISHBONE_CATEGORIES = [
  'manpower',
  'methods',
  'materials',
  'machinery',
  'environment',
  'management',
] as const;

export const FISHBONE_CATEGORY_LABELS: Record<string, string> = {
  manpower: 'Manpower',
  methods: 'Methods',
  materials: 'Materials',
  machinery: 'Machinery',
  environment: 'Environment',
  management: 'Management',
};

export const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
  'DC','PR','VI','GU','AS','MP',
];
