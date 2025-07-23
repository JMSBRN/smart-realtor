import { Apartment } from "@/types/apartment";

function getUniqueOptions(apartments: Apartment[], key: keyof Apartment): string[] {
  const options = new Set<string>();
  apartments.forEach((apartment) => {
    const value = apartment[key];
    if (value !== undefined && value !== null) {
      options.add(String(value));
    }
  });
  // Sort numeric options correctly, otherwise sort alphabetically
  const sortedOptions = Array.from(options).sort((a, b) => {
    const numA = Number(a);
    const numB = Number(b);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return a.localeCompare(b);
  });
  return sortedOptions;
}

export function generateSteps(apartments: Apartment[]) {
  return [
    {
      id: "goal",
      question: "Какая цель покупки?",
      options: ["Для себя", "Для сдачи", "Инвестировать", "Пока не знаю"],
    },
    {
      id: "region",
      question: "Выберите регион:",
      options: getUniqueOptions(apartments, "region"),
    },
    {
      id: "city",
      question: "Какой город интересует?",
      options: getUniqueOptions(apartments, "settlement"),
    },
    {
      id: "budget",
      question: "Какой у вас бюджет?",
      options: [
        "До $30.000",
        "$30.000–$50.000",
        "$50.000–$70.000",
        "Больше $70.000",
      ], // можно тоже посчитать по статистике из базы
    },
    {
      id: "rooms",
      question: "Сколько комнат вы ищете?",
      options: getUniqueOptions(apartments, "roomsCount").map(String),
    },
    {
      id: "mortgage",
      question: "Были ли вы в банке?",
      options: ["Да, одобрили ипотеку", "Планирую пойти", "Нет, без ипотеки"],
    },
    {
      id: "contacts",
      question: "Оставьте, пожалуйста, ваш номер телефона:",
      options: null,
    },
  ];
}