import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import userStore from "../stores/user.store";
import { useSaveActionsMutation } from "../slices/api/user.slice";
import { ActionType } from "../models/action";

const useActivityLogger = () => {
    const [saveActions] = useSaveActionsMutation()

    const [logs, setLogs] = useState<ActionType[]>([]);
    const location = useLocation(); //track route

    //scroll debouncer
    let scrollTimeout: NodeJS.Timeout | null = null;
    let isScrolling = false;

    //input debouncer
    let inputTimeout: NodeJS.Timeout | null = null;
    let lastInputValues: Record<string, string> = {}; // Track previous values of inputs

    // Function to log user actions
    const logAction = (action: string, type: string, newValue?: string) => {
        setLogs((prevLogs) => [
            ...prevLogs,
            {
                // userId: userStore.user?.id,
                action,
                type,
                newValue: newValue || null,
                url: window.location.pathname,
                timestamp: new Date().toISOString(),
            },
        ]);
    };

    // Handle Scroll Logging with Debounce
    const handleScroll = () => {
        if (!isScrolling) {
            isScrolling = true;
            logAction("scroll", "window", "begin");
        }

        if (scrollTimeout) clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            logAction("scroll", "window", "end");
        }, 500);
    };

    // Handle Input Logging with Debounce
    const handleInputChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const fieldId = target.name || target.id || "unknown-field"; // Unique identifier for the input field
        const newValue = target.value;
        const oldValue = lastInputValues[fieldId] || "";

        if (inputTimeout) clearTimeout(inputTimeout);

        inputTimeout = setTimeout(() => {
            if (newValue !== oldValue) {
                const actionType = newValue.length > oldValue.length ? "added value" : "removed value";
                logAction(actionType, "input", newValue);
                lastInputValues[fieldId] = newValue; // Update last known value
            }
        }, 500); // Wait 500ms after last keypress before logging
    };

    // Event listeners for clicks, scrolls, and inputs
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            logAction("click", target.tagName.toLowerCase());
        };

        document.addEventListener("click", handleClick);
        document.addEventListener("scroll", handleScroll, { passive: true });
        document.addEventListener("input", handleInputChange);

        return () => {
            document.removeEventListener("click", handleClick);
            document.removeEventListener("scroll", handleScroll);
            document.removeEventListener("input", handleInputChange);
        };
    }, []);


    // Send logs to the backend when the user navigates to a new page
    useEffect(() => {
        //do not log if user is admin
        if (logs.length > 0 && userStore.user?.role !== "admin") {
            console.log("Actions: ", logs)
            const response = saveActions({ actions: logs })
                .unwrap()
                .then(() => setLogs([])) // Clear logs after successful submission
                .catch(console.error);
        }
    }, [location.pathname]);

    return { logAction };
}

export default useActivityLogger