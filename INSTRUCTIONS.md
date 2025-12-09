# SubTrack AI - User Manual & Developer Guide

## Overview

SubTrack AI is a modern, client-side React application designed to help users manage recurring subscriptions, visualize spending habits, and receive AI-powered financial insights using the Gemini API.

## Features

*   **OAuth Simulation**: A mocked login flow demonstrating the UI for "Sign in with Google/GitHub".
*   **Onboarding Wizard**: A step-by-step guide to set user preferences and budget goals.
*   **Dashboard**: A comprehensive view of monthly spend, payment timelines, and active subscriptions.
*   **Gemini AI Integration**: Analyzes subscription data to provide actionable saving tips and warnings.
*   **Local Persistence**: All data is stored securely in your browser's LocalStorage.

## User Guide

1.  **Logging In**: Click "Log in" or "Get Started Free" on the landing page. Select a provider (Google/GitHub) to simulate a secure login.
2.  **Onboarding**: 
    *   Enter your **First Name** (used for personalized greetings).
    *   Set a **Monthly Budget Goal** (used to track spending progress).
3.  **Adding Subscriptions**: Click the "+" button to add a new service. Enter the name, cost, day of recurrence, and category.
4.  **AI Insights**: Click "Generate Insights" on the dashboard to have Gemini analyze your spending patterns.

## Developer & Deployment Guide

### Deployment to Vercel

This project is configured to use **Vite** for building.

1.  Push the code to your GitHub repository.
2.  Import the repository into **Vercel**.
3.  Vercel should automatically detect the `package.json` and set the Framework Preset to **Vite**.
4.  **Important**: In the Vercel Project Settings, go to **Environment Variables**.
5.  Add a new variable:
    *   **Key**: `API_KEY`
    *   **Value**: *Your Google Gemini API Key*
6.  Deploy.

### Project Structure

*   `package.json` & `vite.config.ts`: Configuration for building the app.
*   `App.tsx`: Main controller handling User State (Auth/Onboarding) and Dashboard rendering.
*   `components/LandingPage.tsx`: Marketing & Login UI.
*   `components/OnboardingTour.tsx`: User personalization wizard.
*   `services/geminiService.ts`: Integration with Google GenAI SDK.

### OAuth Implementation

Currently, the OAuth flow is **simulated** for demonstration purposes.

To implement **Real OAuth**:
1.  Integrate a library like Firebase Auth or Auth0.
2.  In `LandingPage.tsx`, replace the `handleAuth` timeout with the provider's sign-in method.
3.  Store the returned token securely.

### Environment Variables

The app requires a Gemini API key for AI features.
*   `API_KEY`: Set this in your environment (e.g., Vercel Dashboard) to enable `geminiService.ts`.

## Privacy

This application is "Local First". No data is sent to any server (except the anonymous subscription text sent to Gemini API for analysis if explicitly requested).