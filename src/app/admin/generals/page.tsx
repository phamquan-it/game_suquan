'use client';


import { Layout } from 'lucide-react';
import GeneralStatsCard from './components/GeneralStatsCard';
import GeneralTable from './components/GeneralTable';


export default function GeneralManagementPage() {
  return (
    <div>
      <GeneralStatsCard />
      <GeneralTable />
    </div>
  );
}
