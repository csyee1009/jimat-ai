"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Zap, Leaf, CheckCircle, ArrowRight, Loader2, Sun, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/contexts/DashboardContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

export default function PredictPage() {
    const { predictionData, setPredictionData } = useDashboard();
    const [formData, setFormData] = useState({
        dayOfWeek: "Monday",
        temp: "26.5",
        familySize: "4",
        hasAC: "Yes",
        peakUsage: "5.5",
        hasSolar: false,
        solarSize: "5.0"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPredictionData(null);

        const payload = {
            Day: formData.dayOfWeek,
            Avg_Temperature_C: parseFloat(formData.temp),
            Household_Size: parseInt(formData.familySize),
            Has_AC: formData.hasAC,
            Peak_Hours_Usage_kWh: parseFloat(formData.peakUsage),
            Has_Solar: formData.hasSolar,
            Solar_Panel_Size_kW: formData.hasSolar ? parseFloat(formData.solarSize) : 0
        };

        try {
            const response = await fetch("/api/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Failed to fetch prediction");
            }

            const data = await response.json();
            setPredictionData(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to get prediction. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputClassName = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    // Prepare chart data
    const chartData = predictionData ? (
        predictionData.mode === 'solar' ? [
            { name: 'Usage', value: predictionData.consumption, fill: '#ef4444' },
            { name: 'Solar Gen', value: predictionData.generation, fill: '#ca8a04' }
        ] : [
            { name: 'Usage', value: predictionData.prediction, fill: predictionData.status === 'CRITICAL' ? '#ea580c' : '#22c55e' }
        ]
    ) : [];

    return (
        <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Energy Forecast AI</h2>
                    <p className="text-gray-500">Predict future consumption and optimize with solar</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Prediction Parameters Card */}
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Prediction Parameters</CardTitle>
                        <CardDescription>Enter details to forecast energy consumption</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Day of Week</label>
                                <select
                                    className={inputClassName}
                                    value={formData.dayOfWeek}
                                    onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                                >
                                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Temp (°C)</label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={formData.temp}
                                        onChange={(e) => setFormData({ ...formData, temp: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Family Size</label>
                                    <Input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={formData.familySize}
                                        onChange={(e) => setFormData({ ...formData, familySize: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Has AC?</label>
                                    <select
                                        className={inputClassName}
                                        value={formData.hasAC}
                                        onChange={(e) => setFormData({ ...formData, hasAC: e.target.value })}
                                    >
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Peak Usage (kWh)</label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={formData.peakUsage}
                                        onChange={(e) => setFormData({ ...formData, peakUsage: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <label className="flex items-center gap-3 mb-3 cursor-pointer group relative w-fit select-none">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={formData.hasSolar}
                                            onChange={(e) => setFormData({ ...formData, hasSolar: e.target.checked })}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                        I have Solar Panels
                                    </span>
                                </label>

                                <div className={cn(
                                    "transition-all duration-300 overflow-hidden",
                                    formData.hasSolar ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0"
                                )}>
                                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                                        <label className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-1 block">Panel Size (kW)</label>
                                        <Input
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            value={formData.solarSize}
                                            onChange={(e) => setFormData({ ...formData, solarSize: e.target.value })}
                                            className="bg-white border-yellow-300 font-bold text-gray-800 focus-visible:ring-yellow-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        Calculate Forecast
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Results Card */}
                <Card className={cn(
                    "border-gray-200 shadow-sm transition-all duration-500",
                    predictionData ? "opacity-100" : "opacity-50 grayscale"
                )}>
                    <CardHeader>
                        <CardTitle>Forecast Results</CardTitle>
                        <CardDescription>
                            {predictionData ? "Analysis complete" : "Run a prediction to see results"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {predictionData ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {predictionData.mode === 'solar' ? (
                                    // Solar Mode Results
                                    <>
                                        <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2">Net Impact</p>
                                            <div className="flex items-baseline justify-center gap-1">
                                                <span className={cn(
                                                    "text-4xl font-bold",
                                                    (predictionData.net_energy || 0) > 0 ? "text-green-600" : "text-orange-600"
                                                )}>
                                                    {(predictionData.net_energy || 0) > 0 ? '+' : '-'}RM {Math.abs(predictionData.bill_impact || 0).toFixed(2)}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-500 mt-1">
                                                {(predictionData.net_energy || 0) > 0 ? "Profit Generated" : "Estimated Cost"}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <MetricItem
                                                label="You Use"
                                                value={predictionData.consumption}
                                                unit="kWh"
                                                color="text-slate-700"
                                                bg="bg-gray-50"
                                            />
                                            <MetricItem
                                                label="Solar Makes"
                                                value={predictionData.generation}
                                                unit="kWh"
                                                color="text-yellow-700"
                                                bg="bg-yellow-50"
                                            />
                                        </div>

                                        <AlertBox
                                            type={(predictionData.net_energy || 0) > 0 ? "success" : "warning"}
                                            title={(predictionData.net_energy || 0) > 0 ? "Eco-Friendly Status" : "Energy Deficit"}
                                            message={(predictionData.net_energy || 0) > 0
                                                ? "Great job! Your solar panels are covering 100% of your needs."
                                                : "You are consuming more than you generate. Consider reducing AC usage."}
                                            icon={(predictionData.net_energy || 0) > 0 ? Leaf : Zap}
                                        />
                                    </>
                                ) : (
                                    // Standard Mode Results
                                    <>
                                        <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2">Predicted Consumption</p>
                                            <div className="flex items-baseline justify-center gap-2">
                                                <span className="text-4xl font-bold text-slate-800 tracking-tight">
                                                    {predictionData.prediction.toFixed(2)}
                                                </span>
                                                <span className="text-lg text-gray-500 font-medium">kWh</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <MetricItem
                                                label="Status"
                                                value={predictionData.status}
                                                color={predictionData.status === "Safe" ? "text-green-600" : "text-orange-600"}
                                                bg="bg-gray-50"
                                            />
                                            <MetricItem
                                                label="Safe Threshold"
                                                value={predictionData.threshold}
                                                unit="kWh"
                                                color="text-slate-700"
                                                bg="bg-gray-50"
                                            />
                                        </div>

                                        <AlertBox
                                            type={predictionData.status === "Safe" ? "success" : "warning"}
                                            title={predictionData.status === "Safe" ? "Efficiency Good" : "High Usage Alert"}
                                            message={predictionData.status === "Safe"
                                                ? "Your consumption is within the safe threshold."
                                                : "Your predicted usage is above the safe threshold."}
                                            icon={predictionData.status === "Safe" ? CheckCircle : Zap}
                                        />
                                    </>
                                )}

                                {/* Chart Section */}
                                <div className="h-[200px] w-full mt-6">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                            {predictionData.mode !== 'solar' && (
                                                <ReferenceLine y={predictionData.threshold} stroke="#94a3b8" strokeDasharray="6 6" strokeWidth={2} />
                                            )}
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[400px] text-center text-gray-400 space-y-4">
                                <div className="p-4 bg-gray-50 rounded-full">
                                    <TrendingUp className="w-8 h-8 opacity-20" />
                                </div>
                                <p>Enter parameters and click "Calculate Forecast" <br /> to see AI predictions here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Helper Components

function MetricItem({ label, value, unit, color, bg }: any) {
    return (
        <div className={cn("rounded-xl p-4 text-center border border-transparent", bg)}>
            <p className="text-xs text-gray-500 font-bold uppercase mb-1">{label}</p>
            <p className={cn("text-lg font-bold", color)}>
                {value} {unit && <span className="text-sm font-normal opacity-70">{unit}</span>}
            </p>
        </div>
    );
}

function AlertBox({ type, title, message, icon: Icon }: any) {
    const styles = type === "success"
        ? "bg-green-50 border-green-100 text-green-800"
        : "bg-orange-50 border-orange-100 text-orange-800";

    const iconColor = type === "success" ? "text-green-500" : "text-orange-500";

    return (
        <div className={cn("border rounded-xl p-4 flex items-start gap-3", styles)}>
            <div className="mt-0.5">
                <Icon className={cn("h-5 w-5", iconColor)} />
            </div>
            <div>
                <h4 className="font-bold text-sm">{title}</h4>
                <p className="text-xs mt-1 leading-relaxed opacity-90">{message}</p>
            </div>
        </div>
    );
}
