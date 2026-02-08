import { useFridge } from '@/contexts/FridgeContext';
import Refrigerator from './Refrigerator';
import Freezer from './Frezzer';
import { Button } from '../ui/button';

interface FridgeProps {
    isOpen: boolean;
    toggleFridge: () => void;
}

const Fridge = ({ isOpen, toggleFridge }: FridgeProps) => {
    const { ingredients } = useFridge();

    return (
        <div className="relative w-full max-w-4xl h-[700px] bg-amber-200 rounded-2xl overflow-hidden shadow-2xl">
            {/* 냉장고 문 (닫힌 상태) */}
            <div
                className={`absolute inset-0 bg-gradient-to-br from-amber-700 to-amber-900 rounded-2xl z-20 transform transition-transform duration-700 ease-in-out ${isOpen ? '-translate-x-full' : 'translate-x-0'
                    } flex items-center justify-center cursor-pointer border-r-8 border-amber-950`}
                onClick={toggleFridge}
            >
                <div className="text-center">
                    <span className="text-white text-4xl font-bold block mb-4">
                        우리집 냉장고
                    </span>
                    <span className="text-amber-200 text-lg">클릭해서 열어주세요 👉</span>
                </div>
                {/* 손잡이 */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-20 bg-amber-600 rounded-full shadow-inner"></div>
            </div>
            {/* 냉장고 내부 (열린 상태) */}
            <div className="absolute h-full inset-0 bg-gradient-to-br from-blue-50 to-blue-100 p-6 flex flex-col justify-between">
                {isOpen && (
                    <div className="w-full h-full flex flex-col justify-between">
                        <div className="flex-1 overflow-y-auto pb-4 space-y-4">
                            <Refrigerator items={ingredients} />
                            <Freezer items={ingredients} />
                        </div>
                        {/* 닫기 버튼 */}
                        <Button
                            onClick={toggleFridge}
                            variant="destructive"
                            className="w-full py-6 text-lg"
                        >
                            냉장고 닫기
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Fridge;