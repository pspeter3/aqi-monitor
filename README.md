# aqi-monitor

Micro service for calculating AQI from Purple Air.

## API

The server provides a simple API which supports the following query params:

-   **key** Your Purple Air API Key.
-   **show** The Purple Air Sensor ID. Can be provided up to 5 times.
-   **lat** _(Optional)_ Latitude for interpolation.
-   **lon** _(Optional)_ Longitude for interpolation.
-   **pow** _(Optional)_ Power for interpolation. Higher numbers weigh prioritze closer sensors. Default is `1`.
