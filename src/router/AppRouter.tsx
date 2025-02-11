import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useCheckAuth } from "../hooks/index";
import { CheckingAuth } from "../ui/components/auth/CheckingAuth";
import {
  LoginPage,
  DashboardLayout,
  HomePage,
  HomeMachinery,
  FormMachinery,
  ListMachinery,
  HomeField,
  FormField,
  ListField,
  MapField,
  SeedMapRegister,
  HomeRegister,
  HomeLot,
  ListLot,
  FormLot,
  ListCrop,
  HomeCrop,
  FormCrop,
  MapLot,
  RAF,
  GeneralLabor,
  ListOfCrops,
  DetailsCost,
} from "../features/index";
import { MenuRoute } from "../interfaces";

// Rutas del menú
export const menuRoutes: MenuRoute[] = [
  {
    to: "/home",
    icon: "fa-solid fa-home",
    title: "Inicio",
    description: "Inicio",
    component: <HomePage />,
    visible: true,
  },
  {
    to: "/machinery",
    icon: "fa-solid fa-car",
    title: "Maquinaria",
    description: "Maquinaria",
    component: <HomeMachinery />,
    visible: true,
    subMenu: [
      {
        to: "/machinery/create",
        title: "Crear maquinaria",
        description: "Formulario para crear maquinaria",
        component: <FormMachinery />,
        visible: true,
      },
      {
        to: "/machinery/edit/:code", // Add edit route
        title: "Editar maquinaria",
        description: "Formulario para editar maquinaria",
        component: <FormMachinery />,
        visible: false,
      },
      {
        to: "/machinery/list",
        title: "Listar maquinaria",
        description: "Listado de maquinaria",
        component: <ListMachinery />,
        visible: true,
      },
    ],
  },
  {
    to: "/field",
    icon: "fa-solid fa-wheat-awn",
    title: "Campo",
    description: "Campo",
    component: <HomeField />,
    visible: true,
    subMenu: [
      {
        to: "/field/create",
        title: "Crear campo",
        description: "Formulario para crear campo",
        component: <FormField />,
        visible: true,
      },
      {
        to: "/field/edit/:code",
        title: "Editar campo",
        description: "Formulario para editar campo",
        component: <FormField />,
        visible: false,
      },
      {
        to: "/field/list",
        title: "Listar campo",
        description: "Listado de campo",
        component: <ListField />,
        visible: true,
      },
      {
        to: "/field/map",
        title: "Mapa de campo",
        description: "Mapa de campo",
        component: <MapField />,
        visible: true,
      },
    ],
  },
  {
    to: "/lot",
    icon: "fa-solid fa-mountain-sun",
    title: "Lotes",
    description: "Lotes",
    component: <HomeLot />,
    visible: true,
    subMenu: [
      {
        to: "/lot/create",
        title: "Crear lote",
        description: "Formulario para crear lote",
        component: <FormLot />,
        visible: true,
      },
      {
        to: "/lot/list",
        title: "Listar lotes",
        description: "Listado de lotes",
        component: <ListLot />,
        visible: true,
      },
      {
        to: "/lot/map",
        title: "Mapa de lote",
        description: "Mapa de lote",
        component: <MapLot />,
        visible: true,
      },
      {
        to: "/lot/edit/:code",
        title: "Editar lote",
        description: "Formulario para editar lote",
        component: <FormLot />,
        visible: false,
      },
    ],
  },
  {
    to: "/crop",
    icon: "fa-solid fa-seedling",
    title: "Cultivos",
    description: "Cultivos",
    component: <HomeCrop />,
    visible: true,
    subMenu: [
      {
        to: "/crop/create",
        title: "Crear cultivo",
        description: "Formulario para crear cultivo",
        component: <FormCrop />,
        visible: true,
      },
      {
        to: "/crop/edit/:code", // Simplified route pattern
        title: "Editar cultivo",
        description: "Formulario para editar cultivo",
        component: <FormCrop />,
        visible: false,
      },

      {
        to: "/crop/list",
        title: "Listar cultivos",
        description: "Listado de cultivos",
        component: <ListCrop />,
        visible: true,
      },
    ],
  },
  {
    to: "/registers",
    icon: "fa-solid fa-sheet-plastic",
    title: "Registros",
    description: "Registros",
    component: <HomeRegister />,
    visible: true,
    subMenu: [
      {
        to: "/registers/seed-map",
        title: "Mapa de siembra",
        description: "Mapa de siembra",
        component: <SeedMapRegister />,
        visible: true,
      },
      {
        to: "/registers/raf",
        title: "RAF",
        description: "RAF",
        component: <RAF />,
        visible: true,
      },
      {
        to: "/registers/general-labor",
        title: "Labores",
        description: "Labores",
        component: <GeneralLabor />,
        visible: true,
      },
    ],
  },
  {
    to: "/cost-center/list",
    icon: "fa-solid fa-money-bill",
    title: "Centro de Costos",
    description: "Centro de Costos",
    component: <ListOfCrops />,
    visible: true,
  },
  {
    to: "/cost-center/details/:code",
    icon: "fa-solid fa-money-bill",
    title: "Centro de Costos",
    description: "Centro de Costos",
    component: <DetailsCost />,
    visible: false,
  },
];

// Configuración de rutas
const router = (status: string) =>
  createBrowserRouter([
    {
      path: "/",
      element:
        status === "authenticated" ? (
          <DashboardLayout />
        ) : (
          <Navigate to="/auth/login" />
        ),
      children: [
        ...menuRoutes.map((route) => ({
          path: route.to,
          element: route.component,
        })),
        ...menuRoutes.flatMap(
          (route) =>
            route.subMenu?.map((subRoute) => ({
              path: subRoute.to,
              element: subRoute.component,
            })) || []
        ),
        {
          path: "",
          element: <Navigate to={menuRoutes[0].to} />,
        },
      ],
    },
    {
      path: "/auth",
      element: status === "authenticated" ? <Navigate to="/home" /> : null,
      children: [
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "*",
          element: <Navigate to="/auth/login" />,
        },
      ],
    },
  ]);

export const AppRouter = () => {
  const status = useCheckAuth();

  if (status === "checking") {
    return <CheckingAuth />;
  }

  return <RouterProvider router={router(status)} />;
};
