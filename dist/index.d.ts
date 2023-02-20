import type { DNSResult } from "@lumeweb/libresolver";
import { DnsClient } from "@lumeweb/kernel-dns-client";
import { ResolverOptions } from "@lumeweb/libresolver/src/types.js";
export interface ResolverModule {
  get resolver(): DnsClient;
  set resolver(value: DnsClient);
  resolve(
    domain: string,
    options: ResolverOptions,
    bypassCache: boolean
  ): Promise<DNSResult>;
  getSupportedTlds(): string[];
  getSupportedTlds(): Promise<string[]>;
  getSupportedTlds(): any;
}
export declare function setup(rm: ResolverModule): void;
export * from "@lumeweb/libresolver/dist/util.js";
export * from "@lumeweb/libresolver/dist/types.js";
export { AbstractResolverModule } from "@lumeweb/libresolver/dist/resolverModule.js";
