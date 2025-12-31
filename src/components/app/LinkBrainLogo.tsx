import React from 'react';

interface LinkBrainLogoProps {
    size?: number;
    variant?: 'icon' | 'white' | 'green';
    className?: string;
}

// Full app icon with solid background and rounded corners
const IconLogo = ({ size, className }: { size: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ borderRadius: '19.53%', overflow: 'hidden' }}>
        <rect width="512" height="512" rx="100" fill="#21DBA4" />
        <rect width="284.291" height="51.6892" rx="2" transform="matrix(-1 0 0 1 398.159 223.641)" fill="white" />
        <rect width="169.165" height="51.6892" rx="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 231.345 106.166)" fill="white" />
        <rect width="148.011" height="51.6892" rx="2" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 273.636 232.282)" fill="white" />
        <rect width="148.024" height="51.6121" rx="2" transform="matrix(-0.707107 0.707107 0.707107 0.707107 346.689 127.641)" fill="white" />
        <path d="M221.146 337.39C221.146 321.842 208.672 309.239 193.286 309.239C177.901 309.239 165.429 321.843 165.428 337.39C165.428 352.938 177.901 365.542 193.286 365.543V406L191.535 405.978C154.847 405.039 125.392 374.69 125.392 337.39C125.393 299.499 155.79 268.782 193.286 268.781C230.783 268.781 261.182 299.498 261.182 337.39L261.16 339.162C260.23 376.235 230.198 406 193.286 406V365.543C208.672 365.543 221.146 352.938 221.146 337.39Z" fill="white" />
        <path d="M345.922 337.39C345.921 321.842 333.579 309.239 318.355 309.239C303.132 309.239 290.791 321.843 290.791 337.39C290.791 352.938 303.132 365.542 318.355 365.543V406L316.622 405.978C280.321 405.039 251.176 374.69 251.176 337.39C251.176 299.499 281.253 268.782 318.355 268.781C355.458 268.781 385.536 299.498 385.536 337.39L385.515 339.162C384.595 376.235 354.878 406 318.355 406V365.543C333.579 365.543 345.922 352.938 345.922 337.39Z" fill="white" />
    </svg>
);

// White symbol only (for dark backgrounds)
const WhiteLogo = ({ size, className }: { size: number; className?: string }) => (
    <svg width={size} height={size * (300 / 285)} viewBox="0 0 285 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="284.291" height="51.6892" rx="2" transform="matrix(-1 0 0 1 284.291 117.475)" fill="white" />
        <rect width="169.165" height="51.6892" rx="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 117.477 0)" fill="white" />
        <rect width="148.011" height="51.6892" rx="2" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 159.768 126.116)" fill="white" />
        <rect width="148.024" height="51.6121" rx="2" transform="matrix(-0.707107 0.707107 0.707107 0.707107 232.821 21.4751)" fill="white" />
        <path d="M107.277 231.224C107.277 215.676 94.8036 203.073 79.4179 203.073C64.0326 203.073 51.5603 215.677 51.56 231.224C51.56 246.772 64.0324 259.376 79.4179 259.377V299.834L77.6664 299.812C40.979 298.873 11.5239 268.524 11.5239 231.224C11.5242 193.333 41.9213 162.616 79.4179 162.615C116.915 162.615 147.313 193.332 147.314 231.224L147.292 232.996C146.362 270.069 116.329 299.834 79.4179 299.834V259.377C94.8038 259.377 107.277 246.772 107.277 231.224Z" fill="white" />
        <path d="M232.053 231.224C232.053 215.676 219.711 203.073 204.487 203.073C189.264 203.073 176.923 215.677 176.922 231.224C176.922 246.772 189.263 259.376 204.487 259.377V299.834L202.754 299.812C166.453 298.873 137.308 268.524 137.308 231.224C137.308 193.333 167.385 162.616 204.487 162.615C241.589 162.615 271.667 193.332 271.668 231.224L271.646 232.996C270.726 270.069 241.01 299.834 204.487 299.834V259.377C219.711 259.377 232.053 246.772 232.053 231.224Z" fill="white" />
    </svg>
);

// Green symbol only (for light backgrounds)
const GreenLogo = ({ size, className }: { size: number; className?: string }) => (
    <svg width={size} height={size * (300 / 285)} viewBox="0 0 285 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="284.291" height="51.6892" rx="2" transform="matrix(-1 0 0 1 284.291 117.475)" fill="#21DBA4" />
        <rect width="169.165" height="51.6892" rx="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 117.477 0)" fill="#21DBA4" />
        <rect width="148.011" height="51.6892" rx="2" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 159.768 126.116)" fill="#21DBA4" />
        <rect width="148.024" height="51.6121" rx="2" transform="matrix(-0.707107 0.707107 0.707107 0.707107 232.821 21.4751)" fill="#21DBA4" />
        <path d="M107.277 231.224C107.277 215.676 94.8036 203.073 79.4179 203.073C64.0326 203.073 51.5603 215.677 51.56 231.224C51.56 246.772 64.0324 259.376 79.4179 259.377V299.834L77.6664 299.812C40.979 298.873 11.5239 268.524 11.5239 231.224C11.5242 193.333 41.9213 162.616 79.4179 162.615C116.915 162.615 147.313 193.332 147.314 231.224L147.292 232.996C146.362 270.069 116.329 299.834 79.4179 299.834V259.377C94.8038 259.377 107.277 246.772 107.277 231.224Z" fill="#21DBA4" />
        <path d="M232.053 231.224C232.053 215.676 219.711 203.073 204.487 203.073C189.264 203.073 176.923 215.677 176.922 231.224C176.922 246.772 189.263 259.376 204.487 259.377V299.834L202.754 299.812C166.453 298.873 137.308 268.524 137.308 231.224C137.308 193.333 167.385 162.616 204.487 162.615C241.589 162.615 271.667 193.332 271.668 231.224L271.646 232.996C270.726 270.069 241.01 299.834 204.487 299.834V259.377C219.711 259.377 232.053 246.772 232.053 231.224Z" fill="#21DBA4" />
    </svg>
);

export const LinkBrainLogo = ({ size = 32, variant = 'icon', className }: LinkBrainLogoProps) => {
    switch (variant) {
        case 'icon':
            return <IconLogo size={size} className={className} />;
        case 'white':
            return <WhiteLogo size={size} className={className} />;
        case 'green':
            return <GreenLogo size={size} className={className} />;
        default:
            return <IconLogo size={size} className={className} />;
    }
};
