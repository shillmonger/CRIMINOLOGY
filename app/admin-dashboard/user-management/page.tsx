"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Check,
  UserCheck,
  Users,
  TrendingUp,
  X,
  LineChart,
  LayoutDashboard,
  Search,
  MoreVertical,
  UserX,
  Shield,
  ShieldOff,
  Trash2,
} from "lucide-react";

import AdminHeader from "@/components/admin-dashboard/Header";
import { UserManagementSkeleton } from "@/components/ui/user-management-skeleton";
import AdminSidebar from "@/components/admin-dashboard/Sidebar";
import AdminNav from "@/components/admin-dashboard/Nav";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  status: "active" | "suspended";
  role: "user" | "admin";
  avatarSrc?: string;
}

export default function AdminUserManagementPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const suspendedUsers = users.filter((u) => u.status === "suspended").length;
  const newThisWeek = users.filter(user => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(user.createdAt) > oneWeekAgo;
  }).length;

  const handleAction = async (userId: string, action: "delete" | "suspend" | "reactivate" | "makeAdmin" | "removeAdmin") => {
    try {
      setIsProcessing(prev => ({ ...prev, [userId + action]: true }));
      
      if (action === 'delete') {
        const response = await fetch(`/api/users?userId=${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to delete user');
        
        setUsers(prev => prev.filter(user => user.id !== userId));
        toast.success('User has been deleted successfully');
      } else {
        const response = await fetch('/api/users', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, action }),
        });

        if (!response.ok) throw new Error(`Failed to ${action} user`);
        
        const updatedUser = await response.json();
        
        setUsers(prev =>
          prev.map(user =>
            user.id === updatedUser.id 
              ? { 
                  ...user, 
                  status: updatedUser.status, 
                  role: updatedUser.role 
                } 
              : user
          )
        );
        
        toast.success(`User has been ${action === 'suspend' ? 'suspended' : action === 'reactivate' ? 'reactivated' : action === 'makeAdmin' ? 'made admin' : 'removed from admin'} successfully`);
      }
    } catch (error) {
      console.error(`Error ${action} user:`, error);
      toast.error(`Failed to ${action} user. Please try again.`);
    } finally {
      setIsProcessing(prev => ({ ...prev, [userId + action]: false }));
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background font-inter">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
          {loading ? (
            <UserManagementSkeleton />
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-lg md:text-2xl font-black uppercase tracking-tighter italic leading-none text-foreground mb-2">
                  User Management
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage all registered users and their investment status.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "Total Users",
                    value: totalUsers,
                    icon: <Users className="w-5 h-5" />,
                    color: "text-foreground",
                    bg: "bg-foreground/5",
                  },
                  {
                    label: "Active",
                    value: activeUsers,
                    icon: <UserCheck className="w-5 h-5" />,
                    color: "text-green-500",
                    bg: "bg-green-500/10",
                  },
                  {
                    label: "Suspended",
                    value: suspendedUsers,
                    icon: <UserX className="w-5 h-5" />,
                    color: "text-red-500",
                    bg: "bg-red-500/10",
                  },
                  {
                    label: "New This Week",
                    value: `+${newThisWeek}`,
                    icon: <TrendingUp className="w-5 h-5" />,
                    color: "text-blue-500",
                    bg: "bg-blue-500/10",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="group relative bg-card border border-border rounded-2xl p-5 transition-all duration-300 hover:border-foreground/30 hover:shadow-lg hover:shadow-foreground/5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                          {stat.label}
                        </p>
                        <p className={`text-3xl font-black italic tracking-tighter ${stat.color}`}>
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-0 overflow-hidden rounded-2xl opacity-5">
                       <div className="translate-x-4 translate-y-4 scale-150">
                         {stat.icon}
                       </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border py-6"
                />
              </div>

              {/* Users Table */}
              <div className="bg-card border border-border rounded-xl overflow-hidden mb-5">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">All Users</h2>
                    <Badge variant="secondary" className="text-sm">
                      {filteredUsers.length} users
                    </Badge>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Name</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Email</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Joined</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-border hover:bg-muted/20 transition">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-9 w-9 md:h-11 md:w-11 border-2 border-foreground/20 hover:border-foreground transition-all rounded-xl p-0.5 cursor-pointer">
                                <AvatarImage
                                  src={user.avatarSrc || "https://github.com/shadcn.png"}
                                  className="rounded-lg"
                                />
                                <AvatarFallback className="rounded-lg bg-foreground text-background font-bold">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">{user.name}</p>
                                {user.role === 'admin' && (
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Admin
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-foreground">{user.email}</td>
                          <td className="px-6 py-5 text-muted-foreground">{formatDate(user.createdAt)}</td>
                          <td className="px-6 py-5">
                            <Badge
                              variant={user.status === "active" ? "default" : "destructive"}
                              className={user.status === "active" ? "bg-green-600 text-white" : ""}
                            >
                              {user.status === "active" ? "Active" : "Suspended"}
                            </Badge>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-5 h-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {user.status === "active" ? (
                                  <DropdownMenuItem
                                    className="text-orange-600 focus:text-orange-600"
                                    onClick={() => handleAction(user.id, "suspend")}
                                    disabled={isProcessing[user.id + 'suspend']}
                                  >
                                    <UserX className="w-4 h-4 mr-2" />
                                    Suspend User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="text-green-600 focus:text-green-600"
                                    onClick={() => handleAction(user.id, "reactivate")}
                                    disabled={isProcessing[user.id + 'reactivate']}
                                  >
                                    <Check className="w-4 h-4 mr-2" />
                                    Reactivate User
                                  </DropdownMenuItem>
                                )}

                                {user.role === 'admin' ? (
                                  <DropdownMenuItem
                                    className="text-muted-foreground"
                                    onClick={() => handleAction(user.id, "removeAdmin")}
                                    disabled={isProcessing[user.id + 'removeAdmin']}
                                  >
                                    <ShieldOff className="w-4 h-4 mr-2" />
                                    Remove Admin
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="text-blue-600 focus:text-blue-600"
                                    onClick={() => handleAction(user.id, "makeAdmin")}
                                    disabled={isProcessing[user.id + 'makeAdmin']}
                                  >
                                    <Shield className="w-4 h-4 mr-2" />
                                    Make Admin
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600"
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
                                      handleAction(user.id, "delete");
                                    }
                                  }}
                                  disabled={isProcessing[user.id + 'delete']}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      No users found matching your search.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
        <AdminNav />
      </div>
    </div>
  );
}