import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth } from "../auth/useAuth";

const drawerWidth = 240;

// Menu items configuráveis
const menuItems = [
  { label: "Home", icon: <HomeIcon />, path: "/home" },
  { label: "Processos", icon: <EventIcon />, path: "/processo" },
  { label: "Calculos", icon: <PeopleIcon />, path: "/calculos" },

  {
    label: "Documentos",
    icon: <PeopleIcon />,
    path: "/documentos",
    disabled: true,
  },
  {
    label: "Comunicacao",
    icon: <PeopleIcon />,
    path: "/comunicacao",
    disabled: true,
  },
  {
    label: "Qualidade",
    icon: <PeopleIcon />,
    path: "/profissionais",
    disabled: true,
  },
  { label: "Empreitadas", icon: <PeopleIcon />, path: "/empreitadas" },
  {
    label: "Medicoes",
    icon: <PeopleIcon />,
    path: "/profissionais",
    disabled: true,
  },

  { label: "Equipe", icon: <PeopleIcon />, path: "/equipe" },
  { label: "Clientes", icon: <PeopleIcon />, path: "/cliente" },
  {
    label: "Contratos",
    icon: <PeopleIcon />,
    path: "/profissionais",
    disabled: true,
  },
  { label: "Cartilhas", icon: <PeopleIcon />, path: "/profissionais" },
  { label: "Empresas", icon: <PeopleIcon />, path: "/empresas" },
  { label: "Colaboradores", icon: <PeopleIcon />, path: "/colaboradores" },
];

export default function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const usuario = localStorage.getItem("usuario");

  const menuItemStyle = {
    "&:hover": {
      bgcolor: "#5c6cff",
      color: "#fff",
      "& .MuiListItemIcon-root": { color: "#fff" },
    },
    "&.Mui-selected": {
      bgcolor: "#5c6cff",
      color: "#fff",
      "& .MuiListItemIcon-root": { color: "#fff" },
      "&:hover": { bgcolor: "#5c6cff" },
    },
  };

  const handleMenu = () => {
    setOpen(!open);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* HEADER */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "#fff",
          color: "#1e293b",
          borderBottom: "1px solid #e5e7eb",
          zIndex: 1201,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* LOGO + NOME */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              component="img"
              src="/images/KolpyAI_Icone_App.png"
              sx={{ height: 32 }}
            />

            <Typography
              fontWeight={700}
              fontSize={20}
              sx={{ color: "#5c6cff" }}
            >
              LexCalc - Lider
            </Typography>
          </Box>

          {/* USUÁRIO */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Typography fontWeight={600}>{usuario || "Usuário"}</Typography>
            <Avatar
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/perfil")}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* BOTÃO MENU */}
      <Box
        sx={{
          position: "fixed",
          top: 72,
          left: open ? drawerWidth + 10 : 10,
          zIndex: 1300,
          transition: "left 0.3s",
        }}
      >
        <IconButton
          onClick={handleMenu}
          disableRipple
          sx={{
            bgcolor: open ? "#fff" : "#5c6cff",
            color: open ? "#000" : "#fff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            "&:hover": {
              bgcolor: "#5c6cff",
              color: "#fff",
            },
            "&:focus": {
              outline: "none",
            },

            "&:focus-visible": {
              outline: "none",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* MENU LATERAL */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            top: "64px",
            height: "calc(100% - 64px)",
            borderRight: "1px solid #e5e7eb",
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    navigate(item.path);
                  }
                }}
                sx={{
                  ...menuItemStyle,
                  ...(item.disabled && {
                    opacity: 0.5,
                    cursor: "not-allowed",
                  }),
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    ...(item.disabled && { color: "#999" }),
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}

          {/* Botão de logout */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                logout();
                navigate("/");
              }}
              sx={{ ...menuItemStyle, mt: 2 }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* CONTEÚDO */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 8,
          p: 3,
          transition: "margin 0.3s",
          marginLeft: open ? `${drawerWidth}px` : 0,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
