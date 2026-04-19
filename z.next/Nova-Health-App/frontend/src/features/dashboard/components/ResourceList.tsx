import React from 'react';

const resources = [
  {
    title: 'Nutritional Guide',
    description: 'Anti-inflammatory meal plans tailored to your profile.',
    icon: 'restaurant',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfGOiXe81ha3bQPA-yCvXO7toEusFEaCgLJPVasrRzaxwoRN1Y9R_sr1YfHKL9YQTBjxLNjsT5D2zhgjyw_24aaI-RfqE6_pzGRacvuWJBt3CVAi41cyp6Nye-Bevv04U3IKYRxi8o9-1AdItsHFL-ItamuOVBLbku6zpOBVTPMltr8TRQllGNTnNXtTvOrvnCxb_hW8c9nmjPXfWuQ9t6xVXX2vUfctk-bdUX5vs6lEZQVHAC9fUT4lhJZ5Qk4njMJYGlD2cIzZQ',
  },
  {
    title: 'Mindfulness Flow',
    description: 'Guided meditation for stress management and clarity.',
    icon: 'self_improvement',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAriLMuuPOUBMJLTS_QgUzBUvgku4DuUnr1mFMuCq7XqqCoCQOQAeH8zkFtzLZ2kL1SaLqSTLiXfBhs8AoQJU4ycVsCZWkLCsmWBP2v7p6M6nTf0dHsPmw9onU-tDdBAMKYPQlAmDbPibxr-dVIqkEHPgJBOaYo5GoYuUitu3vLBgNOLwkCjaXYdxz45aiBePEw2NQIt25-KbRj9dy4BaH0rcg6Cbh3DOKvtDG3KIypA_kOsHkbmwrOHby2EQ6cuB2zzR5h7C4vaoE',
  },
  {
    title: 'Low-Impact Cardio',
    description: 'Gentle exercises to improve circulation and stamina.',
    icon: 'directions_run',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUc_TgpRv8GuplwZi3qn3GS_ZMzmTeb85QatAcL4xWZHH7ek6-U-1yUgVw61APyZMUa49uh9EaAUXXyQMgOlWRXaiDdsANzjmGf0VpET8-vCE2CRZxidAvcfDUmvIBJqG7S0IBFXpGjersf-fJ1Q1_IORmxEkJslDmnQu9sNy2LfVXCBD0o3B7URr0CbvXKcWgnNsnG-WNXmMyzTZw-E3XCB3EvCrn17yy9StDKPk9k_NB0Jszv2fsA1leAyYo3zAulAUQillc6gA',
  },
  {
    title: 'Medicine Tracker',
    description: 'Stay on schedule with intelligent dosage reminders.',
    icon: 'medication',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfGOiXe81ha3bQPA-yCvXO7toEusFEaCgLJPVasrRzaxwoRN1Y9R_sr1YfHKL9YQTBjxLNjsT5D2zhgjyw_24aaI-RfqE6_pzGRacvuWJBt3CVAi41cyp6Nye-Bevv04U3IKYRxi8o9-1AdItsHFL-ItamuOVBLbku6zpOBVTPMltr8TRQllGNTnNXtTvOrvnCxb_hW8c9nmjPXfWuQ9t6xVXX2vUfctk-bdUX5vs6lEZQVHAC9fUT4lhJZ5Qk4njMJYGlD2cIzZQ',
  },
];

export function ResourceList() {
  return (
    <div className="p-8 rounded-3xl bg-surface-container-lowest border border-surface-variant/50 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline font-bold text-xl text-on-surface">Recommended Resources</h2>
        <button className="text-primary hover:text-primary-container font-headline font-semibold text-sm flex items-center gap-1 transition-colors">
          View All
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {resources.map((resource, idx) => (
          <div key={idx} className="rounded-2xl overflow-hidden cursor-pointer group border border-transparent hover:border-outline-variant/30 hover:shadow-md transition-all">
            <div className="h-24 overflow-hidden relative">
              <img
                src={resource.image}
                alt={resource.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-2 left-2 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-base">{resource.icon}</span>
              </div>
            </div>
            <div className="p-3">
              <p className="font-headline font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">{resource.title}</p>
              <p className="font-body text-xs text-outline mt-1 line-clamp-2">{resource.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
