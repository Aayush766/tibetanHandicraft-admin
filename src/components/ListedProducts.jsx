import React, { useEffect, useState } from "react";
import { API } from "../api";
import { TrashIcon, PencilSquareIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function ListedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      await API.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      alert("Product removed");
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Listed Products</h1>
          <p className="text-slate-500 text-sm">Manage all items currently in your studio archive.</p>
        </div>
        <button 
          onClick={fetchProducts}
          className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"
        >
          <ArrowPathIcon className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400">Product</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400">SKU</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400">Category</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400">Price</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={product.image} className="w-12 h-12 rounded-lg object-cover bg-slate-100" alt="" />
                    <span className="font-semibold text-slate-700 text-sm">{product.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500">{product.sku}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{product.category}</td>
                <td className="px-6 py-4 text-sm font-bold text-emerald-600">${product.price}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && !loading && (
          <div className="p-20 text-center text-slate-400 italic">No products listed in the archive.</div>
        )}
      </div>
    </div>
  );
}