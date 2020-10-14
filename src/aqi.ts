const limits = [
    [0, 0],
    [12.0, 50],
    [35.4, 100],
    [55.4, 150],
    [150.4, 200],
    [250.4, 300],
    [500.4, 500],
];

export const calculateAQI = (particles: number, humidity: number): number => {
    const value = 0.534 * particles - 0.0844 * humidity + 5.604;
    for (const [index, [maxPM, maxAQI]] of limits.entries()) {
        if (value < maxPM) {
            const [minPM, minAQI] = limits[index - 1];
            return (
                ((maxAQI - minAQI) / (maxPM - minPM)) * (value - minPM) + minAQI
            );
        }
    }
    throw new Error(`Could not calculate AQI for ${value}`);
};
