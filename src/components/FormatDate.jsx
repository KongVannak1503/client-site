// src/utils/dateUtils.js

// Function to format a date string
export const formatDate = (dateString) => {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };
    return new Date(dateString).toLocaleString('en-US', options);
};

// Function to get the current date
export const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US');
};

// Function to check if it's day or night based on current time
export const isDayTime = () => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18; // Daytime is between 6 AM and 6 PM
};

// Function to get the difference in days between two dates
export const getDaysDifference = (date1, date2) => {
    const diffTime = Math.abs(new Date(date2) - new Date(date1));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};