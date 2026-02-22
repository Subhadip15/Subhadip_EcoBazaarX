import { useEffect, useMemo, useState } from "react";
// Removed Link from the import below
import { useNavigate } from "react-router-dom"; 
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../services/productService";
import { uploadProductImage } from "../services/cloudinaryService";
import "../styles/ProductCatalog.css";

// Helper to check user role from token
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

const CARBON_FILTERS = ["all", "low", "medium", "high"];

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

const getInitialForm = () => ({
  name: "",
  category: "",
  seller: "",
  price: "",
  image: "",
  description: "",
  isEcoFriendly: false,
  manualCO2e: "",
  manufacturing: 0,
  packaging: 0,
  transport: 0,
  handling: 0
});

function ProductCatalog() {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const isAdmin = userRole === "ADMIN";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState(getInitialForm());
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [carbonFilter, setCarbonFilter] = useState("all");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
      setApiError("");
    } catch (err) {
      setApiError("Backend Server is unreachable. Check your Spring Boot API.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const onUploadImage = async () => {
    if (!selectedImageFile) return alert("Select a file first");
    try {
      setUploadingImage(true);
      const imageUrl = await uploadProductImage(selectedImageFile);
      setForm((prev) => ({ ...prev, image: imageUrl }));
      alert("Image uploaded to Cloudinary!");
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const productPayload = {
      name: form.name,
      category: form.category,
      seller: form.seller,
      price: parseFloat(form.price),
      image: form.image,
      description: form.description,
      isEcoFriendly: form.isEcoFriendly,
      carbonData: {
        method: "manual",
        totalCO2ePerKg: parseFloat(form.manualCO2e || 0),
        material: "General",
        breakdown: {
          manufacturing: parseFloat(form.manufacturing || 0),
          packaging: parseFloat(form.packaging || 0),
          transport: parseFloat(form.transport || 0),
          handling: parseFloat(form.handling || 0)
        }
      }
    };

    try {
      if (editingId) {
        await updateProduct(editingId, productPayload);
      } else {
        await createProduct(productPayload);
      }
      setForm(getInitialForm());
      setEditingId(null);
      fetchData(); 
    } catch (err) {
      setApiError("Failed to save product. Check permissions.");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (p) => {
    setEditingId(p.id);
    setForm({
      ...p,
      manualCO2e: p.carbonData?.totalCO2ePerKg || "",
      manufacturing: p.carbonData?.breakdown?.manufacturing || 0,
      packaging: p.carbonData?.breakdown?.packaging || 0,
      transport: p.carbonData?.breakdown?.transport || 0,
      handling: p.carbonData?.breakdown?.handling || 0
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const bucket = getCarbonBucket(p.carbonData?.totalCO2ePerKg || 0);
      const matchCarbon = carbonFilter === "all" || bucket === carbonFilter;
      return matchSearch && matchCarbon;
    });
  }, [products, search, carbonFilter]);

  return (
    <main className="catalog-page">
      <header className="catalog-hero">
        <h1>Eco-BazaarX Catalog</h1>
        <button onClick={() => navigate("/dashboard")} className="ghost-btn">Dashboard</button>
      </header>

      <section className="catalog-layout">
        {isAdmin && (
          <article className="product-form-panel">
            <h2>{editingId ? "Update Product" : "Add New Product"}</h2>
            <form onSubmit={onSubmit} className="product-form">
              <input name="name" value={form.name} onChange={onChange} placeholder="Product Name" required />
              <input name="category" value={form.category} onChange={onChange} placeholder="Category" />
              <input name="price" type="number" value={form.price} onChange={onChange} placeholder="Price" required />
              <input name="image" value={form.image} onChange={onChange} placeholder="Image URL (Cloudinary)" />
              
              <div className="upload-section">
                <input type="file" onChange={(e) => setSelectedImageFile(e.target.files[0])} />
                <button type="button" onClick={onUploadImage} disabled={uploadingImage}>
                  {uploadingImage ? "Uploading..." : "Upload File"}
                </button>
              </div>

              <div className="carbon-inputs">
                <h4>Carbon Data (per kg)</h4>
                <input name="manualCO2e" type="number" value={form.manualCO2e} onChange={onChange} placeholder="Total CO2e" />
                <div className="field-grid">
                   <input name="manufacturing" type="number" value={form.manufacturing} onChange={onChange} placeholder="Mfg" />
                   <input name="packaging" type="number" value={form.packaging} onChange={onChange} placeholder="Pack" />
                </div>
              </div>

              <button type="submit" className="primary-btn" disabled={saving}>
                {saving ? "Processing..." : editingId ? "Update" : "Create"}
              </button>
              {editingId && <button type="button" onClick={() => {setEditingId(null); setForm(getInitialForm());}}>Cancel</button>}
            </form>
          </article>
        )}

        <article className="products-panel">
          <div className="filters-row">
            <input placeholder="Search products..." onChange={(e) => setSearch(e.target.value)} />
            <select onChange={(e) => setCarbonFilter(e.target.value)}>
              {CARBON_FILTERS.map(f => <option key={f} value={f}>{f} carbon</option>)}
            </select>
          </div>

          {apiError && <p className="error">{apiError}</p>}
          
          <div className="product-grid">
            {loading ? <p>Loading Products...</p> : filteredProducts.map((p) => {
              const rating = getEcoRating(p.carbonData?.totalCO2ePerKg || 0);
              return (
                <div key={p.id} className="product-card">
                  {/* Clicking the image or name now takes user to details via navigate */}
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    onClick={() => navigate(`/products/${p.id}`)} 
                    style={{ cursor: 'pointer' }} 
                  />
                  <div className="product-body">
                    <h3 
                      onClick={() => navigate(`/products/${p.id}`)} 
                      style={{ cursor: 'pointer' }}
                    >
                      {p.name} <span className={`badge badge-${rating.tone}`}>{rating.label}</span>
                    </h3>
                    <p className="price">${p.price}</p>
                    <div className="card-actions">
                      {isAdmin ? (
                        <>
                          <button onClick={() => onEdit(p)}>Edit</button>
                          <button className="danger" onClick={() => onDelete(p.id)}>Delete</button>
                        </>
                      ) : (
                        <>
                          <button className="primary-btn">Buy Now</button>
                          <button 
                            className="ghost-btn" 
                            onClick={() => navigate(`/products/${p.id}`)}
                          >
                            View Impact
                          </button>
                        </>
                      )}
                    </div>
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