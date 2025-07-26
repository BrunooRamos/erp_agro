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
  IrrigationForm,
  HomeIrrigation,
  IrrigationList,
  CreateMovement,
  ListRAF,
  CreateRAF,
  ListSeedMap,
  CreateSeedMap,
  HomeMovement,
  LogisticCosts,
  IrrigationHours,
  ListLabor,
  LaborRegister,
  IrrigationCosts,
  IrrigationFertirriego,
  IrrigationGeneral,
  DolarAndFuelPrice,
  PostHarvest,
  TongProcces,
  CreateAndListCaliber,
  HomeTong,
  CostoTong,
  ListTongProcesses,
  HomeWash,
  QualitiesAndLabels,
  CostWash,
  ProcessWash,
  HomeCostCenter,
  ResultStatus,
  ListPotateoHarvest,
  FormMaintenance,
  DepreciationCostHome,
  DepreciationForm,
  DepreciationList,
  OtherExpensesHome,
  OtherExpensesForm,
  OtherExpensesList,
  SupplierInvoiceList,
  SupplierAccountStatement
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
      {
        to: "/machinery/maintenance",
        title: "Mantenimiento",
        description: "Mantenimiento",
        component: <FormMaintenance />,
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
        title: "Laboreos generales",
        description: "Laboreos generales",
        component: <LaborRegister />,
        visible: true,
      }
    ],
  },
  {
    to: "/irrigation",
    icon: "fa-solid fa-water",
    title: "Riego",
    description: "Riego",
    component: <HomeIrrigation />,
    visible: true,
    subMenu: [
      {
        to: "/irrigation/create",
        title: "Crear riego",
        description: "Formulario para crear riego",
        component: <IrrigationForm />,
        visible: true,
      },
      {
        to: "/irrigation/list",
        title: "Listado de riegos",
        description: "Listado de riegos",
        component: <IrrigationList />,
        visible: true,
      },
      {
        to: "/irrigation/hours",
        title: "Horas de riego",
        description: "Horas de riego",
        component: <IrrigationHours />,
        visible: false,
      },
      {
        to: "/irrigation/fertirriego",
        title: "Fertirriego",
        description: "Fertirriego",
        component: <IrrigationFertirriego />,
        visible: false,
      },
      {
        to: "/irrigation/costs",
        title: "Costos de riego",
        description: "Costos de riego",
        component: <IrrigationCosts />,
        visible: true,
      },
      {
        to: "/irrigation/general",
        title: "Riego general",
        description: "Riego general",
        component: <IrrigationGeneral />,
        visible: false,
      }
    ],
  },
  {
    to: "/movements",
    icon: "fa-solid fa-file-invoice",
    title: "Movimientos",
    description: "Movimientos",
    component: <HomeMovement />,
    visible: true,
    subMenu: [
      {
        to: "/movements/create",
        title: "Crear movimiento",
        description: "Formulario para crear movimiento",
        component: <CreateMovement />,
        visible: true,
      },
      {
        to: "/movements/logistic-costs",
        title: "Costos logísticos",
        description: "Costos logísticos",
        component: <LogisticCosts />,
        visible: true,
      },
      {
        to: "/movements/list",
        title: "Listar movimimientos",
        description: "Listar movimientos de papa desde el campo hasta los depositos",
        component: <ListPotateoHarvest />,
        visible: true,
      },
    ],
  },
  {
    to: "/post-harvest",
    icon: "fa-solid fa-chain",
    title: "Post cosecha",
    description: "Post cosecha",
    component: <PostHarvest />,
    visible: true,
    subMenu: [
      {
        to: "/post-harvest/tong",
        title: "Tong",
        description: "Tong",
        component: <HomeTong />,
        visible: true,
      },
      {
        to: "/post-harvest/wash",
        title: "Lavado",
        description: "Lavado",
        component: <HomeWash />,
        visible: true,
      },
    ],
  },
  {
    to: "/prices",
    icon: "fa-solid fa-coins",
    title: "Cotizaciones",
    description: "Cotizaciones",
    component: <DolarAndFuelPrice />,
    visible: true,
  },

  {
    to: "/cost-center/home",
    icon: "fa-solid fa-money-bill",
    title: "Centro de Costos",
    description: "Centro de Costos",
    component: <HomeCostCenter />,
    visible: true,
    subMenu: [
      {
        to: "/cost-center/result-status",
        title: "Resultados",
        description: "Resultados",
        component: <ResultStatus />,
        visible: true,
      },
      {
        to: "/cost-center/depreciation",
        title: "Depreciación",
        description: "Depreciación",
        component: <DepreciationCostHome />,
        visible: true,
      },
      {
        to: "/cost-center/depreciation/create",
        title: "Crear depreciación",
        description: "Crear depreciación",
        component: <DepreciationForm />,
        visible: false,
      },
      {
        to: "/cost-center/depreciation/list",
        title: "Listar depreciación",
        description: "Listar depreciación",
        component: <DepreciationList />,
        visible: false,
      },
      {
        to: "/cost-center/other-expenses",
        title: "Otros gastos",
        description: "Otros gastos",
        component: <OtherExpensesHome />,
        visible: true,
      },
      {
        to: "/cost-center/other-expenses/create",
        title: "Crear otros gastos",
        description: "Crear otros gastos",
        component: <OtherExpensesForm />,
        visible: false,
      },
      {
        to: "/cost-center/other-expenses/list",
        title: "Listar otros gastos",
        description: "Listar otros gastos",
        component: <OtherExpensesList />,
        visible: false,
      }
    ],
  },

  {
    to: "/supplier",
    icon: "fa-solid fa-truck",
    title: "Proveedores",
    description: "Proveedores",
    component: <SupplierInvoiceList />,
    visible: true,
    subMenu: [
      {
        to: "/supplier/invoices",
        title: "Ordenes de pago",
        description: "Ordenes de pago",
        component: <SupplierInvoiceList />,
        visible: true,
      },
      {
        to: "/supplier/account-statement",
        title: "Estado de cuenta",
        description: "Estado de cuenta de proveedores",
        component: <SupplierAccountStatement />,
        visible: true,
      },
    ],
  },
  //!Sub menus de post cosecha
  // TONG  
  {
    to: "/post-harvest/tong/proceso-tong",
    title: "Proceso Tong",
    description: "Proceso Tong",
    component: <TongProcces />,
    visible: false,
    icon: "fa-solid fa-plus",
  },
  {
    to: "/post-harvest/tong/list-tong-processes",
    title: "Listar procesos de tong",
    description: "Listar procesos de tong",
    component: <ListTongProcesses />,
    visible: false,
    icon: "fa-solid fa-list",
  },
  {
    to: "/post-harvest/tong/create-caliber",
    title: "Crear y listar calibre",
    description: "Crear y listar calibre",
    component: <CreateAndListCaliber />,
    visible: false,
    icon: "fa-solid fa-plus",
  },
  {
    to: "/post-harvest/tong/costo-tong",
    title: "Costo Tong",
    description: "Costo Tong",
    component: <CostoTong />,
    visible: false,
    icon: "fa-solid fa-plus",
  },
  // WASH
  {
    to: "/post-harvest/wash/proceso-wash",
    title: "Proceso Wash",
    description: "Proceso Wash",
    component: <ProcessWash />,
    visible: false,
    icon: "fa-solid fa-plus",
  },
  {
    to: "/post-harvest/wash/qualities",
    title: "Crear y listar calidades y etiquetas",
    description: "Crear y listar calidades y etiquetas",
    component: <QualitiesAndLabels />,
    visible: false,
    icon: "fa-solid fa-plus",
  },
  {
    to: "/post-harvest/wash/costs",
    title: "Costos de lavado",
    description: "Costos de lavado",
    component: <CostWash />,
    visible: false,
    icon: "fa-solid fa-plus",
  },
  // Sub menus de cada uno de los registros los cuales ya son sub menus
  {
    to: "/registers/raf/create",
    title: "Crear RAF",
    description: "Crear RAF",
    component: <CreateRAF />,
    visible: false,
    icon: "fa-solid fa-plus",
  },
  {
    to: "/registers/raf/list",
    title: "Listar RAF",
    description: "Listar RAF",
    component: <ListRAF />,
    visible: false,
    icon: "fa-solid fa-list",
  },


  {
    to: "/registers/seed-map/create",
    title: "Crear Mapa de siembra",
    description: "Crear Mapa de siembra",
    component: <CreateSeedMap />,
    visible: false,
    icon: "fa-solid fa-plus",
  },
  {
    to: "/registers/seed-map/list",
    title: "Listar Mapa de siembra",
    description: "Listar Mapa de siembra",
    component: <ListSeedMap />,
    visible: false,
    icon: "fa-solid fa-list",
  },

  {
    to: "/registers/general-labor/create",
    title: "Crear Labores",
    description: "Crear Labores",
    component: <GeneralLabor />,
    visible: false,
    icon: "fa-solid fa-plus",
  },
  {
    to: "/registers/general-labor/list",
    title: "Listar Labores",
    description: "Listar Labores",
    component: <ListLabor />,
    visible: false,
    icon: "fa-solid fa-list",
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
