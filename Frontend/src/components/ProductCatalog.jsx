import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct
} from "../services/productService";
import { uploadProductImage } from "../services/cloudinaryService";
import "../styles/ProductCatalog.css";

/* ================= USER ROLE ================= */

function getUserRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

/* ================= CONSTANTS ================= */

const CARBON_FILTERS = ["all", "low", "medium", "high"];

const MATERIAL_MULTIPLIERS = {
  plant: 0.7,
  glass: 1.1,
  plastic: 1.45,
  metal: 1.3,
  mixed: 1.2
};

const PACKAGING_MULTIPLIERS = {
  compostable: 0.7,
  recyclable: 0.9,
  standard: 1.2
};

/* ================= UTILITIES ================= */

function round(v) {
  return Math.round(v * 100) / 100;
}

function getEcoRating(total) {
  if (total <= 1.5) return { label: "A+", tone: "best" };
  if (total <= 2.5) return { label: "A", tone: "great" };
  if (total <= 3.8) return { label: "B", tone: "good" };
  if (total <= 5) return { label: "C", tone: "warn" };
  return { label: "D", tone: "risk" };
}

function getCarbonBucket(total) {
  if (total <= 2.5) return "low";
  if (total <= 4.5) return "medium";
  return "high";
}

function buildBreakdown(total) {
  return {
    manufacturing: round(total * 0.45),
    packaging: round(total * 0.16),
    transport: round(total * 0.26),
    handling: round(total * 0.13)
  };
}

function calculateAutoCarbon(form) {
  const weight = Number(form.weightKg || 0);
  const distance = Number(form.transportKm || 0);
  const materialFactor = MATERIAL_MULTIPLIERS[form.material] || 1;
  const packagingFactor = PACKAGING_MULTIPLIERS[form.packagingType] || 1;

  const manufacturing = 0.55 * weight * materialFactor;
  const transport = 0.0022 * distance * weight;
  const packaging = 0.2 * packagingFactor;
  const handling = 0.12 * weight;

  const total = round(manufacturing + transport + packaging + handling);

  return {
    totalCO2ePerKg: total,
    breakdown: {
      manufacturing: round(manufacturing),
      packaging: round(packaging),
      transport: round(transport),
      handling: round(handling)
    }
  };
}

/* ================= INITIAL FORM ================= */

function getInitialForm() {
  return {
    name: "",
    category: "",
    seller: "",
    price: "",
    image: "",
    description: "",
    isEcoFriendly: true,
    carbonMethod: "manual",
    manualCO2e: "",
    material: "mixed",
    weightKg: "",
    transportKm: "",
    packagingType: "recyclable"
  };
}

/* ================= COMPONENT ================= */

