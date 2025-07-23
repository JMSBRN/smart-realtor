import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

interface ContactFormProps {
  onSubmit: (data: {
    phone_number: string;
    email: string;
    messenger: string;
  }) => void;
  initialData?: { phone_number?: string; email?: string; messenger?: string };
}

const phoneRegex = /^\+375\d{9}$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export default function ContactForm({
  onSubmit,
  initialData,
}: ContactFormProps) {
  const [phone, setPhone] = useState(initialData?.phone_number || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [messenger, setMessenger] = useState(initialData?.messenger || "");

  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [messengerError, setMessengerError] = useState<string | null>(null);

  const validatePhone = (value: string) => {
    if (!value.trim()) return "Поле телефона обязательно для заполнения.";
    if (!phoneRegex.test(value.trim()))
      return "Введите номер в формате +375XXXXXXXXX.";
    return null;
  };

  const validateEmail = (value: string) => {
    if (value.trim() && !emailRegex.test(value.trim()))
      return "Введите корректный email.";
    return null;
  };

  const validateMessenger = (value: string) => {
    return null; // опционально, не проверяем
  };

  const handleSubmit = () => {
    const phoneValidation = validatePhone(phone);
    const emailValidation = validateEmail(email);
    const messengerValidation = validateMessenger(messenger);

    setPhoneError(phoneValidation);
    setEmailError(emailValidation);
    setMessengerError(messengerValidation);

    if (phoneValidation || emailValidation || messengerValidation) return;

    onSubmit({
      phone_number: phone.trim(),
      email: email.trim(),
      messenger: messenger.trim(),
    });
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* Phone Field */}
      <TextField
        label="Номер телефона *"
        variant="outlined"
        fullWidth
        value={phone}
        onChange={(e) => {
          const val = e.target.value;
          setPhone(val);
          setPhoneError(validatePhone(val));
        }}
        error={!!phoneError}
        helperText={phoneError || "Введите номер в формате +375XXXXXXXXX"}
      />

      {/* Email Field */}
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => {
          const val = e.target.value;
          setEmail(val);
          setEmailError(validateEmail(val));
        }}
        error={!!emailError}
        helperText={emailError || "example@email.com"}
      />

      {/* Messenger Field */}
      <TextField
        label="Удобный мессенджер или ник (Telegram, Viber, WhatsApp)"
        variant="outlined"
        fullWidth
        value={messenger}
        onChange={(e) => {
          const val = e.target.value;
          setMessenger(val);
          setMessengerError(validateMessenger(val));
        }}
        error={!!messengerError}
        helperText={messengerError || "Например: @your_nick"}
      />

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={
          !phone.trim() || !!phoneError || !!emailError || !!messengerError
        }
      >
        Продолжить
      </Button>
    </Box>
  );
}
