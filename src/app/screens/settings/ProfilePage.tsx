import { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Camera, Edit2, Save } from 'lucide-react';

interface ProfilePageProps {
  onBack: () => void;
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'Rishabh Aroea',
    email: 'rishabh@example.com',
    phone: '+91 98765 43210',
    homeAirport: 'Delhi (DEL)',
    dateOfBirth: '1995-06-15',
    address: '123 MG Road, New Delhi, 110001'
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 1000);
  };

  return (
    <div className="pb-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1F77D2] via-[#1a67b8] to-[#155a9e] px-6 pt-12 pb-8 shadow-xl relative overflow-hidden border-b-2 border-[#1F77D2]/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="relative">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Settings</span>
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] border border-white/30">
              <User className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" size={28} />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">Profile</h1>
              <p className="text-white/90 text-sm mt-1">Manage your personal information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Profile Picture */}
        <Card className="relative overflow-hidden">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#1F77D2] to-[#1557a0] flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                RA
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white border-2 border-[#1F77D2] flex items-center justify-center shadow-lg hover:bg-[#1F77D2] hover:text-white transition-all group-hover:scale-110">
                <Camera size={18} />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-[#222222] mt-4">{profileData.fullName}</h2>
            <p className="text-sm text-[#666666] font-medium">{profileData.email}</p>
            <div className="flex items-center gap-2 mt-3 px-4 py-1.5 bg-gradient-to-r from-[#00A854]/10 to-transparent rounded-lg">
              <div className="w-2 h-2 rounded-full bg-[#00A854] animate-pulse shadow-[0_0_8px_rgba(0,168,84,0.6)]"></div>
              <span className="text-sm font-bold text-[#00A854]">Premium Member</span>
            </div>
          </div>
        </Card>

        {/* Edit Button */}
        <div className="flex justify-end">
          {!isEditing ? (
            <Button
              variant="outlined"
              size="medium"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 size={18} />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outlined"
                size="medium"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="medium"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Profile Information */}
        <Card>
          <h3 className="text-lg font-bold text-[#222222] mb-4">Personal Information</h3>
          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-[#001F3F]/80 px-1">
                <User size={16} className="text-[#1F77D2]" />
                Full Name
              </label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                disabled={!isEditing}
                className="w-full h-12 px-4 rounded-xl bg-white border-2 border-[#E8E8E8]
                         text-[#001F3F] font-semibold text-base
                         focus:border-[#1F77D2] focus:outline-none
                         focus:shadow-[0_0_0_4px_rgba(31,119,210,0.1)]
                         disabled:bg-[#F5F5F5] disabled:text-[#666666]
                         transition-all duration-200"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-[#001F3F]/80 px-1">
                <Mail size={16} className="text-[#1F77D2]" />
                Email Address
              </label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="w-full h-12 px-4 rounded-xl bg-[#F5F5F5] border-2 border-[#E8E8E8]
                         text-[#666666] font-semibold text-base cursor-not-allowed"
              />
              <p className="text-xs text-[#999999] px-1">Email cannot be changed (linked to OAuth account)</p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-[#001F3F]/80 px-1">
                <Phone size={16} className="text-[#1F77D2]" />
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full h-12 px-4 rounded-xl bg-white border-2 border-[#E8E8E8]
                         text-[#001F3F] font-semibold text-base
                         focus:border-[#1F77D2] focus:outline-none
                         focus:shadow-[0_0_0_4px_rgba(31,119,210,0.1)]
                         disabled:bg-[#F5F5F5] disabled:text-[#666666]
                         transition-all duration-200"
              />
            </div>

            {/* Home Airport */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-[#001F3F]/80 px-1">
                <MapPin size={16} className="text-[#1F77D2]" />
                Home Airport
              </label>
              <select
                value={profileData.homeAirport}
                onChange={(e) => setProfileData({ ...profileData, homeAirport: e.target.value })}
                disabled={!isEditing}
                className="w-full h-12 px-4 rounded-xl bg-white border-2 border-[#E8E8E8]
                         text-[#001F3F] font-semibold text-base
                         focus:border-[#1F77D2] focus:outline-none
                         focus:shadow-[0_0_0_4px_rgba(31,119,210,0.1)]
                         disabled:bg-[#F5F5F5] disabled:text-[#666666]
                         transition-all duration-200"
              >
                <option>Delhi (DEL)</option>
                <option>Mumbai (BOM)</option>
                <option>Bangalore (BLR)</option>
                <option>Chennai (MAA)</option>
                <option>Hyderabad (HYD)</option>
                <option>Kolkata (CCU)</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-[#001F3F]/80 px-1">
                <Calendar size={16} className="text-[#1F77D2]" />
                Date of Birth
              </label>
              <input
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                disabled={!isEditing}
                className="w-full h-12 px-4 rounded-xl bg-white border-2 border-[#E8E8E8]
                         text-[#001F3F] font-semibold text-base
                         focus:border-[#1F77D2] focus:outline-none
                         focus:shadow-[0_0_0_4px_rgba(31,119,210,0.1)]
                         disabled:bg-[#F5F5F5] disabled:text-[#666666]
                         transition-all duration-200"
              />
            </div>
          </div>
        </Card>

        {/* Account Stats */}
        <Card className="bg-gradient-to-br from-[#1F77D2]/5 to-transparent">
          <h3 className="text-lg font-bold text-[#222222] mb-4">Account Activity</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Member Since', value: 'Jan 2024', icon: '📅' },
              { label: 'Total Bookings', value: '12', icon: '✈️' },
              { label: 'Money Saved', value: '₹45,000', icon: '💰' },
              { label: 'Active Alerts', value: '8', icon: '🔔' }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-[#E8E8E8]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-xs font-bold text-[#666666]">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold text-[#1F77D2]">{stat.value}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
