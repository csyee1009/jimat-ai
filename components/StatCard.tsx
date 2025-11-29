import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    description?: string;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, description }: StatCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                {(trend || description) && (
                    <p className="text-xs text-gray-500 mt-1">
                        {trend && (
                            <span className={trendUp ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                                {trend}
                            </span>
                        )}
                        {trend && description && " "}
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
