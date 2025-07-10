import React from "react";

const InputWithValidation = ({
	label,
	name,
	placeholder,
	value,
	onChange,
	showError,
	style = {}
}) => {
	return (
		<div style={{ marginBottom: "1rem" }}>
			{label && (
				<label
					htmlFor={name}
					style={{ display: "block", marginBottom: "0.25rem", fontWeight: "bold" }}
				>
					{label}
				</label>
			)}
			<input
				id={name}
				name={name}
				type="text"
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				style={{
				width: "100%",
				padding: "0.5rem",
				borderRadius: "4px",
				border: showError ? "1px solid red" : "1px solid #ccc",
				outline: "none",
				...style,
				}}
			/>
			{showError && (
				<div style={{ color: "red", marginTop: "0.25rem", fontSize: "0.875rem" }}>
					Este campo es obligatorio.
				</div>
			)}
		</div>
  	);
};

export default InputWithValidation;
