import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext.js";
import { 
  FileSpreadsheet, 
  Search, 
  ArrowRight, 
  Package, 
  Check, 
  X, 
  DollarSign, 
  User 
} from "lucide-react";

interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  paymentMethod: string;
  createdAt: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export const OrderList: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadData = async () => {
    try {
      const h = { Authorization: `Bearer ${token}` };
      const [resOrd, resCust] = await Promise.all([
        fetch("/api/orders", { headers: h }),
        fetch("/api/customers", { headers: h })
      ]);

      if (resOrd.ok) setOrders(await resOrd.json());
      if (resCust.ok) setCustomers(await resCust.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const updateStatus = async (id: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const updatePaymentStatus = async (id: string, paymentStatus: string) => {
    // We didn't create a separate route but it was mapped to Status put or we can just send it
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus })
      });
      if (res.ok) loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadge = (status: Order["status"]) => {
    const map = {
      PENDING: "bg-amber-50 text-amber-600 border-amber-200",
      CONFIRMED: "bg-blue-50 text-blue-600 border-blue-200",
      PACKED: "bg-purple-50 text-purple-600 border-purple-200",
      SHIPPED: "bg-indigo-50 text-indigo-600 border-indigo-200 animate-pulse",
      DELIVERED: "bg-emerald-50 text-emerald-600 border-emerald-200",
      CANCELLED: "bg-rose-50 text-rose-600 border-rose-200",
      REFUNDED: "bg-slate-100 text-slate-500 border-slate-300"
    };
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${map[status]}`;
  };

  const getPaymentBadge = (status: Order["paymentStatus"]) => {
    const map = {
      UNPAID: "bg-amber-50 text-amber-600 border-amber-100",
      PAID: "bg-emerald-50 text-emerald-600 border-emerald-100",
      REFUNDED: "bg-slate-100 text-slate-500 border-slate-200"
    };
    return `inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold border ${map[status]}`;
  };

  const filteredOrders = orders.filter(o => {
    const cust = customers.find(c => c.id === o.customerId);
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || (cust && cust.name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-500" />
            Social Shop Orders
          </h2>
          <p className="text-xs text-slate-400">Track pending transactions, fullfill package shipments, and monitor payment clearings.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* 2. Order Listings Table */}
      <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer Details</th>
                <th className="py-4 px-6">Items Purchased</th>
                <th className="py-4 px-6 text-right">Total Amount</th>
                <th className="py-4 px-6">Payment</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredOrders.map(o => {
                const cust = customers.find(c => c.id === o.customerId);

                return (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-extrabold text-indigo-600">{o.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-indigo-50 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">{cust?.name || "Simulated Customer"}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{cust?.phone || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1 max-w-xs">
                        {o.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-4 text-xs text-slate-600">
                            <span className="truncate font-semibold">{item.name}</span>
                            <span className="font-bold text-slate-400 shrink-0">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-extrabold text-slate-800">Rs. {o.totalAmount}</td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div>{getPaymentBadge(o.paymentStatus)}</div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{o.paymentMethod}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(o.status)}
                    </td>
                    <td className="py-4 px-6 text-right space-x-1.5 shrink-0">
                      {o.status === "PENDING" && (
                        <button
                          onClick={() => updateStatus(o.id, "CONFIRMED")}
                          className="text-xs bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded font-bold transition-all"
                        >
                          Confirm Order
                        </button>
                      )}
                      {o.status === "CONFIRMED" && (
                        <button
                          onClick={() => updateStatus(o.id, "SHIPPED")}
                          className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 px-2 py-1 rounded font-bold transition-all"
                        >
                          Ship Package
                        </button>
                      )}
                      {o.status === "SHIPPED" && (
                        <button
                          onClick={() => {
                            updateStatus(o.id, "DELIVERED");
                            updatePaymentStatus(o.id, "PAID"); // Auto clear COD/Unpaid on delivery
                          }}
                          className="text-xs bg-emerald-600 text-white hover:bg-emerald-700 px-2 py-1 rounded font-bold transition-all"
                        >
                          Mark Delivered
                        </button>
                      )}

                      {/* Cancel action */}
                      {o.status !== "DELIVERED" && o.status !== "CANCELLED" && (
                        <button
                          onClick={() => updateStatus(o.id, "CANCELLED")}
                          className="text-xs text-rose-500 hover:bg-rose-50 p-1 rounded font-semibold transition-all"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
