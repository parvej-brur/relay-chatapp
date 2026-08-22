"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { ErrorState } from "@/components/shared/ErrorState";
import { toErrorMessage } from "@/lib/api/client";
import { useLogin } from "../hooks/useLogin";
import { CountryCodeSelect } from "./CountryCodeSelect";
import {
  type LoginFormErrors,
  type LoginFormValues,
  toE164,
  validateLoginForm,
} from "../utils/validateLoginForm";

const INITIAL_VALUES: LoginFormValues = { dialCode: "+880", phone: "", name: "" };

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const loginMutation = useLogin();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const update = <Key extends keyof LoginFormValues>(key: Key, value: LoginFormValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateLoginForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    loginMutation.mutate(
      { phone: toE164(values), name: values.name.trim() },
      { onSuccess },
    );
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {loginMutation.isError ? (
        <ErrorState
          title="Could not sign you in"
          description={toErrorMessage(loginMutation.error, "Something went wrong. Please try again.")}
        />
      ) : null}

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

      <Button type="submit" size="lg" loading={loginMutation.isPending} className="mt-1 w-full">
        Continue
      </Button>
    </form>
  );
}
