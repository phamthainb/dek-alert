import 'reflect-metadata';
import { PageHeader } from '@/components/page-header';
import { WebhooksTable } from '@/components/webhooks/webhooks-table';
import type { Webhook } from '@/lib/types';
import { getDataSource } from '@/lib/db';
import { Webhook as WebhookEntity } from '@/lib/entities';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

async function getWebhooks(): Promise<Webhook[]> {
  try {
    const dataSource = await getDataSource();
    const webhookRepo = dataSource.getRepository(WebhookEntity);
    return await webhookRepo.find();
  } catch (error) {
    if (error instanceof Error && error.message.includes('no such table')) {
      console.warn("Webhooks table not found. It probably needs to be initialized.");
      return [];
    }
    console.error("Failed to fetch webhooks:", error);
    return [];
  }
}

export default async function WebhooksPage() {
  const webhooks = await getWebhooks();
  return (
    <>
      <PageHeader
        title="Webhooks"
        description="Manage webhook endpoints for sending notifications."
      >
        <Button asChild>
          <Link href="/webhooks/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Webhook
          </Link>
        </Button>
      </PageHeader>
      <WebhooksTable webhooks={webhooks} />
    </>
  );
}
