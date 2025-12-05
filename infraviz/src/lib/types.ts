import { Node, Edge } from 'reactflow';

export interface TerraformResource {
    type: string;
    name: string;
    attributes: Record<string, any>;
    id: string; // constructed as `${type}.${name}`
}

export interface TerraformState {
    resources: TerraformResource[];
}

export interface GraphData {
    nodes: Node[];
    edges: Edge[];
}
