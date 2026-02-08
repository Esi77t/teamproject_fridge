import { Ingredient } from '@/types';
import Section from './Section';

interface FreezerProps {
    items: Ingredient[];
}

const Freezer = ({ items }: FreezerProps) => {
    const freezerItems = items.filter((item) => item.category === 'freezer');

    return (
        <div className="bg-blue-200 p-4 rounded-lg shadow-inner border-2 border-indigo-300">
            <h2 className="text-xl font-bold text-indigo-800 mb-4 text-center">냉동실</h2>
            <div className="flex">
                <Section
                    sectionId="freezer"
                    title="냉동"
                    items={freezerItems}
                />
            </div>
        </div>
    );
};

export default Freezer;