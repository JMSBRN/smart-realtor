import { useState } from "react";

interface ContactFormProps {
  onSubmit: (data: { contacts: string; email: string; messenger: string }) => void;
  initialData?: { contacts?: string; email?: string; messenger?: string };
}

// Регулярка для белорусского номера в формате +375XXXXXXXXX
const phoneRegex = /^\+375\d{9}$/;
// Регулярка для простой проверки email
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export default function ContactForm({ onSubmit, initialData }: ContactFormProps) {
  const [phone, setPhone] = useState(initialData?.contacts || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [messenger, setMessenger] = useState(initialData?.messenger || "");

  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [messengerError, setMessengerError] = useState<string | null>(null);

  const validatePhone = (value: string) => {
    if (!value.trim()) {
      return "Поле телефона обязательно для заполнения.";
    }
    if (!phoneRegex.test(value.trim())) {
      return "Пожалуйста, введите корректный номер телефона в формате +375XXXXXXXXX.";
    }
    return null;
  };

  const validateEmail = (value: string) => {
    if (value.trim() && !emailRegex.test(value.trim())) {
      return "Пожалуйста, введите корректный адрес электронной почты.";
    }
    return null;
  };

  const validateMessenger = (value: string) => {
    // Messenger is not strictly required, but if something is typed, it should be trimmed
    if (value.trim() === "") {
      return null; // No error if empty, as it's optional
    }
    return null; // No specific format validation for messenger for now
  };

  const handleSubmit = () => {
    // Perform final validation before submitting
    const phoneValidationResult = validatePhone(phone);
    const emailValidationResult = validateEmail(email);
    const messengerValidationResult = validateMessenger(messenger);

    setPhoneError(phoneValidationResult);
    setEmailError(emailValidationResult);
    setMessengerError(messengerValidationResult);

    if (phoneValidationResult || emailValidationResult || messengerValidationResult) {
      return; // Stop if there are validation errors
    }

    onSubmit({
      contacts: phone.trim(),
      email: email.trim(),
      messenger: messenger.trim(),
    });
  };

  return (
    <div className="space-y-4">
      {/* Phone Input */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Оставьте, пожалуйста, ваш номер телефона: <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => {
            const newValue = e.target.value;
            setPhone(newValue);
            setPhoneError(validatePhone(newValue)); // Validate immediately
          }}
          placeholder="+375XXXXXXXXX"
          className={`border p-2 rounded w-full transition placeholder-black text-black ${phoneError ? "border-red-500" : "border-gray-300"}`}
        />
        {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Пожалуйста, оставьте ваш email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
            const newValue = e.target.value;
            setEmail(newValue);
            setEmailError(validateEmail(newValue)); // Validate immediately
          }}
          placeholder="your@example.com"
          className={`border p-2 rounded w-full transition placeholder-black text-black ${emailError ? "border-red-500" : "border-gray-300"}`}
        />
        {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
      </div>

      {/* Messenger Input */}
      <div>
        <label htmlFor="messenger" className="block text-sm font-medium text-gray-700 mb-1">
          Напишите удобный для вас мессенджер (Telegram, Viber, WhatsApp) или ваш ник:
        </label>
        <input
          type="text"
          id="messenger"
          value={messenger}
          onChange={(e) => {
            const newValue = e.target.value;
            setMessenger(newValue);
            setMessengerError(validateMessenger(newValue)); // Validate immediately
          }}
          placeholder="Telegram, @your_nick"
          className={`border p-2 rounded w-full transition placeholder-black text-black ${messengerError ? "border-red-500" : "border-gray-300"}`}
        />
        {messengerError && <p className="text-red-600 text-sm mt-1">{messengerError}</p>}
      </div>

      <button
        onClick={handleSubmit}
        className={`w-full py-2 text-white rounded transition ${
          (phone.trim() && !phoneError && !emailError && !messengerError) ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={!phone.trim() || !!phoneError || !!emailError || !!messengerError}
      >
        Продолжить
      </button>
    </div>
  );
}
