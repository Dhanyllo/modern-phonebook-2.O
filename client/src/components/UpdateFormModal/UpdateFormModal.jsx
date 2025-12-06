import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateContact } from "../../api/updateContact";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { RiCloseLine } from "react-icons/ri";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import CreatableSelect from "react-select/creatable";
import { useUI } from "../../context/UIContext";
import { useDarkMode } from "../../hooks/useDarkmode";
import { darkSelectStyles } from "../../theme/select/darkSelectStyles";
import { lightSelectStyles } from "../../theme/select/lightSelectStyles";
import styles from "./UpdateFormModal.module.css";
import axiosClient from "../../api/axiosClient";

export default function UpdateContactModal({ contactId, contactData }) {
  const { setActiveModal } = useUI();
  const { darkMode } = useDarkMode();
  const apiUrl = import.meta.env.VITE_API_URL;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const closeModal = () => setActiveModal(null);
  const backToDetail = () => setActiveModal("detail");

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.3 } },
  };

  const [formData, setFormData] = useState(() => ({
    first_name: contactData?.first_name || "",
    other_names: contactData?.other_names || "",
    phone_number: contactData?.phone_number || "",
    email: contactData?.email || "",
    home_address: contactData?.home_address || "",
    occupations: (contactData?.occupations || []).map((o) => ({
      value: o,
      label: o,
    })),
    twitter: contactData?.twitter || "",
    instagram: contactData?.instagram || "",
    facebook: contactData?.facebook || "",
    whatsapp: contactData?.whatsapp || "",
    linkedin: contactData?.linkedin || "",
    contactImage: null,
  }));

  const [previewUrl, setPreviewUrl] = useState(null);
  const [serverImageInfo, setServerImageInfo] = useState(null);

  useEffect(() => {
    const loadImageMetadata = async () => {
      if (!contactData?.image_url) return;

      const imagePath = contactData.image_url.startsWith("/")
        ? contactData.image_url
        : `/${contactData.image_url}`;

      const fullUrl = `${apiUrl}${imagePath}`;
      setPreviewUrl(fullUrl);

      try {
        const headRes = await axiosClient.head(fullUrl);
        const size = headRes.headers["content-length"];

        if (size) {
          setServerImageInfo({
            size: Number(size),
          });
        }
      } catch (metaErr) {
        console.warn("Failed to fetch image metadata", metaErr);
      }
    };

    loadImageMetadata();
  }, [contactData, apiUrl]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      const file = files?.[0] || null;
      setFormData((prev) => ({ ...prev, contactImage: file }));
      setPreviewUrl(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Phone input
  const handlePhoneChange = (value) =>
    setFormData((prev) => ({ ...prev, phone_number: value }));

  // Occupations select
  const handleOccupationSelect = (selected) =>
    setFormData((prev) => ({ ...prev, occupations: selected || [] }));

  // Mutation
  const mutation = useMutation({
    mutationFn: async ({ data }) =>
      await updateContact(apiUrl, data, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries(["contacts"]);
      setActiveModal(null);
      navigate("/");
    },
    onError: (error) => {
      if (error.status === 401) {
        window.location.href = "/login";
      }
      console.error("Update Contact Error:", error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    // Append all text fields
    for (const [key, value] of Object.entries(formData)) {
      if (key === "occupations") continue;
      data.append(key, value);
    }

    // Append occupations
    formData.occupations.forEach((occ) =>
      data.append("occupations[]", occ.value)
    );

    mutation.mutate({ data });
  };

  return ReactDOM.createPortal(
    <motion.div
      className={styles.modalOverlay}
      onClick={closeModal}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className={styles.mainContainer}
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header Buttons */}
        <div className={styles.btnContainer}>
          <button
            className={styles.backBtn}
            onClick={(e) => {
              e.stopPropagation();
              backToDetail();
            }}
          >
            <MdOutlineKeyboardBackspace size={28} />
          </button>
          <button
            className={styles.modalClose}
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
            }}
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Branding */}
        <div className={styles.headerContainer}>
          <div className={styles.imgIcon}>
            <img
              className={styles.companyLogo}
              src="/images/logo.png"
              alt="company Logo"
            />
          </div>
          <div className={styles.imgSideText}>
            <div className={styles.text2}>Modern Phonebook 2.O</div>
            <div className={styles.text3}>
              Easy &#8226; Convenient &#8226; Flexible
            </div>
          </div>
        </div>

        <hr />

        <form className={styles.updateForm} onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className={styles.layer1}>
            <div className={styles.formLayer1}>
              <label>First Name</label>
              <input
                placeholder="Enter your first name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formLayer1}>
              <label>Other Names</label>
              <input
                placeholder="Enter your other names"
                name="other_names"
                value={formData.other_names}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formLayer1}>
              <label>Phone Number</label>
              <PhoneInput
                defaultCountry="gh"
                value={formData.phone_number}
                onChange={handlePhoneChange}
                inputClassName={styles.phoneInput}
                className={styles.phoneContainer}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className={styles.formLayer1}>
              <label>Email (optional)</label>
              <input
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formLayer1}>
              <label>Home Address (optional)</label>
              <input
                placeholder="Enter your home address"
                name="home_address"
                value={formData.home_address}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formLayer1}>
              <label>Current or Previous Job Title (optional)</label>
              <CreatableSelect
                isMulti
                isClearable
                value={formData.occupations}
                onChange={handleOccupationSelect}
                placeholder="Type and press Enter..."
                styles={darkMode ? darkSelectStyles : lightSelectStyles}
              />
            </div>
          </div>

          <hr />

          {/* Social Links */}
          <div className={styles.layer2}>
            {["twitter", "instagram", "facebook", "whatsapp", "linkedin"].map(
              (field) => (
                <div className={styles.formLayer1} key={field}>
                  <label>{`Link to ${field} - URL`}</label>
                  <input
                    placeholder={`Link to ${field} URL`}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                </div>
              )
            )}
          </div>

          <hr />

          {/* Image Upload */}
          <div className={`${styles.formLayer1} ${styles.contactImage}`}>
            <div className={styles.text4}>Attach an image for contact</div>
            <label className={styles.contactImageStyle} htmlFor="contactImage">
              <img src="/images/Icon18.png" alt="image-file-icon" />
              <div>Attach image</div>
            </label>
            <input
              className={styles.fileBtn}
              type="file"
              name="contactImage"
              id="contactImage"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleChange}
            />
          </div>

          {previewUrl && (
            <div className={styles.previewContainer}>
              <img
                src={previewUrl}
                alt="Preview"
                className={styles.previewImage}
              />

              {formData.contactImage && (
                <div className={styles.fileInfo}>
                  <strong>{formData.contactImage.name}</strong>
                  <span>
                    {(formData.contactImage.size / 1024).toFixed(1)} KB
                  </span>
                  <span>
                    {(formData.contactImage.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              )}

              {!formData.contactImage && serverImageInfo && (
                <div className={styles.fileInfo}>
                  <strong>Saved Image</strong>
                  <span>{(serverImageInfo.size / 1024).toFixed(1)} KB</span>
                  <span>
                    {(serverImageInfo.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              )}
            </div>
          )}
          <div>❗Attached image size should not exceed 5MB</div>

          <hr />

          <button type="submit" className={styles.formButton}>
            Update Contact
          </button>
        </form>
      </motion.div>
    </motion.div>,
    document.getElementById("modal-root")
  );
}
