// This module contains types that are visible in the documentation,
// but which cannot be imported from `@sveltejs/kit`. Care should
// be taken to avoid breaking changes when editing this file

import { RouteDefinition } from './index.js';

export interface AdapterEntry {
	/**
	 * HTTP サービス (例: serverless function) を一意に識別するための文字列で、重複を排除するために使用されます。
	 * 例えば、`/foo/a-[b]` と `/foo/[c]` は別のルート(routes)ですが、
	 * Netlify の _redirects ファイルではどちらも `/foo/:param` として表現されるので、ID を共有します
	 */
	id: string;

	/**
	 * 候補のルート(route)と現在のルート(route)を比較し、
	 * 候補のルートを現在のルートのフォールバック(fallback)として扱うべきかどうかを判断する関数です。
	 *
	 * Use cases:
	 * - Fallback pages: `/foo/[c]` is a fallback for `/foo/a-[b]`, and `/[...catchall]` is a fallback for all routes
	 * - Grouping routes that share a common `config`: `/foo` should be deployed to the edge, `/bar` and `/baz` should be deployed to a serverless function
	 */
	filter(route: RouteDefinition): boolean;

	/**
	 * エントリーが作成されると呼び出される関数です。
	 * ここで、関数をファイルシステムに書き込み、リダイレクトマニフェストを生成します。
	 */
	complete(entry: { generateManifest(opts: { relativePath: string }): string }): MaybePromise<void>;
}

// Based on https://github.com/josh-hemphill/csp-typed-directives/blob/latest/src/csp.types.ts
//
// MIT License
//
// Copyright (c) 2021-present, Joshua Hemphill
// Copyright (c) 2021, Tecnico Corporation
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

export namespace Csp {
	type ActionSource = 'strict-dynamic' | 'report-sample';
	type BaseSource =
		| 'self'
		| 'unsafe-eval'
		| 'unsafe-hashes'
		| 'unsafe-inline'
		| 'wasm-unsafe-eval'
		| 'none';
	type CryptoSource = `${'nonce' | 'sha256' | 'sha384' | 'sha512'}-${string}`;
	type FrameSource = HostSource | SchemeSource | 'self' | 'none';
	type HostNameScheme = `${string}.${string}` | 'localhost';
	type HostSource = `${HostProtocolSchemes}${HostNameScheme}${PortScheme}`;
	type HostProtocolSchemes = `${string}://` | '';
	type HttpDelineator = '/' | '?' | '#' | '\\';
	type PortScheme = `:${number}` | '' | ':*';
	type SchemeSource = 'http:' | 'https:' | 'data:' | 'mediastream:' | 'blob:' | 'filesystem:';
	type Source = HostSource | SchemeSource | CryptoSource | BaseSource;
	type Sources = Source[];
	type UriPath = `${HttpDelineator}${string}`;
}

export interface CspDirectives {
	'child-src'?: Csp.Sources;
	'default-src'?: Array<Csp.Source | Csp.ActionSource>;
	'frame-src'?: Csp.Sources;
	'worker-src'?: Csp.Sources;
	'connect-src'?: Csp.Sources;
	'font-src'?: Csp.Sources;
	'img-src'?: Csp.Sources;
	'manifest-src'?: Csp.Sources;
	'media-src'?: Csp.Sources;
	'object-src'?: Csp.Sources;
	'prefetch-src'?: Csp.Sources;
	'script-src'?: Array<Csp.Source | Csp.ActionSource>;
	'script-src-elem'?: Csp.Sources;
	'script-src-attr'?: Csp.Sources;
	'style-src'?: Array<Csp.Source | Csp.ActionSource>;
	'style-src-elem'?: Csp.Sources;
	'style-src-attr'?: Csp.Sources;
	'base-uri'?: Array<Csp.Source | Csp.ActionSource>;
	sandbox?: Array<
		| 'allow-downloads-without-user-activation'
		| 'allow-forms'
		| 'allow-modals'
		| 'allow-orientation-lock'
		| 'allow-pointer-lock'
		| 'allow-popups'
		| 'allow-popups-to-escape-sandbox'
		| 'allow-presentation'
		| 'allow-same-origin'
		| 'allow-scripts'
		| 'allow-storage-access-by-user-activation'
		| 'allow-top-navigation'
		| 'allow-top-navigation-by-user-activation'
	>;
	'form-action'?: Array<Csp.Source | Csp.ActionSource>;
	'frame-ancestors'?: Array<Csp.HostSource | Csp.SchemeSource | Csp.FrameSource>;
	'navigate-to'?: Array<Csp.Source | Csp.ActionSource>;
	'report-uri'?: Csp.UriPath[];
	'report-to'?: string[];

