import {
  DNSResult,
  ResolverOptions,
  ResolverModuleConstructor as ResolverModuleConstructorBase,
} from "@lumeweb/libresolver";
import { Client } from "@lumeweb/libkernel-universal";
export interface ResolverModuleConstructor
  extends ResolverModuleConstructorBase {
  new (resolver: ResolverRegistry): ResolverModule;
}
export declare class ResolverRegistry {
  get resolvers(): Promise<Set<ResolverModule>>;
  resolve(
    domain: string,
    options?: ResolverOptions,
    bypassCache?: boolean
  ): Promise<DNSResult>;
  register(resolver: ResolverModule): void;
  clear(): void;
}
export declare class ResolverModule extends Client {
  private resolver;
  private domain;
  constructor(resolver: ResolverRegistry, domain: string);
  resolve(
    domain: string,
    options: ResolverOptions,
    bypassCache: boolean
  ): Promise<DNSResult>;
  getSupportedTlds(): Promise<string[]>;
}
