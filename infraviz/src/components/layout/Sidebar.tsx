'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileCode, Database, Server, Box } from 'lucide-react';
import { TerraformResource } from '@/lib/types';
import clsx from 'clsx';

interface SidebarProps {
    onFileUpload: (content: string) => void;
    resources: TerraformResource[];
}

export function Sidebar({ onFileUpload, resources }: SidebarProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                onFileUpload(content);
            };
            reader.readAsText(file);
        }
    }, [onFileUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/plain': ['.tf', '.hcl'] },
        multiple: false
    });

    return (
        <aside className="w-80 border-r border-border bg-secondary/30 flex flex-col h-[calc(100vh-3.5rem)]">
            <div className="p-4 border-b border-border">
                <div
                    {...getRootProps()}
                    className={clsx(
                        "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors",
                        isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-white/5"
                    )}
                >
                    <input {...getInputProps()} />
                    <UploadCloud className="w-8 h-8 text-muted mb-2" />
                    <p className="text-sm text-muted font-medium">
                        {isDragActive ? "Drop main.tf here" : "Drag & drop main.tf"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">or click to browse</p>
                </div>

                {/* Debug/Test Button */}
                <button
                    onClick={() => {
                        const sample = `
provider "aws" {
  region = "eu-west-3"
}

# 1. Le Réseau (VPC)
resource "aws_vpc" "main_network" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "Mon-VPC-Production"
  }
}

# 2. Le Sous-réseau (Subnet)
resource "aws_subnet" "public_subnet" {
  vpc_id     = aws_vpc.main_network.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "eu-west-3a"
}

# 3. Le Groupe de Sécurité (Firewall)
resource "aws_security_group" "allow_web" {
  name        = "allow_http_traffic"
  description = "Allow inbound HTTP"
  vpc_id      = aws_vpc.main_network.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 4. Le Serveur (Instance EC2)
resource "aws_instance" "web_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  
  # Dépendance 1
  subnet_id = aws_subnet.public_subnet.id
  
  # Dépendance 2
  vpc_security_group_ids = [aws_security_group.allow_web.id]

  tags = {
    Name = "Mon-Serveur-Web"
  }
}

# 5. Stockage (S3)
resource "aws_s3_bucket" "logs_bucket" {
  bucket = "mon-super-saas-logs-v1"
}
                    `;
                        onFileUpload(sample);
                    }}
                    className="mt-4 w-full py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs text-gray-400 transition-colors"
                >
                    Load Sample Data
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Detected Resources ({resources.length})
                </h3>

                <div className="space-y-2">
                    {resources.length === 0 ? (
                        <p className="text-sm text-gray-600 italic">No resources yet.</p>
                    ) : (
                        resources.map((resource) => (
                            <div
                                key={resource.id}
                                className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 transition-colors group"
                            >
                                <ResourceIcon type={resource.type} />
                                <div className="overflow-hidden">
                                    <p className="text-sm font-medium text-gray-200 truncate">{resource.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{resource.type}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </aside>
    );
}

function ResourceIcon({ type }: { type: string }) {
    if (type.includes('s3')) return <Database className="w-4 h-4 text-yellow-500" />;
    if (type.includes('instance')) return <Server className="w-4 h-4 text-orange-500" />;
    if (type.includes('vpc')) return <Box className="w-4 h-4 text-purple-500" />;
    return <Box className="w-4 h-4 text-gray-500" />;
}
