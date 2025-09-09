import { useState, useRef } from "react";
import { RiCloseLine } from "react-icons/ri";
import styles from "./productModal.module.css";

const ProductModal = ({
  selectedProduct,
  isProductModalOpen,
  handleCloseProductModal,
}) => {
  const thumbnails = [
    "images/image(41).jpg",
    "images/image(39).jpg",
    "images/image (20).jpg",
    "images/image(42).jpg",
    "images/image(40).jpg",
    "images/image-65.jpg",
  ];

  const [selectedImage, setSelectedImage] = useState(thumbnails[0]);
  const trackRef = useRef(null);

  const scroll = (direction) => {
    const track = trackRef.current;
    track.scrollBy({
      left: direction === "left" ? -70 : 70,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`${styles.modalOverlay} ${
        isProductModalOpen ? styles.show : ""
      }`}
      onClick={handleCloseProductModal}
    >
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.modalClose} onClick={handleCloseProductModal}>
          <RiCloseLine size={24} />
        </button>
        <div className={styles.modalContent}>
          <div className={styles.modalImageSection}>
            <div className={styles.mainImageWrap}>
              <img
                className={styles.mainImage}
                src={selectedProduct.image}
                alt="Product"
              />
            </div>
            <div className={styles.thumbnailLayout}>
              <div className={styles.thumbnailRowWrap}>
                <button
                  className={`${styles.productModalCarouselArrow} ${styles.left}`}
                  onClick={() => scroll("left")}
                >
                  &#10094;
                </button>
                <div ref={trackRef} className={styles.thumbnailRow}>
                  {thumbnails.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`thumb-${index}`}
                      className={`${styles.thumbnail} ${
                        selectedImage === img ? styles.selected : ""
                      }`}
                      onClick={() => setSelectedImage(img)}
                    />
                  ))}
                </div>
                <button
                  className={`${styles.productModalCarouselArrow} ${styles.right}`}
                  onClick={() => scroll("right")}
                >
                  &#10095;
                </button>
              </div>
            </div>
          </div>

          <div className={styles.modalDetails}>
            <div className={styles.productTitle}>Modern Smart Phone</div>
            <div className={styles.productModalProductPrice}>$20.90</div>
            <div className={styles.productRating}>
              <span className={styles.stars}>★★★★★</span>
              <span className={styles.reviewCount}>( 2 Review )</span>
            </div>
            <hr className={styles.hrCheckoutModal} />
            <p className={styles.productDescription}>
              Lorem ipsum dolor sit amet, consecte adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua...
            </p>
            <div className={styles.productSku}>
              <strong>SKU:</strong> Ch-256xl
            </div>
            <div className={styles.productCategory}>
              <strong>Categories:</strong>{" "}
              <span className={styles.blue}>Smart Device</span>, ETC
            </div>
            <div className={styles.productTags}>
              <strong>Tags:</strong> Smart Device, Phone
            </div>

            <div className={styles.purchaseActions}>
              <div className={styles.quantityControl}>
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
              <button className={styles.addToCart}>Add To Cart</button>
              <button className={styles.wishlist}>&#10084;</button>
            </div>

            <div className={styles.paymentOptions}>
              <img
                className={styles.paypalIcon}
                src="icons/paypal.svg"
                alt="PayPal"
              />
              <img
                className={styles.mastercardIcon}
                src="icons/mastercard.svg"
                alt="MasterCard"
              />
              <img
                className={styles.visacardIcon}
                src="icons/visacard.png"
                alt="Visa"
              />
              <img
                className={styles.discoverIcon}
                src="icons/discover.svg"
                alt="Discover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
