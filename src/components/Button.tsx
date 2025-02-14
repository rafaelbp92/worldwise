import styles from "./Button.module.css";

function Button({ children, onClick, type = "primary" }: { children: React.ReactNode, onClick: () => void, type: "primary" | "secondary" }) {
  return (
    <button className={`${styles.btn} ${styles[type]}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