function ProductCatalog() {
  const navigate = useNavigate();
  const isAdmin = getUserRole() === "ADMIN";

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(getInitialForm());
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [ecoOnly, setEcoOnly] = useState(false);
  const [carbonFilter, setCarbonFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formError, setFormError] = useState("");
  const [apiError, setApiError] = useState("");

  const [carbonPreview, setCarbonPreview] = useState(null);

  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  /* ================= LOAD PRODUCTS ================= */

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (e) {
        setApiError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ================= FILTER ================= */

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const query = search.toLowerCase();
      const matchSearch =
        !query ||
        (p.name || "").toLowerCase().includes(query) ||
        (p.category || "").toLowerCase().includes(query) ||
        (p.seller || "").toLowerCase().includes(query);

      const ecoMatch = ecoOnly ? p.isEcoFriendly : true;

      const total = Number(p?.carbonData?.totalCO2ePerKg || 0);
      const bucket = getCarbonBucket(total);
      const carbonMatch = carbonFilter === "all" || bucket === carbonFilter;

      return matchSearch && ecoMatch && carbonMatch;
    });
  }, [products, search, ecoOnly, carbonFilter]);

  /* ================= FORM ================= */

  const onChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () => {
    setForm(getInitialForm());
    setEditingId(null);
    setCarbonPreview(null);
    setSelectedImageFile(null);
  };

  /* ================= IMAGE ================= */

  const onUploadImage = async () => {
    if (!selectedImageFile) return;
    try {
      setUploadingImage(true);
      const url = await uploadProductImage(selectedImageFile);
      setForm(prev => ({ ...prev, image: url }));
      setSelectedImageFile(null);
    } catch (e) {
      setFormError("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  /* ================= SUBMIT ================= */

  const onSubmit = async e => {
    e.preventDefault();

    let carbonData;

    if (form.carbonMethod === "manual") {
      const manual = Number(form.manualCO2e);
      if (!manual) return setFormError("Invalid CO2 value");
      carbonData = {
        method: "manual",
        totalCO2ePerKg: round(manual),
        breakdown: buildBreakdown(manual)
      };
    } else {
      carbonData = { method: "auto", ...calculateAutoCarbon(form) };
    }

    const payload = {
      name: form.name,
      category: form.category,
      seller: form.seller,
      price: Number(form.price),
      image: form.image,
      description: form.description,
      isEcoFriendly: form.isEcoFriendly,
      carbonData
    };

    try {
      setSaving(true);
      if (editingId) {
        const updated = await updateProduct(editingId, payload);
        setProducts(prev => prev.map(p => p.id === editingId ? updated : p));
      } else {
        const created = await createProduct(payload);
        setProducts(prev => [created, ...prev]);
      }
      resetForm();
    } catch (e) {
      setApiError(e.message);
    } finally {
      setSaving(false);
    }
  };

  /* ================= EDIT ================= */

  const onEdit = p => {
    setEditingId(p.id);
    setForm({
      ...getInitialForm(),
      ...p,
      manualCO2e: p?.carbonData?.totalCO2ePerKg || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= DELETE ================= */

  const onDelete = async id => {
    if (!window.confirm("Delete product?")) return;
    try {
      setDeletingId(id);
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      setApiError(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= UI ================= */

  return (
    <main className="catalog-page">
      <header className="catalog-hero">
        <h1>Eco Product Catalog</h1>
        <button onClick={() => navigate("/dashboard")} className="ghost-btn">
          Dashboard
        </button>
      </header>

      <section className="catalog-layout">

        {isAdmin && (
          <article className="product-form-panel">
            <h2>{editingId ? "Update Product" : "Add Product"}</h2>

            <form onSubmit={onSubmit} className="product-form">

              <input name="name" value={form.name} onChange={onChange} placeholder="Name" />
              <input name="category" value={form.category} onChange={onChange} placeholder="Category" />
              <input name="seller" value={form.seller} onChange={onChange} placeholder="Seller" />
              <input name="price" type="number" value={form.price} onChange={onChange} placeholder="Price" />

              <input name="image" value={form.image} onChange={onChange} placeholder="Image URL" />

              <input type="file" onChange={e => setSelectedImageFile(e.target.files[0])} />
              <button type="button" onClick={onUploadImage} disabled={uploadingImage}>
                {uploadingImage ? "Uploading..." : "Upload Image"}
              </button>

              <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" />

              <label>
                <input type="checkbox" name="isEcoFriendly" checked={form.isEcoFriendly} onChange={onChange} />
                Eco Friendly
              </label>

              <button className="primary-btn" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </button>

              {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
            </form>
          </article>
        )}

        <article className="products-panel">

          <div className="filters-row">
            <input placeholder="Search..." onChange={e => setSearch(e.target.value)} />
            <label>
              <input type="checkbox" onChange={e => setEcoOnly(e.target.checked)} />
              Eco Only
            </label>
            <select onChange={e => setCarbonFilter(e.target.value)}>
              {CARBON_FILTERS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          {loading && <p>Loading...</p>}

          <div className="product-grid">
            {filteredProducts.map(p => {
              const rating = getEcoRating(p?.carbonData?.totalCO2ePerKg || 0);
              return (
                <div key={p.id} className="product-card">
                  <img src={p.image} alt={p.name} />
                  <h3>{p.name} <span>{rating.label}</span></h3>
                  <p>${p.price}</p>

                  <div className="card-actions">
                    <Link to={`/products/${p.id}`}>View Impact</Link>
                    {isAdmin && (
                      <>
                        <button onClick={() => onEdit(p)}>Edit</button>
                        <button onClick={() => onDelete(p.id)} disabled={deletingId === p.id}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </article>

      </section>
    </main>
  );
}

export default ProductCatalog;