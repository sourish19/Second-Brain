import { useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';

const useScrollToHashSection = () => {
	const location = useLocation();

	useEffect(() => {
		let timerId: number;
		if (location.hash) {
			const scrollToElement = (hash: string, retries = 10) => {
				const ele = document.querySelector(hash);
				if (ele) {
					ele.scrollIntoView({ behavior: 'smooth' });
				} else if (retries > 0) {
					timerId = window.setTimeout(() => {
						scrollToElement(location.hash, retries - 1);
					}, 100);
				}
			};
			scrollToElement(location.hash);
		}
		return () => {
			clearTimeout(timerId);
		};
	}, [location.hash]);
};

export default useScrollToHashSection;
