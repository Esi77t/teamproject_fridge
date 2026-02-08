import { useDroppable } from '@dnd-kit/core';
import { Ingredient, Category } from '@/types';
import Item from './Item';

interface SectionProps {
    sectionId: Category;
    title: string;
    items: Ingredient[];
}

const Section = ({ sectionId, title, items }: SectionProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: sectionId,
        data: {
            type: 'fridge-section',
            category: sectionId,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={`flex-1 min-h-[200px] border-2 rounded-lg p-2 m-1 transition-all duration-200 ${isOver
                    ? 'bg-blue-200 border-blue-400 ring-2 ring-blue-400'
                    : 'bg-blue-50 border-blue-300'
                } flex flex-wrap content-start items-start justify-center`}
        >
            <h3 className="w-full text-center text-sm font-semibold text-blue-800 mb-2">
                {title}
            </h3>

            {items.length === 0 ? (
                <p className="text-xs text-gray-400 text-center mt-8">
                    비어있음
                </p>
            ) : (
                items.map((item) => (
                    <Item key={item.id} item={item} />
                ))
            )}
        </div>
    );
};

export default Section;