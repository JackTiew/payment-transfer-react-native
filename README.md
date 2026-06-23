# Payment Transfer React Native

A cross-platform digital banking demo app built with Expo and React Native. Users can fund their account, transfer money, view transactions, pick recipients from contacts, and confirm sensitive actions with biometric authentication.

## Project Structure

```
payment-transfer-react-native/
├── app/                              # Screens (Expo Router file-based routing)
│   ├── _layout.tsx                   # Root layout, theme provider, toast
│   ├── index.tsx                     # Home screen (composes homepage components)
│   ├── settings.tsx                  # App settings (theme toggle)
│   ├── transactions.tsx              # Transaction history
│   ├── success.tsx                   # Success screen after reload/transfer
│   ├── fund-in/
│   │   ├── _layout.tsx
│   │   ├── index.tsx                 # Reload amount entry (keypad)
│   │   └── confirm.tsx               # Confirm reload + biometric auth
│   └── transfer/
│       ├── _layout.tsx
│       ├── index.tsx                 # Transfer hub (recent + contacts)
│       ├── new.tsx                   # New transfer form
│       ├── amount.tsx                # Transfer amount entry
│       ├── details.tsx               # Recipient reference & payment details
│       └── confirm.tsx               # Confirm transfer + biometric auth
│
├── components/
│   ├── common/                       # Shared UI used across flows
│   │   ├── AmountKeypad.tsx          # Cent-based amount input
│   │   ├── AppToast.tsx              # Toast notification wrapper
│   │   ├── Button.tsx
│   │   └── ScreenHeader.tsx
│   └── homepage/                     # Home screen sections
│       ├── HomeHeader.tsx            # Avatar and greeting
│       ├── AccountSection.tsx        # Account card and balance toggle
│       ├── QuickActionsSection.tsx   # Fund In, Transfer, etc.
│       └── TestingSection.tsx        # Reset local data (testing)
│
├── constants/
│   ├── banks.ts                      # Supported bank list
│   ├── recentTransfers.ts            # Mock recent transfer seed data
│   ├── theme.ts                      # Color palettes and spacing tokens
│   └── types.ts                      # Shared types and storage keys
│
├── contexts/
│   └── ThemeContext.tsx              # Light/dark theme state
│
├── services/                         # Business logic and device integrations
│   ├── BiometricAuth.ts              # Face ID / Touch ID / fingerprint / fallback
│   ├── Contacts.ts                   # Contact list and native picker
│   ├── Transaction.tsx               # Reload, transfer, transactions storage
│   └── User.tsx                      # User profile and balance
│
├── utils/
│   └── common.ts                     # Formatting, notifications, route helpers
│
├── styles/
│   └── global.ts                     # Global style utilities
│
├── assets/images/                    # App icons and splash assets
├── app.json                          # Expo configuration
├── eas.json                          # EAS Build profiles
├── package.json
└── tsconfig.json
```

### Layer Overview

| Layer         | Role                                        |
| ------------- | ------------------------------------------- |
| `app/`        | Route screens and navigation flow           |
| `components/` | Reusable and feature-specific UI            |
| `services/`   | Data persistence, transactions, device APIs |
| `constants/`  | Static config, types, and design tokens     |
| `contexts/`   | App-wide UI state (theme)                   |
| `utils/`      | Pure helpers shared across the app          |

## Workflows

### Fund In (Reload)

Adds funds to the user's local account balance.

**Steps**

1. **Amount entry** (`/fund-in`) — User enters reload amount via `AmountKeypad`.
2. **Confirm** (`/fund-in/confirm`) — User reviews the amount and taps **Confirm Reload**.
3. **Authentication** — `requireAuthentication()` prompts for biometrics, device passcode, or a manual confirm fallback (web).
4. **Process** — `reload()` in `services/Transaction.tsx`:
    - Validates amount > 0
    - Creates a **Fund In** transaction (positive amount)
    - Persists to AsyncStorage
    - Updates user balance
