export type MonitorStatus = "normal" | "alert" | "pending";

export type AlertHistoryItem = {
  timestamp: string;
  message: string;
  status: "alert" | "normal";
};

export type Monitor = {
  id: string;
  name: string;
  type: "Elasticsearch" | "SQL";
  status: MonitorStatus;
  lastCheck: string;
  alertHistory: AlertHistoryItem[];
} & (
  | {
      type: "Elasticsearch";
      keywords: string[];
    }
  | {
      type: "SQL";
      dbType: "Oracle" | "MySQL" | "PostgreSQL";
      query: string;
      schedule: string;
    }
);

export type Webhook = {
  id: string;
  name: string;
  url: string;
  platform: "Slack" | "Discord" | "Generic" | "Custom";
};

export type DataSourceBase = {
  id: string;
  name: string;
};

export type ElasticsearchDataSource = DataSourceBase & {
  type: "Elasticsearch";
  url: string;
  apiKey?: string;
};

export type SQLDataSource = DataSourceBase & {
  type: "PostgreSQL" | "Oracle" | "MySQL";
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
};

export type DataSource = ElasticsearchDataSource | SQLDataSource;

// Authentication types
export type User = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  lastLogin?: string;
};

export type Session = {
  id: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
};
