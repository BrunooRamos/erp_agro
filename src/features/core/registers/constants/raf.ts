export const RAF_OPTIONS = {
    types: [
        { value: "barbecho", label: "Barbecho" },
        { value: "mantenimiento_cultivo", label: "Mantenimiento de cultivo" },
        { value: "encalado", label: "Encalado" }
    ],
    subTypes: {
        barbecho: [
            { value: "quimico", label: "Químico" },
        ],
        mantenimiento_cultivo: [
            { value: "apl_nitrogeno", label: "Aplicación de Nitrógeno" },
            { value: "apl_agroquimico", label: "Aplicación de Agroquímico" },
        ]
    }
} as const;