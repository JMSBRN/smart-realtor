"use client";

import { useState } from "react";
import { steps } from "@/lib/steps";

type Answers = Record<string, string>;

// Регулярка для белорусского номера в формате +375XXXXXXXXX
const phoneRegex = /^\+375\d{9}$/;

export default function ChatBot() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [inputValue, setInputValue] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const current = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const validatePhone = (phone: string) => phoneRegex.test(phone);

  const handleOptionClick = async (option: string) => {
    const newAnswers = { ...answers, [current.id]: option };
    setAnswers(newAnswers);
    setInputValue("");
    setInputError(false);
    setShowRestart(false);

    if (!isLast) {
      setStepIndex(stepIndex + 1);
    } else {
      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAnswers),
        });

        if (res.ok) {
          setIsDone(true);
        } else {
          alert("Ошибка при отправке данных.");
        }
      } catch (err) {
        console.error("Ошибка отправки:", err);
        alert("Произошла ошибка.");
      }
    }
  };

  const handleTextSubmit = () => {
    if (!inputValue.trim() || !validatePhone(inputValue.trim())) {
      setInputError(true);
      setShowRestart(true);
      return;
    }
    handleOptionClick(inputValue.trim());
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      setInputError(false);
      setShowRestart(false);
    }
  };

  const handleRestart = () => {
    setStepIndex(0);
    setAnswers({});
    setInputValue("");
    setInputError(false);
    setShowRestart(false);
    setIsDone(false);
    setIsLoadingResults(false);
    setButtonClicked(false);
  };

  const handleShowResultsClick = () => {
    setButtonClicked(true);
    setIsLoadingResults(true);

    // Симулируем загрузку 1.5 секунды, затем редирект
    setTimeout(() => {
      window.location.href = "/results";
    }, 1500);
  };

  if (isDone) {
    return (
      <div className="p-4 max-w-xl mx-auto text-center border rounded-2xl shadow-md bg-white space-y-4">
        <h2 className="text-lg font-semibold text-green-600">
          Спасибо! Мы свяжемся с вами в ближайшее время.
        </h2>

        {!inputError && (
          <button
            onClick={handleShowResultsClick}
            disabled={buttonClicked}
            className={`inline-block px-6 py-3 rounded-full text-white transition ${
              buttonClicked
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoadingResults ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Загрузка...
              </span>
            ) : (
              "Показать подходящие квартиры"
            )}
          </button>
        )}

        {inputError && showRestart && (
          <div>
            <p className="text-red-600 mb-2">
              Пожалуйста, введите корректный номер телефона в формате +375XXXXXXXXX
            </p>
            <button
              onClick={handleRestart}
              className="text-gray-600 underline"
            >
              Вернуться на начало поиска
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4 border rounded-2xl shadow-md bg-white">
      <h2 className="text-lg font-semibold">{current.question}</h2>

      {current.options ? (
        <div className="flex flex-wrap gap-2">
          {current.options.map((opt) => (
            <button
              key={opt}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              onClick={() => handleOptionClick(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="tel"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (inputError) setInputError(false);
              if (showRestart) setShowRestart(false);
            }}
            placeholder="Введите ваш номер телефона"
            className={`border p-2 rounded w-full transition ${
              inputError ? "border-red-500" : "border-gray-300"
            }`}
          />
          <button
            onClick={handleTextSubmit}
            disabled={!inputValue.trim()}
            className={`w-full py-2 text-white rounded transition ${
              inputValue.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Продолжить
          </button>
          {inputError && (
            <p className="text-red-600 text-sm mt-1">
              Формат номера: +375XXXXXXXXX
            </p>
          )}
        </div>
      )}

      {stepIndex > 0 && (
        <button
          className="text-sm text-gray-500 underline"
          onClick={handleBack}
        >
          Назад
        </button>
      )}
    </div>
  );
}
