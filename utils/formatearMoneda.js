export function formatearMoneda(value) {
	if (value == null) return "";
	return new Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		minimumFractionDigits: 0,
	}).format(value);
}
