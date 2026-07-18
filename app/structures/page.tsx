import { redirect } from "next/navigation";
import { structures } from "@/lib/content/structures";

export default function StructuresIndex() {
  redirect(`/structures/${structures[0].slug}`);
}
