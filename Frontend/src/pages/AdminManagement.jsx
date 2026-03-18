import { useEffect, useMemo, useState } from "react";
import MainNavbar from "../components/MainNavbar";
import { fetchAdminStats, fetchAdminUsers } from "../services/adminService";
import { getProducts, updateProduct } from "../services/productService";
import { mapProductToRequest } from "../utils/productMapper";
import "../styles/AdminManagement.css";

const tabs = [
  { id: "users", label: "Users" },
  { id: "sellers", label: "Sellers" },
  { id: "products", label: "Products" },
  { id: "carbon", label: "Carbon Data" },
  { id: "verify", label: "Verification" },
  { id: "reports", label: "Reports" },
];

const downloadTextFile = (filename, content) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

function AdminManagement() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadAdminData = async () => {
      setLoading(true);
      setError("");
      try {
        const [usersData, productsData, statsData] = await Promise.all([
          fetchAdminUsers(),
          getProducts(),
          fetchAdminStats(),
        ]);
        if (!isMounted) return;
        setUsers(usersData);
        setProducts(productsData);
        setStats(statsData);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load admin data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAdminData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const query = userFilter.toLowerCase();
    return users.filter((item) =>
      item.name?.toLowerCase().includes(query) || item.email?.toLowerCase().includes(query)
    );
  }, [users, userFilter]);

  const sellers = useMemo(() => {
    const sellerMap = new Map();
    products.forEach((product) => {
      if (!product?.seller) return;
      const existing = sellerMap.get(product.seller) || {
        id: product.seller,
        name: product.seller,
        status: "verified",
        rating: 4.5,
      };
      if (!product.isEcoFriendly) {
        existing.status = "pending";
      }
      sellerMap.set(product.seller, existing);
    });
    return Array.from(sellerMap.values());
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = productFilter.toLowerCase();
    return products.filter((item) => item.name?.toLowerCase().includes(query));
  }, [products, productFilter]);

  const carbonData = useMemo(() => {
    return products.map((product) => ({
      id: product.id,
      product: product.name,
      emission: `${product.emission ?? 0}kg`,
      verified: product.isEcoFriendly ? "yes" : "pending",
    }));
  }, [products]);

  const verifications = useMemo(() => {
    return products
      .filter((product) => !product.isEcoFriendly)
      .slice(0, 6)
      .map((product, index) => ({
        id: `V-${product.id || index + 1}`,
        productId: product.id,  // ADD THIS LINE
        type: "Product",
        subject: product.name,
        status: "pending",
      }));
  }, [products]);

  const handleProductStatus = async (product, carbonTag) => {
    if (!product) return;
    const nextEco = carbonTag === "verified";
    const payload = mapProductToRequest(product, { isEcoFriendly: nextEco });
    const updated = await updateProduct(product.id, payload);
    setProducts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleCarbonStatus = async (product, verified) => {
    if (!product) return;
    const nextEco = verified === "yes";
    const payload = mapProductToRequest(product, { isEcoFriendly: nextEco });
    const updated = await updateProduct(product.id, payload);
    setProducts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleSellerStatus = async (seller, status) => {
    if (!seller) return;
    // Update all products from this seller
    const sellerProducts = products.filter((p) => p.seller === seller.id);
    const nextEco = status === "verified";

    for (const product of sellerProducts) {
      const payload = mapProductToRequest(product, { isEcoFriendly: nextEco });
      const updated = await updateProduct(product.id, payload);
      setProducts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    }
  };

  const handleReportDownload = () => {
    const content = [
      "EcoBazaarX System Sustainability Report",
      "",
      "Key Metrics",
      `- Active users: ${stats?.totalNormalUsers ?? 0}`,
      `- Verified sellers: ${sellers.filter((item) => item.status === "verified").length}`,
      `- Green SKUs: ${products.filter((product) => product.isEcoFriendly).length}`,
      `- Carbon savings this quarter: ${products.reduce((acc, item) => acc + (item.emission || 0), 0).toFixed(2)} kg`,
      "",
      "Pending Verifications",
      ...verifications.map((item) => `- ${item.type} ${item.subject}: ${item.status}`),
    ].join("\n");
    const date = new Date().toISOString().slice(0, 10);
    downloadTextFile(`sustainability-report-${date}.txt`, content);
  };

  return (
    <>
      <MainNavbar />
      <div className="admin-page">
        <header className="admin-hero">
          <div>
            <p className="admin-kicker">Admin Management</p>
            <h1>Control users, verify green products, and publish sustainability reports.</h1>
          </div>
          <div className="admin-cta">
            <button className="solid-btn" onClick={handleReportDownload}>Download System Report</button>
          </div>
        </header>

        {loading && (
          <section className="admin-card">
            <h3>Loading admin dashboard...</h3>
            <p>Fetching users, products, and system metrics.</p>
          </section>
        )}

        {!loading && error && (
          <section className="admin-card">
            <h3>Unable to load admin data</h3>
            <p>{error}</p>
          </section>
        )}

        <div className="admin-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "tab active" : "tab"}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {!loading && !error && activeTab === "users" && (
          <section className="admin-card">
            <div className="admin-card-header">
              <h3>User Management</h3>
              <input
                className="admin-search"
                placeholder="Search users by name/email"
                value={userFilter}
                onChange={(event) => setUserFilter(event.target.value)}
              />
            </div>
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className={`pill ${String(user.role || "active").toLowerCase()}`}>{user.role || "active"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {!loading && !error && activeTab === "sellers" && (
          <section className="admin-card">
            <div className="admin-card-header">
              <h3>Seller Verification</h3>
              <p>Approve or flag sellers before listing green inventory.</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Seller ID</th>
                  <th>Seller</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr key={seller.id}>
                    <td>{seller.id}</td>
                    <td>{seller.name}</td>
                    <td>{seller.rating}</td>
                    <td><span className={`pill ${seller.status}`}>{seller.status}</span></td>
                    <td>
                      <button className="ghost-btn" onClick={() => handleSellerStatus(seller, "verified")}>Verify</button>
                      <button className="ghost-btn danger" onClick={() => handleSellerStatus(seller, "pending")}>Flag</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {!loading && !error && activeTab === "products" && (
          <section className="admin-card">
            <div className="admin-card-header">
              <h3>Product Approval</h3>
              <input
                className="admin-search"
                placeholder="Search products"
                value={productFilter}
                onChange={(event) => setProductFilter(event.target.value)}
              />
            </div>
            <table>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product</th>
                  <th>Stock</th>
                  <th>Carbon Tag</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.stock ?? "-"}</td>
                    <td><span className={`pill ${product.isEcoFriendly ? "verified" : "pending"}`}>{product.isEcoFriendly ? "verified" : "pending"}</span></td>
                    <td>
                      <button className="ghost-btn" onClick={() => handleProductStatus(product, "verified")}>Approve</button>
                      <button className="ghost-btn danger" onClick={() => handleProductStatus(product, "pending")}>Hold</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {!loading && !error && activeTab === "carbon" && (
          <section className="admin-card">
            <div className="admin-card-header">
              <h3>Carbon Data Registry</h3>
              <p>Audit emission values before tagging products.</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Record</th>
                  <th>Product</th>
                  <th>Emission</th>
                  <th>Verified</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {carbonData.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.product}</td>
                    <td>{record.emission}</td>
                    <td><span className={`pill ${record.verified}`}>{record.verified}</span></td>
                    <td>
                      <button
                        className="ghost-btn"
                        onClick={() => handleCarbonStatus(products.find((p) => p.id === record.id), "yes")}
                      >
                        Verify
                      </button>
                      <button
                        className="ghost-btn danger"
                        onClick={() => handleCarbonStatus(products.find((p) => p.id === record.id), "pending")}
                      >
                        Recheck
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {!loading && !error && activeTab === "verify" && (
          <section className="admin-card">
            <div className="admin-card-header">
              <h3>Verification Workflow</h3>
              <p>Resolve certification issues before publishing.</p>
            </div>
            <div className="verification-grid">
              {verifications.map((item) => (
                <div key={item.id} className="verification-card">
                  <div>
                    <span className="meta">{item.type} Request</span>
                    <h4>{item.subject}</h4>
                    <p>Ticket ID: {item.id}</p>
                  </div>
                  <div className="verification-actions">
                    <span className={`pill ${item.status}`}>{item.status}</span>
                    <button
                      className="ghost-btn"
                      onClick={() => handleProductStatus(products.find((p) => p.id === item.productId), "verified")}
                    >
                      Approve
                    </button>
                    <button
                      className="ghost-btn danger"
                      onClick={() => handleProductStatus(products.find((p) => p.id === item.productId), "pending")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!loading && !error && activeTab === "reports" && (
          <section className="admin-card report-card">
            <h3>System-wide Sustainability Reports</h3>
            <p>Export quarterly or monthly data snapshots to share with partners.</p>
            <div className="report-actions">
              <button className="solid-btn" onClick={handleReportDownload}>Download Report</button>
              <button className="ghost-btn">Schedule Monthly Export</button>
            </div>
            <div className="report-preview">
              <div>
                <span>Quarterly Overview</span>
                <strong>{products.reduce((acc, item) => acc + (item.emission || 0), 0).toFixed(2)} kg CO₂e saved</strong>
              </div>
              <div>
                <span>Verification Queue</span>
                <strong>{verifications.filter((item) => item.status === "pending").length} pending</strong>
              </div>
              <div>
                <span>Green Seller Growth</span>
                <strong>{stats?.totalAdmins ? "+14% QoQ" : "N/A"}</strong>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export default AdminManagement;
