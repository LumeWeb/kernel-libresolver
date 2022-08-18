import {
  DNSResult,
  ResolverOptions,
  DNS_RECORD_TYPE,
  resolverError,
} from "@lumeweb/resolver-common";
import { resolve } from "@lumeweb/kernel-dns-client";

export class ResolverRegistry {
  public async resolve(
    domain: string,
    options: ResolverOptions = { type: DNS_RECORD_TYPE.DEFAULT },
    bypassCache: boolean = false
  ): Promise<DNSResult> {
    let result: DNSResult;

    try {
      result = await resolve(domain, options, bypassCache);
    } catch (e: any) {
      return resolverError(e);
    }

    return result;
  }
}
