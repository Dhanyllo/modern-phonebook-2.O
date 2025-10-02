import styles from "./CreateContactModal.module.css";
import { RiCloseLine } from "react-icons/ri";

const CreateContactModal = ({
  isProductModalOpen,
  handleCloseProductModal,
  darkmode,
}) => {
  return (
    <div
      className={`${styles.modalOverlay} ${
        isProductModalOpen ? styles.show : ""
      }`}
      onClick={handleCloseProductModal}
    >
      <div
        className={styles.mainContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.btnContainer}>
          <button
            className={styles.modalClose}
            onClick={handleCloseProductModal}
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
          <div className={styles.text1}>Create Your Contact</div>
          <br />
          <div className={styles.text6}>
            The following are required fields to create a contact and will only
            be shared with Mphone
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
              <label htmlFor="phone_number">Phone number</label>
              <input
                placeholder="Enter your number"
                type="tel"
                name="phone_number"
                id="phone_number"
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
              <label htmlFor="occupation">
                Current or Previous job title (Optional)
              </label>
              <input
                placeholder="What's your current or previous job title"
                type="text"
                name="occupation"
                id="occupation"
              />
            </div>
          </div>

          <br />
          <hr />
          <br />

          <div className={styles.text7}>
            LINKS <span style={{ color: "black" }}>(Optional)</span>
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

          <div className={`${styles.formLayer1} ${styles.cvSide}`}>
            <div className={styles.text4}>Attach an image for contact</div>
            <label className={styles.cvStyle} htmlFor="CV">
              <img src="/images/Icon18.png" alt="file-icon" />
              <div>Attach an image</div>
            </label>
            <input
              className={styles.fileBtn}
              type="file"
              name="cvFile"
              id="CV"
              accept=".jpg,.jpeg,.png,.webp"
            />
          </div>

          <br />
          <hr />
          <br />

          <button type="submit" className={styles.formButton}>
            Create Contact
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateContactModal;
