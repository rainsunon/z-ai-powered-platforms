import React from 'react';
import { X, Plus, Trash2, Calendar, User, Upload, FileText, CheckCircle, Clock, Image as ImageIcon } from 'lucide-react';
import { Button, Input, Textarea, Select, Label, Card } from './ui';

interface CreateActionModalProps {
  type: string | null;
  onClose: () => void;
}

export default function CreateActionModal({ type, onClose }: CreateActionModalProps) {
  if (!type) return null;

  const renderContent = () => {
    switch (type) {
      case 'Client': return <ClientForm />;
      case 'Retainer': return <RetainerForm />;
      case 'Invoice': return <InvoiceForm />;
      case 'Recurring Template': return <RecurringTemplateForm />;
      case 'Other Income': return <OtherIncomeForm />;
      case 'Expense': return <ExpenseForm />;
      case 'Estimate': return <EstimateForm />;
      case 'Proposal': return <ProposalForm />;
      case 'Credit': return <CreditForm />;
      case 'Bill': return <BillForm />;
      case 'Vendor': return <VendorForm />;
      default: return <div className="p-6 text-slate-500">Form for <span className="font-semibold text-slate-900">{type}</span> is under construction.</div>;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity animate-in fade-in" onClick={onClose}></div>
      <div className="fixed top-0 right-0 bottom-0 w-full md:w-[650px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-bold text-slate-900">New {type}</h3>
            <p className="text-sm text-slate-500">Enter the details below to create a new {type.toLowerCase()}.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             {renderContent()}
          </div>
        </div>
        <div className="p-6 border-t border-slate-200 flex gap-3 bg-white z-10">
            <Button variant="outline" className="flex-1 font-bold h-12" onClick={onClose}>Cancel</Button>
            <Button className="flex-1 font-bold shadow-md h-12" onClick={onClose}>
                Save {type}
            </Button>
        </div>
      </div>
    </>
  );
}

// --- Sub Forms ---

const ClientForm = () => (
  <div className="flex flex-col gap-5">
    <div className="grid gap-2">
      <Label>Company / Client Name</Label>
      <Input placeholder="e.g. Acme Corp" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label>Primary Contact First Name</Label>
        <Input placeholder="Jane" />
      </div>
      <div className="grid gap-2">
        <Label>Primary Contact Last Name</Label>
        <Input placeholder="Doe" />
      </div>
    </div>
    <div className="grid gap-2">
      <Label>Email Address</Label>
      <Input type="email" placeholder="jane@acme.com" />
    </div>
    <div className="grid gap-2">
      <Label>Phone Number</Label>
      <Input type="tel" placeholder="(555) 123-4567" />
    </div>
    <div className="grid gap-2">
        <Label>Billing Address</Label>
        <Textarea placeholder="123 Market St, Suite 400..." />
    </div>
    <div className="flex items-center gap-2 mt-2">
        <input type="checkbox" id="portal" className="rounded border-slate-300 text-[#13b6ec] focus:ring-[#13b6ec]" />
        <label htmlFor="portal" className="text-sm text-slate-600">Send Client Portal invitation</label>
    </div>
  </div>
);

const VendorForm = () => (
    <div className="flex flex-col gap-5">
      <div className="grid gap-2">
        <Label>Vendor Name</Label>
        <Input placeholder="e.g. AWS Web Services" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
            <Label>Contact Person</Label>
            <Input placeholder="Support Team" />
        </div>
        <div className="grid gap-2">
            <Label>Email</Label>
            <Input placeholder="billing@vendor.com" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Account Number (Optional)</Label>
        <Input placeholder="XXXX-XXXX-XXXX" />
      </div>
      <div className="grid gap-2">
        <Label>Default Expense Category</Label>
        <Select>
            <option>Software</option>
            <option>Office Supplies</option>
            <option>Rent</option>
            <option>Contractors</option>
        </Select>
      </div>
    </div>
);

const InvoiceForm = () => (
    <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
                <Label className="mb-1.5 block">Client</Label>
                <Select>
                    <option>Select a client...</option>
                    <option>Acme Corp</option>
                    <option>Globex Inc</option>
                    <option>Stark Industries</option>
                </Select>
            </div>
            <div>
                <Label className="mb-1.5 block">Invoice Date</Label>
                <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
                <Label className="mb-1.5 block">Due Date</Label>
                <Input type="date" defaultValue={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} />
            </div>
        </div>

        <div className="h-px bg-slate-100 w-full"></div>

        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-900">Line Items</h4>
            </div>
            
            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-slate-500 px-1">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Amt</div>
            </div>

            {[1, 2].map((i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-start">
                    <div className="col-span-6">
                        <Input placeholder="Description of service..." />
                    </div>
                    <div className="col-span-2">
                        <Input type="number" className="text-right" placeholder="0" />
                    </div>
                    <div className="col-span-2">
                        <Input type="number" className="text-right" placeholder="0.00" />
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                        <span className="text-sm font-medium text-slate-900 pt-2">$0.00</span>
                        <button className="text-slate-300 hover:text-red-500 pt-2 transition-colors">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ))}
            
            <button className="flex items-center gap-2 text-[#13b6ec] text-sm font-bold mt-1 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors self-start">
                <Plus size={16} /> Add Line Item
            </button>
        </div>

        <div className="h-px bg-slate-100 w-full"></div>

        <div className="flex flex-col gap-2 items-end">
            <div className="flex justify-between w-1/2 text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-900">$0.00</span>
            </div>
            <div className="flex justify-between w-1/2 text-lg font-bold border-t border-slate-100 pt-2 mt-2">
                <span className="text-slate-900">Total</span>
                <span className="text-[#13b6ec]">$0.00</span>
            </div>
        </div>
    </div>
);

const ExpenseForm = () => (
    <div className="flex flex-col gap-5">
        <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors cursor-pointer">
            <div className="size-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 text-[#13b6ec]">
                <Upload size={20} />
            </div>
            <p className="text-sm font-semibold text-slate-900">Upload Receipt</p>
            <p className="text-xs text-slate-500 mt-1">Drag & drop or click to browse</p>
        </div>
        <div className="grid gap-2">
            <Label>Payee / Merchant</Label>
            <Input placeholder="e.g. Starbucks, Office Depot" />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label>Date</Label>
                <Input type="date" />
            </div>
            <div className="grid gap-2">
                <Label>Amount</Label>
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                    <Input className="pl-7" placeholder="0.00" type="number" />
                </div>
            </div>
        </div>
        <div className="grid gap-2">
            <Label>Category</Label>
            <Select>
                <option>Meals & Entertainment</option>
                <option>Travel</option>
                <option>Office Supplies</option>
                <option>Software</option>
            </Select>
        </div>
        <div className="grid gap-2">
            <Label>Notes</Label>
            <Textarea placeholder="Lunch with client..." />
        </div>
    </div>
);

const RetainerForm = () => (
    <div className="flex flex-col gap-5">
        <div className="grid gap-2">
            <Label>Client</Label>
            <Select>
                <option>Select Client...</option>
                <option>Acme Corp</option>
            </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label>Retainer Amount</Label>
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                    <Input className="pl-7" placeholder="0.00" type="number" />
                </div>
            </div>
            <div className="grid gap-2">
                <Label>Frequency</Label>
                <Select>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Yearly</option>
                </Select>
            </div>
        </div>
        <div className="grid gap-2">
            <Label>Start Date</Label>
            <Input type="date" />
        </div>
        <div className="flex items-center gap-2 mt-2 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
            <CheckCircle size={16} />
            <span>First invoice will be generated automatically on start date.</span>
        </div>
    </div>
);

const RecurringTemplateForm = () => (
    <div className="flex flex-col gap-5">
         <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 mb-2">
            <p className="text-sm text-orange-800 font-medium">This template will generate invoices automatically based on the schedule below.</p>
         </div>
         <InvoiceForm />
         <div className="h-px bg-slate-100 w-full"></div>
         <h4 className="font-bold text-slate-900">Schedule Settings</h4>
         <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label>Repeat Every</Label>
                <div className="flex gap-2">
                    <Input type="number" defaultValue="1" className="w-20" />
                    <Select>
                        <option>Month(s)</option>
                        <option>Week(s)</option>
                    </Select>
                </div>
            </div>
            <div className="grid gap-2">
                <Label>Next Invoice Date</Label>
                <Input type="date" />
            </div>
         </div>
    </div>
);

const OtherIncomeForm = () => (
    <div className="flex flex-col gap-5">
        <div className="grid gap-2">
            <Label>Payer / Source</Label>
            <Input placeholder="e.g. Interest, Refund" />
        </div>
        <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
                <Label>Amount</Label>
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                    <Input className="pl-7" placeholder="0.00" type="number" />
                </div>
            </div>
            <div className="grid gap-2">
                <Label>Date Received</Label>
                <Input type="date" />
            </div>
        </div>
        <div className="grid gap-2">
            <Label>Account</Label>
            <Select>
                <option>Business Checking (...1234)</option>
                <option>Savings</option>
                <option>Petty Cash</option>
            </Select>
        </div>
        <div className="grid gap-2">
            <Label>Category</Label>
            <Select>
                <option>Other Income</option>
                <option>Interest Income</option>
                <option>Refunds</option>
            </Select>
        </div>
    </div>
);

const EstimateForm = () => (
    <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-700">Estimate Details</h4>
            <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">EST-001</span>
        </div>
        <InvoiceForm />
        <div className="grid gap-2 mt-2">
            <Label>Expiry Date</Label>
            <Input type="date" />
        </div>
    </div>
);

const ProposalForm = () => (
    <div className="flex flex-col gap-6">
        <div className="grid gap-2">
            <Label>Proposal Title</Label>
            <Input placeholder="Website Redesign Project" className="text-lg font-bold" />
        </div>
        <div className="grid gap-2">
            <Label>Client</Label>
            <Select>
                <option>Select Client...</option>
                <option>Acme Corp</option>
            </Select>
        </div>
        <div className="grid gap-2">
            <Label>Executive Summary</Label>
            <Textarea className="min-h-[120px]" placeholder="Outline the project goals and scope..." />
        </div>
        <div className="h-px bg-slate-100 w-full"></div>
        <h4 className="font-bold text-slate-900">Pricing Estimate</h4>
        <InvoiceForm />
    </div>
);

const CreditForm = () => (
    <div className="flex flex-col gap-5">
        <div className="grid gap-2">
            <Label>Client</Label>
            <Select>
                <option>Select Client...</option>
                <option>Acme Corp</option>
            </Select>
        </div>
        <div className="grid gap-2">
            <Label>Credit Amount</Label>
            <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                <Input className="pl-7" placeholder="0.00" type="number" />
            </div>
        </div>
        <div className="grid gap-2">
            <Label>Original Invoice # (Optional)</Label>
            <Input placeholder="#INV-..." />
        </div>
        <div className="grid gap-2">
            <Label>Reason</Label>
            <Textarea placeholder="Refund for unused hours..." />
        </div>
    </div>
);

const BillForm = () => (
    <div className="flex flex-col gap-5">
        <div className="grid gap-2">
            <Label>Vendor</Label>
            <Select>
                <option>Select Vendor...</option>
                <option>AWS</option>
                <option>WeWork</option>
            </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
                <Label>Bill #</Label>
                <Input placeholder="12345" />
            </div>
            <div className="grid gap-2">
                <Label>Amount</Label>
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                    <Input className="pl-7" placeholder="0.00" type="number" />
                </div>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
                <Label>Bill Date</Label>
                <Input type="date" />
            </div>
            <div className="grid gap-2">
                <Label>Due Date</Label>
                <Input type="date" />
            </div>
        </div>
        <div className="grid gap-2">
            <Label>Memo</Label>
            <Textarea placeholder="Services rendered..." />
        </div>
    </div>
);
