"use client";

import {
    IconCopy,
    IconCheck,
    IconCurrencyPound,
    IconClick,
    IconUsers,
    IconPercentage,
    IconLogout,
    IconTrendingUp,
    IconCash,
} from "@tabler/icons-react";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { tokens, radii } from "../theme";
import { ImmersiveCard } from "../components/ImmersiveCard";
import { affFetch, getToken, clearToken } from "../lib/api";

const TRACK_BASE = process.env.NEXT_PUBLIC_AFFILIATE_API_URL ?? "http://localhost:8085";

interface DashboardData {
    stats: {
        total_clicks: number;
        total_signups: number;
        total_earnings_pence: number;
        total_paid_pence: number;
        pending_pence: number;
        conversion_rate: number;
        last_30_days_clicks: number;
        last_30_days_signups: number;
    };
    affiliate: {
        id: string;
        name: string;
        email: string;
        referral_code: string;
        commission_rate: number;
    };
}

interface Conversion {
    id: string;
    event_type: string;
    amount_pence: number;
    commission_pence: number;
    status: string;
    created_at: string;
}

interface Payout {
    id: string;
    amount_pence: number;
    method: string;
    status: string;
    created_at: string;
}

function formatPence(pence: number): string {
    return `£${(pence / 100).toFixed(2)}`;
}

