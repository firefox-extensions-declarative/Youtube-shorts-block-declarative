import type { IStorage } from "./types/config";

let firstLoad = true;

export async function loadStorageConfig(
    managedPrecedence = true,
): Promise<IStorage> {
    const loadManaged = firstLoad;
    firstLoad = false;

    const local = (await chrome.storage.local.get(null)) as IStorage;

    if (!loadManaged) {
        return local;
    }

    let managed: IStorage = {};
    try {
        if (typeof chrome.storage.managed?.get === "function") {
            managed = (await chrome.storage.managed.get(null)) as IStorage;
        }
    } catch {
        // No managed policy configured, or unsupported browser.
    }

    return managedPrecedence
        ? { ...local, ...managed }
        : { ...managed, ...local };
}
