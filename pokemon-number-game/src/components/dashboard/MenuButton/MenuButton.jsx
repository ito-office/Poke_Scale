import { useNavigate } from "react-router-dom";
import styles from "./MenuButton.module.css";

export default function MenuButton({
  image,
  alt,
  to,
  className = "",
}) {
  const navigate = useNavigate();

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <img
        src={image}
        alt={alt}
        className={styles.image}
      />

      <button
        type="button"
        aria-label={alt}
        className={styles.button}
        onClick={() => navigate(to)}
      />
    </div>
  );
}