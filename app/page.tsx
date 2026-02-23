"use client";

import { IconUserPlus, IconLogin } from "@tabler/icons-react";
import { Alert, Box, Button, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { tokens } from "./theme";
import { ImmersiveCard } from "./components/ImmersiveCard";
import { affFetch, setToken } from "./lib/api";

export default function AuthPage() {
    const router = useRouter();
    const [tab, setTab] = useState(0);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [referralCode, setReferralCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAuth = async () => {
        setLoading(true);
        setError("");
        try {
            if (tab === 0) {
                // Login
                const res = await affFetch<{ token: string }>("/auth/login", {
                    method: "POST",
                    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
                });
                setToken(res.token);
            } else {
                // Register
                const res = await affFetch<{ token: string }>("/auth/register", {
                    method: "POST",
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim().toLowerCase(),
                        password,
                        referral_code: referralCode.trim().toUpperCase() || undefined,
                    }),
                });
                setToken(res.token);
            }
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100dvh",
                display: "grid",
                placeItems: "center",
                px: 2,
                bgcolor: tokens.surface,
            }}
        >
            <ImmersiveCard noHover sx={{ width: "100%", maxWidth: 420, p: 3.5 }}>
                <Stack spacing={2.5}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            background: `linear-gradient(135deg, ${tokens.primary}, ${tokens.accent})`,
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Nikkahify Affiliates
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Earn commission by referring users to Nikkahify.
                    </Typography>

                    <Tabs
                        value={tab}
                        onChange={(_, v) => { setTab(v); setError(""); }}
                        sx={{
                            "& .MuiTab-root": { fontWeight: 600, textTransform: "none", fontSize: "0.875rem" },
                            "& .Mui-selected": { color: tokens.primary },
                            "& .MuiTabs-indicator": { backgroundColor: tokens.primary },
                        }}
                    >
                        <Tab label="Sign In" />
                        <Tab label="Register" />
                    </Tabs>

                    {error && <Alert severity="error">{error}</Alert>}

                    {tab === 1 && (
                        <TextField
                            label="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                        />
                    )}
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                    />
                    {tab === 1 && (
                        <TextField
                            label="Your Referral Code (e.g. AHMED)"
                            value={referralCode}
                            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                            helperText="Choose a unique code. Users will use this to sign up."
                            fullWidth
                        />
                    )}

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleAuth}
                        disabled={loading || !email || !password || (tab === 1 && !name)}
                        startIcon={tab === 0 ? <IconLogin size={18} /> : <IconUserPlus size={18} />}
                        sx={{ py: 1.3 }}
                    >
                        {loading ? "Please wait..." : tab === 0 ? "Sign In" : "Create Account"}
                    </Button>
                </Stack>
            </ImmersiveCard>
        </Box>
    );
}
