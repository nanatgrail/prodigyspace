export interface StorageItem<T> {
  data: T;
  timestamp: number;
  version: string;
}

export class LocalStorageManager {
  private static instance: LocalStorageManager;
  private version = "1.0.0";

  static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  setItem<T>(key: string, data: T): void {
    try {
      const item: StorageItem<T> = {
        data,
        timestamp: Date.now(),
        version: this.version,
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed: StorageItem<T> = JSON.parse(item);

      // Check version compatibility
      if (parsed.version !== this.version) {
        console.warn(
          `Version mismatch for ${key}. Expected ${this.version}, got ${parsed.version}`
        );
        // Could implement migration logic here
      }

      return parsed.data;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }

  exportData(): string {
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key);
      }
    }
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, value as string);
      });
    } catch (error) {
      console.error("Error importing data:", error);
    }
  }
}

export const storage = LocalStorageManager.getInstance();

// Helper functions for backward compatibility
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  const item = storage.getItem<T>(key);
  return item !== null ? item : defaultValue;
}

export function saveToStorage<T>(key: string, data: T): void {
  storage.setItem(key, data);
}
