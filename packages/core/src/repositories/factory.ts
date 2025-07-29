import { RepositoryFactory, LotteryRepository, UserRepository, StoreRepository } from './interfaces';
import { HttpLotteryRepository, MockLotteryRepository } from './lottery.repository';
import { SupabaseUserRepository, MockUserRepository } from './user.repository';
import { HttpStoreRepository, MockStoreRepository } from './store.repository';

export class ProductionRepositoryFactory implements RepositoryFactory {
  createLotteryRepository(): LotteryRepository {
    return new HttpLotteryRepository();
  }

  createUserRepository(): UserRepository {
    return new SupabaseUserRepository();
  }

  createStoreRepository(): StoreRepository {
    return new HttpStoreRepository();
  }
}

export class TestRepositoryFactory implements RepositoryFactory {
  createLotteryRepository(): LotteryRepository {
    return new MockLotteryRepository();
  }

  createUserRepository(): UserRepository {
    return new MockUserRepository();
  }

  createStoreRepository(): StoreRepository {
    return new MockStoreRepository();
  }
}

// Singleton pattern for repository management
export class RepositoryManager {
  private static instance: RepositoryManager;
  private factory: RepositoryFactory;
  private repositories: {
    lottery?: LotteryRepository;
    user?: UserRepository;
    store?: StoreRepository;
  } = {};

  private constructor() {
    // Default to production factory
    this.factory = new ProductionRepositoryFactory();
  }

  static getInstance(): RepositoryManager {
    if (!RepositoryManager.instance) {
      RepositoryManager.instance = new RepositoryManager();
    }
    return RepositoryManager.instance;
  }

  setFactory(factory: RepositoryFactory): void {
    this.factory = factory;
    // Clear existing repositories when factory changes
    this.repositories = {};
  }

  getLotteryRepository(): LotteryRepository {
    if (!this.repositories.lottery) {
      this.repositories.lottery = this.factory.createLotteryRepository();
    }
    return this.repositories.lottery;
  }

  getUserRepository(): UserRepository {
    if (!this.repositories.user) {
      this.repositories.user = this.factory.createUserRepository();
    }
    return this.repositories.user;
  }

  getStoreRepository(): StoreRepository {
    if (!this.repositories.store) {
      this.repositories.store = this.factory.createStoreRepository();
    }
    return this.repositories.store;
  }

  // Utility method for testing
  reset(): void {
    this.repositories = {};
    this.factory = new ProductionRepositoryFactory();
  }
}

// Export convenience function
export function getRepository<T extends keyof RepositoryManager>(
  type: T
): ReturnType<RepositoryManager[T]> {
  const manager = RepositoryManager.getInstance();
  
  switch (type) {
    case 'getLotteryRepository':
      return manager.getLotteryRepository() as any;
    case 'getUserRepository':
      return manager.getUserRepository() as any;
    case 'getStoreRepository':
      return manager.getStoreRepository() as any;
    default:
      throw new Error(`Unknown repository type: ${type}`);
  }
}