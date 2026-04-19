import React from 'react';
import { useNavigate } from 'react-router-dom';

const familyMembers = [
  {
    name: 'Sarah',
    relation: 'Daughter',
    note: 'Vaccination due in 12 days',
    avatar: 'https://i.pravatar.cc/150?u=sarah_daughter',
  },
  {
    name: 'David',
    relation: 'Husband',
    note: 'Recent Checkup: All Clear',
    avatar: 'https://i.pravatar.cc/150?u=david_husband',
  },
];

export function FamilyHealthCard() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-container-high/50 p-6 rounded-[2rem]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline font-bold text-xl">Family Health</h3>
        <button
          onClick={() => navigate('/family')}
          className="text-primary text-sm font-bold hover:underline"
        >
          View All
        </button>
      </div>
      <div className="space-y-4">
        {familyMembers.map((member) => (
          <div
            key={member.name}
            className="flex items-center p-4 bg-surface-container-lowest rounded-2xl shadow-sm"
          >
            <img
              alt={member.name}
              className="w-12 h-12 rounded-full mr-4 object-cover"
              src={member.avatar}
            />
            <div className="flex-1">
              <p className="font-bold text-sm">
                {member.name} ({member.relation})
              </p>
              <p className="text-xs text-outline">{member.note}</p>
            </div>
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