	'require-trusted-types-for'?: Array<'script'>;
	'trusted-types'?: Array<'none' | 'allow-duplicates' | '*' | string>;
	'upgrade-insecure-requests'?: boolean;

	/** @deprecated */
	'require-sri-for'?: Array<'script' | 'style' | 'script style'>;

	/** @deprecated */
	'block-all-mixed-content'?: boolean;

	/** @deprecated */
	'plugin-types'?: Array<`${string}/${string}` | 'none'>;

	/** @deprecated */
	referrer?: Array<
		| 'no-referrer'
		| 'no-referrer-when-downgrade'
		| 'origin'
		| 'origin-when-cross-origin'
		| 'same-origin'
		| 'strict-origin'
		| 'strict-origin-when-cross-origin'
		| 'unsafe-url'
		| 'none'
	>;
}

export type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

export interface Logger {
	(msg: string): void;
	success(msg: string): void;
	error(msg: string): void;
	warn(msg: string): void;
	minor(msg: string): void;
	info(msg: string): void;
}

export type MaybePromise<T> = T | Promise<T>;

export interface Prerendered {
	/**
	 * `path` と `{ file }` オブジェクトの map で、`/foo` という path に対応する `foo.html`、`/bar/` という path に対応する `bar/index.html`、となります。
	 */
	pages: Map<
		string,
		{
			/** .html ファイルのロケーションで、output ディレクトリからの相対です */
			file: string;
		}
	>;
	/**
	 * `path` と `{ type }` オブジェクトの map です。
	 */
	assets: Map<
		string,
		{
			/** アセット(asset) の MIME type です */
			type: string;
		}
	>;
	/**
	 * プリレンダリング中に発生したリダイレクトの map です。
	 */
	redirects: Map<
		string,
		{
			status: number;
			location: string;
		}
	>;
	/** プリレンダリングされた path の配列 (trailingSlash の設定に関わらず、末尾のスラッシュは取り除かれる) */
	paths: string[];
}

export interface PrerenderHttpErrorHandler {
	(details: {
		status: number;
		path: string;
		referrer: string | null;
		referenceType: 'linked' | 'fetched';
		message: string;
	}): void;
}

export interface PrerenderMissingIdHandler {
	(details: { path: string; id: string; referrers: string[]; message: string }): void;
}

export type PrerenderHttpErrorHandlerValue = 'fail' | 'warn' | 'ignore' | PrerenderHttpErrorHandler;
export type PrerenderMissingIdHandlerValue = 'fail' | 'warn' | 'ignore' | PrerenderMissingIdHandler;

export type PrerenderOption = boolean | 'auto';

export type PrerenderMap = Map<string, PrerenderOption>;

export interface RequestOptions {
	getClientAddress(): string;
	platform?: App.Platform;
}

export interface RouteSegment {
	content: string;
	dynamic: boolean;
	rest: boolean;
}

export type TrailingSlash = 'never' | 'always' | 'ignore';

/**
 * This doesn't actually exist, it's a way to better distinguish the type
 */
declare const uniqueSymbol: unique symbol;

export interface UniqueInterface {
	readonly [uniqueSymbol]: unknown;
}
