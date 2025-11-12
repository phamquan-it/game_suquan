// hooks/useScrollAnimation.ts
import { useState, useEffect } from 'react';

export const useScrollAnimation = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const elements = document.querySelectorAll('.fade-in-section');
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementBottom = element.getBoundingClientRect().bottom;
                const isVisible = elementTop < window.innerHeight && elementBottom >= 0;

                if (isVisible) {
                    element.classList.add('visible');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial state

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return isVisible;
};
