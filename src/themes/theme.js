// Theme Configuration System
// Easy to swap themes by changing the active theme

export const themes = {
    // Default Purple Theme (Current)
    purple: {
        name: 'Purple Night',
        colors: {
            primary: '#8b5cf6',
            primaryLight: '#a78bfa',
            secondary: '#ec4899',
            accent: '#06b6d4',
            bgDark: '#0a0a0f',
            bgCard: 'rgba(20, 20, 30, 0.85)',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            text: '#ffffff',
            textMuted: 'rgba(255, 255, 255, 0.6)',
            textDim: 'rgba(255, 255, 255, 0.4)',
        },
        gradients: {
            primary: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            title: 'linear-gradient(135deg, #a78bfa, #f472b6, #22d3ee)',
            background: `
        radial-gradient(ellipse 80% 50% at 20% 40%, rgba(139, 92, 246, 0.12), transparent),
        radial-gradient(ellipse 60% 40% at 80% 60%, rgba(236, 72, 153, 0.08), transparent)
      `,
        }
    },

    // Pink Cute Theme (BeautyPlus Style)
    pink: {
        name: 'Pink Cute',
        colors: {
            primary: '#ff6b9d',
            primaryLight: '#ff8fb3',
            secondary: '#ff4081',
            accent: '#7c4dff',
            bgDark: '#fff5f8',
            bgCard: 'rgba(255, 255, 255, 0.95)',
            borderColor: 'rgba(255, 107, 157, 0.15)',
            text: '#333333',
            textMuted: 'rgba(51, 51, 51, 0.7)',
            textDim: 'rgba(51, 51, 51, 0.5)',
        },
        gradients: {
            primary: 'linear-gradient(135deg, #ff6b9d, #ff4081)',
            title: 'linear-gradient(135deg, #ff6b9d, #ff8fb3, #ffb6c1)',
            background: `
        radial-gradient(ellipse 80% 50% at 20% 40%, rgba(255, 107, 157, 0.15), transparent),
        radial-gradient(ellipse 60% 40% at 80% 60%, rgba(255, 64, 129, 0.1), transparent)
      `,
        }
    },

    // Minimal White Theme
    minimal: {
        name: 'Minimal White',
        colors: {
            primary: '#1a1a1a',
            primaryLight: '#333333',
            secondary: '#666666',
            accent: '#999999',
            bgDark: '#ffffff',
            bgCard: 'rgba(245, 245, 245, 0.95)',
            borderColor: 'rgba(0, 0, 0, 0.1)',
            text: '#1a1a1a',
            textMuted: 'rgba(26, 26, 26, 0.7)',
            textDim: 'rgba(26, 26, 26, 0.5)',
        },
        gradients: {
            primary: 'linear-gradient(135deg, #333333, #666666)',
            title: 'linear-gradient(135deg, #1a1a1a, #333333)',
            background: 'none',
        }
    }
};

// Apply theme to document
export function applyTheme(themeName = 'purple') {
    const theme = themes[themeName] || themes.purple;
    const root = document.documentElement;

    // Apply colors
    root.style.setProperty('--primary', theme.colors.primary);
    root.style.setProperty('--primary-light', theme.colors.primaryLight);
    root.style.setProperty('--secondary', theme.colors.secondary);
    root.style.setProperty('--accent', theme.colors.accent);
    root.style.setProperty('--bg-dark', theme.colors.bgDark);
    root.style.setProperty('--card-bg', theme.colors.bgCard);
    root.style.setProperty('--border-color', theme.colors.borderColor);
    root.style.setProperty('--text-color', theme.colors.text);
    root.style.setProperty('--text-muted', theme.colors.textMuted);
    root.style.setProperty('--text-dim', theme.colors.textDim);

    // Apply gradients
    root.style.setProperty('--gradient-primary', theme.gradients.primary);
    root.style.setProperty('--gradient-title', theme.gradients.title);
    root.style.setProperty('--gradient-background', theme.gradients.background);

    // Store current theme
    localStorage.setItem('photo-booth-theme', themeName);

    return theme;
}

// Get saved theme or default
export function getSavedTheme() {
    return localStorage.getItem('photo-booth-theme') || 'purple';
}

// Get list of available themes
export function getThemeList() {
    return Object.entries(themes).map(([key, theme]) => ({
        id: key,
        name: theme.name
    }));
}

export default { themes, applyTheme, getSavedTheme, getThemeList };
