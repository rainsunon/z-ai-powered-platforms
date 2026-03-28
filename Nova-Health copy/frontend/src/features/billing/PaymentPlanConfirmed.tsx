import React from 'react';
import { useNavigate } from 'react-router-dom';

export function PaymentPlanConfirmed() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full px-6 py-12 md:py-20">
        {/* Hero Section */}
        <section className="mb-16 text-center md:text-left">
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface mb-6 leading-tight">
            Payment Plan <span className="text-primary">Confirmed</span>
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed">
            Hello Elena, your payment plan for Invoice #NH-2024-BLK has been successfully set up and is now active.
          </p>
        </section>

        {/* Bento Grid Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Amount */}
          <div className="bg-surface-container-low p-8 rounded-3xl flex flex-col justify-between transition-colors hover:bg-surface-container duration-300">
            <span className="font-label text-on-surface-variant font-medium uppercase tracking-widest text-xs mb-4">Total Balance</span>
            <div>
              <span className="text-4xl font-headline font-bold text-on-surface">$694.50</span>
              <p className="text-sm text-on-surface-variant mt-2">Fully amortized</p>
            </div>
          </div>

          {/* Installment Count */}
          <div className="bg-secondary-container p-8 rounded-3xl flex flex-col justify-between transition-colors hover:bg-surface-container-highest duration-300">
            <span className="font-label text-on-secondary-container font-medium uppercase tracking-widest text-xs mb-4">Installments</span>
            <div>
              <span className="text-4xl font-headline font-bold text-on-secondary-container">4 Parts</span>
              <p className="text-sm text-on-secondary-container/80 mt-2">Monthly intervals</p>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="bg-surface-container-lowest p-8 rounded-3xl flex flex-col justify-between shadow-sm transition-colors hover:bg-white duration-300">
            <span className="font-label text-primary font-medium uppercase tracking-widest text-xs mb-4">Interest Rate</span>
            <div>
              <span className="text-4xl font-headline font-bold text-primary">0% APR</span>
              <p className="text-sm text-on-surface-variant mt-2">No hidden fees</p>
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="bg-surface-container p-1 rounded-[2rem] mb-12 overflow-hidden shadow-sm">
          <div className="bg-surface-container-lowest rounded-[1.8rem] overflow-hidden">
            <div className="px-8 py-6 bg-surface-container-high/30 border-b border-outline-variant/10">
              <h3 className="font-headline text-xl font-bold text-on-surface">Installment Schedule</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="font-label text-on-surface-variant text-xs uppercase tracking-wider">
                    <th className="px-8 py-4 font-semibold">Payment</th>
                    <th className="px-8 py-4 font-semibold">Amount</th>
                    <th className="px-8 py-4 font-semibold">Due Date</th>
                    <th className="px-8 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  <tr className="group hover:bg-surface-container-low transition-colors">
                    <td className="px-8 py-5 font-medium">Payment 1</td>
                    <td className="px-8 py-5">$173.63</td>
                    <td className="px-8 py-5">Today</td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        PAID
                      </span>
                    </td>
                  </tr>
                  <tr className="group hover:bg-surface-container-low transition-colors">
                    <td className="px-8 py-5 font-medium">Payment 2</td>
                    <td className="px-8 py-5">$173.63</td>
                    <td className="px-8 py-5">Nov 24, 2024</td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold">
                        UPCOMING
                      </span>
                    </td>
                  </tr>
                  <tr className="group hover:bg-surface-container-low transition-colors">
                    <td className="px-8 py-5 font-medium">Payment 3</td>
                    <td className="px-8 py-5">$173.63</td>
                    <td className="px-8 py-5">Dec 24, 2024</td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold">
                        UPCOMING
                      </span>
                    </td>
                  </tr>
                  <tr className="group hover:bg-surface-container-low transition-colors">
                    <td className="px-8 py-5 font-medium">Payment 4</td>
                    <td className="px-8 py-5">$173.61</td>
                    <td className="px-8 py-5">Jan 24, 2025</td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold">
                        UPCOMING
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payment Method & CTA */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between bg-surface-container-low/50 p-10 rounded-[2.5rem]">
          <div className="flex items-center gap-6">
            <div className="w-16 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center p-2">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAG2yCFiEtMWr6pjVqoZTX6BZiaJqjwyopbCbYydGIznXzKTyErd168PgMaRIIWOUssVikUDfBSRDVfYg1i0IBilrLEsKWTKEHV6NXTGlcGXTFBJN3A6jThrKQds5H6JN_b1NyM1teYhevC1B0fVWHTi1mpqOP9727KPByspsqLEb94FDBlAWFV-3k1w06ptjzr6AHCPWXi5BbouMveR546ZeqsAP10KykszpvkTn6KjG0eQq866RA164J-3SW6_6OXeicFVQEZGY" alt="Visa Logo" className="w-full h-auto" />
            </div>
            <div>
              <h4 className="font-headline font-bold text-on-surface">Payment Method</h4>
              <p className="text-on-surface-variant">Visa ending in 4242</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/billing')}
            className="primary-gradient text-white px-10 py-5 rounded-full font-headline font-bold text-lg shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-3"
          >
            View My Dashboard
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        {/* Trust/Reassurance Section */}
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <div className="flex justify-center gap-4 mb-6">
            <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
          </div>
          <p className="text-on-surface-variant leading-relaxed italic">
            All payments are processed through our secure, encrypted health-finance gateway. Installments will be automatically charged to your selected method on the scheduled dates. No further action is required from your side.
          </p>
        </div>
      </div>
    </div>
  );
}
