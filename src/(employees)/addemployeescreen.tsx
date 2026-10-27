import React, { useState } from 'react';

interface AddEmployeeFormProps {
  onBack?: () => void;
  onSubmitSuccess?: () => void;
}

export const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({
  onBack,
  onSubmitSuccess,
}) => {
    console.log('AddEmployeeForm mounted');
    console.log('AddEmployeeForm component executing');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'EMPLOYEE' | 'ADMIN'>('EMPLOYEE');
  const [department, setDepartment] = useState('');
  const [sendInviteEmail, setSendInviteEmail] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitSuccess) {
      onSubmitSuccess();
    } else {
      alert(`Invitation sent to ${firstName || 'Employee'} (${email || 'email@company.com'})! (Mock)`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white font-mono p-4 sm:p-6 md:p-12 flex flex-col gap-6 antialiased select-none text-black max-w-2xl mx-auto">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="self-start flex items-center gap-2 text-xs font-bold text-black hover:underline cursor-pointer"
      >
        <span>←</span>
        <span>Back to Employees</span>
      </button>

      {/* Main Form Container */}
      <div className="border border-dashed border-black bg-white p-6 sm:p-10">
        <div className="text-xs uppercase tracking-wider text-black font-bold mb-2">
          02 / ONBOARDING
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-black mb-2">
          Invite Employee
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mb-8">
          Send an activation invitation to a new team member or appoint an additional company administrator.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Two-Column Name Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="firstName" className="block text-xs font-bold text-black">
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jack"
                className="w-full bg-[#D9D9D9] border border-dashed border-black px-3.5 py-2.5 text-sm text-black font-mono focus:border-solid focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="lastName" className="block text-xs font-bold text-black">
                Last Name *
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Sparrow"
                className="w-full bg-[#D9D9D9] border border-dashed border-black px-3.5 py-2.5 text-sm text-black font-mono focus:border-solid focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-bold text-black">
              Corporate Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jack.sparrow@glucode.com"
              className="w-full bg-[#D9D9D9] border border-dashed border-black px-4 py-2.5 text-sm text-black font-mono focus:border-solid focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Role & Department Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="role" className="block text-xs font-bold text-black">
                Platform Access Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'EMPLOYEE' | 'ADMIN')}
                className="w-full bg-[#D9D9D9] border border-dashed border-black px-3.5 py-2.5 text-sm text-black font-mono focus:border-solid focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="EMPLOYEE">Standard Employee</option>
                <option value="ADMIN">Company Administrator</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="department" className="block text-xs font-bold text-black">
                Department (Optional)
              </label>
              <input
                id="department"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Navigation / Marine"
                className="w-full bg-[#D9D9D9] border border-dashed border-black px-3.5 py-2.5 text-sm text-black font-mono focus:border-solid focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          {/* Send Email Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sendInviteEmail}
                onChange={(e) => setSendInviteEmail(e.target.checked)}
                className="w-4 h-4 rounded-none border border-black text-black focus:ring-0 cursor-pointer"
              />
              <span className="text-xs text-black font-medium">
                Dispatch onboarding email immediately with activation link
              </span>
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-between bg-[#F09343] hover:bg-[#F3A15E] active:bg-[#E07D2C] text-black font-bold text-sm px-6 py-4 border border-black shadow-[4px_4px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              <span>Send Invitation</span>
              <span className="text-base font-bold">→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeForm;