import React from 'react';
import { useNavigate } from 'react-router-dom';

const wellnessRewards = [
  { title: 'Signature Spa Retreat', desc: 'Full day access for two to the Serenity Springs Wellness Center. Includes 60min massage.', points: 4500, locked: false },
  { title: 'Private Family Yoga', desc: 'A guided session at home or in-studio focused on family connection and flexibility.', points: 1200, locked: false },
  { title: 'Cryo-Recovery Pack', desc: 'Unlocks at 15,000 Total Points. Premium metabolic recovery for the whole family.', points: 15000, locked: true, progress: 83 },
];

const experienceRewards = [
  { title: 'Emerald Peak Pass', desc: '"The kids\' absolute favorite weekend outing!"', points: 8000, tag: 'Family Choice', tagBg: 'bg-secondary-container text-on-secondary-container' },
  { title: 'Trailblazer Day', desc: 'Guided mountain biking tour and picnic for up to 5 family members.', points: 5500, tag: 'Limited Time', tagBg: 'bg-tertiary-container text-on-tertiary-container' },
];

const treatRewards = [
  { title: 'Organic Harvest Box', desc: 'A week of fresh, seasonal produce.', points: 2400, icon: 'eco' },
  { title: 'Vitality Juice Pass', desc: '10 credits for any organic smoothie bar.', points: 1800, icon: 'local_cafe' },
  { title: "Kids' Kitchen Academy", desc: 'Online healthy cooking masterclass.', points: 3200, icon: 'restaurant' },
  { title: 'In-Home Chef Dinner', desc: 'Personal chef prepares a healthy 3-course meal.', points: 9500, icon: 'dining' },
];

const recentlyRedeemed = [
  { title: 'Week Gym Pass', time: 'Redeemed 2 days ago', icon: 'fitness_center' },
  { title: 'Morning Glow Juice', time: 'Redeemed 4 days ago', icon: 'local_cafe' },
];

