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

// Revalidate periodically so the daily verse rotates without a full rebuild.
export const revalidate = 3600;

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
