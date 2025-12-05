'use client';

import React, { useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    ConnectionMode,
    useNodesState,
    useEdgesState,
    BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { DetailsPanel } from './DetailsPanel';

const nodeTypes = {
    custom: CustomNode,
};

interface DiagramCanvasProps {
    initialNodes: Node[];
    initialEdges: Edge[];
    onNodeClick?: (event: React.MouseEvent, node: Node) => void;
    selectedNode?: Node | null;
    onPanelClose?: () => void;
}

export function DiagramCanvas({
    initialNodes,
    initialEdges,
    onNodeClick,
    selectedNode,
    onPanelClose
}: DiagramCanvasProps) {
    // We use internal state for React Flow to handle dragging/interactions
    // But we initialize it from props when they change (key technique: key={version} or useEffect)
    // For simplicity in this MVP, we'll let the parent control the "initial" state 
    // and just render what's passed, but React Flow needs its own state hooks for interactivity.

    // Actually, to make it truly reactive to new files, we should use the props to reset state.
    // The easiest way is to force re-mount by changing a key on the component when file changes.

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Sync props to state if they change (e.g. new file upload)
    React.useEffect(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [initialNodes, initialEdges, setNodes, setEdges]);

    return (
        <div className="w-full h-full bg-background relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                connectionMode={ConnectionMode.Loose}
                fitView
                className="bg-background"
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="#282828"
                />
                <Controls className="bg-secondary border border-border text-foreground fill-foreground" />
                <MiniMap
                    className="bg-secondary border border-border"
                    nodeColor="#5e6ad2"
                    maskColor="rgba(0, 0, 0, 0.6)"
                />
            </ReactFlow>

            {/* Inspector Panel - Sibling to ReactFlow */}
            <DetailsPanel
                selectedNode={selectedNode}
                onClose={onPanelClose || (() => { })}
            />
        </div>
    );
}
