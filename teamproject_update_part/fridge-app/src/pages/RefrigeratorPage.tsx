import { useState } from 'react';
import { useFridge } from '@/contexts/FridgeContext';
import Fridge from '@/components/fridge/Fridge';
import Sidebar from '@/components/sidebar/Sidebar';

const RefrigeratorPage = () => {
    const { isLoading } = useFridge();
    const [isFridgeOpen, setIsFridgeOpen] = useState(false);

    const toggleFridge = () => setIsFridgeOpen(!isFridgeOpen);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-xl">
                    <p className="text-lg font-semibold text-gray-700">데이터를 로딩 중입니다...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
            <div className="flex w-full max-w-7xl h-[800px] bg-white rounded-2xl shadow-2xl overflow-hidden">
                <Sidebar />
                <main className="flex-1 p-8 flex items-center justify-center">
                    <Fridge isOpen={isFridgeOpen} toggleFridge={toggleFridge} />
                </main>
            </div>
        </div>
    );
};

export default RefrigeratorPage;