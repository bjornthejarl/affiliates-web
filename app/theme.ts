"use client";

import { createTheme } from "@mui/material/styles";

export const tokens = {
    primary: "#0D9373",
    primaryDark: "#0A7A60",
    primaryLight: "#11B48D",
    accent: "#D4A843",
    accentDark: "#B8922E",
    accentLight: "#E0BD6A",
    surface: "#111111",
    card: "#1A1A1A",
    elevated: "#242424",
    textPrimary: "#F5F5F5",
    textSecondary: "#9E9E9E",
    divider: "rgba(255,255,255,0.06)",
    danger: "#E53935",
    dangerDark: "#C62828",
} as const;

export const radii = {
    card: 16,
    button: 12,
    pill: 24,
    circle: 9999,
} as const;

export const timing = {
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    duration: "200ms",
} as const;

export const appTheme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: tokens.primary, dark: tokens.primaryDark, light: tokens.primaryLight, contrastText: "#FFFFFF" },
        secondary: { main: tokens.accent, dark: tokens.accentDark, light: tokens.accentLight, contrastText: "#111111" },
        background: { default: tokens.surface, paper: tokens.card },
        text: { primary: tokens.textPrimary, secondary: tokens.textSecondary },
        divider: tokens.divider,
        error: { main: tokens.danger, dark: tokens.dangerDark },
    },
    shape: { borderRadius: radii.button },
    typography: {
        fontFamily: "var(--font-inter), 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        h3: { fontWeight: 700, letterSpacing: "-0.02em", fontSize: "2rem" },
        h4: { fontWeight: 700, letterSpacing: "-0.02em", fontSize: "1.5rem" },
        h5: { fontWeight: 700, fontSize: "1.25rem" },
        h6: { fontWeight: 700, fontSize: "1.125rem" },
        subtitle1: { fontWeight: 600, fontSize: "0.9375rem" },
        subtitle2: { fontWeight: 600, fontSize: "0.8125rem" },
        body1: { fontWeight: 500, fontSize: "0.9375rem", lineHeight: 1.6 },
        body2: { fontWeight: 400, fontSize: "0.8125rem", lineHeight: 1.5 },
        button: { textTransform: "none" as const, fontWeight: 600, fontSize: "0.9375rem" },
        caption: { fontSize: "0.75rem", color: tokens.textSecondary },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "*, *::before, *::after": { boxSizing: "border-box" },
                html: { WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale", scrollBehavior: "smooth" },
                body: { backgroundColor: tokens.surface, color: tokens.textPrimary, overscrollBehavior: "none" },
            },
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: { borderRadius: radii.button, padding: "10px 20px", transition: `all ${timing.duration} ${timing.standard}` },
                containedPrimary: { backgroundColor: tokens.primary, "&:hover": { backgroundColor: tokens.primaryLight }, "&:active": { transform: "scale(0.98)" } },
                outlined: { borderColor: tokens.divider, "&:hover": { borderColor: tokens.primary, backgroundColor: "rgba(13,147,115,0.08)" } },
            },
        },
        MuiTextField: {
            defaultProps: { variant: "outlined", size: "small" },
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: radii.button,
                        backgroundColor: tokens.elevated,
                        "& fieldset": { borderColor: tokens.divider },
                        "&:hover fieldset": { borderColor: "rgba(255,255,255,0.12)" },
                        "&.Mui-focused fieldset": { borderColor: tokens.primary },
                    },
                },
            },
        },
        MuiPaper: { styleOverrides: { root: { backgroundImage: "none", border: "none" } } },
        MuiChip: {
            styleOverrides: {
                root: { borderRadius: radii.pill, fontWeight: 500, fontSize: "0.75rem", backdropFilter: "blur(8px)", backgroundColor: "rgba(255,255,255,0.08)", border: `1px solid ${tokens.divider}`, color: tokens.textPrimary },
                colorPrimary: { backgroundColor: "rgba(13,147,115,0.15)", border: "1px solid rgba(13,147,115,0.3)", color: tokens.primaryLight },
                colorSecondary: { backgroundColor: "rgba(212,168,67,0.15)", border: "1px solid rgba(212,168,67,0.3)", color: tokens.accentLight },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: { borderRadius: radii.button, fontSize: "0.8125rem" },
                standardInfo: { backgroundColor: "rgba(13,147,115,0.1)", color: tokens.primaryLight, border: "1px solid rgba(13,147,115,0.2)" },
                standardError: { backgroundColor: "rgba(229,57,53,0.1)", color: "#EF9A9A", border: "1px solid rgba(229,57,53,0.2)" },
            },
        },
    },
});
