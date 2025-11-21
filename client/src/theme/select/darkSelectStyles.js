export const darkSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: 3,
    backgroundColor: "#2a2a2a",
    borderColor: state.isFocused ? "#4d88ff" : "#444",
    border: state.isFocused
      ? "2px solid #2684ff" // When focused
      : "1.5px solid #ccc", // Default border
    boxShadow: "none",
    color: "white",
    "&:hover": {
      borderColor: "none",
    },
  }),

  input: (base) => ({
    ...base,
    color: "white",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#a1a1a1",
  }),

  singleValue: (base) => ({
    ...base,
    color: "white",
  }),

  multiValue: (base) => ({
    ...base,
    backgroundColor: "#333",
  }),

  multiValueLabel: (base) => ({
    ...base,
    color: "white",
  }),

  multiValueRemove: (base) => ({
    ...base,
    color: "white",
    "&:hover": {
      backgroundColor: "#ff4d4d",
      color: "white",
    },
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: "#2a2a2a",
    border: "1px solid #444",
  }),

  menuList: (base) => ({
    ...base,
    backgroundColor: "#2a2a2a",
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#374151" : "#2a2a2a",
    color: state.isFocused ? "#fff" : "#e5e7eb",
  }),
};
