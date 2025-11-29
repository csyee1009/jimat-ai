import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const activities = [
    {
        user: "Alice Smith",
        action: "created a new project",
        target: "Marketing Campaign",
        time: "2 minutes ago",
        avatar: "AS",
    },
    {
        user: "Bob Jones",
        action: "uploaded a file",
        target: "Q4_Report.pdf",
        time: "15 minutes ago",
        avatar: "BJ",
    },
    {
        user: "Charlie Brown",
        action: "commented on",
        target: "Design Mockups",
        time: "1 hour ago",
        avatar: "CB",
    },
    {
        user: "Diana Prince",
        action: "completed task",
        target: "Update Homepage",
        time: "3 hours ago",
        avatar: "DP",
    },
];

export function ActivityList() {
    return (
        <div className="space-y-6">
            {activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.user}`} />
                        <AvatarFallback>{activity.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                            {activity.user} <span className="text-gray-500 font-normal">{activity.action}</span> <span className="font-medium text-primary">{activity.target}</span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
