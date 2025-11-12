// hooks/useStoryTimeline.ts
import { useState, useEffect } from 'react';

export const useStoryTimeline = () => {
    const [currentChapter, setCurrentChapter] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const chapters = document.querySelectorAll('.story-chapter');
            const scrollPosition = window.scrollY + window.innerHeight / 2;

            chapters.forEach((chapter, index) => {
                const chapterTop = (chapter as HTMLElement).offsetTop;
                const chapterHeight = (chapter as HTMLElement).offsetHeight;

                if (scrollPosition >= chapterTop && scrollPosition < chapterTop + chapterHeight) {
                    setCurrentChapter(index);
                    const chapterProgress = ((scrollPosition - chapterTop) / chapterHeight) * 100;
                    setProgress(Math.min(100, Math.max(0, chapterProgress)));
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return { currentChapter, progress };
};
