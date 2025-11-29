'use client';

import React, { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Line,
    ComposedChart,
} from 'recharts';
import { Zap, TrendingUp, Battery, Leaf, Loader2, ArrowLeft } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { Button } from '@/components/ui/button';

// Types moved to DashboardContext

import { useDashboard } from '@/contexts/DashboardContext';

export default function Dashboard() {
    const { dashboardData, setDashboardData } = useDashboard();
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleFileSelect = async (file: File) => {
        console.log("File selected:", file.name);
        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            console.log("Sending file to API...");
            const response = await fetch("/api/analyze-bill", {
                method: "POST",
                body: formData,
            });

            console.log("API response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API error response:", errorText);
                throw new Error(`Failed to analyze bill: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("API response data:", data);
            setDashboardData(data);
        } catch (error) {
            console.error("Error analyzing bill:", error);
            alert("Failed to analyze bill. Please check the console for details.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (!dashboardData) {
        return (
            <div className="p-6 min-h-[80vh] flex flex-col items-center justify-center space-y-8">
                <div className="text-center space-y-4 max-w-2xl">
                    <h1 className="text-4xl font-bold text-gray-900">Upload Your Electricity Bill</h1>
                    <p className="text-lg text-gray-600">
                        Upload your PDF bill to get instant AI-powered insights, usage analysis, and cost breakdown.
                    </p>
                </div>

                <div className="w-full max-w-xl">
                    <FileUpload onFileSelect={handleFileSelect} />
                </div>

                {isAnalyzing && (
                    <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-gray-600 font-medium">Analyzing your bill with AI...</p>
                    </div>
                )}
            </div>
        );
    }

    const { usageHistory, billSummary, metrics, costBreakdown } = dashboardData;

    return (
        <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Household Energy Dashboard</h2>
                    <p className="text-gray-500">Billing Period: {billSummary.billingPeriod}</p>
                </div>
                <div className="text-left md:text-right">
                    <p className="text-sm text-gray-500">Total Amount Due</p>
                    <p className="text-3xl font-bold text-primary">RM {billSummary.totalAmount.toFixed(2)}</p>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Avg. Monthly Usage"
                    value={`${metrics.averageUsage} kWh`}
                    icon={<Zap className="w-5 h-5 text-yellow-600" />}
                    trend="+2.5% vs last year"
                    trendUp={true}
                    iconBg="bg-yellow-100"
                />
                <MetricCard
                    title="Daily Usage"
                    value={`${metrics.dailyUsage} kWh`}
                    icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
                    trend="-1.2% vs last month"
                    trendUp={false}
                    iconBg="bg-blue-100"
                />
                <MetricCard
                    title="Generation Cost"
                    value={`RM ${metrics.generationCost}/kWh`}
                    icon={<Battery className="w-5 h-5 text-purple-600" />}
                    subtext="Base energy cost"
                    iconBg="bg-purple-100"
                />
                <MetricCard
                    title="Green Incentive"
                    value={`RM ${Math.abs(metrics.greenIncentive)}/kWh`}
                    icon={<Leaf className="w-5 h-5 text-green-600" />}
                    subtext="Credit applied"
                    highlight
                    iconBg="bg-green-100"
                />
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Usage History Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">6-Month Usage History</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={usageHistory}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="month" stroke="#64748b" />
                                <YAxis yAxisId="left" stroke="#64748b" />
                                <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }}
                                    itemStyle={{ color: '#1e293b' }}
                                />
                                <Legend />
                                <Bar yAxisId="left" dataKey="usage" name="Usage (kWh)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                <Line yAxisId="right" type="monotone" dataKey="cost" name="Cost (RM)" stroke="#10b981" strokeWidth={2} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Cost Breakdown</h3>
                    <div className="flex-1 space-y-6">
                        {costBreakdown.map((item) => (
                            <CostItem
                                key={item.name}
                                label={item.name}
                                amount={item.value}
                                rate={0} // Rate not always available in breakdown, simplifying for now
                                color={item.color.replace('#', 'bg-[#') + ']'} // Hacky color mapping, ideally use classes
                                isCredit={item.value < 0}
                            />
                        ))}
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-end">
                                <span className="text-gray-500">Total Bill</span>
                                <span className="text-3xl font-bold text-gray-900">RM {billSummary.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <Button
                    variant="outline"
                    onClick={() => setDashboardData(null)}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Upload a different bill
                </Button>
            </div>
        </div>
    );
}

// Sub-components

function MetricCard({ title, value, icon, trend, trendUp, subtext, highlight, iconBg }: any) {
    return (
        <div className={`p-6 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${highlight
            ? 'bg-green-50 border-green-200'
            : 'bg-white border-gray-200 shadow-sm'
            }`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${iconBg || 'bg-gray-100'}`}>
                    {icon}
                </div>
                {trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
            <p className={`text-2xl font-bold ${highlight ? 'text-green-700' : 'text-gray-900'}`}>{value}</p>
            {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
        </div>
    );
}

function CostItem({ label, amount, rate, color, isCredit }: any) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${color.startsWith('bg-') ? color : 'bg-blue-500'}`} style={{ backgroundColor: !color.startsWith('bg-') ? color : undefined }} />
                <div>
                    <p className="text-gray-900 font-medium">{label}</p>
                    {rate > 0 && <p className="text-xs text-gray-500">RM {Math.abs(rate)}/kWh</p>}
                </div>
            </div>
            <div className="text-right">
                <p className={`font-semibold ${isCredit ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {isCredit ? '-' : ''}RM {Math.abs(amount).toFixed(2)}
                </p>
            </div>
        </div>
    );
}
