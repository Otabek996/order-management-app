import * as React from "react";
import {
  createTheme,
  ThemeProvider,
  PaletteMode,
  styled,
} from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import ToggleColorMode from "./ToggleColorMode";
import getSignInTheme from "./theme/getSignInTheme";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderBottom: "1px solid",
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  boxShadow: "none",
  backgroundImage: "none",
  zIndex: theme.zIndex.drawer + 1,
  flex: "0 0 auto",
}));

interface TemplateFrameProps {
  showCustomTheme: boolean;
  toggleCustomTheme: (theme: boolean) => void;
  mode: PaletteMode;
  toggleColorMode: () => void;
  children: React.ReactNode;
}

export default function TemplateFrame({
  mode,
  toggleColorMode,
  children,
}: TemplateFrameProps) {

  const signInTheme = createTheme(getSignInTheme(mode));

  return (
    <ThemeProvider theme={signInTheme}>
      <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
        <StyledAppBar>
          <Toolbar
            variant="dense"
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              p: "8px 12px",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <ToggleColorMode
                data-screenshot="toggle-mode"
                mode={mode}
                toggleColorMode={toggleColorMode}
              />
            </Box>
          </Toolbar>
        </StyledAppBar>
        <Box sx={{ flex: "1 1", overflow: "auto" }}>{children}</Box>
      </Box>
    </ThemeProvider>
  );
}
