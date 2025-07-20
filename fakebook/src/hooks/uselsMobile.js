import { useState, useEffect } from 'react';

// Custom hook to check whether the given screen size is considered to be mobile
function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

    useEffect(() => {
        // Resize handler function that updates isMobile state
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        // Adding the event listener to window
        window.addEventListener('resize', handleResize);

        // Clean up code
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]); // Re-run if breakpoint value changes

    // Returns the current isMobile state
    return isMobile;
}

export default useIsMobile;