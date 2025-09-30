import 'reflect-metadata';
import { PageHeader } from '@/components/page-header';
import { CreateDataSourceDialog } from '@/components/datasources/create-datasource-dialog';
import { DataSourcesTable } from '@/components/datasources/datasources-table';
import type { DataSource } from '@/lib/types';
import { getDataSource } from '@/lib/db';
import { DataSource as DataSourceEntity } from '@/lib/entities';

async function getDataSources(): Promise<DataSource[]> {
  try {
    const dataSource = await getDataSource();
    const dataSourceRepo = dataSource.getRepository(DataSourceEntity);
    const sources = await dataSourceRepo.find();
    
    // Map database entities to application types
    return sources.map(ds => ({
      id: ds.id,
      name: ds.name,
      ...(ds.type === 'Elasticsearch' ? {
        type: 'Elasticsearch' as const,
        url: ds.url!,
        apiKey: ds.apiKey,
      } : {
        type: ds.type as 'PostgreSQL' | 'Oracle' | 'MySQL',
        host: ds.host!,
        port: ds.port!,
        user: ds.user!,
        password: ds.password,
        database: ds.database!,
      }),
    })) as DataSource[];
  } catch (error) {
    if (error instanceof Error && error.message.includes('no such table')) {
      console.warn("Data sources table not found. It probably needs to be initialized.");
      return [];
    }
    console.error("Failed to fetch data sources:", error);
    return [];
  }
}

export default async function DataSourcesPage() {
  const dataSources = await getDataSources();

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
