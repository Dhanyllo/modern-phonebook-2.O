import { useState, useEffect } from "react";
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

// export async function action({ request }) {
//   const formData = await request.formData();
//   const occupationsString = formData.get("occupations");
//   const occupations = occupationsString ? occupationsString.split(",") : [];

//   console.log("Occupations:", occupations);

//   return null;
// }

function UpdateFormModal() {
  const { setActiveModal } = useUI();
  const { darkMode } = useDarkMode();
  const closeModal = () => setActiveModal(null);
  const backToDetail = () => setActiveModal("detail");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setSelectedFile(file);
  };

  useEffect(() => {
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl); // Cleanup old preview when file changes or component unmounts
    };
  }, [selectedFile]);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const [occupations, setOccupations] = useState([]);

  const handleChange = (selected) => {
    setOccupations(selected || []);
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
              Easy &nbsp; &#8226; &nbsp; Convenient&nbsp; &#8226; &nbsp;
              Flexible
            </div>
          </div>
        </div>

        <hr />

        <div className={styles.title}>
          <div className={styles.text1}>Update this Contact</div>
          <br />
          <div className={styles.text6}>
            The following are required fields to create or update a contact and
            will only be shared with Mphone
          </div>
        </div>

        <form className={styles.updateForm}>
          <div className={styles.layer1}>
            <div className={styles.formLayer1}>
              <label htmlFor="first_name">First Name</label>
              <input
                placeholder="Enter your first name"
                type="text"
                name="first_name"
                id="first_name"
              />
            </div>

            <div className={styles.formLayer1}>
              <label htmlFor="other_name">Other Names</label>
              <input
                placeholder="Enter your other names"
                type="text"
                name="other_name"
                id="other_name"
              />
            </div>

            <div className={styles.formLayer1}>
              <label htmlFor="phone_number" className={styles.phoneLabel}>
                Phone Number
              </label>
              <PhoneInput
                id="phone_number"
                defaultCountry="gh"
                inputClassName={styles.phoneInput}
                className={styles.phoneContainer}
                placeholder="Enter your phone number"
              />
            </div>

            <div className={styles.formLayer1}>
              <label htmlFor="email">Email Address (Optional)</label>
              <input
                placeholder="Enter your email address"
                type="text"
                name="email"
                id="email"
              />
            </div>

            <div className={styles.formLayer1}>
              <label htmlFor="home_address">Home Address (Optional)</label>
              <input
                placeholder="Enter your home address"
                type="text"
                name="home_address"
                id="home_address"
              />
            </div>

            <div className={styles.formLayer1}>
              <label htmlFor="occupations" className={styles.label}>
                Current or Previous job title (Optional)
              </label>

              <CreatableSelect
                id="occupations"
                isMulti
                isClearable
                placeholder="Type and press Enter..."
                onChange={handleChange}
                styles={
                  darkMode ? { ...darkSelectStyles } : { ...lightSelectStyles }
                }
              />

              <input
                type="hidden"
                name="occupations"
                value={occupations.map((occ) => occ.value).join(",")}
              />
            </div>
          </div>

          <br />
          <hr />
          <br />

          <div className={styles.text7}>
            LINKS <span className={styles.optionalTag}>(Optional)</span>
          </div>

          <br />

          <div className={styles.layer2}>
            <div className={styles.formLayer1}>
              <label htmlFor="twitter">Link to Twitter - URL</label>
              <input
                placeholder="Enter your Twitter URL"
                type="text"
                name="twitter"
                id="twitter"
              />
            </div>

            <div className={styles.formLayer1}>
              <label htmlFor="instagram">Link to Instagram - URL</label>
              <input
                placeholder="Link to Instagram URL"
                type="text"
                name="instagram"
                id="instagram"
              />
            </div>

            <div className={styles.formLayer1}>
              <label htmlFor="facebook">Link to Facebook - URL</label>
              <input
                placeholder="Link to Facebook URL"
                type="text"
                name="facebook"
                id="facebook"
              />
            </div>

            <div className={styles.formLayer1}>
              <label htmlFor="whatsapp">Link to Whatsapp - URL</label>
              <input
                placeholder="eg. https://wa.me/<Person's Number>"
                type="text"
                name="whatsapp"
                id="whatsapp"
              />
            </div>

            <div className={styles.formLayer1}>
              <label htmlFor="linkedin">Link to LinkedIn - URL</label>
              <input
                placeholder="Link to LinkedIn URL"
                type="text"
                name="linkedin"
                id="linkedin"
              />
            </div>
          </div>

          <br />
          <hr />
          <br />

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
              onChange={handleFileChange}
            />
          </div>

          {selectedFile && (
            <div className={styles.previewContainer}>
              <img
                src={previewUrl}
                alt="Preview"
                className={styles.previewImage}
              />
              <div className={styles.fileInfo}>
                <strong>{selectedFile.name}</strong>
                <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
              </div>
            </div>
          )}

          <br />
          <hr />
          <br />

          <button type="submit" className={styles.formButton}>
            Create Contact
          </button>
        </form>
      </motion.div>
    </motion.div>,
    document.getElementById("modal-root")
  );
}

export default UpdateFormModal;
