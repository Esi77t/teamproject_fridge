import { Ingredient } from '@/types';
import Section from './Section';

interface RefrigeratorProps {
    items: Ingredient[];
}

const Refrigerator = ({ items }: RefrigeratorProps) => {
    const vegetableItems = items.filter((item) => item.category === 'vegetable');
    const meatItems = items.filter((item) => item.category === 'meat');
    const otherItems = items.filter((item) => item.category === 'other');

    return (
        <div className="bg-blue-100 p-4 rounded-lg shadow-inner border-2 border-blue-200">
            <h2 className="text-xl font-bold text-blue-800 mb-4 text-center">냉장실</h2>
            <div className="flex flex-col md:flex-row gap-2">
                <Section
                    sectionId="vegetable"
                    title="야채"
                    items={vegetableItems}
                />
                <Section
                    sectionId="meat"
                    title="육류"
                    items={meatItems}
                />
                <Section
                    sectionId="other"
                    title="기타"
                    items={otherItems}
                />
            </div>
        </div>
    );
};

export default Refrigerator;