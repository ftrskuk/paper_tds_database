export const EXTRA_SPECS_OPTIONS = [
    { label: "불투명도 (Opacity)", value: "opacity", unit: "%" },
    { label: "수분 (Moisture)", value: "moisture", unit: "%" },
    { label: "강도 (Stiffness)", value: "stiffness", unit: "mN" },
    { label: "거칠기 (Roughness)", value: "roughness", unit: "um" },
    { label: "광택도 (Gloss)", value: "gloss", unit: "%" },
    { label: "PH", value: "ph", unit: "" },
] as const

export type ExtraSpecKey = typeof EXTRA_SPECS_OPTIONS[number]['value']
