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

export const limitFrequency = (fn: () => Promise<void>, milliseconds: number): () => Promise<void> => {
    let previousReturnTime = 0;
    let nextCall: Promise<void> | undefined;

    return async () => {
        if (nextCall) {
            await nextCall;
        } else {
            const timeSinceLastReturn = Date.now() - previousReturnTime;

            if (timeSinceLastReturn >= milliseconds) {
                nextCall = fn();
            } else {
                nextCall = new Promise<void>((resolve) => {
                    setTimeout(async () => {
                        await fn();
                        resolve();
                    }, milliseconds - timeSinceLastReturn);
                });
            }

            try {
                await nextCall;
            } catch (error) {
                console.error("Function execution failed", error);
            } finally {
                nextCall = undefined;
                previousReturnTime = Date.now();
            }
        }
    };
};

export default withLock;
