export interface ReleaseType {
  type: string;
  startDate: string;
  endDate?: string;          
  versionCode?: string;
  releaseTypeStatus: 'Completed' | 'Active' | 'Future' | 'Skipped';
}

export interface ReleaseData {
  version: string;
  status: string;
  releaseTypes: ReleaseType[];
  releaseName?: string; 
}