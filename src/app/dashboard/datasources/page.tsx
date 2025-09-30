import { PageHeader } from '@/components/page-header';
import { CreateDataSourceDialog } from '@/components/datasources/create-datasource-dialog';
import { DataSourcesTable } from '@/components/datasources/datasources-table';
import type { DataSource } from '@/lib/types';
import db from '@/lib/db';

function getDataSources(): DataSource[] {
  try {
    const stmt = db.prepare('SELECT * FROM data_sources');
    return stmt.all() as DataSource[];
  } catch (error) {
    if (error instanceof Error && error.message.includes('no such table')) {
      console.warn("Data sources table not found. It probably needs to be initialized.");
      return [];
    }
    console.error("Failed to fetch data sources:", error);
    return [];
  }
}

export default function DataSourcesPage() {
  const dataSources = getDataSources();

  return (
    <>
      <PageHeader
        title="Data Sources"
        description="Manage connection details for all your data sources."
      >
        <CreateDataSourceDialog />
      </PageHeader>
      <DataSourcesTable dataSources={dataSources} />
    </>
  );
}
