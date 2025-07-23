"use client";

import { useState, useEffect } from "react";
import ContactForm from "./ContactForm";

interface ChatStep {
  id: string;
  question: string;
  options: string[] | null;
}

type Answers = Record<string, string>;

const LOCAL_STORAGE_STEPS_KEY = "chatbot_steps_cache";

export default function ChatBot() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isDone, setIsDone] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [steps, setSteps] = useState<ChatStep[]>([]);
  const [isLoadingSteps, setIsLoadingSteps] = useState(true);
  const [errorLoadingSteps, setErrorLoadingSteps] = useState(false);

  useEffect(() => {
    async function loadChatSteps() {
      try {
        // 1. Try to load from localStorage first
        const cachedSteps = localStorage.getItem(LOCAL_STORAGE_STEPS_KEY);
        if (cachedSteps) {
          setSteps(JSON.parse(cachedSteps));
          setIsLoadingSteps(false); // No loading state needed if from cache
          return;
        }

        // 2. If not in localStorage, fetch from API
        const res = await fetch("/api/options");
        if (!res.ok) {
          throw new Error("Failed to fetch chat options");
        }
        const { data: optionsMap } = await res.json();

        const generatedSteps: ChatStep[] = [
          {
            id: "goal",
            question: "Какая цель покупки?",
            options: ["Для себя", "Для сдачи", "Инвестировать", "Пока не знаю"],
          },
          {
            id: "region",
            question: "Выберите регион:",
            options: optionsMap.region || [],
          },
          {
            id: "city",
            question: "Какой город интересует?",
            options: optionsMap.city || [],
          },
          {
            id: "budget",
            question: "Какой у вас бюджет?",
            options: [
              "До $30.000",
              "$30.000–$50.000",
              "$50.000–$70.000",
              "Больше $70.000",
            ],
          },
          {
            id: "rooms",
            question: "Сколько комнат вы ищете?",
            options: optionsMap.rooms || [],
          },
          {
            id: "mortgage",
            question: "Были ли вы в банке?",
            options: ["Да, одобрили ипотеку", "Планирую пойти", "Нет, без ипотеки"],
          },
          {
            id: "contact_details",
            question: "Пожалуйста, оставьте ваши контактные данные:",
            options: null,
          },
        ];
        setSteps(generatedSteps);
        localStorage.setItem(LOCAL_STORAGE_STEPS_KEY, JSON.stringify(generatedSteps));
      } catch (error) {
        console.error("Error loading chat steps:", error);
        setErrorLoadingSteps(true);
      } finally {
        setIsLoadingSteps(false);
      }
    }
    loadChatSteps();
  }, []);

  const current = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const handleAdvanceStep = async (newAnswersPart: Record<string, string>) => {
    const newAnswers = { ...answers, ...newAnswersPart };
    setAnswers(newAnswers);

    if (stepIndex === steps.length - 1) {
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
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleRestart = () => {
    setStepIndex(0);
    setAnswers({});
    setIsDone(false);
    setIsLoadingResults(false);
    setButtonClicked(false);
    // No need to re-fetch from API here, localStorage will handle it on next full page load or if cache is cleared
  };

  const handleShowResultsClick = () => {
    setButtonClicked(true);
    setIsLoadingResults(true);

    setTimeout(() => {
      window.location.href = "/results";
    }, 1500);
  };

  if (isLoadingSteps) {
    return (
      <div className="p-4 max-w-xl mx-auto text-center border rounded-2xl shadow-md bg-white space-y-4">
        <p>Загрузка данных чат-бота...</p>
      </div>
    );
  }

  if (errorLoadingSteps) {
    return (
      <div className="p-4 max-w-xl mx-auto text-center border rounded-2xl shadow-md bg-white space-y-4">
        <p className="text-red-600">
          Ошибка загрузки шагов чат-бота. Пожалуйста, попробуйте позже.
        </p>
        <button onClick={handleRestart} className="text-gray-600 underline">
          Начать заново
        </button>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="p-4 max-w-xl mx-auto text-center border rounded-2xl shadow-md bg-white space-y-4">
        <p className="text-red-600">
          Ошибка: Шаги чат-бота не загружены или пусты.
        </p>
        <button onClick={handleRestart} className="text-gray-600 underline">
          Начать заново
        </button>
      </div>
    );
  }

  if (isDone) {
    return (
      <div className="p-4 max-w-xl mx-auto text-center border rounded-2xl shadow-md bg-white space-y-4">
        <h2 className="text-lg font-semibold text-green-600">
          Спасибо! Мы свяжемся с вами в ближайшее время.
        </h2>

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

      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4 border rounded-2xl shadow-md bg-white">
      <h2 className="text-lg font-semibold text-gray-900">{current.question}</h2>

      {current.id === "contact_details" ? (
        <ContactForm
          onSubmit={(data) => handleAdvanceStep(data)}
          initialData={{
            contacts: answers.contacts,
            email: answers.email,
            messenger: answers.messenger,
          }}
        />
      ) : current.options ? (
        <div className="flex flex-wrap gap-2">
          {current.options.map((opt) => (
            <button
              key={opt}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              onClick={() => handleAdvanceStep({ [current.id]: opt })}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : null /* Should not happen with defined steps */}

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
