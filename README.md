
**AlertHub**, a centralized monitoring and alerting system.


Role is to collect data from different sources, evaluate conditions, and deliver actionable alerts.

---

## **Capabilities**

### Database Monitoring

* Connect to **Oracle, PostgreSQL, MySQL, SQLite**.
* Run **pre-configured SQL queries** on schedule.
* Check query results against **alert conditions**.
* Send alerts when conditions are met.

### Log Monitoring (ELK / Elasticsearch)

* Connect via **REST API**.
* Support **keywords, index patterns, and conditions**.
* Periodically search logs for matches.
* Trigger alerts if matches are found.

### Kubernetes Event Monitoring

* Use **Kubernetes client or Kube Api**.
* Monitor cluster events in **real-time**.
* Filter by **namespace** or **event type** (e.g., `Warning`, `Killing`).
* Push alerts immediately when relevant events occur.

---

## **Alert Delivery**

* Alerts must be **concise, clear text**.
* Optional: include **links, status info, images**.
* Delivery channels:

  * **Telegram**
  * **Webhook**
  * **Email**
  * Extendable via **custom scripts**.

---

## **Web Interface (UI)**

* Dashboard features:

  * View **alert history**.
  * Manage **DB queries, Elasticsearch keywords, K8s filters**.
  * Update **Telegram / K8s / DB configuration**.

---

## **Configuration & State**

* Store in **SQLite**:

  * DB queries
  * Elasticsearch keywords
  * Kubernetes namespaces
  * Telegram credentials
* Ensure **persistent state** across restarts.

---

## **Deployment**

* Distributed as a **Docker container**.
* Deployable as:

  * **Pod** (continuous monitoring)
  * **CronJob** (scheduled tasks)
* Supports **persistent volumes** for SQLite.

---

## **Tech Stack**

* **Backend & Jobs:** Node.js
* **Frontend:** React.js + Tailwind CSS
* **Database:** SQLite
* **Kubernetes-ready** (Dockerized services)
