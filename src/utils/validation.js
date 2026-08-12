export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).trim());
}

export function validateEmail(email) {
  const value = String(email || "").trim();
  if (!value) return "Email is required.";
  if (!isValidEmail(value)) return "Please enter a valid email address (e.g. name@example.com).";
  return "";
}

export function validatePassword(password) {
  const value = String(password || "");
  if (!value) return "Password is required.";
  if (value.length < 6) return "Password must be at least 6 characters long.";
  if (!/[A-Za-z]/.test(value)) return "Password must contain at least one letter.";
  if (!/[0-9]/.test(value)) return "Password must contain at least one number.";
  if (!/[^A-Za-z0-9]/.test(value)) return "Password must contain at least one special character (e.g. !@#$).";
  return "";
}

export function validateFullName(name) {
  const value = String(name || "").trim();
  if (!value) return "Full name is required.";
  if (value.length < 3) return "Full name must be at least 3 characters long.";
  if (!/^[A-Za-z][A-Za-z .'-]*$/.test(value)) return "Full name can only contain letters, spaces, dots, apostrophes and hyphens.";
  return "";
}

export function validatePhone(phone) {
  const value = String(phone || "").trim();
  if (!value) return "Phone number is required.";
  if (!/^\d{10}$/.test(value)) return "Phone number must be exactly 10 digits (e.g. 98XXXXXXXX).";
  return "";
}
