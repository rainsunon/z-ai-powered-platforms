// src/features/analysis/pages/AnalysisPage.tsx
import React, { useState } from 'react';
import Layout from '../../../components/layout/Layout';
import { UploadedFile } from '../types';
import { DocumentIntake } from '../components/DocumentIntake';
import { CaseOverview } from '../components/CaseOverview';
import { ProcessingEngine } from '../components/ProcessingEngine';
import { PredictionMetrics } from '../components/PredictionMetrics';
import { ShareModal } from '../components/ShareModal';
import { ActionBar } from '../components/ActionBar';

interface AnalysisPageProps {
    theme?: string;
    toggleTheme?: () => void;
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ theme, toggleTheme }) => {
    const [isExtracting, setIsExtracting] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [extractionProgress, setExtractionProgress] = useState(88);
    const [files, setFiles] = useState<UploadedFile[]>([
        { name: 'initial_complaint.pdf', size: '2.4 MB', time: '2m ago' }
    ]);

    const handleFileUpload = (newFiles: FileList | null) => {
        if (!newFiles) return;
        const newUploadedFiles: UploadedFile[] = Array.from(newFiles).map(file => ({
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
            time: 'Just now'
        }));
        setFiles(prev => [...newUploadedFiles, ...prev]);
    };

    const runExtraction = () => {
        setIsExtracting(true);
        setExtractionProgress(0);
        const interval = setInterval(() => {
            setExtractionProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsExtracting(false);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);
    };

    const executePlan = () => {
        setIsExecuting(true);
        setTimeout(() => {
            alert("Plan execution signal sent to legal team and stakeholders.");
            setIsExecuting(false);
        }, 1500);
    };

    const shareAnalysis = () => {
        setShowShareModal(true);
    };

    const generatePDF = () => {
        setIsDownloadingPDF(true);
        setTimeout(() => {
            setIsDownloadingPDF(false);
            alert("Success: Your encrypted LexGrid PDF Report has been generated and saved to downloads.");
        }, 2000);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Link copied to clipboard!");
    };

    return (
        <Layout theme={theme} toggleTheme={toggleTheme}>
            <div className="max-w-[1600px] mx-auto p-10 grid grid-cols-12 gap-10 relative">
                {/* Left: Document Intake */}
                <aside className="col-span-12 lg:col-span-3 space-y-8">
                    <DocumentIntake
                        files={files}
                        isExtracting={isExtracting}
                        onFileUpload={handleFileUpload}
                        onRemoveFile={removeFile}
                        onRunExtraction={runExtraction}
                    />
                    <CaseOverview />
                </aside>

                {/* Right: Analysis Results */}
                <div className="col-span-12 lg:col-span-9 space-y-8">
                    <ProcessingEngine extractionProgress={extractionProgress} isExtracting={isExtracting} />
                    <PredictionMetrics />
                </div>

                {/* Share Modal */}
                {showShareModal && (
                    <ShareModal onClose={() => setShowShareModal(false)} onCopy={copyToClipboard} />
                )}

                {/* Sticky Action Bar */}
                <ActionBar
                    onShare={shareAnalysis}
                    onGeneratePDF={generatePDF}
                    isDownloadingPDF={isDownloadingPDF}
                    onExecutePlan={executePlan}
                    isExecuting={isExecuting}
                />
            </div>
        </Layout>
    );
};

export default AnalysisPage;
