const sampleProducts = [
  {
    id: "P-1004",
    name: "Organic Whole Wheat Flour",
    category: "Grains",
    seller: "Nature's Basket Farm",
    price: 3.6,
    image:
      "https://images.unsplash.com/photo-1604908176997-4313cde77f9c?auto=format&fit=crop&w=900&q=80",
    description:
      "Stone-ground whole wheat flour sourced from certified organic farms.",
    isEcoFriendly: true,
    carbonData: {
      method: "manual",
      totalCO2ePerKg: 1.4,
      material: "plant",
      breakdown: {
        manufacturing: 0.52,
        packaging: 0.21,
        transport: 0.41,
        handling: 0.26
      }
    }
  },
  {
    id: "P-1005",
    name: "Bamboo Toothbrush Pack",
    category: "Lifestyle",
    seller: "Eco Smile Supplies",
    price: 5.9,
    image:
      "https://images.unsplash.com/photo-1588776814546-ec7e0a0b4e87?auto=format&fit=crop&w=900&q=80",
    description:
      "Biodegradable bamboo toothbrushes with soft charcoal bristles.",
    isEcoFriendly: true,
    carbonData: {
      method: "auto",
      totalCO2ePerKg: 0.9,
      material: "bamboo",
      breakdown: {
        manufacturing: 0.33,
        packaging: 0.14,
        transport: 0.27,
        handling: 0.16
      }
    }
  },
  {
    id: "P-1006",
    name: "Stainless Steel Lunch Box",
    category: "Lifestyle",
    seller: "Green Kitchenware",
    price: 14.2,
    image:
      "https://images.unsplash.com/photo-1590080877777-6c4c9f61f64b?auto=format&fit=crop&w=900&q=80",
    description:
      "Durable, plastic-free lunch box ideal for school and office meals.",
    isEcoFriendly: true,
    carbonData: {
      method: "manual",
      totalCO2ePerKg: 2.3,
      material: "steel",
      breakdown: {
        manufacturing: 1.05,
        packaging: 0.29,
        transport: 0.63,
        handling: 0.33
      }
    }
  },
  {
    id: "P-1007",
    name: "Packaged Potato Chips",
    category: "Snacks",
    seller: "Quick Bite Foods",
    price: 1.8,
    image:
      "https://images.unsplash.com/photo-1617196038435-52f1bfa8d26e?auto=format&fit=crop&w=900&q=80",
    description:
      "Crispy salted potato chips packed in single-use plastic bags.",
    isEcoFriendly: false,
    carbonData: {
      method: "manual",
      totalCO2ePerKg: 4.6,
      material: "plastic",
      breakdown: {
        manufacturing: 1.95,
        packaging: 1.02,
        transport: 1.08,
        handling: 0.55
      }
    }
  },
  {
    id: "P-1008",
    name: "Organic Cold-Pressed Mustard Oil",
    category: "Groceries",
    seller: "Pure Earth Oils",
    price: 6.7,
    image:
      "https://images.unsplash.com/photo-1600891963935-cf1e0f63a0a3?auto=format&fit=crop&w=900&q=80",
    description:
      "Cold-pressed mustard oil extracted without chemicals or additives.",
    isEcoFriendly: true,
    carbonData: {
      method: "auto",
      totalCO2ePerKg: 1.8,
      material: "plant",
      breakdown: {
        manufacturing: 0.72,
        packaging: 0.33,
        transport: 0.49,
        handling: 0.26
      }
    }
  },
  {
    id: "P-1009",
    name: "Plastic Storage Containers",
    category: "Home Care",
    seller: "Urban Utility Store",
    price: 8.4,
    image:
      "https://images.unsplash.com/photo-1606813909353-9bcb4e3f4c12?auto=format&fit=crop&w=900&q=80",
    description:
      "Set of airtight plastic containers for kitchen storage.",
    isEcoFriendly: false,
    carbonData: {
      method: "manual",
      totalCO2ePerKg: 6.2,
      material: "plastic",
      breakdown: {
        manufacturing: 2.7,
        packaging: 1.31,
        transport: 1.42,
        handling: 0.77
      }
    }
  },
  {
    id: "P-1010",
    name: "Organic Green Tea Leaves",
    category: "Beverages",
    seller: "Himalayan Organics",
    price: 4.2,
    image:
      "https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&w=900&q=80",
    description:
      "Handpicked organic green tea leaves with rich antioxidants.",
    isEcoFriendly: true,
    carbonData: {
      method: "manual",
      totalCO2ePerKg: 1.1,
      material: "plant",
      breakdown: {
        manufacturing: 0.39,
        packaging: 0.18,
        transport: 0.34,
        handling: 0.19
      }
    }
  },
  {
    id: "P-1011",
    name: "Disposable Paper Cups",
    category: "Home Care",
    seller: "Daily Essentials Hub",
    price: 2.5,
    image:
      "https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=900&q=80",
    description:
      "Single-use coated paper cups suitable for hot beverages.",
    isEcoFriendly: false,
    carbonData: {
      method: "auto",
      totalCO2ePerKg: 3.9,
      material: "paper",
      breakdown: {
        manufacturing: 1.6,
        packaging: 0.74,
        transport: 1.03,
        handling: 0.53
      }
    }
  },
  {
    id: "P-1012",
    name: "Organic Cotton T-Shirt",
    category: "Clothing",
    seller: "Eco Wear Collective",
    price: 18.0,
    image:
      "https://images.unsplash.com/photo-1520975693416-35a3b3f0f0c2?auto=format&fit=crop&w=900&q=80",
    description:
      "Soft organic cotton t-shirt made using low-impact dyes.",
    isEcoFriendly: true,
    carbonData: {
      method: "manual",
      totalCO2ePerKg: 2.6,
      material: "cotton",
      breakdown: {
        manufacturing: 1.21,
        packaging: 0.34,
        transport: 0.72,
        handling: 0.33
      }
    }
  },
  {
    id: "P-1013",
    name: "Synthetic Air Freshener Spray",
    category: "Home Care",
    seller: "Fresh Living Store",
    price: 3.9,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    description:
      "Chemical-based room freshener with long-lasting fragrance.",
    isEcoFriendly: false,
    carbonData: {
      method: "manual",
      totalCO2ePerKg: 5.4,
      material: "plastic",
      breakdown: {
        manufacturing: 2.3,
        packaging: 1.14,
        transport: 1.27,
        handling: 0.69
      }
    }
  }
];

export default sampleProducts;