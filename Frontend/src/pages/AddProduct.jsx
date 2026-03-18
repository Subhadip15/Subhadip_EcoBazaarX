import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../styles/AddProduct.css";
import MainNavbar from "../components/MainNavbar";
import { createProduct, updateProduct, getProductById } from "../services/productService";
import { uploadProductImage } from "../services/cloudinaryService";
import { useToast } from "../context/ToastContext";

const AddProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [form, setForm] = useState({
        name: '',
        category: '',
        seller: '',
        price: '',
        description: '',
        isEcoFriendly: false,
        image: '',
        manufacturing: 0,
        packaging: 0,
        transport: 0,
        handling: 0,
        manualCO2e: ''
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);

    // Load product data if in Edit Mode
    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                setLoading(true);
                try {
                    const data = await getProductById(id);
                    setForm({
                        name: data.name || '',
                        category: data.category || '',
                        seller: data.seller || '',
                        price: data.price || '',
                        description: data.description || '',
                        isEcoFriendly: data.isEcoFriendly || false,
                        image: data.image || '',
                        manufacturing: data.carbonData?.breakdown?.manufacturing || 0,
                        packaging: data.carbonData?.breakdown?.packaging || 0,
                        transport: data.carbonData?.breakdown?.transport || 0,
                        handling: data.carbonData?.breakdown?.handling || 0,
                        manualCO2e: data.carbonData?.totalCO2ePerKg || ''
                    });
                } catch (err) {
                    showToast("Error loading product", "error");
                    navigate("/products");
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id, navigate, showToast]);

    const autoSum = Number(form.manufacturing || 0) + 
                    Number(form.packaging || 0) + 
                    Number(form.transport || 0) + 
                    Number(form.handling || 0);

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleImageUpload = async (e) => {
        e.preventDefault(); 
        if (!selectedFile) return showToast("Select a file first", "info");

        setUploadingImage(true);
        try {
            const imageUrl = await uploadProductImage(selectedFile);
            setForm(prev => ({ ...prev, image: imageUrl }));
            showToast("Image linked successfully", "success");
        } catch (err) {
            showToast("Upload failed", "error");
        } finally {
            setUploadingImage(false);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!form.image) return showToast("Image is required", "error");

        setSaving(true);
        const payload = { 
            ...form, 
            price: Number(form.price),
            manufacturing: Number(form.manufacturing),
            packaging: Number(form.packaging),
            transport: Number(form.transport),
            handling: Number(form.handling),
            totalCO2e: form.manualCO2e ? Number(form.manualCO2e) : autoSum
        };

        try {
            if (id) {
                await updateProduct(id, payload);
                showToast("Updated successfully", "success");
            } else {
                await createProduct(payload);
                showToast("Listed successfully", "success");
            }
            navigate("/products");
        } catch (err) {
            showToast("Save failed", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading-line">Loading Product Details...</div>;

    return (
        <div className="admin-container">
           <MainNavbar />

            <main className="form-wrapper">
                <form className="product-form" onSubmit={onSubmit}>
                    <div className="form-header">
                        <h2>{id ? "Edit Listing" : "Add New Product"}</h2>
                        <p>Provide accurate data to improve your eco-rating on the marketplace.</p>
                    </div>

                    <section className="form-section">
                        <h4>General Information</h4>
                        <div className="input-group">
                            <label>Product Name *</label>
                            <input name="name" value={form.name} onChange={onChange} required placeholder="Name of the product" />
                        </div>

                        <div className="row">
                            <div className="input-group">
                                <label>Category</label>
                                <input name="category" value={form.category} onChange={onChange} placeholder="e.g. Wellness" />
                            </div>
                            <div className="input-group">
                                <label>Seller</label>
                                <input name="seller" value={form.seller} onChange={onChange} placeholder="Store Name" />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Price (₹) *</label>
                            <input name="price" type="number" step="0.01" value={form.price} onChange={onChange} required />
                        </div>

                        <div className="input-group">
                            <label>Description</label>
                            <textarea name="description" value={form.description} onChange={onChange} placeholder="Product features..." />
                        </div>
                    </section>

                    <section className="form-section">
                        <h4>Media & Assets</h4>
                        <div className="upload-container">
                            <div className="input-group">
                                <label>Direct Image Link</label>
                                <input name="image" value={form.image} onChange={onChange} className="image-url-input" placeholder="URL will appear here after upload" />
                                {form.image && (
                                    <div className="image-preview-wrapper">
                                        <img src={form.image} alt="Preview" className="img-thumbnail" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="file-upload-box">
                                <input type="file" id="file-input" hidden onChange={handleFileChange} />
                                <label htmlFor="file-input" className="file-label">
                                    {selectedFile ? selectedFile.name : "Choose local image"}
                                </label>
                                <button type="button" className="upload-btn" onClick={handleImageUpload} disabled={uploadingImage || !selectedFile}>
                                    {uploadingImage ? "Uploading..." : "Upload"}
                                </button>
                            </div>
                        </div>

                        <label className="checkbox-container">
                            <input type="checkbox" name="isEcoFriendly" checked={form.isEcoFriendly} onChange={onChange} />
                            <span className="checkmark"></span>
                            Verified Eco-Friendly Product
                        </label>
                    </section>

                    <section className="form-section">
                        <h4>Sustainability Analysis</h4>
                        <div className="carbon-grid">
                            <div className="input-group">
                                <label>Manufacturing</label>
                                <input name="manufacturing" type="number" step="0.01" value={form.manufacturing} onChange={onChange} />
                            </div>
                            <div className="input-group">
                                <label>Packaging</label>
                                <input name="packaging" type="number" step="0.01" value={form.packaging} onChange={onChange} />
                            </div>
                            <div className="input-group">
                                <label>Transport</label>
                                <input name="transport" type="number" step="0.01" value={form.transport} onChange={onChange} />
                            </div>
                            <div className="input-group">
                                <label>Handling</label>
                                <input name="handling" type="number" step="0.01" value={form.handling} onChange={onChange} />
                            </div>
                        </div>

                        <div className="calculation-box">
                            <div className="calc-row">
                                <strong>Calculated Total:</strong> {autoSum.toFixed(2)} kg CO2e
                            </div>
                            <div className="input-group">
                                <label>Manual Total Override</label>
                                <input name="manualCO2e" type="number" step="0.01" value={form.manualCO2e} onChange={onChange} placeholder="Optional" />
                            </div>
                        </div>
                    </section>

                    <div className="form-actions">
                        <button type="submit" className="save-btn" disabled={saving}>
                            {saving ? "SAVING..." : id ? "UPDATE PRODUCT" : "CONFIRM & LIST"}
                        </button>
                        <button type="button" className="cancel-btn" onClick={() => navigate("/products")}>
                            CANCEL
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default AddProduct;
