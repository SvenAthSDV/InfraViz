import React from 'react';
import { Box, Download } from 'lucide-react';
import { toPng } from 'html-to-image';

export function Header() {
    const onExport = () => {
        // 1. Target the main React Flow viewport
        const flowElement = document.querySelector('.react-flow__viewport') as HTMLElement;

        if (!flowElement) {
            console.error("Impossible de trouver le viewport React Flow");
            return;
        }

        // 2. Export options
        const options = {
            backgroundColor: '#111111', // Force dark background as requested
            width: flowElement.scrollWidth,
            height: flowElement.scrollHeight,
            style: {
                width: `${flowElement.scrollWidth}px`,
                height: `${flowElement.scrollHeight}px`,
                transform: `translate(${0}px, ${0}px)`, // Reset zoom for export
            },
        };

        // 3. Generate Image
        toPng(flowElement, options)
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'infra-diagram.png';
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('Erreur lors de l\'export:', err);
            });
    };

    return (
        <header className="h-14 border-b border-border bg-secondary/50 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <div className="bg-primary/20 p-1.5 rounded-md">
                    <Box className="w-5 h-5 text-primary" />
                </div>
                <span className="font-bold text-lg tracking-tight">InfraViz</span>
            </div>

            <button
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white text-black rounded-md hover:bg-gray-200 transition-colors"
                onClick={onExport}
            >
                <Download className="w-4 h-4" />
                Export PNG
            </button>
        </header>
    );
}
