import { LucideIcon } from "lucide-react";

interface Props {
  heading: string;
  description: string;
  icon: LucideIcon;
}

export default function IconTextPage({ heading, description, icon: Icon }: Props) {
  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center py-12">
        <Icon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">{heading}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
