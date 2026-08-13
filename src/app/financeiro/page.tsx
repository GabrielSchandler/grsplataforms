import type { Metadata } from "next";
import { AreaPage, areaMetadata } from "@/components/site/area-page";
import { requireArea } from "@/content/areas";

const area = requireArea("financeiro");

export const metadata: Metadata = areaMetadata(area);

export default function Page() {
  return <AreaPage area={area} />;
}
