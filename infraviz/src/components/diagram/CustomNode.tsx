import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box } from 'lucide-react';
import { AwsEc2, AwsS3, AwsVpc, AwsSubnet, AwsSecurityGroup, AwsRds, AwsElb } from './AwsIcons';
import clsx from 'clsx';

const ICON_MAP: Record<string, any> = {
    'aws_instance': AwsEc2,
    'aws_s3_bucket': AwsS3,
    'aws_vpc': AwsVpc,
    'aws_subnet': AwsSubnet,
    'aws_security_group': AwsSecurityGroup,
    'aws_db_instance': AwsRds,
    'aws_lb': AwsElb,
};

// Map Terraform types to Hex colors for inline styling
const HEX_COLOR_MAP: Record<string, string> = {
    'aws_instance': '#f97316', // Orange-500
    'aws_s3_bucket': '#22c55e', // Green-500
    'aws_vpc': '#8b5cf6', // Violet-500
    'aws_subnet': '#3b82f6', // Blue-500
    'aws_security_group': '#ef4444', // Red-500
    'aws_db_instance': '#6366f1', // Indigo-500
    'aws_lb': '#8b5cf6', // Violet-500
};

function CustomNode({ data, selected }: NodeProps) {
    const Icon = ICON_MAP[data.resourceType] || Box;
    const typeColor = HEX_COLOR_MAP[data.resourceType] || '#6b7280'; // Default Gray

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: selected ? '4px solid #8b5cf6' : '1px solid #e5e7eb', // Violet ring if selected
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            width: '300px',
            minHeight: '200px', // Ensure minimum size
            height: 'auto', // Allow expansion for content
            overflow: 'hidden',
            fontFamily: 'sans-serif',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left'
        }}>
            <Handle type="target" position={Position.Top} style={{ background: '#9ca3af', width: '12px', height: '12px' }} />

            {/* HEADER */}
            <div style={{
                backgroundColor: typeColor,
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderBottom: '1px solid rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '6px'
                }}>
                    <Icon style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={data.label}>
                        {data.label}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                        {data.resourceType}
                    </div>
                </div>
            </div>

            {/* BODY */}
            <div style={{
                padding: '12px',
                backgroundColor: 'white',
                color: '#333'
            }}>
                {data.details && Object.keys(data.details).length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '100px 1fr',
                        gap: '8px',
                        fontSize: '11px',
                        fontFamily: 'monospace'
                    }}>
                        {Object.entries(data.details).map(([key, value]) => (
                            <React.Fragment key={key}>
                                <div style={{
                                    color: '#6b7280',
                                    fontWeight: 'bold',
                                    textAlign: 'right',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }} title={key}>
                                    {key}
                                </div>
                                <div style={{
                                    color: '#111827',
                                    wordBreak: 'break-all'
                                }}>
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', fontStyle: 'italic' }}>
                        No attributes
                    </div>
                )}
            </div>

            <Handle type="source" position={Position.Bottom} style={{ background: '#9ca3af', width: '12px', height: '12px' }} />
        </div>
    );
}

export default memo(CustomNode);
