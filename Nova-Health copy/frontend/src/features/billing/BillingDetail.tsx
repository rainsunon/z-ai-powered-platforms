import React from 'react';
import { useNavigate } from 'react-router-dom';

export function BillingDetail() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {/* Breadcrumb & Back */}
      <div className="flex items-center gap-2 text-sm text-on-surface-variant">
        <button onClick={() => navigate('/billing')} className="hover:text-primary transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Billing
        </button>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface font-medium">Invoice Detail</span>
      </div>

      {/* Invoice Header */}
      <section className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">Specialist Consultation</h2>
            <span className="text-[10px] font-black uppercase tracking-tighter bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full">Pending</span>
          </div>
          <p className="text-on-surface-variant mt-2">Invoice #NH-89245 • Issued Oct 05, 2024 • Due Nov 04, 2024</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-high text-primary font-bold px-6 py-3 rounded-full hover:bg-surface-container-highest transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">download</span> Download PDF
          </button>
          <button className="primary-gradient text-white font-bold px-8 py-3 rounded-full shadow-lg hover:opacity-95 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined">payments</span> Pay Now
          </button>
        </div>
      </section>

      {/* Bento Grid Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Itemized Breakdown */}
        <div className="lg:col-span-2 space-y-8">
          {/* Service Details Card */}
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
            <h3 className="font-headline font-bold text-xl mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">receipt_long</span>
              Service Breakdown
            </h3>
            <div className="divide-y divide-outline-variant/15">
              <div className="flex justify-between items-center py-4">
                <div>
                  <p className="font-bold text-on-surface">Dermatology Consultation</p>
                  <p className="text-xs text-on-surface-variant mt-1">Dr. Sarah Mitchell • 45 min session</p>
                </div>
                <span className="font-headline font-bold text-lg">$200.00</span>
              </div>
              <div className="flex justify-between items-center py-4">
                <div>
                  <p className="font-bold text-on-surface">Skin Biopsy — Punch Technique</p>
                  <p className="text-xs text-on-surface-variant mt-1">Lab processing included</p>
                </div>
                <span className="font-headline font-bold text-lg">$350.00</span>
              </div>
              <div className="flex justify-between items-center py-4">
                <div>
                  <p className="font-bold text-on-surface">Topical Treatment Application</p>
                  <p className="text-xs text-on-surface-variant mt-1">Cryotherapy — 3 areas</p>
                </div>
                <span className="font-headline font-bold text-lg">$125.00</span>
              </div>
              <div className="flex justify-between items-center py-4">
                <div>
                  <p className="font-bold text-on-surface">Follow-up Scheduling Fee</p>
                  <p className="text-xs text-on-surface-variant mt-1">Priority booking, 2-week follow-up</p>
                </div>
                <span className="font-headline font-bold text-lg">$25.00</span>
              </div>
            </div>
          </div>

          {/* Cost Summary Card */}
          <div className="bg-surface-container-low p-8 rounded-[2rem]">
            <h3 className="font-headline font-bold text-xl mb-6">Cost Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="font-bold">$700.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Insurance Adjustment (Luminous Shield PPO)</span>
                <span className="font-bold text-primary">-$480.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Co-pay Applied</span>
                <span className="font-bold">-$25.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Deductible Remaining</span>
                <span className="font-bold">-$45.00</span>
              </div>
              <div className="border-t border-outline-variant/20 pt-4 mt-4 flex justify-between items-center">
                <span className="font-headline font-bold text-lg">Patient Responsibility</span>
                <span className="font-headline font-extrabold text-2xl text-primary">$150.00</span>
              </div>
            </div>
          </div>

          {/* Provider Notes */}
          <div className="bg-surface-container-high/50 p-8 rounded-[2rem]">
            <h3 className="font-headline font-bold text-xl mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">clinical_notes</span>
              Provider Notes
            </h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Patient presented with multiple suspicious moles on the upper back region. Punch biopsy performed on the largest lesion (8mm diameter). Results will be available within 5-7 business days. Cryotherapy applied to three actinic keratoses. Follow-up appointment recommended in two weeks to review pathology results and assess treatment area healing.
            </p>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Provider Info Card */}
          <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm">
            <h4 className="font-headline font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person</span>
              Provider Information
            </h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl primary-gradient flex items-center justify-center text-white text-lg font-bold">SM</div>
              <div>
                <p className="font-headline font-bold">Dr. Sarah Mitchell</p>
                <p className="text-xs text-on-surface-variant">Board Certified Dermatologist</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-outline-variant/15">
                <span className="text-on-surface-variant">Facility</span>
                <span className="font-medium">Luminous Health Center</span>
              </div>
              <div className="flex justify-between py-2 border-b border-outline-variant/15">
                <span className="text-on-surface-variant">Date of Service</span>
                <span className="font-medium">Oct 05, 2024</span>
              </div>
              <div className="flex justify-between py-2 border-b border-outline-variant/15">
                <span className="text-on-surface-variant">Claim Status</span>
                <span className="font-bold text-primary">Processed</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-on-surface-variant">Authorization #</span>
                <span className="font-mono text-xs">AUTH-2024-77291</span>
              </div>
            </div>
          </div>

          {/* Insurance Applied Card */}
          <div className="bg-primary-container/10 p-8 rounded-[2.5rem] border-2 border-primary-container/20 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-headline font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                Insurance Coverage
              </h4>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Plan</span>
                  <span className="font-bold">Luminous Shield PPO</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Member ID</span>
                  <span className="font-mono text-xs">LX-0092-8812</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Coverage Rate</span>
                  <span className="font-bold text-primary">68.5%</span>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-2xl mt-6">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
                  <span className="material-symbols-outlined text-[14px] text-primary">info</span>
                  Deductible Progress
                </div>
                <div className="h-2 bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '83%' }}></div>
                </div>
                <p className="text-xs text-on-surface-variant mt-2">$2,500 / $3,000 met</p>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-primary-container/20 rounded-full blur-3xl"></div>
          </div>

          {/* Payment Options */}
          <div className="bg-surface-container-low p-8 rounded-[2.5rem]">
            <h4 className="font-headline font-bold mb-6">Payment Options</h4>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/billing/bulk-pay/method')}
                className="w-full primary-gradient text-white rounded-[1.5rem] py-4 font-headline font-extrabold shadow-xl shadow-primary/30 flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined">credit_card</span>
                Pay $150.00 Now
              </button>
              <button
                onClick={() => navigate('/billing/bulk-pay/schedule')}
                className="w-full bg-surface-container-highest text-on-surface rounded-[1.5rem] py-4 font-headline font-extrabold flex items-center justify-center gap-3 hover:bg-surface-dim transition-colors"
              >
                <span className="material-symbols-outlined">calendar_month</span>
                Set Up Payment Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
