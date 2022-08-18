import { DNSResult, ResolverOptions } from "@lumeweb/resolver-common";
import { RpcNetwork } from "@lumeweb/kernel-rpc-client";
export declare class ResolverRegistry {
  private _rpcNetwork;
  constructor(network: RpcNetwork);
  get rpcNetwork(): RpcNetwork;
  resolve(
    domain: string,
    options?: ResolverOptions,
    bypassCache?: boolean
  ): Promise<DNSResult>;
}
export { RpcNetwork };
