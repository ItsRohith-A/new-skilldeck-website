import * as Icons from "lucide-react";

interface ServiceItemIconProps {
    iconString?: string;
    className?: string;
    defaultIcon?: string;
}

export default function ServiceItemIcon({
    iconString,
    className = "w-5 h-5",
    defaultIcon = "Layers"
}: ServiceItemIconProps) {
    if (!iconString) {
        const Fallback = (Icons as any)[defaultIcon] || Icons.Layers;
        return <Fallback className={className} />;
    }

    const parts = iconString.split(",");
    const rawName = parts[0]?.trim() || "";
    const name = rawName.startsWith("Lucide") ? rawName.substring(6) : rawName;
    const hexColor = parts[1]?.trim() || null;
    const IconComponent = (Icons as any)[name] || (Icons as any)[defaultIcon] || Icons.Layers;

    return (
        <div
            style={hexColor && hexColor !== "currentColor" ? { color: hexColor } : undefined}
            className="flex items-center justify-center shrink-0"
        >
            <IconComponent className={className} />
        </div>
    );
}
