import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext.js";
import { 
  Users, 
  Search, 
  Tag, 
  Phone, 
  Mail, 
  DollarSign, 
  BookOpen 
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  tags: string[];
  notes?: string;
  lifetimeValue: number;
}

export const CustomerProfiles: React.FC = () => {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  const loadCustomers = async () => {
    try {
      const res = await fetch("/api/customers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setCustomers(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [token]);

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Social CRM Customer Profiles
          </h2>
          <p className="text-xs text-slate-400">Manage client contact journals, categorize tags, and calculate customer Lifetime Values.</p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Grid of Customer Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-slate-150 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-lg">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{c.name}</h4>
                  <span className="inline-block bg-slate-100 text-slate-500 font-extrabold text-[9px] px-1.5 py-0.5 rounded uppercase mt-0.5">
                    ID: {c.id}
                  </span>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-1 text-xs text-slate-500">
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {c.phone}</p>
                <p className="flex items-center gap-2 font-mono"><Mail className="w-3.5 h-3.5 text-slate-400" /> {c.email}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {c.tags.map((tag, idx) => (
                  <span key={idx} className="bg-indigo-50/50 text-indigo-600 border border-indigo-100 font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Notes */}
              {c.notes && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-500 italic flex gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p>"{c.notes}"</p>
                </div>
              )}
            </div>

            {/* Lifetime value footer */}
            <div className="mt-5 border-t border-slate-100 pt-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Purchase Value</span>
              <span className="text-sm font-extrabold text-emerald-600">Rs. {c.lifetimeValue}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
