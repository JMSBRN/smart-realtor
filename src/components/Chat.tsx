"use client";

import { useState, useEffect } from "react";
import ContactForm from "./ContactForm";
import { Lead } from "@/types/lead";

interface ChatStep {
  id: string;
  question: string;
  options: string[] | null;
}

type Answers = Record<string, string>;

const LOCAL_STORAGE_STEPS_KEY = "chatbot_steps_cache_v4";

export default function ChatBot() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isDone, setIsDone] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [steps, setSteps] = useState<ChatStep[]>([]);
  const [regionCityMap, setRegionCityMap] = useState<Record<string, string[]>>(
    {}
  );
  const [errorLoadingSteps, setErrorLoadingSteps] = useState(false);

  useEffect(() => {
    async function loadChatSteps() {
      try {
        const cachedData = localStorage.getItem(LOCAL_STORAGE_STEPS_KEY);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setSteps(parsedData.steps);
          setRegionCityMap(parsedData.regionCityMap);
          return;
        }

        const res = await fetch("/api/options");
        if (!res.ok) throw new Error("Failed to fetch chat options");

        const { data } = await res.json();
        const { optionsMap, regionCityMap: fetchedRegionCityMap } = data;

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
            options: null,
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
            options: [
              "Да, одобрили ипотеку",
              "Планирую пойти",
              "Нет, без ипотеки",
            ],
          },
          {
            id: "contact_details",
            question: "Пожалуйста, оставьте ваши контактные данные:",
            options: null,
          },
        ];

        setSteps(generatedSteps);
        setRegionCityMap(fetchedRegionCityMap);

        localStorage.setItem(
          LOCAL_STORAGE_STEPS_KEY,
          JSON.stringify({
            steps: generatedSteps,
            regionCityMap: fetchedRegionCityMap,
          })
        );
      } catch (error) {
        console.error("Error loading chat steps:", error);
        setErrorLoadingSteps(true);
      }
    }

    loadChatSteps();
  }, []);

  const current = steps[stepIndex];

  const getCityOptions = () => {
    const selectedRegion = answers.region;
    if (selectedRegion && regionCityMap[selectedRegion]) {
      return regionCityMap[selectedRegion];
    }
    return [];
  };

  const handleAdvanceStep = async (newAnswersPart: Record<string, string>) => {
    const newAnswers = { ...answers, ...newAnswersPart };

    if (current?.id === "region" && newAnswersPart.region !== answers.region) {
      newAnswers.city = "";
    }

    setAnswers(newAnswers);

    if (current?.id === "contact_details") {
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
      return;
    }

    setStepIndex(stepIndex + 1);
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      if (steps[stepIndex]?.id === "city") {
        setAnswers((prev) => {
          const newAnswers = { ...prev };
          delete newAnswers.city;
          return newAnswers;
        });
      }
    }
  };

  const handleRestart = () => {
    setStepIndex(0);
    setAnswers({});
    setIsDone(false);
    setIsLoadingResults(false);
    setButtonClicked(false);
  };

  const handleShowResultsClick = () => {
    setButtonClicked(true);
    setIsLoadingResults(true);
    setTimeout(() => {
      window.location.href = "/results";
    }, 1500);
  };

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

  if (isDone) {
    return (
      <div className="p-4 max-w-xl mx-auto text-center border rounded-2xl shadow-md bg-white space-y-4">
        <p className="text-green-600 text-lg font-semibold">
          Спасибо! Мы свяжемся с вами в ближайшее время.
        </p>
        <button onClick={handleRestart} className="text-blue-600 underline">
          Начать заново
        </button>
        <button
          onClick={handleShowResultsClick}
          className="ml-20 text-blue-600 underline"
        >
          Показать результаты
        </button>
      </div>
    );
  }

  if (!current) {
    return null;
  }

  const optionsToRender =
    current.id === "city" ? getCityOptions() : current.options;

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4 border rounded-2xl shadow-md bg-white">
      <h2 className="text-lg font-semibold text-gray-900">
        {current.question}
      </h2>

      {current.id === "contact_details" ? (
        <ContactForm
          onSubmit={(data) => handleAdvanceStep(data)}
          initialData={{
            phone_number: answers.contacts,
            email: answers.email,
            messenger: answers.messenger,
          }}
        />
      ) : optionsToRender && optionsToRender.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {optionsToRender.map((opt) => (
            <button
              key={opt}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              onClick={() => handleAdvanceStep({ [current.id]: opt })}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : current.id === "city" ? (
        <p className="text-gray-600">Нет городов для выбранного региона.</p>
      ) : null}

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
