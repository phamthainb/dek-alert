import { PageHeader } from '@/components/page-header';
import { DatabaseSettings } from '@/components/settings/database-settings';

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage application settings and data."
      />
      <DatabaseSettings />
    </>
  );
}
