"use client";
import { Box, type SxProps, type Theme } from "@mui/material";
import { tokens, radii, timing } from "../theme";

interface ImmersiveCardProps {
    children: React.ReactNode;
    glass?: boolean;
    noHover?: boolean;
    sx?: SxProps<Theme>;
    onClick?: () => void;
}

export function ImmersiveCard({ children, glass, noHover, sx, onClick }: ImmersiveCardProps) {
    return (
        <Box
            onClick={onClick}
            sx={{
                backgroundColor: glass ? "rgba(26,26,26,0.75)" : tokens.card,
                backdropFilter: glass ? "blur(20px)" : "none",
                borderRadius: `${radii.card}px`,
                border: `1px solid ${tokens.divider}`,
                overflow: "hidden",
                transition: `transform ${timing.duration} ${timing.standard}, box-shadow ${timing.duration} ${timing.standard}`,
                cursor: onClick ? "pointer" : "default",
                ...(!noHover && onClick
                    ? {
                        "&:hover": { transform: "scale(1.01)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" },
                        "&:active": { transform: "scale(0.99)" },
                    }
                    : {}),
                ...sx,
            }}
        >
            {children}
        </Box>
    );
}
