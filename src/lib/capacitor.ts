import { Capacitor } from '@capacitor/core';

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform();

export async function initializeNativePlugins() {
  if (!isNative) return;

  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide();
  } catch (e) {
    console.warn('[Capacitor] SplashScreen error:', e);
  }

  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    if (platform === 'android') {
      await StatusBar.setBackgroundColor({ color: '#21DBA4' });
    }
    await StatusBar.setStyle({ style: Style.Dark });
  } catch (e) {
    console.warn('[Capacitor] StatusBar error:', e);
  }

  try {
    const { Keyboard } = await import('@capacitor/keyboard');
    Keyboard.addListener('keyboardWillShow', () => {
      document.body.classList.add('keyboard-open');
    });
    Keyboard.addListener('keyboardWillHide', () => {
      document.body.classList.remove('keyboard-open');
    });
  } catch (e) {
    console.warn('[Capacitor] Keyboard error:', e);
  }

  try {
    const { App } = await import('@capacitor/app');
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });
  } catch (e) {
    console.warn('[Capacitor] App error:', e);
  }
}

export async function setStatusBarForTheme(theme: 'light' | 'dark') {
  if (!isNative) return;
  
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    const style = theme === 'dark' ? Style.Light : Style.Dark;
    await StatusBar.setStyle({ style });
    
    if (platform === 'android') {
      const bgColor = theme === 'dark' ? '#0f172a' : '#ffffff';
      await StatusBar.setBackgroundColor({ color: bgColor });
    }
  } catch (e) {
    console.warn('[Capacitor] StatusBar theme error:', e);
  }
}
