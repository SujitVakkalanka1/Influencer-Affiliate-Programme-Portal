import { Flame } from "lucide-react";
export default function Logo() {
  return <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-ember-500 text-white shadow-glow"><Flame className="h-5 w-5" /></span><div><p className="text-base font-black tracking-normal text-white">InfluenceX</p><p className="text-xs font-medium text-white/40">Affiliate Studio</p></div></div>;
}
