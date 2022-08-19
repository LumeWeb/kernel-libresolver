import { DNSResult, ResolverOptions } from "@lumeweb/resolver-common";
import { RpcNetwork } from "@lumeweb/kernel-rpc-client";
export declare class ResolverRegistry {
  private _rpcNetwork;
  constructor(network: RpcNetwork);
  get rpcNetwork(): RpcNetwork;
  get resolvers(): Promise<Set<ResolverModule>>;
  resolve(
    domain: string,
    options?: ResolverOptions,
    bypassCache?: boolean
  ): Promise<DNSResult>;
}
export declare class ResolverModule {
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
export { RpcNetwork };
