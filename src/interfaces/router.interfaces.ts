export interface MenuRoute {
    to: string;
    icon: string;
    title: string;
    description: string;
    component?: React.ReactNode;
    subMenu?: SubMenuRoute[];
    visible: boolean;
  }
  
  export interface SubMenuRoute {
    to: string;
    title: string;
    description: string;
    component: React.ReactNode;
    visible: boolean;
  }