class LockManager {
    private locks: { [key: string]: boolean } = {};

    async acquireLock(key: string): Promise<void> {
        while (this.locks[key]) {
            await new Promise(resolve => setTimeout(resolve, 50)); // Wait before retrying
        }
        this.locks[key] = true;
    }

    releaseLock(key: string): void {
        delete this.locks[key];
    }
}

const lockManager = new LockManager();

const withLock = async (key: string, fn: () => Promise<void>): Promise<void> => {
    await lockManager.acquireLock(key);
    try {
        return await fn();
    } finally {
        lockManager.releaseLock(key);
    }
};

export default withLock;
