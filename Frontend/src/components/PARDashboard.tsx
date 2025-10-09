import React, { useEffect, useMemo, useState } from 'react';
import html2canvas from 'html2canvas';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart } from 'recharts';
import { CalendarIcon, BarChart3, LineChart as LineChartIcon, PieChartIcon, FileText, FileImage, FileSpreadsheet, TrendingUp, TrendingDown, Eye, AlertTriangle, DollarSign, Users, Activity, ArrowUpRight, ArrowDownRight, User, Target, Banknote, ChevronDown, MousePointer, TrendingUpIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import App from '../App';






// Real data structure for PAR Dashboard
const realKPIData = {
  totalOutstanding: 11197315657,
  totalGrossProvision: 468927167,
  overallPAR: 4.19,
  week: '20 Sep',
  growthRate: -0.28,
  provisionRate: 4.19
};

// Real weekly data with correct format
const realWeeklyData = [
  { week: '31 Aug', par: 3.98, outstanding: 10800000000, provision: 430000000, date: '2024-08-31' },
  { week: '5 Sep', par: 4.84, outstanding: 11000000000, provision: 532400000, date: '2024-09-05' },
  { week: '12 Sep', par: 4.47, outstanding: 11100000000, provision: 495970000, date: '2024-09-12' },
  { week: '20 Sep', par: 4.19, outstanding: 11197315657, provision: 468927167, date: '2024-09-20' }
];

// Real officers data with detailed metrics
const realOfficersData: any = {
  'All Officers': realWeeklyData,
  'Joseph Kiwia Mwanya': {
    data: [
      { week: '31 Aug', par: 3.2, outstanding: 2700000000, provision: 86400000, performing: 78, watch: 12, substandard: 6, doubtful: 3, loss: 1 },
      { week: '5 Sep', par: 4.1, outstanding: 2750000000, provision: 112750000, performing: 75, watch: 15, substandard: 7, doubtful: 2, loss: 1 },
      { week: '12 Sep', par: 3.8, outstanding: 2800000000, provision: 106400000, performing: 76, watch: 14, substandard: 6, doubtful: 3, loss: 1 },
      { week: '20 Sep', par: 3.5, outstanding: 2850000000, provision: 99750000, performing: 79, watch: 12, substandard: 5, doubtful: 3, loss: 1 }
    ],
    performance: { performing: 79, watch: 12, substandard: 5, doubtful: 3, loss: 1 },
    avgLoanSize: 6333333,
    collectionRate: 96.5
  },
  'Ochieng Stephen': {
    data: [
      { week: '31 Aug', par: 4.2, outstanding: 2800000000, provision: 117600000, performing: 72, watch: 16, substandard: 8, doubtful: 3, loss: 1 },
      { week: '5 Sep', par: 5.1, outstanding: 2900000000, provision: 147900000, performing: 68, watch: 18, substandard: 9, doubtful: 4, loss: 1 },
      { week: '12 Sep', par: 4.8, outstanding: 2950000000, provision: 141600000, performing: 70, watch: 17, substandard: 8, doubtful: 4, loss: 1 },
      { week: '20 Sep', par: 4.4, outstanding: 2980000000, provision: 131120000, performing: 73, watch: 15, substandard: 7, doubtful: 4, loss: 1 }
    ],
    performance: { performing: 73, watch: 15, substandard: 7, doubtful: 4, loss: 1 },
    avgLoanSize: 7095238,
    collectionRate: 95.6
  },
  'Steve Kibor': {
    data: [
      { week: '31 Aug', par: 4.5, outstanding: 2650000000, provision: 119250000, performing: 69, watch: 18, substandard: 9, doubtful: 3, loss: 1 },
      { week: '5 Sep', par: 5.3, outstanding: 2700000000, provision: 143100000, performing: 66, watch: 19, substandard: 10, doubtful: 4, loss: 1 },
      { week: '12 Sep', par: 4.9, outstanding: 2750000000, provision: 134750000, performing: 68, watch: 18, substandard: 9, doubtful: 4, loss: 1 },
      { week: '20 Sep', par: 4.6, outstanding: 2800000000, provision: 128800000, performing: 71, watch: 16, substandard: 8, doubtful: 4, loss: 1 }
    ],
    performance: { performing: 71, watch: 16, substandard: 8, doubtful: 4, loss: 1 },
    avgLoanSize: 7368421,
    collectionRate: 95.4
  },
  'Protus Bwire Wandera': {
    data: [
      { week: '31 Aug', par: 3.8, outstanding: 2650000000, provision: 100700000, performing: 74, watch: 15, substandard: 7, doubtful: 3, loss: 1 },
      { week: '5 Sep', par: 4.7, outstanding: 2650000000, provision: 124550000, performing: 71, watch: 17, substandard: 8, doubtful: 3, loss: 1 },
      { week: '12 Sep', par: 4.3, outstanding: 2700000000, provision: 116100000, performing: 73, watch: 16, substandard: 7, doubtful: 3, loss: 1 },
      { week: '20 Sep', par: 4.0, outstanding: 2767315657, provision: 110692626, performing: 75, watch: 15, substandard: 6, doubtful: 3, loss: 1 }
    ],
    performance: { performing: 75, watch: 15, substandard: 6, doubtful: 3, loss: 1 },
    avgLoanSize: 6749304,
    collectionRate: 96.0
  }
};

// Performance categories data
const performanceCategories = [
  { name: 'Performing', value: 74.25, color: '#10b981', description: 'Loans with no payment issues' },
  { name: 'Watch', value: 15.5, color: '#f59e0b', description: '1-30 days past due' },
  { name: 'Substandard', value: 6.75, color: '#f97316', description: '31-90 days past due' },
  { name: 'Doubtful', value: 2.75, color: '#ef4444', description: '91-180 days past due' },
  { name: 'Loss', value: 0.75, color: '#7c2d12', description: 'Over 180 days past due' }
];

/* =========================================
   BACKEND INTEGRATION (NO UI/STYLE CHANGES)
   ========================================= */

type WeeklyRow = { week: string; outstanding: number; provision: number; par: number };
type Snapshot = { week: string | null; totalOutstanding: number; totalGrossProvision: number; overallPAR: number };

const API_BASE = 'http://127.0.0.1:8050/api';

export function PARDashboard() {
  // DESIGN STATE (UNCHANGED)
  const [selectedOfficer, setSelectedOfficer] = useState('All Officers');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'composed'>('line');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarMode, setCalendarMode] = useState<'upto' | 'single'>('upto');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [performanceOpen, setPerformanceOpen] = useState(false);

  // NEW: backend state (does NOT change the design)
  const [backendOfficers, setBackendOfficers] = useState<string[] | null>(null);
  const [backendOverallWeekly, setBackendOverallWeekly] = useState<WeeklyRow[] | null>(null);
  const [backendOfficerWeekly, setBackendOfficerWeekly] = useState<WeeklyRow[] | null>(null);
  const [backendSnapshot, setBackendSnapshot] = useState<Snapshot | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);

  

  // Fetch Overall on mount
  // Fetch overall (with date)
