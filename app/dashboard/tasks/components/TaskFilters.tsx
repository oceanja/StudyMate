import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import '../index.css';
import '../app.css';

export interface FilterState {
  search: string;
  priority: 'all' | 'low' | 'medium' | 'high';
  status: 'all' | 'pending' | 'completed';
  subject: string; // changed from category
}

interface TaskFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  subjects: string[]; // changed from categories
}

export function TaskFilters({ filters, onFiltersChange, subjects }: TaskFiltersProps) {
  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== 'all' && value !== ''
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filters</span>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {activeFiltersCount} active
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>
        
        <Select 
          value={filters.status} 
          onValueChange={(value: 'all' | 'pending' | 'completed') => 
            onFiltersChange({ ...filters, status: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all" value="all">All Status</SelectItem>
            <SelectItem key="pending" value="pending">Pending</SelectItem>
            <SelectItem key="completed" value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={filters.priority} 
          onValueChange={(value: 'all' | 'low' | 'medium' | 'high') => 
            onFiltersChange({ ...filters, priority: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all" value="all">All Priorities</SelectItem>
            <SelectItem key="low" value="low">🟢 Low</SelectItem>
            <SelectItem key="medium" value="medium">🟡 Medium</SelectItem>
            <SelectItem key="high" value="high">🔴 High</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={filters.subject} 
          onValueChange={(value) => onFiltersChange({ ...filters, subject: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all" value="all">All Subjects</SelectItem>
            {subjects.map((subject, index) => (  // Switched to index for guaranteed uniqueness
              <SelectItem key={index} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
