import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import "../styles/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError("Product not found or server error.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="loader">Loading Impact Data...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  const { carbonData, name, image, description, price, seller } = product;

  return (
    <div className="product-detail-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Back to Catalog</button>
      
      <div className="detail-grid">
        <div className="image-section">
          <img src={image} alt={name} />
        </div>

        <div className="info-section">
          <h1>{name}</h1>
          <p className="seller-tag">Sold by: {seller}</p>
          <h2 className="detail-price">${price}</h2>
          <p className="description">{description}</p>
          
          <div className="impact-card">
            <h3>🌍 Environmental Impact</h3>
            <div className="total-score">
              <span className="label">Carbon Footprint:</span>
              <span className="value">{carbonData?.totalCO2ePerKg} kg CO2e / kg</span>
            </div>

            <div className="breakdown-bars">
              <h4>Impact Breakdown</h4>
              <div className="bar-group">
                <label>Manufacturing ({carbonData?.breakdown?.manufacturing}kg)</label>
                <div className="bar"><div className="fill" style={{width: `${(carbonData?.breakdown?.manufacturing / carbonData?.totalCO2ePerKg) * 100}%`}}></div></div>
              </div>
              <div className="bar-group">
                <label>Transport ({carbonData?.breakdown?.transport}kg)</label>
                <div className="bar"><div className="fill" style={{width: `${(carbonData?.breakdown?.transport / carbonData?.totalCO2ePerKg) * 100}%`}}></div></div>
              </div>
              <div className="bar-group">
                <label>Packaging ({carbonData?.breakdown?.packaging}kg)</label>
                <div className="bar"><div className="fill" style={{width: `${(carbonData?.breakdown?.packaging / carbonData?.totalCO2ePerKg) * 100}%`}}></div></div>
              </div>
            </div>
          </div>
          
          <button className="buy-now-large">Add to Cart</button>
          <button className="buy-now-large">Buy Now</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;