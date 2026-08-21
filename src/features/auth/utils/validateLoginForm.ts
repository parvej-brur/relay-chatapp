export type LoginFormValues = {
  dialCode: string;
  phone: string;
  name: string;
};

export type LoginFormErrors = Partial<Record<"phone" | "name", string>>;

export function toE164(values: LoginFormValues): string {
  return `${values.dialCode}${values.phone.replace(/\D/g, "")}`;
}

export function validateLoginForm(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const digits = values.phone.replace(/\D/g, "");

  if (digits.length === 0) errors.phone = "Enter your phone number.";
  else if (digits.length < 6 || digits.length > 14) errors.phone = "Enter a valid phone number.";

  if (values.name.trim().length === 0) errors.name = "Enter your name.";
  else if (values.name.trim().length > 40) errors.name = "Keep your name under 40 characters.";

  return errors;
}
