import { Node, Edge, MarkerType } from 'reactflow';
import dagre from 'dagre';
import { TerraformResource, GraphData } from './types';

// Map Terraform types to visual types/colors
const RESOURCE_TYPE_MAP: Record<string, { label: string; color: string; icon?: string }> = {
    'aws_instance': { label: 'EC2 Instance', color: 'orange' },
    'aws_s3_bucket': { label: 'S3 Bucket', color: 'yellow' },
    'aws_vpc': { label: 'VPC', color: 'purple' },
    'aws_subnet': { label: 'Subnet', color: 'blue' },
    'aws_security_group': { label: 'Security Group', color: 'red' },
    'aws_db_instance': { label: 'RDS Database', color: 'indigo' },
    'aws_lb': { label: 'Load Balancer', color: 'green' },
};

const NODE_WIDTH = 300;
const NODE_HEIGHT = 250; // Estimated average height for spec cards
const REGION_PADDING = 100;
const GROUP_PADDING = 80;

export function generateGraph(resources: TerraformResource[]): GraphData {
    let nodes: Node[] = [];
    const edges: Edge[] = [];

    // 1. Identify VPCs (Groups)
    const vpcResources = resources.filter(r => r.type === 'aws_vpc');
    const otherResources = resources.filter(r => r.type !== 'aws_vpc');

    // Create Global Region Node
    const regionNodeId = 'aws_region_global';
    nodes.push({
        id: regionNodeId,
        type: 'group', // Use default group or custom if we had one
        position: { x: 0, y: 0 },
        data: { label: 'AWS Region (eu-west-3)' },
        style: {
            width: 1000,
            height: 800,
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            zIndex: -2,
        },
    });

    // 2. Create Nodes
    // VPC Nodes (Groups) - now children of Region
    vpcResources.forEach(vpc => {
        nodes.push({
            id: vpc.id,
            type: 'custom',
            position: { x: 0, y: 0 },
            data: {
                label: vpc.name,
                type: 'VPC',
                resourceType: vpc.type,
                details: vpc.attributes,
            },
            parentNode: regionNodeId, // VPC is inside Region
            extent: 'parent',
            style: {
                width: 600,
                height: 400,
                backgroundColor: 'rgba(140, 79, 255, 0.05)', // AWS VPC Purple tint
                border: '1px dashed rgba(140, 79, 255, 0.3)',
                paddingTop: 60, // Added padding for header
                zIndex: -1,
            },
        });
    });

    // Other Nodes
    otherResources.forEach(resource => {
        const mapEntry = RESOURCE_TYPE_MAP[resource.type] || { label: resource.type, color: 'gray' };

        // Check for parent (VPC)
        let parentId: string | undefined;

        // 1. Direct VPC reference
        Object.values(resource.attributes).forEach(val => {
            if (typeof val === 'string' && val.includes('aws_vpc.')) {
                const match = resources.find(r => val.includes(r.id));
                if (match && match.type === 'aws_vpc') {
                    parentId = match.id;
                }
            }
        });

        // 2. Transitive VPC reference via Subnet
        if (!parentId) {
            Object.values(resource.attributes).forEach(val => {
                if (typeof val === 'string' && val.includes('aws_subnet.')) {
                    // Find the subnet
                    const subnetMatch = resources.find(r => val.includes(r.id));
                    if (subnetMatch) {
                        // Check if subnet has a VPC parent
                        // We can look at the subnet's attributes for vpc_id
                        Object.values(subnetMatch.attributes).forEach(subVal => {
                            if (typeof subVal === 'string' && subVal.includes('aws_vpc.')) {
                                const vpcMatch = resources.find(r => subVal.includes(r.id));
                                if (vpcMatch && vpcMatch.type === 'aws_vpc') {
                                    parentId = vpcMatch.id;
                                }
                            }
                        });
                    }
                }
            });
        }

        // If no VPC parent, assign to Region
        if (!parentId) {
            parentId = regionNodeId;
        }

        nodes.push({
            id: resource.id,
            type: 'custom',
            position: { x: 0, y: 0 },
            data: {
                label: resource.name,
                type: mapEntry.label,
                resourceType: resource.type,
                details: resource.attributes,
            },
            parentNode: parentId,
            extent: 'parent',
        });
    });

    // 3. Create Edges
    resources.forEach((sourceResource) => {
        Object.entries(sourceResource.attributes).forEach(([key, value]) => {
            if (typeof value === 'string') {
                const targetResource = resources.find(r => value.includes(r.id));

                if (targetResource && targetResource.id !== sourceResource.id) {
                    const isParent = nodes.find(n => n.id === sourceResource.id)?.parentNode === targetResource.id;

                    if (!isParent) {
                        edges.push({
                            id: `${sourceResource.id}-${targetResource.id}-${key}`,
                            source: targetResource.id,
                            target: sourceResource.id,
                            // Label hidden for cleaner look, could be added back as tooltip
                            type: 'smoothstep', // Cleaner edges
                            animated: false, // Less distracting
                            style: { stroke: '#666', strokeWidth: 1.5 },
                            markerEnd: {
                                type: MarkerType.ArrowClosed,
                                color: '#666',
                            },
                        });
                    }
                }
            }
        });
    });

    // 4. Auto-Layout with Dagre

    // A. Layout Region (Top-level items inside Region)
    // We need to layout the children of the Region node.
    // These children are: VPCs and Orphan Resources.

    const regionChildren = nodes.filter(n => n.parentNode === regionNodeId);
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setGraph({ rankdir: 'LR', ranksep: 100, nodesep: 50 });
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // Add nodes to dagre
    regionChildren.forEach(node => {
        dagreGraph.setNode(node.id, { width: node.style?.width || NODE_WIDTH, height: node.style?.height || NODE_HEIGHT });
    });

    // Add edges between region children
    edges.forEach(edge => {
        if (regionChildren.find(n => n.id === edge.source) && regionChildren.find(n => n.id === edge.target)) {
            dagreGraph.setEdge(edge.source, edge.target);
        }
    });

    dagre.layout(dagreGraph);

    // Apply positions to Region children
    let regionMaxX = 0;
    let regionMaxY = 0;

    regionChildren.forEach(node => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const width = typeof node.style?.width === 'number' ? node.style.width : NODE_WIDTH;
        const height = typeof node.style?.height === 'number' ? node.style.height : NODE_HEIGHT;

        node.position = {
            x: nodeWithPosition.x - width / 2 + REGION_PADDING,
            y: nodeWithPosition.y - height / 2 + REGION_PADDING,
        };

        // Track max dimensions for Region sizing
        const right = node.position.x + width;
        const bottom = node.position.y + height;
        if (right > regionMaxX) regionMaxX = right;
        if (bottom > regionMaxY) regionMaxY = bottom;
    });

    // Update Region Size
    const regionNode = nodes.find(n => n.id === regionNodeId);
    if (regionNode) {
        regionNode.style = {
            ...regionNode.style,
            width: regionMaxX + REGION_PADDING,
            height: regionMaxY + REGION_PADDING,
        };
    }

    // B. Inner Layout (for each VPC)
    vpcResources.forEach(vpc => {
        const children = nodes.filter(n => n.parentNode === vpc.id);
        if (children.length > 0) {
            const subGraph = new dagre.graphlib.Graph();
            subGraph.setGraph({ rankdir: 'TB', ranksep: 60, nodesep: 40 }); // Increased padding
            subGraph.setDefaultEdgeLabel(() => ({}));

            children.forEach(child => {
                subGraph.setNode(child.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
            });

            edges.forEach(edge => {
                if (children.find(n => n.id === edge.source) && children.find(n => n.id === edge.target)) {
                    subGraph.setEdge(edge.source, edge.target);
                }
            });

            dagre.layout(subGraph);

            let vpcMaxX = 0;
            let vpcMaxY = 0;

            children.forEach(child => {
                const nodeWithPosition = subGraph.node(child.id);
                child.position = {
                    x: nodeWithPosition.x - NODE_WIDTH / 2 + GROUP_PADDING,
                    y: nodeWithPosition.y - NODE_HEIGHT / 2 + GROUP_PADDING,
                };

                const right = child.position.x + NODE_WIDTH;
                const bottom = child.position.y + NODE_HEIGHT;
                if (right > vpcMaxX) vpcMaxX = right;
                if (bottom > vpcMaxY) vpcMaxY = bottom;
            });

            const vpcNode = nodes.find(n => n.id === vpc.id);
            if (vpcNode) {
                vpcNode.style = {
                    ...vpcNode.style,
                    width: vpcMaxX + GROUP_PADDING,
                    height: vpcMaxY + GROUP_PADDING,
                };

                // IMPORTANT: Since we changed VPC size, we technically need to re-run the Region layout 
                // because the VPC node is now larger.
                // For MVP, we can just hope the initial layout allocated enough space or we accept overlap.
                // To do it right, we should have calculated VPC sizes FIRST, then run Region layout.

                // Let's do a quick fix: Re-run Region layout? No, that's expensive/complex to structure here.
                // Instead, let's assume the initial layout used the DEFAULT size (600x400).
                // If the VPC grows bigger, it might overlap neighbors.
                // Ideally, we calculate inner layouts FIRST.
            }
        }
    });

    // RE-RUN Region Layout with correct VPC sizes
    // This is the correct order: Inner Layouts -> Get Sizes -> Outer Layout.

    // 1. Calculate Inner Layouts (VPCs)
    vpcResources.forEach(vpc => {
        const children = nodes.filter(n => n.parentNode === vpc.id);
        if (children.length > 0) {
            const subGraph = new dagre.graphlib.Graph();
            subGraph.setGraph({ rankdir: 'TB', ranksep: 300, nodesep: 100 }); // Drastically increased spacing
            subGraph.setDefaultEdgeLabel(() => ({}));

            children.forEach(child => {
                subGraph.setNode(child.id, { width: NODE_WIDTH, height: 400 }); // Increased estimated height for layout calculations
            });

            edges.forEach(edge => {
                if (children.find(n => n.id === edge.source) && children.find(n => n.id === edge.target)) {
                    subGraph.setEdge(edge.source, edge.target);
                }
            });

            dagre.layout(subGraph);

            let vpcMaxX = 0;
            let vpcMaxY = 0;

            const HEADER_HEIGHT = 80; // Height reserved for VPC header

            children.forEach(child => {
                const nodeWithPosition = subGraph.node(child.id);
                child.position = {
                    x: nodeWithPosition.x - NODE_WIDTH / 2 + GROUP_PADDING,
                    y: nodeWithPosition.y - NODE_HEIGHT / 2 + GROUP_PADDING + HEADER_HEIGHT, // Shift down for header
                };
                const right = child.position.x + NODE_WIDTH;
                const bottom = child.position.y + NODE_HEIGHT;
                if (right > vpcMaxX) vpcMaxX = right;
                if (bottom > vpcMaxY) vpcMaxY = bottom;
            });

            const vpcNode = nodes.find(n => n.id === vpc.id);
            if (vpcNode) {
                vpcNode.style = {
                    ...vpcNode.style,
                    width: Math.max(vpcMaxX + GROUP_PADDING, 600), // Min size
                    height: Math.max(vpcMaxY + GROUP_PADDING, 400),
                    paddingTop: HEADER_HEIGHT, // Ensure CSS matches layout
                };
            }
        }
    });

    // 2. Calculate Outer Layout (Region) using updated VPC sizes
    const regionGraph = new dagre.graphlib.Graph();
    regionGraph.setGraph({ rankdir: 'LR', ranksep: 200, nodesep: 100 });
    regionGraph.setDefaultEdgeLabel(() => ({}));

    regionChildren.forEach(node => {
        // Use the updated style width/height if available
        const width = typeof node.style?.width === 'number' ? node.style.width : NODE_WIDTH;
        const height = typeof node.style?.height === 'number' ? node.style.height : NODE_HEIGHT;
        regionGraph.setNode(node.id, { width, height });
    });

    edges.forEach(edge => {
        if (regionChildren.find(n => n.id === edge.source) && regionChildren.find(n => n.id === edge.target)) {
            regionGraph.setEdge(edge.source, edge.target);
        }
    });

    dagre.layout(regionGraph);

    regionMaxX = 0;
    regionMaxY = 0;

    regionChildren.forEach(node => {
        const nodeWithPosition = regionGraph.node(node.id);
        const width = typeof node.style?.width === 'number' ? node.style.width : NODE_WIDTH;
        const height = typeof node.style?.height === 'number' ? node.style.height : NODE_HEIGHT;

        node.position = {
            x: nodeWithPosition.x - width / 2 + REGION_PADDING,
            y: nodeWithPosition.y - height / 2 + REGION_PADDING,
        };

        const right = node.position.x + width;
        const bottom = node.position.y + height;
        if (right > regionMaxX) regionMaxX = right;
        if (bottom > regionMaxY) regionMaxY = bottom;
    });

    if (regionNode) {
        regionNode.style = {
            ...regionNode.style,
            width: regionMaxX + REGION_PADDING,
            height: regionMaxY + REGION_PADDING,
        };
    }

    return { nodes, edges };
}
