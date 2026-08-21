"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { ErrorState } from "@/components/shared/ErrorState";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/providers/AuthProvider";
import { CountryCodeSelect } from "./CountryCodeSelect";
import {
  type LoginFormErrors,
  type LoginFormValues,
  toE164,
  validateLoginForm,
} from "../utils/validateLoginForm";

const INITIAL_VALUES: LoginFormValues = { dialCode: "+1", phone: "", name: "" };

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { login } = useAuth();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = <Key extends keyof LoginFormValues>(key: Key, value: LoginFormValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateLoginForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await login({ phone: toE164(values), name: values.name.trim() });
      onSuccess();
    } catch (error) {
      setSubmitError(
        error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {submitError ? <ErrorState title="Could not sign you in" description={submitError} /> : null}

      <TextField
        label="Phone number"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="555 000 0000"
        value={values.phone}
        error={errors.phone}
        onChange={(event) => update("phone", event.target.value)}
        leadingSlot={<CountryCodeSelect value={values.dialCode} onChange={(code) => update("dialCode", code)} />}
      />

      <TextField
        label="Your name"
        autoComplete="name"
        placeholder="Enter your display name"
        value={values.name}
        error={errors.name}
        onChange={(event) => update("name", event.target.value)}
      />

      <Button type="submit" size="lg" loading={submitting} className="mt-1 w-full">
        Continue
      </Button>
    </form>
  );
}
