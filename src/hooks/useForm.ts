import { ChangeEvent, useState } from "react";

type FieldType = "email" | "password" | "number" | false;

interface ValidationType {
  regex: RegExp;
  msg: string;
}

const types: Record<Exclude<FieldType, false>, ValidationType> = {
  email: {
    regex:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    msg: "Preencha um email válido.",
  },
  password: {
    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d@$!%*?&]{8,}$/,
    msg: "A senha precisa ter 1 caractere maiúsculo, 1 minúsculo e 1 número, com no mínimo 8 caracteres.",
  },
  number: {
    regex: /^\d+$/,
    msg: "Utilize apenas números.",
  },
};

export default function useForm(type: FieldType = false) {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string | null>("");

  function validate(value: string): boolean {
    if (type === false) return true;

    if (value.length === 0) {
      setError("Preencha um valor.");
      return false;
    }

    const validation = types[type];
    if (validation && !validation.regex.test(value)) {
      setError(validation.msg);
      return false;
    }

    setError(null);
    return true;
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    if (error) validate(event.target.value);
    setValue(event.target.value);
  }

  return {
    value,
    setValue,
    onChange,
    error,
    validate: () => validate(value),
    onBlur: () => validate(value),
  };
}
