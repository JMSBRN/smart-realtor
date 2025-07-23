"use client";

import { useState, useEffect } from "react";
import Chat from "@/components/Chat";
import { Apartment } from "@/types/apartment";

export default function Page() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loadingApartments, setLoadingApartments] = useState(true);
  const [errorApartments, setErrorApartments] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string | null>(null);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await fetch("/api/apartments");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setApartments(result.data);
        setDataSource(result.from);
      } catch (error: any) {
        setErrorApartments(error.message);
      } finally {
        setLoadingApartments(false);
      }
    };

    fetchApartments();
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-md py-6 text-center">
        <h1 className="text-5xl font-bold text-gray-800">Smart Realtor Assistant</h1>
        <p className="mt-4 text-xl text-gray-600">Your AI-powered guide to finding the perfect home.</p>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <section className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">Find Your Dream Home with Ease</h2>
          <p className="text-lg text-gray-600">
            Our intelligent assistant will guide you through the process, understanding your needs and
            connecting you with the best properties available.
          </p>
          <button
            onClick={toggleChat}
            className="mt-6 px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Start Chat
          </button>
        </section>

        <section className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full mb-12">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6 text-center">Available Apartments</h2>
          {loadingApartments ? (
            <p className="text-center text-gray-600">Loading apartments...</p>
          ) : errorApartments ? (
            <p className="text-center text-red-600">Error loading apartments: {errorApartments}</p>
          ) : (
            <div className="text-center">
              <p className="text-lg text-gray-800 font-medium">
                Currently, we have <span className="text-blue-600 font-bold">{apartments.length}</span> apartments in our database.
              </p>
              {dataSource && (
                <p className="text-sm text-gray-500 mt-2">
                  Data is currently being served from: <span className="font-semibold text-gray-700">{dataSource === 'cache' ? 'Redis Cache' : 'Firebase'}</span>
                </p>
              )}
            </div>
          )}
        </section>

        <section className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6 text-center">Our Technology</h2>
          <div className="text-lg text-gray-600 space-y-4">
            <p>
              Our Smart Realtor Assistant leverages cutting-edge AI to understand your unique housing needs.
              We use a robust backend system, powered by Firebase, to store and manage a comprehensive database
              of available apartments. To ensure rapid response times and efficient data delivery, we implement
              advanced caching mechanisms, primarily using <span className="font-semibold text-gray-800">Redis</span>.
            </p>
            <p>
              This hybrid approach allows us to provide you with the most up-to-date apartment listings while
              maintaining a lightning-fast user experience. Whether you're looking for a cozy studio or a spacious family home,
              our technology is designed to make your search seamless and productive.
            </p>
          </div>
        </section>

        {/* Chat Modal */}
        {isChatOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl relative w-11/12 max-w-lg max-h-[90vh] overflow-auto">
              <button
                onClick={toggleChat}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
              >
                &times;
              </button>
              <Chat />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-6 text-center mt-12">
        <p>&copy; 2023 Smart Realtor. All rights reserved.</p>
        <p className="mt-2 text-sm">Powered by AI and modern web technologies.</p>
      </footer>
    </div>
  );
}
