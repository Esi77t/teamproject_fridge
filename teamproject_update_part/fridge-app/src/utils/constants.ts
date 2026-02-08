import { Category } from "@/types";

// 카테고리별 이모지
export const getCategoryEmoji = (category: Category): string => {
    const emojiMap: Record<Category, string> = {
        vegetable: '🥬',
        meat: '🥩',
        freezer: '❄️',
        other: '🍱',
    };
    return emojiMap[category] || '📦';
};

// 카테고리 한글 표시명
export const getCategoryTitle = (category: Category): string => {
    const titleMap: Record<Category, string> = {
        vegetable: '야채',
        meat: '육류',
        freezer: '냉동',
        other: '기타',
    };
    return titleMap[category] || '기타';
};

// 날짜 포맷팅
export const formatDate = (dateString?: string): string => {
    if (!dateString) return '날짜 정보 없음';
    return new Date(dateString).toLocaleDateString('ko-KR');
};

// D-day 계산
export const calculateDaysLeft = (expirationDate?: string): number | null => {
    if (!expirationDate) return null;

    const today = new Date();
    const expiration = new Date(expirationDate);
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

// D-day 텍스트 생성
export const getDaysLeftText = (daysLeft?: number | null): string => {
    if (daysLeft === null || daysLeft === undefined) return '';

    if (daysLeft < 0) return `유통기한 ${Math.abs(daysLeft)}일 경과`;
    if (daysLeft === 0) return '오늘 만료';
    if (daysLeft <= 3) return `D-${daysLeft}`;
    return `${daysLeft}일 남음`;
};

// 유통기한 상태별 색상
export const getExpirationColor = (daysLeft?: number | null): string => {
    if (daysLeft === null || daysLeft === undefined) return 'text-gray-500';

    if (daysLeft < 0) return 'text-red-600 font-bold';
    if (daysLeft === 0) return 'text-red-500 font-bold';
    if (daysLeft <= 3) return 'text-orange-500 font-semibold';
    if (daysLeft <= 7) return 'text-yellow-600';
    return 'text-green-600';
};