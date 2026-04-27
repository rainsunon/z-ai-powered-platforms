import React from "react";
import { Plus, Settings, Users, HelpCircle, CreditCard } from "lucide-react";
import { motion } from "motion/react";
import { ShortcutLink } from "./components/DashboardSubcomponents";
import { CashFlowSection, ProfitLossSection, ExpenseBreakdownSection, OverdueSection, PayableAndOwingSection, NetIncomeSection } from "./components/DashboardSections";

export function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [cashFlowPeriod, setCashFlowPeriod] = React.useState<"12" | "24">("12");
  const [profitLossPeriod, setProfitLossPeriod] = React.useState<"12" | "24">("12");
  const [expensePeriod, setExpensePeriod] = React.useState<"year" | "month">("month");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 space-y-12 bg-white min-h-screen font-sans text-gray-800">
      <div className="flex justify-between items-center border-b border-gray-100 pb-6">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard</h2>
      </div>

      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-12 lg:col-span-4 space-y-12">
          <OverdueSection onNavigate={onNavigate} />
          <section className="space-y-6">
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Things You Can Do</h3>
            <div className="space-y-4">
              <ShortcutLink icon={Plus} label="Add a customer" onClick={() => onNavigate("new-customer")} />
              <ShortcutLink icon={Plus} label="Add a vendor" onClick={() => onNavigate("new-vendor")} />
              <ShortcutLink icon={Settings} label="Customize your invoices" onClick={() => onNavigate("settings")} />
              <ShortcutLink icon={Users} label="Invite a guest collaborator" onClick={() => {}} />
              <ShortcutLink icon={HelpCircle} label="Professional accounting help" onClick={() => onNavigate("advisors")} />
              <ShortcutLink icon={CreditCard} label="Accept credit cards to get paid faster" onClick={() => {}} />
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-16">
          <CashFlowSection period={cashFlowPeriod} onPeriodChange={setCashFlowPeriod} onNavigate={onNavigate} />
          <ProfitLossSection period={profitLossPeriod} onPeriodChange={setProfitLossPeriod} onNavigate={onNavigate} />
          <PayableAndOwingSection />
          <NetIncomeSection />
          <ExpenseBreakdownSection period={expensePeriod} onPeriodChange={setExpensePeriod} />
        </div>
      </div>
    </motion.div>
  );
}