export default function DashboardPage() {
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!getToken()) router.replace("/");
    }, [router]);

    const { data, isLoading, error } = useQuery({
        queryKey: ["dashboard"],
        queryFn: () => affFetch<DashboardData>("/dashboard"),
        enabled: !!getToken(),
        staleTime: 15_000,
    });

    const { data: conversionsData } = useQuery({
        queryKey: ["conversions"],
        queryFn: () => affFetch<{ items: Conversion[] }>("/conversions?limit=20"),
        enabled: !!getToken(),
        staleTime: 30_000,
    });

    const { data: payoutsData } = useQuery({
        queryKey: ["payouts"],
        queryFn: () => affFetch<{ items: Payout[] }>("/payouts?limit=20"),
        enabled: !!getToken(),
        staleTime: 30_000,
    });

    const logout = () => {
        clearToken();
        router.replace("/");
    };

    const copyLink = () => {
        if (!data) return;
        navigator.clipboard.writeText(`${TRACK_BASE}/track/${data.affiliate.referral_code}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center", bgcolor: tokens.surface }}>
                <CircularProgress sx={{ color: tokens.primary }} />
            </Box>
        );
    }

    if (error || !data) {
        return (
            <Box sx={{ maxWidth: 600, mx: "auto", px: 2, py: 6 }}>
                <Alert severity="error">Failed to load dashboard. Please sign in again.</Alert>
                <Button sx={{ mt: 2 }} onClick={logout}>Sign In</Button>
            </Box>
        );
    }

    const { stats, affiliate } = data;
    const conversions = conversionsData?.items ?? [];
    const payouts = payoutsData?.items ?? [];

    const statCards = [
        { label: "Total Clicks", value: stats.total_clicks, icon: <IconClick size={20} />, sub: `${stats.last_30_days_clicks} last 30d` },
        { label: "Total Signups", value: stats.total_signups, icon: <IconUsers size={20} />, sub: `${stats.last_30_days_signups} last 30d` },
        { label: "Conversion Rate", value: `${stats.conversion_rate.toFixed(1)}%`, icon: <IconPercentage size={20} />, sub: "clicks → signups" },
        { label: "Total Earned", value: formatPence(stats.total_earnings_pence), icon: <IconTrendingUp size={20} />, sub: `${affiliate.commission_rate}% commission` },
        { label: "Paid Out", value: formatPence(stats.total_paid_pence), icon: <IconCash size={20} />, sub: "completed" },
        { label: "Pending", value: formatPence(stats.pending_pence), icon: <IconCurrencyPound size={20} />, sub: "awaiting payout" },
    ];

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", px: 2, py: 3, pb: 6 }}>
            {/* ── Header ── */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        Hey, {affiliate.name.split(" ")[0]} 👋
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {affiliate.email}
                    </Typography>
                </Box>
                <Tooltip title="Sign out">
                    <IconButton onClick={logout} sx={{ color: tokens.textSecondary }}>
                        <IconLogout size={20} />
                    </IconButton>
                </Tooltip>
            </Stack>

            {/* ── Referral Link ── */}
            <ImmersiveCard noHover sx={{ p: 2.5, mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Your Referral Link
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                fontFamily: "monospace",
                                fontSize: "0.8125rem",
                                color: tokens.primaryLight,
                                wordBreak: "break-all",
                            }}
                        >
                            {TRACK_BASE}/track/{affiliate.referral_code}
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                        onClick={copyLink}
                        sx={{ ml: 2, whiteSpace: "nowrap", minWidth: 100 }}
                    >
                        {copied ? "Copied!" : "Copy"}
                    </Button>
                </Stack>
                <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                    Code: <strong>{affiliate.referral_code}</strong> · Commission: <strong>{affiliate.commission_rate}%</strong>
                </Typography>
            </ImmersiveCard>

            {/* ── Stat Grid ── */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr" },
                    gap: 1.5,
                    mb: 3,
                }}
            >
                {statCards.map((s) => (
                    <ImmersiveCard key={s.label} noHover sx={{ p: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Box sx={{ color: tokens.primary, opacity: 0.7 }}>{s.icon}</Box>
                            <Typography variant="caption" color="text.secondary">
                                {s.label}
                            </Typography>
                        </Stack>
                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.25 }}>
                            {s.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {s.sub}
                        </Typography>
                    </ImmersiveCard>
                ))}
            </Box>

            {/* ── Conversions Table ── */}
            <Typography variant="h6" sx={{ mb: 1.5 }}>
                Recent Conversions
            </Typography>
            <ImmersiveCard noHover sx={{ mb: 3, overflow: "auto" }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: tokens.textSecondary, fontWeight: 600, fontSize: "0.75rem" }}>Type</TableCell>
                                <TableCell sx={{ color: tokens.textSecondary, fontWeight: 600, fontSize: "0.75rem" }}>Amount</TableCell>
                                <TableCell sx={{ color: tokens.textSecondary, fontWeight: 600, fontSize: "0.75rem" }}>Commission</TableCell>
                                <TableCell sx={{ color: tokens.textSecondary, fontWeight: 600, fontSize: "0.75rem" }}>Status</TableCell>
                                <TableCell sx={{ color: tokens.textSecondary, fontWeight: 600, fontSize: "0.75rem" }}>Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {conversions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ textAlign: "center", py: 3, color: tokens.textSecondary }}>
                                        No conversions yet. Share your referral link to get started!
                                    </TableCell>
                                </TableRow>
                            )}
                            {conversions.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell>
                                        <Chip
                                            label={c.event_type}
                                            size="small"
                                            color={c.event_type === "PAYMENT" ? "primary" : "default"}
                                            sx={{ fontSize: "0.6875rem" }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontSize: "0.8125rem" }}>
                                        {c.amount_pence > 0 ? formatPence(c.amount_pence) : "—"}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: "0.8125rem", color: tokens.primaryLight, fontWeight: 600 }}>
                                        {c.commission_pence > 0 ? formatPence(c.commission_pence) : "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={c.status}
                                            size="small"
                                            color={c.status === "APPROVED" ? "primary" : c.status === "PENDING" ? "secondary" : "default"}
                                            sx={{ fontSize: "0.6875rem" }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontSize: "0.75rem", color: tokens.textSecondary }}>
                                        {new Date(c.created_at).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ImmersiveCard>

            {/* ── Payouts Table ── */}
            <Typography variant="h6" sx={{ mb: 1.5 }}>
                Payout History
            </Typography>
            <ImmersiveCard noHover sx={{ overflow: "auto" }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: tokens.textSecondary, fontWeight: 600, fontSize: "0.75rem" }}>Amount</TableCell>
                                <TableCell sx={{ color: tokens.textSecondary, fontWeight: 600, fontSize: "0.75rem" }}>Method</TableCell>
                                <TableCell sx={{ color: tokens.textSecondary, fontWeight: 600, fontSize: "0.75rem" }}>Status</TableCell>
                                <TableCell sx={{ color: tokens.textSecondary, fontWeight: 600, fontSize: "0.75rem" }}>Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payouts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} sx={{ textAlign: "center", py: 3, color: tokens.textSecondary }}>
                                        No payouts yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {payouts.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell sx={{ fontSize: "0.875rem", fontWeight: 600, color: tokens.primaryLight }}>
                                        {formatPence(p.amount_pence)}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: "0.8125rem" }}>{p.method}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={p.status}
                                            size="small"
                                            color={p.status === "COMPLETED" ? "primary" : "default"}
                                            sx={{ fontSize: "0.6875rem" }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontSize: "0.75rem", color: tokens.textSecondary }}>
                                        {new Date(p.created_at).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ImmersiveCard>
        </Box>
    );
}
