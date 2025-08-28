# ✅ Key Features of `AlertHub`

Name: AlertHub
Purpose: Centralized platform to manage alerts from multiple sources and send notifications.

## 📦 Database Monitoring
- [ ] Supports common databases: **Oracle**, **PostgreSQL**, **MySQL**, **SQLite**
- [ ] Allows pre-configured SQL queries
- [ ] Periodically executes queries and checks alert conditions
- [ ] Sends alerts when results match specified conditions

## 📊 ELK Stack Log Monitoring
- [ ] Connects to **Elasticsearch** via REST API
- [ ] Supports configurable alert **keywords**, **index***, **conditions**
- [ ] Periodically searches recent logs for keywords
- [ ] Sends alerts after search

## ☸️ Kubernetes Event Monitoring
- [ ] Uses Kubernetes Python client to monitor **Events**
- [ ] Filters by **namespace** or event type (e.g., Warning, Killing, etc.)
- [ ] Sends real-time Telegram alerts when events are created

## 📩 Alert Integration
- [ ] Sends alerts in clear, concise text format
- [ ] Can include **links**, **service status**, or **images** if needed
- [ ] Can using custom script for can send to other platform like: telegram, webhook, mail,...

## 🖥️ Simple Web Interface (UI)
- [ ] View alert history
- [ ] Manage: DB queries, Elasticsearch keywords, K8s event filters
- [ ] Update Telegram / K8s / DB configuration via UI

## 🗂️ Configuration and State Persistence
- [ ] Uses SQLite to store:
  - [ ] Configured SQL queries
  - [ ] Elasticsearch keywords
  - [ ] List of monitored namespaces
  - [ ] Telegram bot token and chat_id

## 🚀 Runs Reliably on Kubernetes
- [ ] Packaged as a Docker container
- [ ] Deployable as a **Pod** or **CronJob** in-cluster
- [ ] Supports **persistent volume** for long-term SQLite storage

## Teach stacks
- Nodejs for backend and jobs
- Reactjs and tailwindcss for frontend
- Database using sqlite

