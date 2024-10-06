import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],

  setProducts(products) {
    return set({ products });
  },

  async createProduct(newProduct) {
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return { success: false, message: "Please fill in all the fields." };
    }

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    const data = await res.json();
    set((state) => ({ products: [...state.products, data.data] }));

    return { success: true, message: "Product created successfully." };
  },

  async fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    set({ products: data.data });
  },

  async deleteProduct(id) {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    const { success, message } = await res.json();
    if (success) {
      set((state) => ({
        products: state.products.filter((product) => product._id !== id),
      }));
    }
    return { success, message };
  },

  async updateProduct(id, updatedProduct) {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });

    const { success, data } = await res.json();
    if (success) {
      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? data : product
        ),
      }));
    }
    return { success };
  },
}));
