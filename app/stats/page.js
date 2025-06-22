import AllStatsClient from "./AllStatsClient";

export const metadata = {
  title: "All Link Stats | ShortLink",
  description:
    "View analytics and stats for all your shortened links. Filter, search, and export your link data easily.",
};

export default function StatsPage() {
  return <AllStatsClient />;
}
