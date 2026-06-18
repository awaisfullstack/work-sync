export function getDateInputValue(date?: string | null) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export function parseDateInputValue(value?: string | null) {
  if (!value) return undefined;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day);
}

export function formatDateInputValue(date?: Date | null) {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
