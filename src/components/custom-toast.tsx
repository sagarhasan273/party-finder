import { Box, Stack, Button, keyframes, Typography } from "@mui/material";

const pulse = keyframes`
  0% { opacity: 0.4; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.4; transform: scale(0.8); }
`;

interface CustomToastProps {
  title: string;
  message: string;
  type?: "join" | "reject" | "info";
  lobbyId?: string;
  applicantName?: string;
  onActionClick?: () => void;
  actionLabel?: string;
}

export const CustomToast = ({
  title,
  message,
  type = "info",
  lobbyId,
  applicantName,
  onActionClick,
  actionLabel = "View",
}: CustomToastProps) => {
  const getIconColor = () => {
    switch (type) {
      case "join":
        return "#22c55e";
      case "reject":
        return "#FF4655";
      default:
        return "#FF4655";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "join":
        return "🎮";
      case "reject":
        return "❌";
      default:
        return "🔔";
    }
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{
        minWidth: 320,
        maxWidth: 420,
      }}
    >
      {/* Icon Box */}
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "4px",
          background: `${getIconColor()}14`,
          border: `1px solid ${getIconColor()}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          flexShrink: 0,
        }}
      >
        {getIcon()}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontFamily: '"Rajdhani", sans-serif',
            fontWeight: 700,
            fontSize: "0.85rem",
            letterSpacing: "0.08em",
            color: getIconColor(),
            mb: 0.5,
            textTransform: "uppercase",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontFamily: '"Rajdhani", sans-serif',
            fontSize: "0.75rem",
            color: "#edf0f4",
            opacity: 0.9,
            mb: 1,
          }}
        >
          {message}
        </Typography>

        {applicantName && (
          <Typography
            sx={{
              fontFamily: '"Rajdhani", sans-serif',
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            From: {applicantName}
          </Typography>
        )}

        {/* Action Button */}
        {onActionClick && (
          <Button
            size="small"
            onClick={onActionClick}
            sx={{
              mt: 1,
              fontFamily: '"Rajdhani", sans-serif',
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: getIconColor(),
              borderColor: `${getIconColor()}40`,
              "&:hover": {
                borderColor: getIconColor(),
                backgroundColor: `${getIconColor()}14`,
              },
            }}
            variant="outlined"
          >
            {actionLabel}
          </Button>
        )}
      </Box>

      {/* Pulse indicator */}
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: getIconColor(),
          animation: `${pulse} 1.5s ease-in-out infinite`,
          flexShrink: 0,
        }}
      />
    </Stack>
  );
};

export default CustomToast;
