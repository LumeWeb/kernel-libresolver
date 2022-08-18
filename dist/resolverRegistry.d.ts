import { DNSResult, ResolverOptions } from "@lumeweb/resolver-common";
export declare class ResolverRegistry {
  resolve(
    domain: string,
    options?: ResolverOptions,
    bypassCache?: boolean
  ): Promise<DNSResult>;
}