5. **Success** (`/success`) — Shows transaction summary, then user returns home.

---

### Transfer

Sends money to a recipient and deducts from the user's balance.

**Steps**

1. **Transfer hub** (`/transfer`) — User can:
    - Start a **New Transfer**
    - Pick a **Recent** recipient (skips to amount)
    - Pick from **Contacts** (opens new transfer with name pre-filled)
2. **New transfer** (`/transfer/new`) — User selects bank, enters account number and recipient name. Optional contact picker fills the name.
3. **Amount** (`/transfer/amount`) — User enters transfer amount via `AmountKeypad`.
4. **Details** (`/transfer/details`) — User enters recipient reference (required) and payment details (optional).
5. **Confirm** (`/transfer/confirm`) — User reviews bank, account, recipient, amount, and references, then taps **Approve**.
6. **Authentication** — Same biometric flow as fund-in.
7. **Process** — `transfer()` in `services/Transaction.tsx`:
    - Validates amount and sufficient balance
    - Creates a **Transfer to {name}** transaction (negative amount)
    - Persists to AsyncStorage
    - Updates user balance
    - Updates recent transfers list (max 5)
8. **Success** (`/success`) — Shows full transfer summary, then user returns home.

---

### Data Storage

All data is stored locally via AsyncStorage:

| Key                 | Content                       |
| ------------------- | ----------------------------- |
| `@user`             | Name, account number, balance |
| `@transactions`     | Full transaction history      |
| `@recent_transfers` | Last 5 transfer recipients    |

Use **Reset Data** on the home screen to clear all stored data during testing.

## Tech Stack & Versions

### Core

| Library      | Version    |
| ------------ | ---------- |
| Expo SDK     | `~54.0.34` |
| React        | `19.1.0`   |
| React Native | `0.81.5`   |
| TypeScript   | `~5.9.2`   |
| Expo Router  | `~6.0.23`  |

### Notable Dependencies

| Library                                   | Version    | Purpose                   |
| ----------------------------------------- | ---------- | ------------------------- |
| expo-local-authentication                 | `~17.0.8`  | Biometric / passcode auth |
| expo-contacts                             | `~15.0.11` | Contact list and picker   |
| expo-dev-client                           | `~6.0.21`  | Development builds        |
| @react-native-async-storage/async-storage | `^2.2.0`   | Local persistence         |
| react-native-toast-message                | `^2.3.3`   | In-app notifications      |

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (included with Node.js)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) via `npx expo`
- For native builds:
    - **iOS:** macOS with Xcode (simulator or device)
    - **Android:** Android Studio with an emulator or physical device

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm start
```

Or run a specific platform:

```bash
npm run web       # Web browser
npm run android   # Android (development build)
npm run ios       # iOS (development build)
```

### 3. Lint the project

```bash
npm run lint
```

### Native Features Notes

| Feature                                           | iOS / Android                                                                                  | Web                    |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------- |
| Biometric auth (Face ID / Touch ID / fingerprint) | `expo-local-authentication`                                                                    | Browser confirm dialog |
| Contact picker                                    | `expo-contacts`                                                                                | Not available          |
| Face ID in Expo Go                                | Requires a [development build](https://docs.expo.dev/develop/development-builds/introduction/) | —                      |

For full biometric and contacts support, use a development build:

```bash
npx expo run:ios
npx expo run:android
```

Or build with EAS:

```bash
npx eas build --profile development --platform ios
npx eas build --profile development --platform android
```

## Scripts

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `npm start`       | Start Expo development server |
| `npm run web`     | Start for web                 |
| `npm run ios`     | Run on iOS (native build)     |
| `npm run android` | Run on Android (native build) |
| `npm run lint`    | Run ESLint                    |

## Documentation

- [Expo SDK 54 docs](https://docs.expo.dev/versions/v54.0.0/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
