import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "../../components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "../../components/ui/table";
import { 
  FileText, DollarSign, ShoppingCart, TrendingUp, LogOut, 
  RefreshCw, Loader2, ChevronLeft, ChevronRight, Download,
  AlertTriangle, Users, BarChart3, Calendar
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [errors, setErrors] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const adminName = localStorage.getItem("adminName") || "Admin";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const authHeaders = { Authorization: `Bearer ${token}` };
      
      const requests = [
        axios.get(`${API}/admin/analytics`, { headers: authHeaders }),
        axios.get(`${API}/admin/orders`, { 
          headers: authHeaders,
          params: { 
            skip: page * 10, 
            limit: 10,
            status: statusFilter !== "all" ? statusFilter : undefined
          }
        }),
        axios.get(`${API}/admin/revenue-summary`, { 
          headers: authHeaders,
          params: { days: 30 }
        })
      ];

      const [analyticsRes, ordersRes, revenueRes] = await Promise.all(requests);
      
      setAnalytics(analyticsRes.data);
      setOrders(ordersRes.data.orders);
      setTotalOrders(ordersRes.data.total);
      
      // Format daily revenue for chart
      const formattedRevenue = (revenueRes.data.dailyRevenue || []).map(item => ({
        date: item._id,
        revenue: item.revenue,
        orders: item.orders
      })).reverse();
      setDailyRevenue(formattedRevenue);
      
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin");
      } else {
        toast.error("Failed to load data");
      }
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin");
      return;
    }
    fetchData();
  }, [fetchData, navigate]);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
  });

  const fetchErrors = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API}/admin/errors`, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      setErrors(response.data);
    } catch (error) {
      console.error("Errors fetch error:", error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API}/admin/users`, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Users fetch error:", error);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'errors') fetchErrors();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab, fetchErrors, fetchUsers]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate("/admin");
  };

  const handleExport = async (type) => {
    try {
      const response = await axios.get(`${API}/admin/export`, {
        headers: getAuthHeaders(),
        params: { type },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_export.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${type} exported successfully`);
    } catch (error) {
      toast.error("Export failed");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium",
      paid: "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium",
      completed: "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium",
      failed: "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium",
      refunded: "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium"
    };
    return <span className={styles[status] || styles.pending}>{status}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalPages = Math.ceil(totalOrders / 10);

  // Prepare pie chart data
  const serviceDistribution = analytics ? 
    Object.entries(analytics.ordersByService || {}).map(([service, count]) => ({
      name: service,
      value: count
    })).slice(0, 6) : [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-md flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-900">FileSolved</span>
                <span className="text-slate-400 ml-2 text-sm">Admin</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 hidden sm:block">Welcome, {adminName}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                data-testid="admin-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-4 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'errors', label: 'Errors', icon: AlertTriangle }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && activeTab === 'overview' ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6" data-testid="stat-revenue">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Total Revenue</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">
                          ${(analytics?.totalRevenue || 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6" data-testid="stat-orders">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Total Orders</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">
                          {analytics?.totalOrders || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6" data-testid="stat-conversion">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Conversion Rate</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">
                          {(analytics?.conversionRate || 0).toFixed(1)}%
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6" data-testid="stat-services">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Active Services</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">
                          {Object.keys(analytics?.ordersByService || {}).length || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-amber-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Revenue Chart */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold text-slate-900">Revenue (Last 30 Days)</h2>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        Daily
                      </div>
                    </div>
                    {dailyRevenue.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={dailyRevenue}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => value.split('-').slice(1).join('/')}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                            labelFormatter={(label) => `Date: ${label}`}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[250px] flex items-center justify-center text-slate-400">
                        No revenue data yet
                      </div>
                    )}
                  </div>

                  {/* Service Distribution */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="font-semibold text-slate-900 mb-6">Orders by Service</h2>
                    {serviceDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={serviceDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name.slice(0, 10)}... ${(percent * 100).toFixed(0)}%`}
                          >
                            {serviceDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[250px] flex items-center justify-center text-slate-400">
                        No orders data yet
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-900">Recent Orders</h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveTab('orders')}
                    >
                      View All
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(analytics?.recentOrders || []).slice(0, 5).map((order) => (
                          <TableRow key={order.orderId}>
                            <TableCell className="font-mono text-sm">
                              {order.orderId?.slice(0, 8)}...
                            </TableCell>
                            <TableCell>{order.serviceName || order.serviceId}</TableCell>
                            <TableCell className="font-semibold">${(order.amount || 0).toFixed(2)}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                          </TableRow>
                        ))}
                        {(!analytics?.recentOrders || analytics.recentOrders.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-slate-400 py-8">
                              No orders yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <h2 className="font-semibold text-slate-900">All Orders</h2>
                  <div className="flex items-center gap-4">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32" data-testid="status-filter">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExport('orders')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={fetchData}
                      data-testid="refresh-orders"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>

                {loading ? (
                  <div className="p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400 mx-auto" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    No orders found
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.orderId} data-testid={`order-row-${order.orderId}`}>
                              <TableCell className="font-mono text-sm">
                                {order.orderId?.slice(0, 8)}...
                              </TableCell>
                              <TableCell>{order.serviceName || order.serviceId}</TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{order.customerName}</p>
                                  <p className="text-xs text-slate-500">{order.customerEmail}</p>
                                </div>
                              </TableCell>
                              <TableCell className="font-semibold">${(order.amount || 0).toFixed(2)}</TableCell>
                              <TableCell>{getStatusBadge(order.status)}</TableCell>
                              <TableCell className="text-slate-500 text-sm">
                                {formatDate(order.createdAt)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-slate-200 flex items-center justify-between">
                      <p className="text-sm text-slate-500">
                        Showing {page * 10 + 1} - {Math.min((page + 1) * 10, totalOrders)} of {totalOrders}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(p => Math.max(0, p - 1))}
                          disabled={page === 0}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-slate-600">
                          Page {page + 1} of {totalPages || 1}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(p => p + 1)}
                          disabled={page >= totalPages - 1}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">Registered Users</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={fetchUsers}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.userId}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium">
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm">
                            {formatDate(user.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                      {users.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-slate-400 py-8">
                            No users registered yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Errors Tab */}
            {activeTab === 'errors' && (
              <div className="space-y-6">
                {/* Failed Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <h2 className="font-semibold text-slate-900">Failed Orders</h2>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={fetchErrors}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Error</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(errors?.failedOrders || []).map((order) => (
                          <TableRow key={order.orderId}>
                            <TableCell className="font-mono text-sm">
                              {order.orderId?.slice(0, 8)}...
                            </TableCell>
                            <TableCell>{order.serviceName || order.serviceId}</TableCell>
                            <TableCell className="text-red-600 text-sm max-w-xs truncate">
                              {order.errorMessage || 'Unknown error'}
                            </TableCell>
                            <TableCell className="text-slate-500 text-sm">
                              {formatDate(order.createdAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                        {(!errors?.failedOrders || errors.failedOrders.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-green-600 py-8">
                              ✓ No failed orders
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Failed Jobs */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <h2 className="font-semibold text-slate-900">Failed Processing Jobs</h2>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job ID</TableHead>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Error</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(errors?.failedJobs || []).map((job) => (
                          <TableRow key={job.jobId}>
                            <TableCell className="font-mono text-sm">
                              {job.jobId?.slice(0, 8)}...
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {job.orderId?.slice(0, 8)}...
                            </TableCell>
                            <TableCell>{job.type}</TableCell>
                            <TableCell className="text-red-600 text-sm max-w-xs truncate">
                              {job.errorMessage || 'Unknown error'}
                            </TableCell>
                            <TableCell className="text-slate-500 text-sm">
                              {formatDate(job.createdAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                        {(!errors?.failedJobs || errors.failedJobs.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-green-600 py-8">
                              ✓ No failed jobs
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
