'use client';

import React, { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { DiagramCanvas } from '@/components/diagram/DiagramCanvas';
import { parseTerraform } from '@/lib/parser';
import { generateGraph } from '@/lib/graph-utils';
import { TerraformResource, GraphData } from '@/lib/types';
import { Node, Edge } from 'reactflow';

export default function Home() {
    const [resources, setResources] = useState<TerraformResource[]>([]);
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    const handleFileUpload = (content: string) => {
        try {
            // 1. Parse
            const parsedResources = parseTerraform(content);
            setResources(parsedResources);

            // 2. Generate Graph
            const { nodes, edges } = generateGraph(parsedResources);
            setGraphData({ nodes, edges });
            setSelectedNode(null); // Reset selection on new upload

        } catch (error) {
            console.error("Failed to parse Terraform file:", error);
            alert("Error parsing file. Check console for details.");
        }
    };

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        console.log("Node clicked:", node);
        setSelectedNode(node);
    }, []);

    const onCloseDetails = () => setSelectedNode(null);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
            <Header />

            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar
                    onFileUpload={handleFileUpload}
                    resources={resources}
                />

                <main className="flex-1 relative">
                    {graphData.nodes.length > 0 ? (
                        <DiagramCanvas
                            initialNodes={graphData.nodes}
                            initialEdges={graphData.edges}
                        // onNodeClick={onNodeClick} // Interaction disabled for static export
                        // selectedNode={selectedNode}
                        // onPanelClose={onCloseDetails}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted">
                            <div className="text-center">
                                <p className="text-lg font-medium">No architecture to display</p>
                                <p className="text-sm">Upload a main.tf file to get started</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
