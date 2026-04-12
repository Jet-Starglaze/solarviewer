import { SolarSystemPage } from "@/components/solar-system/SolarSystemPage";
import { planets, sun } from "@/data/solar-system";

export default function Home() {
  return <SolarSystemPage sun={sun} planets={planets} />;
}
