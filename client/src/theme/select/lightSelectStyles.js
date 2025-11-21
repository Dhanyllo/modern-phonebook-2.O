export const lightSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: 3,
    border: state.isFocused
      ? "2px solid #2684ff" // When focused
      : "1.5px solid #ccc", // Default border
    fontSize: "0.95rem",
    boxShadow: "none",
    "&:hover": {
      borderColor: "none",
    },
  }),
};
