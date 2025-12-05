import React from 'react';
import { X, Box } from 'lucide-react';
import { AwsEc2, AwsS3, AwsVpc, AwsSubnet, AwsSecurityGroup, AwsRds, AwsElb } from './AwsIcons';

interface DetailsPanelProps {
    selectedNode: any | null;
    onClose: () => void;
}

const ICON_MAP: Record<string, any> = {
    'aws_instance': AwsEc2,
    'aws_s3_bucket': AwsS3,
    'aws_vpc': AwsVpc,
    'aws_subnet': AwsSubnet,
    'aws_security_group': AwsSecurityGroup,
    'aws_db_instance': AwsRds,
    'aws_lb': AwsElb,
};

export function DetailsPanel({ selectedNode, onClose }: DetailsPanelProps) {
    // Always render the container to ensure visibility
    const hasNode = !!selectedNode;
    const node = selectedNode || { data: { label: 'No Selection', resourceType: 'aws_instance' } };
    const Icon = ICON_MAP[node.data.resourceType] || Box;

    if (!hasNode) {
        return null; // Reverting to null for now to match desired UX, but let's debug why it was failing.
        // Actually, let's try to render a hidden container or something to prove it's mounted?
        // No, let's stick to the plan: Render "Select a node" if null.
    }

    return (
        <div
            className="fixed top-0 right-0 h-screen w-96 bg-background/95 backdrop-blur-xl border-l border-border shadow-2xl z-[100] flex flex-col"
        >
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 pt-20">
                <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Inspector</h2>
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-20 h-20 mb-4 p-4 bg-muted/50 rounded-2xl border border-white/5 shadow-inner flex items-center justify-center">
                        <Icon className="w-full h-full drop-shadow-lg" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-1 break-all">
                        {node.data.label}
                    </h1>
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-medium">
                        {node.data.resourceType}
                    </div>
                </div>

                {/* Attributes Section */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-px flex-1 bg-border"></div>
                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Configuration</span>
                        <div className="h-px flex-1 bg-border"></div>
                    </div>

                    <div className="space-y-3">
                        {Object.entries(node.data.details || {}).map(([key, value]) => (
                            <div key={key} className="group flex flex-col gap-1 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-white/5">
                                <div className="text-xs font-mono text-muted-foreground">{key}</div>
                                <div className="text-sm font-medium text-foreground break-all font-mono">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </div>
                            </div>
                        ))}
                        {(!node.data.details || Object.keys(node.data.details).length === 0) && (
                            <div className="text-center text-muted-foreground text-sm py-8 italic">
                                No configuration attributes found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
