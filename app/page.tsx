import { Hero } from "@/components/home/Hero";
import { DailyBread } from "@/components/home/DailyBread";
import { AnnouncementsBanner } from "@/components/home/AnnouncementsBanner";
import { WeeklyProgram } from "@/components/home/WeeklyProgram";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { MediaTeaser } from "@/components/home/MediaTeaser";
import { ConstructionTeaser } from "@/components/home/ConstructionTeaser";
import { StructuresGroupsOverview } from "@/components/home/StructuresGroupsOverview";
import { PastorsTeaser } from "@/components/home/PastorsTeaser";
import { LocationSection } from "@/components/home/LocationSection";

// Revalidate toutes les 60s pour que les annonces/données dynamiques s'actualisent.
export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Hero />
      <DailyBread />
      <AnnouncementsBanner />
      <WeeklyProgram />
      <UpcomingEvents />
      <MediaTeaser />
      <ConstructionTeaser />
      <StructuresGroupsOverview />
      <PastorsTeaser />
      <LocationSection />
    </>
  );
}