// --------------------
// Intelligent Refetch Helper (GLOBAL)
// --------------------
const fetchWithDateContext = async (officer: string, date: Date) => {
  const dateStr = date.toISOString().split('T')[0];
  const base = `${API_BASE}/${officer === 'All Officers' ? 'overall' : 'officer'}`;
  const params = new URLSearchParams();

  if (officer !== 'All Officers') params.append('name', officer);
  if (dateStr) params.append('date', dateStr);

  const res = await fetch(`${base}?${params.toString()}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();

  // 🧩 Auto-adjust if no weekly data
  if (!json?.weekly?.length && json?.snapshot?.week) {
    console.warn(`⚠️ No data for ${dateStr}, showing most recent available (${json.snapshot.week})`);
  }

  return json?.data || json;
};

// --------------------
// useEffect #1 — Overall Data (All Officers)
// --------------------
useEffect(() => {
  let alive = true;

  (async () => {
    try {
      setBackendError(null);

      if (!selectedDate) return;
      const json = await fetchWithDateContext("All Officers", selectedDate);
      if (!alive) return;

      setBackendSnapshot(json?.snapshot ?? null);
      setBackendOverallWeekly(json?.weekly ?? null);
      setBackendOfficers(json?.officers ?? null);
    } catch (e) {
      console.warn("Export failed silently", e);
    }
  })();

  return () => {
    alive = false;
  };
}, [selectedDate]);

// --------------------
// useEffect #2 — Officer-Specific Data
useEffect(() => {
  let alive = true;
  if (!selectedOfficer || selectedOfficer === "All Officers") {
    setBackendOfficerWeekly(null);
    return () => { alive = false; };
  }

  (async () => {
    try {
      setBackendError(null);
      if (!selectedDate) return;
      const json = await fetchWithDateContext(selectedOfficer, selectedDate);
      if (!alive) return;
      setBackendOfficerWeekly(json?.weekly ?? null);
      setBackendSnapshot(json?.snapshot ?? null);
    } catch (e) {
      if (!alive) return;
      setBackendError((e as any)?.message || "Failed to load officer data");
      setBackendOfficerWeekly(null);
    }
  })();

  return () => { alive = false; };
}, [selectedOfficer, selectedDate]);


// CURRENT DATA with backend preference + hard-coded fallback
  const getCurrentData = () => {
    if (selectedOfficer === 'All Officers') {
      return backendOverallWeekly && backendOverallWeekly.length ? backendOverallWeekly : realWeeklyData;
    }
    // Prefer backend officer data; fallback to hard-coded officer data
    const fromBackend = backendOfficerWeekly && backendOfficerWeekly.length ? backendOfficerWeekly : null;
    if (fromBackend) return fromBackend;
    return realOfficersData[selectedOfficer]?.data || realWeeklyData;
  };

  const getCurrentOfficerDetails = () => {
    if (selectedOfficer === 'All Officers') return null;
    return realOfficersData[selectedOfficer];
  };

  const currentData = getCurrentData();
  const officerDetails = getCurrentOfficerDetails();

  // KPI prefers backend snapshot; otherwise keep your original KPI logic
  const currentKPI = useMemo(() => {
    if (backendSnapshot && selectedOfficer === 'All Officers') {
      return {
        ...realKPIData,
        week: backendSnapshot.week ?? realKPIData.week,
        totalOutstanding: backendSnapshot.totalOutstanding ?? realKPIData.totalOutstanding,
        totalGrossProvision: backendSnapshot.totalGrossProvision ?? realKPIData.totalGrossProvision,
        overallPAR: backendSnapshot.overallPAR ?? realKPIData.overallPAR,
      };
    }
    if (backendSnapshot && selectedOfficer !== 'All Officers') {
      // If backend returns officer snapshot, use it
      if (backendSnapshot.week !== null) {
        return {
          ...realKPIData,
          week: backendSnapshot.week ?? realKPIData.week,
          totalOutstanding: backendSnapshot.totalOutstanding ?? realKPIData.totalOutstanding,
          totalGrossProvision: backendSnapshot.totalGrossProvision ?? realKPIData.totalGrossProvision,
          overallPAR: backendSnapshot.overallPAR ?? realKPIData.overallPAR,
        };
      }
    }
    // Original fallback for hardcoded officer series
    return selectedOfficer === 'All Officers'
      ? realKPIData
      : {
          ...realKPIData,
          totalOutstanding: (currentData as any)[3]?.outstanding || realKPIData.totalOutstanding,
          totalGrossProvision: (currentData as any)[3]?.provision || realKPIData.totalGrossProvision,
          overallPAR: (currentData as any)[3]?.par || realKPIData.overallPAR,
        };
  }, [backendSnapshot, selectedOfficer, currentData]);

  const formatCurrencyFull = (value: number) => {
    return `KES ${value.toLocaleString('en-US')}`;
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `KES ${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `KES ${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `KES ${(value / 1e3).toFixed(2)}K`;
    return `KES ${value.toLocaleString()}`;
  };
/* ===========================
   DOWNLOADS (STABLE EXPORT)
   =========================== */
const fetchBlobAndDownload = async (url: string, filename: string) => {
  const res = await fetch(url, { method: "GET", credentials: "include" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  const blob = await res.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
};

/**
 * Handles PDF / PNG / Excel exports cleanly
 */const handleDownload = async (format: "pdf" | "png" | "excel") => {
  const officerParam =
    selectedOfficer !== "All Officers"
      ? `&officer=${encodeURIComponent(selectedOfficer)}`
      : "";
  const weekParam = selectedDate
    ? `&week=${selectedDate.toISOString().split("T")[0]}`
    : "";

  const url = `${API_BASE}/export?format=${format}${officerParam}${weekParam}`;
  const officerSlug =
    selectedOfficer === "All Officers"
      ? "overall"
      : selectedOfficer.replace(/\s+/g, "_").toLowerCase();

  try {
    const res = await fetch(url, { method: "GET", credentials: "include" });
    if (!res.ok) {
      console.warn(`Download failed: HTTP ${res.status}`);
      return; // no popup
    }
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const ext = format === "excel" ? "xlsx" : format; // ensure xlsx
    link.download = `PAR_${officerSlug}_${selectedDate
      ?.toISOString()
      .split("T")[0]}.${ext}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  } catch (e) {
    console.warn("Silent export failure:", e); // no popup
  }
};

  const getTrendIndicator = (current: number, previous: number) => {
  if (!previous || previous === 0) {
    return { icon: <Activity />, color: 'text-gray-400', value: '0.00' };
  }

  // Normalize values: backend sends 0.04 instead of 4.0
  const cur = current < 1 ? current * 100 : current;
  const prev = previous < 1 ? previous * 100 : previous;

  const changePct = ((cur - prev) / prev) * 100;
  const isUp = changePct > 0;

  return {
    icon: isUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />,
    color: isUp ? 'text-red-500' : 'text-green-500',
    value: Math.abs(changePct).toFixed(2)
  };
};


  const renderChart = () => {
  const chartData = (currentData as any).map((item: any) => ({
    ...item,
    parFormatted: `${item.par}%`,
  }));

  switch (chartType) {
    case "line":
      return (
        <div id="par-chart">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="parGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: any, name: any) => [
                  name === "par"
                    ? `${value}%`
                    : formatCurrency(Number(value)),
                  name === "par"
                    ? "PAR %"
                    : name === "outstanding"
                    ? "Outstanding"
                    : "Provision",
                ]}
              />
              <Area
                type="monotone"
                dataKey="par"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#parGradient)"
                name="PAR %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );

    case "bar":
      return (
        <div id="par-chart">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: any) => [`${value}%`, "PAR %"]}
              />
              <Bar
                dataKey="par"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="PAR %"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );

    case "pie":
      const pieData = officerDetails
        ? Object.entries(officerDetails.performance).map(([key, value]) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value: Number(value as any),
            color:
              performanceCategories.find(
                (p) => p.name.toLowerCase() === key
              )?.color || "#8884d8",
          }))
        : performanceCategories;

      return (
        <div id="par-chart">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData as any}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }: any) => `${name}: ${value}%`}
                outerRadius={140}
                fill="#8884d8"
                dataKey="value"
              >
                {(pieData as any).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );

    case "composed":
      return (
        <div id="par-chart">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" stroke="#64748b" />
              <YAxis yAxisId="left" stroke="#64748b" />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: any, name: any) => [
                  name === "par"
                    ? `${value}%`
                    : formatCurrency(Number(value)),
                  name === "par"
                    ? "PAR %"
                    : name === "outstanding"
                    ? "Outstanding"
                    : "Provision",
                ]}
              />
              <Bar
                yAxisId="left"
                dataKey="par"
                fill="#3b82f6"
                name="PAR %"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="outstanding"
                stroke="#10b981"
                strokeWidth={2}
                name="Outstanding"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      );

    default:
      return null;
  }
};

  const KPIDetailDialog = ({ title, value, description, children, detailContent }: {
    title: string,
    value: string,
    description: string,
    children: React.ReactNode,
    detailContent: React.ReactNode
  }) => (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer transition-transform hover:scale-[1.02] group">
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <MousePointer className="h-6 w-6 text-blue-600" />
            {title} - Detailed Analysis
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="text-4xl mb-2 font-mono">{value}</div>
            <p className="text-gray-600">{description}</p>
          </div>
          {detailContent}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(156, 146, 172, 0.05) 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 p-6 space-y-8 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-lg bg-white/80 rounded-2xl p-6 shadow-xl border border-white/40"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl mb-3 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                PAR Analytics Dashboard
              </h1>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
                  Qona Financial Services
                </Badge>
                <span className="text-sm text-gray-600">
                  Last updated: {backendSnapshot?.week ?? realKPIData.week} 2024
                </span>
                {backendError && (
                  <span className="ml-3 text-xs text-red-600">backend offline — using fallback</span>
                )}
              </div>
            </div>

            {/* Enhanced Download Buttons */}
            <div className="flex gap-3">
              {[
                { type: 'pdf', icon: FileText, label: 'PDF', color: 'bg-red-500' },
                { type: 'png', icon: FileImage, label: 'PNG', color: 'bg-green-500' },
                { type: 'excel', icon: FileSpreadsheet, label: 'Excel', color: 'bg-blue-500' }
              ].map(({ type, icon: Icon, label, color }) => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(type as any)}
                  className="flex items-center gap-2 hover:scale-105 transition-all duration-200 bg-white/80"
                >
                  <div className={`w-2 h-2 rounded-full ${color}`}></div>
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced KPI Cards with Clickable Functionality */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPIDetailDialog
            title="Total Outstanding"
            value={formatCurrencyFull(currentKPI.totalOutstanding)}
            description="Total loan portfolio outstanding amount"
            detailContent={
              <Tabs defaultValue="breakdown" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                  <TabsTrigger value="trend">Weekly Trend</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>
                <TabsContent value="breakdown" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Current Week</p>
                        <p className="text-2xl font-mono">{formatCurrencyFull(currentKPI.totalOutstanding)}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Previous Week</p>
                        <p className="text-2xl font-mono">{formatCurrencyFull((currentData as any)[2]?.outstanding || 0)}</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="trend">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={currentData as any}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [formatCurrency(Number(value)), 'Outstanding']} />
                      <Line type="monotone" dataKey="outstanding" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="analysis">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Action Items:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Monitor portfolio growth rate</li>
                        <li>• Ensure adequate provisioning</li>
                        <li>• Track collection efficiency</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            }
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-blue-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 mb-2">
                        Total Outstanding
                      </p>
                      <div className="text-xl text-gray-900 mb-2 font-mono">
                        {formatCurrencyFull(currentKPI.totalOutstanding)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Week: {currentKPI.week}
                        </Badge>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingDown className="h-3 w-3" />
                          <span className="text-xs">0.28%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </KPIDetailDialog>

          <KPIDetailDialog
            title="Total Gross Provision"
            value={formatCurrencyFull(currentKPI.totalGrossProvision)}
            description="Total provisions for potential losses"
            detailContent={
              <Tabs defaultValue="breakdown" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                  <TabsTrigger value="trend">Weekly Trend</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>
                <TabsContent value="breakdown" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Provision Rate</p>
                        <p className="text-2xl font-mono">{realKPIData.provisionRate}%</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Coverage Ratio</p>
                        <p className="text-2xl font-mono">112.5%</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="trend">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={currentData as any}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [formatCurrency(Number(value)), 'Provision']} />
                      <Line type="monotone" dataKey="provision" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="recommendations">
                  <div className="space-y-4">
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Risk Management Actions:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Review provision adequacy monthly</li>
                        <li>• Implement early warning systems</li>
                        <li>• Enhance collection procedures</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            }
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-orange-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 mb-2">
                        Total Gross Provision
                      </p>
                      <div className="text-xl text-gray-900 mb-2 font-mono">
                        {formatCurrencyFull(currentKPI.totalGrossProvision)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={realKPIData.provisionRate} className="w-20 h-2" />
                        <span className="text-xs text-gray-600">{realKPIData.provisionRate}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </KPIDetailDialog>

          <KPIDetailDialog
            title="Overall PAR"
            value={`${currentKPI.overallPAR}%`}
            description="Portfolio at Risk percentage"
            detailContent={
              <Tabs defaultValue="analysis" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="analysis">Performance Analysis</TabsTrigger>
                  <TabsTrigger value="trend">Trend Analysis</TabsTrigger>
                  <TabsTrigger value="actions">Action Plan</TabsTrigger>
                </TabsList>
                <TabsContent value="analysis" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {performanceCategories.map((category) => (
                      <Card key={category.name}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                            <div>
                              <p className="text-sm font-medium">{category.name}</p>
                              <p className="text-lg font-mono">{category.value}%</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="trend">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={currentData as any}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [`${value}%`, 'PAR']} />
                      <Line type="monotone" dataKey="par" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="actions">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Improvement Strategies:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Strengthen client screening process</li>
                        <li>• Implement automated payment reminders</li>
                        <li>• Enhance collection officer training</li>
                        <li>• Deploy field collection technology</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            }
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-green-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">
                        Overall PAR
                      </p>
                      <div className="text-xl text-gray-900 mb-2 font-mono">
                        {currentKPI.overallPAR}%
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-green-600">
                          <ArrowDownRight className="h-3 w-3" />
                          <span className="text-xs">Improving</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </KPIDetailDialog>
        </div>

        {/* Enhanced Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-lg bg-white/80 rounded-2xl p-6 shadow-xl border border-white/40"
        >
          <div className="flex flex-wrap gap-6 items-center justify-between">
            <div className="flex flex-wrap gap-6 items-center">
              {/* Enhanced Officer Selector */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Collection Officer:
                </label>
                <Select value={selectedOfficer} onValueChange={setSelectedOfficer}>
                  <SelectTrigger className="w-72 bg-white/90 hover:bg-white border-2 border-blue-200 hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm">
                    {/* Backend officers first (if any), then your hard-coded list without duplicates */}
                    {[...(backendOfficers ?? []), 'All Officers',
                      'Joseph Kiwia Mwanya', 'Ochieng Stephen', 'Steve Kibor', 'Protus Bwire Wandera'
                    ].filter((v, i, arr) => arr.indexOf(v) === i).map((name) => (
                      <SelectItem key={name} value={name} className="hover:bg-blue-50">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-600" />
                          <span>{name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Portfolio Performance Dropdown */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Portfolio Performance:
                </label>
                <Popover open={performanceOpen} onOpenChange={setPerformanceOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="bg-white/90 hover:bg-white border-2 border-green-200 hover:border-green-300 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>View Categories</span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-white/95 backdrop-blur-sm" side="bottom">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 mb-3">Portfolio Performance Categories</h4>
                      {(officerDetails ?
                        Object.entries(officerDetails.performance).map(([key, value]) => ({
                          name: key.charAt(0).toUpperCase() + key.slice(1),
                          value: Number(value as any),
                          color: performanceCategories.find(p => p.name.toLowerCase() === key)?.color || '#8884d8',
                          description: performanceCategories.find(p => p.name.toLowerCase() === key)?.description || ''
                        })) : performanceCategories
                      ).map((category: any) => (
                        <div key={category.name} className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                            <div>
                              <p className="text-sm font-medium">{category.name}</p>
                              <p className="text-xs text-gray-500">{category.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">{category.value}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Date Selector */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">Week:</label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 bg-white/90 hover:bg-white">
                    <CalendarIcon className="h-4 w-4" />
                    {selectedDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-sm">
                <Calendar
  mode="single"
  selected={selectedDate}
  onSelect={async (date) => {
    if (!date) return;
    setSelectedDate(date);
    setDatePickerOpen(false);

    try {
      const json = await fetchWithDateContext(selectedOfficer, date);
      if (selectedOfficer === 'All Officers') {
        setBackendSnapshot(json?.snapshot ?? null);
        setBackendOverallWeekly(json?.weekly ?? []);
      } else {
        setBackendOfficerWeekly(json?.weekly ?? []);
        setBackendSnapshot(json?.snapshot ?? null);
      }
    } catch (err) {
      console.error('Calendar refetch failed', err);
      setBackendError((err as any)?.message || 'Failed to update data for selected date');
    }
  }}
  initialFocus
/>

                </PopoverContent>
              </Popover>
            </div>
          </div>
        </motion.div>

        {/* Officer Details KPIs (Removed Total Clients) */}
        {getCurrentOfficerDetails() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-lg">
              <CardContent className="p-4 text-center">
                <Banknote className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-xl font-mono text-gray-900">{formatCurrency((getCurrentOfficerDetails() as any).avgLoanSize)}</div>
                <p className="text-sm text-gray-600">Average Loan Size</p>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-lg">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-xl font-mono text-gray-900">{(getCurrentOfficerDetails() as any).collectionRate}%</div>
                <p className="text-sm text-gray-600">Collection Rate</p>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-lg">
              <CardContent className="p-4 text-center">
                <Activity className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-xl font-mono text-gray-900">{(currentData as any)[(currentData as any).length - 1]?.par}%</div>
                <p className="text-sm text-gray-600">Current PAR</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="backdrop-blur-lg bg-white/90 border-gray-200/50 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  {chartType === 'pie' ? 'Portfolio Distribution' : chartType === 'composed' ? 'Combined Analysis' : 'PAR Trend Analysis'}
                  {selectedOfficer !== 'All Officers' && (
                    <Badge variant="outline" className="ml-2">{selectedOfficer}</Badge>
                  )}
                </CardTitle>

                {/* Chart Type Selector - Enhanced with Composed Chart */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">View:</span>
                  <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                    {[
                      { type: 'line', icon: LineChartIcon, label: 'Trend' },
                      { type: 'bar', icon: BarChart3, label: 'Compare' },
                      { type: 'pie', icon: PieChartIcon, label: 'Distribution' },
                      { type: 'composed', icon: TrendingUpIcon, label: 'Combined' }
                    ].map(({ type, icon: Icon, label }) => (
                      <Button
                        key={type}
                        variant="ghost"
                        size="sm"
                        onClick={() => setChartType(type as any)}
                        className={`flex items-center gap-2 transition-all duration-200 text-xs px-3 py-2 ${
                          chartType === type
                            ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="h-3 w-3" />
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={chartType}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderChart()}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="backdrop-blur-lg bg-white/90 border-gray-200/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Weekly PAR Data - {selectedOfficer}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-4 font-semibold text-gray-700">Week</th>
                      <th className="text-left p-4 font-semibold text-gray-700">PAR %</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Outstanding</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Provision</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(currentData as any).map((row: any, index: number) => {
                      const prevRow = (currentData as any)[index - 1];
                      const trend = prevRow ? getTrendIndicator(row.par, prevRow.par) : null;

                      return (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="p-4 font-medium">{row.week}</td>
                          <td className="p-4">
                     <Badge
                    variant={row.par > 0.045 ? 'destructive' : row.par > 0.04 ? 'secondary' : 'default'}
                  className="font-semibold"
                       >
                     {(row.par < 1 ? (row.par * 100).toFixed(2) : row.par.toFixed(2))}%
                       </Badge>
                      </td>

                          <td className="p-4 text-blue-900 font-mono">{formatCurrencyFull(row.outstanding)}</td>
                          <td className="p-4 text-orange-900 font-mono">{formatCurrencyFull(row.provision)}</td>
                          <td className="p-4">
                            {trend && (
                              <div className={`flex items-center gap-1 ${trend.color}`}>
                                {trend.icon}
                                <span className="text-sm">{trend.value}%</span>
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
export default PARDashboard;
