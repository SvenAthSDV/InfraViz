import React from 'react';

export const AwsEc2 = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="10" fill="#FF9900" />
        <path d="M78 45H68V32H78V22H68V9H58V22H42V9H32V22H22V32H32V45H22V55H32V68H22V78H32V91H42V78H58V91H68V78H78V68H68V55H78V45ZM58 68H42V55H58V68ZM58 45H42V32H58V45Z" fill="white" />
    </svg>
);

export const AwsS3 = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="10" fill="#569A31" />
        <path d="M22 22L50 9L78 22V45L50 58L22 45V22Z" fill="white" fillOpacity="0.8" />
        <path d="M22 52L50 39L78 52V75L50 88L22 75V52Z" fill="white" />
    </svg>
);

export const AwsVpc = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="10" fill="#8C4FFF" />
        <path d="M75 25H25V75H75V25ZM70 70H30V30H70V70Z" fill="white" />
        <path d="M35 35H65V65H35V35Z" fill="white" fillOpacity="0.5" />
    </svg>
);

export const AwsSubnet = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="10" fill="#0073BB" />
        <path d="M25 25H75V75H25V25ZM30 30V70H70V30H30Z" fill="white" />
        <rect x="35" y="35" width="10" height="10" fill="white" />
        <rect x="55" y="35" width="10" height="10" fill="white" />
        <rect x="35" y="55" width="10" height="10" fill="white" />
        <rect x="55" y="55" width="10" height="10" fill="white" />
    </svg>
);

export const AwsSecurityGroup = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="10" fill="#DD344C" />
        <path d="M50 15L80 25V50C80 70 50 85 50 85C50 85 20 70 20 50V25L50 15Z" stroke="white" strokeWidth="8" fill="none" />
        <path d="M50 35V65M35 50H65" stroke="white" strokeWidth="8" />
    </svg>
);

export const AwsRds = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="10" fill="#3B48CC" />
        <path d="M50 15C30 15 15 20 15 25V75C15 80 30 85 50 85C70 85 85 80 85 75V25C85 20 70 15 50 15ZM50 25C65 25 75 28 75 30C75 32 65 35 50 35C35 35 25 32 25 30C25 28 35 25 50 25ZM50 75C35 75 25 72 25 70V60C30 63 40 65 50 65C60 65 70 63 75 60V70C75 72 65 75 50 75Z" fill="white" />
    </svg>
);

export const AwsElb = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="10" fill="#8C4FFF" />
        <path d="M25 50L40 25H60L75 50L60 75H40L25 50Z" stroke="white" strokeWidth="5" fill="none" />
        <circle cx="35" cy="50" r="5" fill="white" />
        <circle cx="50" cy="35" r="5" fill="white" />
        <circle cx="65" cy="50" r="5" fill="white" />
        <circle cx="50" cy="65" r="5" fill="white" />
    </svg>
);
