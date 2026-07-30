import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext.js";
import { 
  ShoppingBag, 
  Plus, 
  ArrowUpDown, 
  Tag, 
  Layers, 
  Warehouse, 
  Search, 
  TrendingDown, 
  AlertTriangle 
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  categoryId: string;
  description: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "DRAFT";
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface WarehouseData {
  id: string;
  name: string;
  location?: string;
}

export const ProductCatalog: React.FC = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");

  // Create Product form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProd, setNewProd] = useState({
    name: "",
    sku: "",
    barcode: "",
    categoryId: "",
    description: "",
    price: 0,
    stock: 0,
    status: "ACTIVE" as const
  });

  // Create Category form state
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const loadData = async () => {
    try {
      const h = { Authorization: `Bearer ${token}` };
      const [resProd, resCat, resWh] = await Promise.all([
        fetch("/api/products", { headers: h }),
        fetch("/api/categories", { headers: h }),
        fetch("/api/warehouses", { headers: h })
      ]);

      if (resProd.ok) setProducts(await resProd.ok ? resProd.json() : []);
      if (resCat.ok) setCategories(await resCat.ok ? resCat.json() : []);
      if (resWh.ok) setWarehouses(await resWh.ok ? resWh.json() : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newProd,
          images: ["https://images.unsplash.com/photo-1607006342411-985c181e57a4?w=500&auto=format&fit=crop&q=60"],
          tax: 18,
          variants: []
        })
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewProd({
          name: "",
          sku: "",
          barcode: "",
          categoryId: "",
          description: "",
          price: 0,
          stock: 0,
          status: "ACTIVE"
        });
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCatName })
      });
      if (res.ok) {
        setShowCatModal(false);
        setNewCatName("");
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdjustStock = async (productId: string, change: number) => {
    try {
      const res = await fetch("/api/inventory/adjust", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantityChange: change, notes: "Quick panel stock adjustment" })
      });
      if (res.ok) loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === "all" || p.categoryId === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-500" />
            Product & Inventory Catalog
          </h2>
          <p className="text-xs text-slate-400">Add commercial goods, establish barcodes, and audit stock lists across multiple warehouses.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product or SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
            />
          </div>

          <button
            onClick={() => setShowCatModal(true)}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
          >
            <Layers className="w-4 h-4" />
            Add Category
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-xl text-xs font-semibold shadow-sm shadow-indigo-100 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* 2. Categorization & Filters tab */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCat("all")}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            selectedCat === "all"
              ? "bg-slate-800 text-white border-slate-800"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          All Items ({products.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${
              selectedCat === cat.id
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {cat.name} ({products.filter(p => p.categoryId === cat.id).length})
          </button>
        ))}
      </div>

      {/* 3. Catalog Grid or Table */}
      <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Product Details</th>
                <th className="py-4 px-6">SKU</th>
                <th className="py-4 px-6">Barcode</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6 text-right">Price (Rs)</th>
                <th className="py-4 px-6 text-center">Current Stock</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredProducts.map(p => {
                const isLowStock = p.stock < 50;
                const catObj = categories.find(c => c.id === p.categoryId);

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                          <img src={p.images && p.images.length > 0 ? p.images[0] : "https://images.unsplash.com/photo-1607006342411-985c181e57a4?w=100&auto=format&fit=crop"} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">{p.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-500 font-semibold">{p.sku}</td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-400">{p.barcode || "—"}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
                        <Tag className="w-3 h-3" />
                        {catObj?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-extrabold text-slate-700">Rs. {p.price}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col items-center gap-1 justify-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isLowStock 
                            ? "bg-rose-50 text-rose-600 border border-rose-200 animate-pulse" 
                            : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        }`}>
                          {isLowStock && <AlertTriangle className="w-3 h-3" />}
                          {p.stock} units
                        </span>

                        {/* Quick stock adjusts */}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <button
                            onClick={() => handleAdjustStock(p.id, -10)}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs rounded flex items-center justify-center transition-colors"
                          >
                            -10
                          </button>
                          <button
                            onClick={() => handleAdjustStock(p.id, 10)}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs rounded flex items-center justify-center transition-colors"
                          >
                            +10
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        p.status === "ACTIVE" ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-400"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-xs text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Add New Catalog Product</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProd.name}
                    onChange={e => setNewProd({ ...newProd, name: e.target.value })}
                    placeholder="e.g. Vaseegrah Herbal Bath Soap Pack"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={newProd.sku}
                    onChange={e => setNewProd({ ...newProd, sku: e.target.value })}
                    placeholder="e.g. VV-SOAP-01"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Barcode (EAN/UPC)</label>
                  <input
                    type="text"
                    value={newProd.barcode}
                    onChange={e => setNewProd({ ...newProd, barcode: e.target.value })}
                    placeholder="e.g. 89012345..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                  <select
                    required
                    value={newProd.categoryId}
                    onChange={e => setNewProd({ ...newProd, categoryId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                  >
                    <option value="">Select Category...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Sale Price (Rs)</label>
                  <input
                    type="number"
                    required
                    value={newProd.price || ""}
                    onChange={e => setNewProd({ ...newProd, price: parseFloat(e.target.value) || 0 })}
                    placeholder="180"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Opening Stock Count</label>
                  <input
                    type="number"
                    required
                    value={newProd.stock || ""}
                    onChange={e => setNewProd({ ...newProd, stock: parseInt(e.target.value, 10) || 0 })}
                    placeholder="100"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                  <select
                    value={newProd.status}
                    onChange={e => setNewProd({ ...newProd, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Product Description</label>
                  <textarea
                    required
                    value={newProd.description}
                    onChange={e => setNewProd({ ...newProd, description: e.target.value })}
                    placeholder="Describe therapeutic values, packaging details, and usage notes."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl h-20 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-sm"
              >
                Add Product to Catalog
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD CATEGORY MODAL */}
      {showCatModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Add New Category</h3>
              <button onClick={() => setShowCatModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  placeholder="e.g. Skin Serums"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
              >
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
