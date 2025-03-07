# Vicentina ERP 
## Bruno Ramos - 2025

### 1. Contexto general
Vicentina ha trabajado en gran parte de su existencia con tablas de Excel, sin embargo, dada la logica de negocio y la dificultad para realizar 
dearrollos personalizados en Excel, independientemente de su felxibilidad, han hecho que en último tiempo estos documentos se "rompan", y no se puedan
arreglar fácilmente. Esto a producido que, si bien los datos se tienen, no se pueden usar para crear información, por lo tanto, se pierde la 
posibilidad de ver en detalle los números de la empresa y ver donde están las oportunidades de mejora. 


__Lectura recomendada:__ [Para ver en general como funciona el Excel ir al siguiente enalce](https://sable-hovercraft-4cd.notion.site/Integraci-n-con-ERP-14b0b387b86e808e8dced3db134d8070?pvs=4)

Para resolver este problema, se optó por la opción de buscar un ERP el cual se adapte a las necesidades de Vicentina. Una de las opciones que se encontró
fue Hispatec, pero luego de considerarlo se terminó desacrtando. Fue así como se optó por [Dolibarr](https://www.dolibarr.org/), una alternativa OpenSource 
que además computacionalmente es bastante ligera, por lo tanto este puede correr en cualquier servidor en la Nube sin que represente un costo computacional
y economico elevado. 

Dolibarr es un ERP y CRM de caracter general, desarrollado en PHP y MySQL, el cual se adapta bien en algunas cosas (proveedores, clientes, ordenes de compra, facturas, entre otros), pero no tiene nada realacionado con el agro. En este punto no enfrentamos a una disyuntiva:
 
 1. Por un lado, Dolibarr cuenta con un programa de [Prefferred Parters](https://wiki.dolibarr.org/index.php?title=Dolibarr_Preferred_Partner&_gl=1*1j3z5kf*_ga*NjkxMTY3NzQxLjE3MzUzMDExNTk.*_ga_KYYDR4YR7J*MTc0MTE3NDkyNC4xOS4xLjE3NDExNzU3MjYuMC4wLjA.) el cual, entre otras cosas, te certifica como organización confiable y con este titulo, todo el dearrollo que se haga se puede vender a gente que lo necesite. Sin embargo, estos dearrollos deben ser necesariamente hechos en PHP siguiendo su documentación de dearrollo, la cual sea de paso, no es del todo clara.

 2. Hacer un dearrollo más ajustado y felxible en React, integrandose con la base de datos existente de Dolibarr. 


Para este caso, por una cuestión de velocidad y conocimiento técnico, además de poner el dearrollo de la empresa por sobre la creación de un producto oficial, se optó por la opción número __2__.

Entonces en resumidas cuentas, todo lo que se adapta a Vicentina y Dolibarr tiene, se usa. Toda la parte de agro se dearrolla en React.

#### 2. Set up
### 2.1 Desarrollo


### 3. Integración
#### 3.1 Explicación
Como se mencionó antes Dolibarr usa PHP y MySQL (o MariaDB o PostgreSQL) ([requisitos de software y hardware](https://wiki.dolibarr.org/index.php?title=Prerequisites)) una de las ventajas que tiene, es que si bien usa PHP y se usa prinicipalmente como una aplicación web que renderiza las páginas desde el servidor, también expone una API REST que permite interactuar con los datos sin necesidad de cargar la interfaz gráfica. Esto nos permite hacer la integración con React e interacturar con los datos de manera mucho mas sencilla.

Ahora bien, recordemos que el desarrollo en React es para trabajar con la parte Agro la cual Dolibarr no tiene, por lo tanto, para que quiero interactura con los datos existentes desde mi web.

Dada su naturaleza flexible, podemos usar un gestor de BD como Table Plus, pgAdmin o dbeaver para abrir la base de datos y crear tantas tablas y relaciones como querramos. Con esto resolvimos una parte del problema, ya tenemos las tablas, ahora, ¿como interactuamos con ellas desde la web de React?

Para hace eso, basta con seguir la lógica que tienen los demás módulos de Dolibarr. 

Aquí es donde entra en juego el Module Builder de Dolibarr. El Module Builder permite crear módulos personalizados dentro de Dolibarr sin necesidad de modificar el código core del sistema. Lo más interesante es que, al crear un nuevo módulo, podemos definir automáticamente endpoints en la API REST para interactuar con las nuevas tablas.

De esta forma logramos integrar la web en React con Dolibarr. A contiunación se ve una representación de como se hace la integración:

![Imagen de integración con Dolibarr](/public/markdown/integracion.png)

#### 3.2 Configuración.
Esto no se integra de manera automatica, sino que hay que desarrollar cierta logica.