export function FamilyRewards() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {/* Points Summary Hero */}
      <section className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-[2.5rem] p-12 relative overflow-hidden flex flex-col justify-center min-h-[320px]">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[20rem] absolute -top-10 -right-10 text-primary">auto_awesome</span>
          </div>
          <div className="relative z-10">
            <span className="bg-secondary-fixed text-on-secondary-container text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 inline-block">Current Status</span>
            <h2 className="font-headline font-extrabold text-6xl text-on-surface mb-2 tracking-tighter">12,450 <span className="text-primary text-3xl font-bold tracking-normal">Points</span></h2>
            <p className="text-on-surface-variant text-xl max-w-md">You're in the <span className="text-primary font-bold">Gold Tier</span>. Earn 2,550 more points to reach Platinum excellence.</p>
          </div>
          <div className="mt-8 flex gap-4">
            <div className="bg-surface-container rounded-2xl px-6 py-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">trending_up</span>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">Monthly Progress</p>
                <p className="font-bold">+1,200 pts</p>
              </div>
            </div>
            <div className="bg-surface-container rounded-2xl px-6 py-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">groups</span>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">Family Rank</p>
                <p className="font-bold">Top 5%</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 primary-gradient rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-xl">
          <div>
            <span className="material-symbols-outlined text-5xl mb-6">stars</span>
            <h3 className="font-headline font-bold text-2xl leading-tight">Elite Benefits<br />Activated</h3>
          </div>
          <ul className="space-y-4 mt-6">
            <li className="flex items-center gap-3 text-sm opacity-90">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              Free health concierge
            </li>
            <li className="flex items-center gap-3 text-sm opacity-90">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              20% off all organic partners
            </li>
            <li className="flex items-center gap-3 text-sm opacity-90">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              Priority appointment booking
            </li>
          </ul>
        </div>
      </section>

      {/* Wellness & Recovery */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h3 className="font-headline font-bold text-3xl text-on-surface">Wellness & Recovery</h3>
            <p className="text-on-surface-variant mt-1">Nurture your family's inner peace and physical vitality.</p>
          </div>
          <button className="text-primary font-bold flex items-center gap-2 hover:underline">
            View All <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {wellnessRewards.map((reward) => (
            <div key={reward.title} className={`group bg-surface-container-lowest rounded-[2rem] overflow-hidden transition-transform ${reward.locked ? 'opacity-80' : 'hover:-translate-y-2'}`}>
              <div className="h-48 relative overflow-hidden bg-surface-container flex items-center justify-center">
                <span className={`material-symbols-outlined text-[80px] ${reward.locked ? 'text-on-surface-variant/20' : 'text-primary/20'} group-hover:scale-110 transition-transform duration-500`}>
                  {reward.locked ? 'lock' : 'spa'}
                </span>
                {!reward.locked && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-primary shadow-sm">
                    {reward.points.toLocaleString()} Points
                  </div>
                )}
                {reward.locked && (
                  <div className="absolute inset-0 bg-on-surface/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-5xl">lock</span>
                  </div>
                )}
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-headline font-bold text-xl">{reward.title}</h4>
                  {reward.locked && <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Locked</span>}
                </div>
                <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">{reward.desc}</p>
                {reward.locked ? (
                  <>
                    <div className="w-full bg-surface-container h-2 rounded-full mb-2">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${reward.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase">
                      <span>12,450 Pts</span>
                      <span>{reward.points.toLocaleString()} Pts</span>
                    </div>
                  </>
                ) : (
                  <button className="w-full py-3 bg-surface-container-high hover:bg-primary hover:text-white text-primary font-bold rounded-xl transition-all">Redeem Now</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Experiences */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h3 className="font-headline font-bold text-3xl text-on-surface">Active Experiences</h3>
            <p className="text-on-surface-variant mt-1">Adventure awaits. Turn your health milestones into memories.</p>
          </div>
          <button className="text-primary font-bold flex items-center gap-2 hover:underline">
            View All <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experienceRewards.map((reward) => (
            <div key={reward.title} className="group bg-surface-container-lowest rounded-[2.5rem] p-8 flex gap-8 items-center transition-all hover:shadow-2xl hover:shadow-primary/5">
              <div className="w-1/2 h-56 rounded-2xl overflow-hidden bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[80px] text-primary/20 group-hover:scale-110 transition-transform duration-500">
                  {reward.title.includes('Peak') ? 'attractions' : 'directions_bike'}
                </span>
              </div>
              <div className="w-1/2">
                <div className="flex gap-2 mb-3">
                  <span className={`${reward.tagBg} text-[10px] font-bold px-2 py-0.5 rounded uppercase`}>{reward.tag}</span>
                  <span className="text-primary font-bold text-xs">{reward.points.toLocaleString()} Pts</span>
                </div>
                <h4 className="font-headline font-bold text-2xl mb-3 leading-tight">{reward.title}</h4>
                <p className="text-on-surface-variant text-sm mb-6">{reward.desc}</p>
                <button className="px-6 py-2.5 bg-primary text-white font-bold rounded-full text-sm">Redeem Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Healthy Treats */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h3 className="font-headline font-bold text-3xl text-on-surface">Healthy Treats</h3>
            <p className="text-on-surface-variant mt-1">Fuel your family with organic, chef-curated nutrition.</p>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
          {treatRewards.map((treat) => (
            <div key={treat.title} className="min-w-[320px] bg-surface-container-lowest rounded-3xl p-6 snap-start">
              <div className="w-full h-40 bg-surface-container rounded-2xl mb-4 flex items-center justify-center">
                <span className="material-symbols-outlined text-[60px] text-primary/20">{treat.icon}</span>
              </div>
              <h5 className="font-headline font-bold text-lg">{treat.title}</h5>
              <p className="text-xs text-on-surface-variant mb-4">{treat.desc}</p>
              <div className="flex justify-between items-center">
                <span className="text-primary font-bold">{treat.points.toLocaleString()} Pts</span>
                <button className="p-2 bg-surface-container text-primary rounded-full hover:bg-primary hover:text-white transition-colors">
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Redeemed */}
      <section className="pt-16 border-t border-outline-variant/20">
        <h3 className="font-headline font-bold text-2xl mb-8">Recently Redeemed</h3>
        <div className="flex gap-6 flex-wrap">
          {recentlyRedeemed.map((item) => (
            <div key={item.title} className="flex items-center gap-4 bg-surface-container/50 px-6 py-4 rounded-2xl">
              <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <div>
                <p className="font-bold text-sm">{item.title}</p>
                <p className="text-xs text-on-surface-variant">{item.time}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-4 bg-surface-container/50 px-6 py-4 rounded-2xl cursor-pointer hover:bg-surface-container transition-colors">
            <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined">more_horiz</span>
            </div>
            <div>
              <p className="font-bold text-sm">View History</p>
              <p className="text-xs text-on-surface-variant">14 more items</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
