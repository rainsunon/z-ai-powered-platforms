import { useQuery } from '@tanstack/react-query';
import { analyticsApi, contentApi } from '@/lib/api';
import {
  FileText,
  Eye,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: () => analyticsApi.overview('30d'),
  });

  const { data: timeseries } = useQuery({
    queryKey: ['analytics', 'timeseries'],
    queryFn: () => analyticsApi.timeseries('30d', 'pageviews'),
  });

  const { data: recentContent } = useQuery({
    queryKey: ['content', 'recent'],
    queryFn: () => contentApi.list({ limit: '5', sort: 'createdAt', order: 'desc' }),
  });

  const stats = overview?.data;
  const chartData = timeseries?.data?.data ?? [];
  const content = recentContent?.data?.data ?? [];

  const statCards = [
    {
      label: 'Total Content',
      value: stats?.totalContent ?? '—',
      change: stats?.contentChange ?? 0,
      icon: FileText,
      color: 'blue',
    },
    {
      label: 'Page Views',
      value: stats?.totalPageviews?.toLocaleString() ?? '—',
      change: stats?.pageviewsChange ?? 0,
      icon: Eye,
      color: 'green',
    },
    {
      label: 'Active Users',
      value: stats?.activeUsers ?? '—',
      change: stats?.usersChange ?? 0,
      icon: Users,
      color: 'purple',
    },
    {
      label: 'Avg. Session',
      value: stats?.avgSessionDuration ? `${Math.round(stats.avgSessionDuration / 60)}m` : '—',
      change: stats?.sessionChange ?? 0,
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
  };

  if (overviewLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your CMS</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <div className={`rounded-lg p-2 ${colorMap[s.color]}`}>
                  <s.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                {s.change >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={s.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(s.change)}%
                </span>
                <span className="text-muted-foreground">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Page Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent content */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent Content</CardTitle>
          <Link to="/content" className="text-sm text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {content.map((item: { id: string; title: string; status: string; createdAt: string }) => (
              <Link
                key={item.id}
                to={`/content/${item.id}/edit`}
                className="flex items-center gap-4 py-3 hover:bg-muted/50 -mx-2 px-2 rounded-lg"
              >
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {format(new Date(item.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>
                <Badge variant={item.status === 'published' ? 'success' : 'warning'}>
                  {item.status}
                </Badge>
              </Link>
            ))}
            {content.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No content yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
