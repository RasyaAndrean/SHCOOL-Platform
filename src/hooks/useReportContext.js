import { useContext } from 'react';
import { ReportContext } from '../contexts/ReportContext.js';

export function useReportContext() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReportContext must be used within a ReportProvider');
  }
  return context;
}
