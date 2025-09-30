import type { Monitor, Webhook, DataSource, AlertHistoryItem } from './types';

const generateHistory = (base: Date, count: number): AlertHistoryItem[] => {
  const history: AlertHistoryItem[] = [];
  let currentStatus: 'alert' | 'normal' = 'normal';

  for (let i = 0; i < count; i++) {
    const newDate = new Date(base.getTime() - i * 6 * 60 * 60 * 1000); // Subtract 6 hours for each entry
    const shouldAlert = Math.random() > 0.7;

    if (currentStatus === 'normal' && shouldAlert) {
      currentStatus = 'alert';
      history.push({
        timestamp: newDate.toISOString(),
        message: `Alert triggered. Threshold exceeded. Value: ${Math.floor(Math.random() * 100 + 500)}`,
        status: 'alert',
      });
    } else if (currentStatus === 'alert' && !shouldAlert) {
      currentStatus = 'normal';
      history.push({
        timestamp: newDate.toISOString(),
        message: 'Alert resolved. System returned to normal.',
        status: 'normal',
      });
    } else {
       history.push({
        timestamp: newDate.toISOString(),
        message: 'System check completed. Status normal.',
        status: 'normal',
      });
    }
  }
  return history;
}

const now = new Date();

export const monitors: Monitor[] = [
  {
    id: '1',
    name: 'Production API Errors',
    type: 'Elasticsearch',
    status: 'alert',
    lastCheck: '2 minutes ago',
    keywords: ['error', '500', 'exception'],
    alertHistory: [
      { timestamp: '2024-07-30T10:00:00Z', message: 'High rate of 500 errors detected.', status: 'alert' },
      { timestamp: '2024-07-29T14:30:00Z', message: 'Alert cleared.', status: 'normal' },
    ],
  },
  {
    id: '2',
    name: 'User Authentication Failures',
    type: 'Elasticsearch',
    status: 'normal',
    lastCheck: '5 minutes ago',
    keywords: ['auth', 'fail', 'unauthorized'],
    alertHistory: generateHistory(now, 20),
  },
  {
    id: '3',
    name: 'Daily Sales Volume Check',
    type: 'SQL',
    dbType: 'PostgreSQL',
    status: 'normal',
    lastCheck: '1 hour ago',
    query: 'SELECT COUNT(*) FROM sales WHERE timestamp > NOW() - INTERVAL \'1 DAY\';',
    schedule: '0 0 * * *', // Every day at midnight
    alertHistory: generateHistory(now, 5),
  },
  {
    id: '4',
    name: 'Unprocessed Orders Queue',
    type: 'SQL',
    dbType: 'Oracle',
    status: 'alert',
    lastCheck: '15 minutes ago',
    query: 'SELECT COUNT(*) FROM orders WHERE status = \'pending\';',
    schedule: '*/15 * * * *', // Every 15 minutes
    alertHistory: [
       { timestamp: '2024-07-30T09:45:00Z', message: 'Pending orders queue size is over threshold (500).', status: 'alert' },
       { timestamp: '2024-07-30T09:30:00Z', message: 'Pending orders queue size is over threshold (480).', status: 'alert' },
    ],
  },
    {
    id: '5',
    name: 'Database Connection Pool',
    type: 'SQL',
    dbType: 'Oracle',
    status: 'normal',
    lastCheck: '30 minutes ago',
    query: 'SELECT current_size FROM v$resource_limit WHERE resource_name = \'processes\';',
    schedule: '*/30 * * * *', // Every 30 minutes
    alertHistory: generateHistory(now, 15),
  },
  {
    id: '6',
    name: 'Payment Gateway Timeouts',
    type: 'Elasticsearch',
    status: 'pending',
    lastCheck: 'N/A',
    keywords: ['payment', 'timeout', 'gateway'],
    alertHistory: [],
  },
];

export const webhooks: Webhook[] = [
  {
    id: 'wh-1',
    name: 'On-Call Engineering Slack',
    url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
    platform: 'Slack',
  },
  {
    id: 'wh-2',
    name: 'DevOps Discord Alerts',
    url: 'https://discord.com/api/webhooks/000000000000000000/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    platform: 'Discord',
  },
  {
    id: 'wh-3',
    name: 'Generic PagerDuty Endpoint',
    url: 'https://events.pagerduty.com/v2/enqueue',
    platform: 'Generic',
  },
  {
    id: 'wh-4',
    name: 'Custom Logger',
    url: '',
    platform: 'Custom',
  },
];

export const dataSources: DataSource[] = [
  {
    id: 'ds-1',
    name: 'Production Elasticsearch Cluster',
    type: 'Elasticsearch',
    url: 'https://elasticsearch.prod.internal:9200',
    apiKey: 'REDACTED',
  },
  {
    id: 'ds-2',
    name: 'Staging Elasticsearch Cluster',
    type: 'Elasticsearch',
    url: 'https://elasticsearch.staging.internal:9200',
    apiKey: 'REDACTED',
  },
  {
    id: 'ds-3',
    name: 'Oracle - Primary DB',
    type: 'Oracle',
    host: 'host',
    port: 1521,
    user: 'user',
    password: 'password',
    database: 'service'
  },
  {
    id: 'ds-4',
    name: 'MySQL - Read Replica',
    type: 'MySQL',
    host: 'host',
    port: 3306,
    user: 'user',
    password: 'password',
    database: 'db'
  },
  {
    id: 'ds-5',
    name: 'PostgreSQL - Data Warehouse',
    type: 'PostgreSQL',
    host: 'host',
    port: 5432,
    user: 'user',
    password: 'password',
    database: 'warehouse'
  },
];
