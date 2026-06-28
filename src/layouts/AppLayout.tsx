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
// import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth } from "../auth/useAuth";

const drawerWidth = 240;

// Menu items configuráveis
const menuItems = [
  { label: "Home", icon: <HomeIcon />, path: "/home", disabled: true },
  { label: "Tarefas", icon: <EventIcon />, path: "/tarefa" },
  // { label: "Calculos", icon: <PeopleIcon />, path: "/calculos" },

  // {
  //   label: "Documentos",
  //   icon: <PeopleIcon />,
  //   path: "/documentos",
  //   disabled: true,
  // },
  // {
  //   label: "Comunicacao",
  //   icon: <PeopleIcon />,
  //   path: "/comunicacao",
  //   disabled: true,
  // },
  // {
  //   label: "Qualidade",
  //   icon: <PeopleIcon />,
  //   path: "/profissionais",
  //   disabled: true,
  // },
  // { label: "Empreitadas", icon: <PeopleIcon />, path: "/empreitadas" },
  // {
  //   label: "Faturômetro",
  //   icon: <PeopleIcon />,
  //   path: "/profissionais",
  //   disabled: true,
  // },

  // { label: "Equipe", icon: <PeopleIcon />, path: "/equipe" },
  // { label: "Clientes", icon: <PeopleIcon />, path: "/cliente" },
  // {
  //   label: "Contratos",
  //   icon: <PeopleIcon />,
  //   path: "/profissionais",
  //   disabled: true,
  // },
  // { label: "Cartilhas", icon: <PeopleIcon />, path: "/profissionais" },
  // { label: "Empresas", icon: <PeopleIcon />, path: "/empresas" },
  // { label: "Colaboradores", icon: <PeopleIcon />, path: "/colaboradores" },
];

export default function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const usuario = localStorage.getItem("usuario");

  const menuItemStyle = {
    borderRadius: "12px",
    margin: "4px 10px",
    transition: "0.3s",

    "&:hover": {
      bgcolor: "rgba(48, 178, 228, 0.15)",
      color: "#fff",

      "& .MuiListItemIcon-root": {
        color: "#30B2E4",
      },
    },

    "&.Mui-selected": {
      bgcolor: "rgba(48, 178, 228, 0.18)",
      color: "#fff",

      "& .MuiListItemIcon-root": {
        color: "#30B2E4",
      },

      "&:hover": {
        bgcolor: "rgba(48, 178, 228, 0.25)",
      },

      // bolinha no final
      "&::after": {
        content: '""',
        position: "absolute",
        right: "12px",
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: "#30B2E4",
      },
    },
  };
  const handleMenu = () => {
    setOpen(!open);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "#0A1C30",
          color: "white",
          borderBottom: "1px solid #0A1C30",
          zIndex: 1201,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* LOGO + NOME */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              component="img"
              src="/images/argos-icone.jpeg"
              sx={{ height: 32 }}
            />

            <Typography fontWeight={700} fontSize={20}>
              <span style={{ color: "#30B2E4" }}>Argos</span>
              <span>AI</span>{" "}
              <span style={{ color: "#30B2E4" }}>Flow - Digitador</span>
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
            bgcolor: open ? "#fff" : "#30B2E4",
            color: open ? "#000" : "#fff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            "&:hover": {
              bgcolor: "#30B2E4",
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
            height: "calc(100vh - 64px)",
            backgroundColor: "#0A1C30",
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
                <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    ...(item.disabled ? { color: "#999" } : { color: "white" }),
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
                <LogoutIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText sx={{ color: "white" }} primary="Sair" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* CONTEÚDO */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "64px",
          height: "100%",
          overflowY: "hidden",
          overflowX: "hidden",
          p: 3,
          marginLeft: open ? `${drawerWidth}px` : 0,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
