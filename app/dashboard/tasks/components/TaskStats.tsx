import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, AlertTriangle, Target } from "lucide-react";
import type { Task } from "./TaskCard";
import '../index.css';
import '../app.css';

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const completed = tasks.filter(task => task.completed).length;
  const pending = tasks.filter(task => !task.completed).length;
  const highPriority = tasks.filter(task => task.priority === 'high' && !task.completed).length;
  const overdue = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  }).length;

  const stats = [
    {
      title: "Completed",
      value: completed,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "High Priority",
      value: highPriority,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
    {
      title: "Total",
      value: tasks.length,
      icon: Target,
      color: "text-muted-foreground",
      bgColor: "bg-muted/20"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-4 bg-gradient-card hover:shadow-soft transition-shadow">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}