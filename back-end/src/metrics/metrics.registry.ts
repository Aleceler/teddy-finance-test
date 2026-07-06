import { Counter, Gauge, Histogram, Registry, collectDefaultMetrics } from 'prom-client';

export const metricsRegistry = new Registry();

collectDefaultMetrics({
  register: metricsRegistry,
  prefix: 'nodejs_',
});

let previousCpuUsage = process.cpuUsage();

export const processUptimeSeconds = new Gauge({
  name: 'process_uptime_seconds',
  help: 'Process uptime in seconds',
  registers: [metricsRegistry],
  collect() {
    processUptimeSeconds.set(process.uptime());
  },
});

export const processMemoryBytes = new Gauge({
  name: 'process_memory_bytes',
  help: 'Process resident memory usage in bytes',
  registers: [metricsRegistry],
  collect() {
    processMemoryBytes.set(process.memoryUsage().rss);
  },
});

export const processCpuUsagePercent = new Gauge({
  name: 'process_cpu_usage_percent',
  help: 'Process CPU usage percentage since the last collection',
  registers: [metricsRegistry],
  collect() {
    const currentCpuUsage = process.cpuUsage(previousCpuUsage);
    previousCpuUsage = process.cpuUsage();
    const totalMicroseconds = currentCpuUsage.user + currentCpuUsage.system;
    processCpuUsagePercent.set(totalMicroseconds / 10000);
  },
});

export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [metricsRegistry],
});

export const httpRequestDurationSeconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [metricsRegistry],
});
