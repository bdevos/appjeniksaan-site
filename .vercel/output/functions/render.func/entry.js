import * as adapter from '@astrojs/vercel/serverless/entrypoint';
import { h, Component } from 'preact';
import render$1 from 'preact-render-to-string';
import { escape } from 'html-escaper';
/* empty css                           *//* empty css                           *//* empty css                        *//* empty css                          */import 'mime';
import 'kleur/colors';
import 'string-width';
import 'path-browserify';
import { compile } from 'path-to-regexp';

/**
 * Astro passes `children` as a string of HTML, so we need
 * a wrapper `div` to render that content as VNodes.
 *
 * As a bonus, we can signal to Preact that this subtree is
 * entirely static and will never change via `shouldComponentUpdate`.
 */
const StaticHtml = ({ value, name }) => {
	if (!value) return null;
	return h('astro-slot', { name, dangerouslySetInnerHTML: { __html: value } });
};

/**
 * This tells Preact to opt-out of re-rendering this subtree,
 * In addition to being a performance optimization,
 * this also allows other frameworks to attach to `children`.
 *
 * See https://preactjs.com/guide/v8/external-dom-mutations
 */
StaticHtml.shouldComponentUpdate = () => false;

const slotName$1 = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());

let originalConsoleError$1;
let consoleFilterRefs$1 = 0;

function check$1(Component$1, props, children) {
	if (typeof Component$1 !== 'function') return false;

	if (Component$1.prototype != null && typeof Component$1.prototype.render === 'function') {
		return Component.isPrototypeOf(Component$1);
	}

	useConsoleFilter$1();

	try {
		try {
			const { html } = renderToStaticMarkup$1(Component$1, props, children);
			if (typeof html !== 'string') {
				return false;
			}

			// There are edge cases (SolidJS) where Preact *might* render a string,
			// but components would be <undefined></undefined>

			return !/\<undefined\>/.test(html);
		} catch (err) {
			return false;
		}
	} finally {
		finishUsingConsoleFilter$1();
	}
}

function renderToStaticMarkup$1(Component, props, { default: children, ...slotted }) {
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		const name = slotName$1(key);
		slots[name] = h(StaticHtml, { value, name });
	}
	// Note: create newProps to avoid mutating `props` before they are serialized
	const newProps = { ...props, ...slots };
	const html = render$1(
		h(Component, newProps, children != null ? h(StaticHtml, { value: children }) : children)
	);
	return { html };
}

/**
 * Reduces console noise by filtering known non-problematic errors.
 *
 * Performs reference counting to allow parallel usage from async code.
 *
 * To stop filtering, please ensure that there always is a matching call
 * to `finishUsingConsoleFilter` afterwards.
 */
function useConsoleFilter$1() {
	consoleFilterRefs$1++;

	if (!originalConsoleError$1) {
		// eslint-disable-next-line no-console
		originalConsoleError$1 = console.error;

		try {
			// eslint-disable-next-line no-console
			console.error = filteredConsoleError$1;
		} catch (error) {
			// If we're unable to hook `console.error`, just accept it
		}
	}
}

/**
 * Indicates that the filter installed by `useConsoleFilter`
 * is no longer needed by the calling code.
 */
function finishUsingConsoleFilter$1() {
	consoleFilterRefs$1--;

	// Note: Instead of reverting `console.error` back to the original
	// when the reference counter reaches 0, we leave our hook installed
	// to prevent potential race conditions once `check` is made async
}

/**
 * Hook/wrapper function for the global `console.error` function.
 *
 * Ignores known non-problematic errors while any code is using the console filter.
 * Otherwise, simply forwards all arguments to the original function.
 */
function filteredConsoleError$1(msg, ...rest) {
	if (consoleFilterRefs$1 > 0 && typeof msg === 'string') {
		// In `check`, we attempt to render JSX components through Preact.
		// When attempting this on a React component, React may output
		// the following error, which we can safely filter out:
		const isKnownReactHookError =
			msg.includes('Warning: Invalid hook call.') &&
			msg.includes('https://reactjs.org/link/invalid-hook-call');
		if (isKnownReactHookError) return;
	}
	originalConsoleError$1(msg, ...rest);
}

const _renderer1 = {
	check: check$1,
	renderToStaticMarkup: renderToStaticMarkup$1,
};

const escapeHTML = escape;
class HTMLString extends String {
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7
};
function serializeArray(value) {
  return value.map((v) => convertToSerializedForm(v));
}
function serializeObject(value) {
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v)];
    })
  );
}
function convertToSerializedForm(value) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [PROP_TYPE.Map, JSON.stringify(serializeArray(Array.from(value)))];
    }
    case "[object Set]": {
      return [PROP_TYPE.Set, JSON.stringify(serializeArray(Array.from(value)))];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props) {
  return JSON.stringify(serializeObject(props));
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}

const HydrationDirectives = ["load", "idle", "media", "visible", "only"];
function extractDirectives(inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (HydrationDirectives.indexOf(extracted.hydration.directive) < 0) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${HydrationDirectives.map(
                (d) => `"client:${d}"`
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new Error(
              'Error: Media query must be provided for "client:media", similar to client:media="(max-width: 600px)"'
            );
          }
          break;
        }
      }
    } else if (key === "class:list") {
      extracted.props[key.slice(0, -5)] = serializeListValue(value);
    } else {
      extracted.props[key] = value;
    }
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport) {
    throw new Error(
      `Unable to resolve a componentExport for "${metadata.displayName}"! Please open an issue.`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  island.props["component-url"] = await result.resolve(componentUrl);
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(renderer.clientEntrypoint);
    island.props["props"] = escapeHTML(serializeProps(props));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  island.props["before-hydration-url"] = await result.resolve("astro:scripts/before-hydration.js");
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  return island;
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=a=>{const e=async()=>{await(await a())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)};`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()};`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}};`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=a=>{(async()=>await(await a())())()};`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(i,c,n)=>{const r=async()=>{await(await i())()};let s=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){s.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];s.observe(t)}};`;

var astro_island_prebuilt_default = `var a;{const l={0:t=>t,1:t=>JSON.parse(t,n),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,n)),5:t=>new Set(JSON.parse(t,n)),6:t=>BigInt(t),7:t=>new URL(t)},n=(t,r)=>{if(t===""||!Array.isArray(r))return r;const[e,i]=r;return e in l?l[e](i):void 0};customElements.get("astro-island")||customElements.define("astro-island",(a=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement?.closest("astro-island[ssr]"))return;const r=this.querySelectorAll("astro-slot"),e={},i=this.querySelectorAll("template[data-astro-template]");for(const s of i)!s.closest(this.tagName)?.isSameNode(this)||(e[s.getAttribute("data-astro-template")||"default"]=s.innerHTML,s.remove());for(const s of r)!s.closest(this.tagName)?.isSameNode(this)||(e[s.getAttribute("name")||"default"]=s.innerHTML);const o=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),n):{};this.hydrator(this)(this.Component,o,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((r,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate),await import(this.getAttribute("before-hydration-url"));const r=JSON.parse(this.getAttribute("opts"));Astro[this.getAttribute("client")](async()=>{const e=this.getAttribute("renderer-url"),[i,{default:o}]=await Promise.all([import(this.getAttribute("component-url")),e?import(e):()=>()=>{}]);return this.Component=i[this.getAttribute("component-export")||"default"],this.hydrator=o,this.hydrate},r,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},a.observedAttributes=["props"],a))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

class Metadata {
  constructor(filePathname, opts) {
    this.modules = opts.modules;
    this.hoisted = opts.hoisted;
    this.hydratedComponents = opts.hydratedComponents;
    this.clientOnlyComponents = opts.clientOnlyComponents;
    this.hydrationDirectives = opts.hydrationDirectives;
    this.mockURL = new URL(filePathname, "http://example.com");
    this.metadataCache = /* @__PURE__ */ new Map();
  }
  resolvePath(specifier) {
    if (specifier.startsWith(".")) {
      const resolved = new URL(specifier, this.mockURL).pathname;
      if (resolved.startsWith("/@fs") && resolved.endsWith(".jsx")) {
        return resolved.slice(0, resolved.length - 4);
      }
      return resolved;
    }
    return specifier;
  }
  getPath(Component) {
    const metadata = this.getComponentMetadata(Component);
    return (metadata == null ? void 0 : metadata.componentUrl) || null;
  }
  getExport(Component) {
    const metadata = this.getComponentMetadata(Component);
    return (metadata == null ? void 0 : metadata.componentExport) || null;
  }
  getComponentMetadata(Component) {
    if (this.metadataCache.has(Component)) {
      return this.metadataCache.get(Component);
    }
    const metadata = this.findComponentMetadata(Component);
    this.metadataCache.set(Component, metadata);
    return metadata;
  }
  findComponentMetadata(Component) {
    const isCustomElement = typeof Component === "string";
    for (const { module, specifier } of this.modules) {
      const id = this.resolvePath(specifier);
      for (const [key, value] of Object.entries(module)) {
        if (isCustomElement) {
          if (key === "tagName" && Component === value) {
            return {
              componentExport: key,
              componentUrl: id
            };
          }
        } else if (Component === value) {
          return {
            componentExport: key,
            componentUrl: id
          };
        }
      }
    }
    return null;
  }
}
function createMetadata(filePathname, options) {
  return new Metadata(filePathname, options);
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
async function* _render(child) {
  child = await child;
  if (child instanceof HTMLString) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await _render(value));
    }
  } else if (typeof child === "function") {
    yield* _render(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (child instanceof AstroComponent || Object.prototype.toString.call(child) === "[object AstroComponent]") {
    yield* renderAstroComponent(child);
  } else if (typeof child === "object" && Symbol.asyncIterator in child) {
    yield* child;
  } else {
    yield child;
  }
}
class AstroComponent {
  constructor(htmlParts, expressions) {
    this.htmlParts = htmlParts;
    this.expressions = expressions;
  }
  get [Symbol.toStringTag]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* _render(expression);
    }
  }
}
function isAstroComponent(obj) {
  return typeof obj === "object" && Object.prototype.toString.call(obj) === "[object AstroComponent]";
}
async function render(htmlParts, ...expressions) {
  return new AstroComponent(htmlParts, expressions);
}
function createComponent(cb) {
  cb.isAstroComponentFactory = true;
  return cb;
}
async function renderSlot(result, slotted, fallback) {
  if (slotted) {
    let iterator = _render(slotted);
    let content = "";
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        content += stringifyChunk(result, chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(content);
  }
  return fallback;
}
const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
const ClientOnlyPlaceholder = "astro-client-only";
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact"];
    default:
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/vue", "@astrojs/svelte"];
  }
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
async function renderComponent(result, displayName, Component, _props, slots = {}) {
  var _a;
  Component = await Component;
  if (Component === Fragment) {
    const children2 = await renderSlot(result, slots == null ? void 0 : slots.default);
    if (children2 == null) {
      return children2;
    }
    return markHTMLString(children2);
  }
  if (Component && typeof Component === "object" && Component["astro:html"]) {
    const children2 = {};
    if (slots) {
      await Promise.all(
        Object.entries(slots).map(
          ([key, value]) => renderSlot(result, value).then((output) => {
            children2[key] = output;
          })
        )
      );
    }
    const html2 = Component.render({ slots: children2 });
    return markHTMLString(html2);
  }
  if (Component && Component.isAstroComponentFactory) {
    async function* renderAstroComponentInline() {
      let iterable = await renderToIterable(result, Component, _props, slots);
      yield* iterable;
    }
    return renderAstroComponentInline();
  }
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(_props);
  let html = "";
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  if (Array.isArray(renderers) && renderers.length === 0 && typeof Component !== "string" && !componentIsHTMLElement(Component)) {
    const message = `Unable to render ${metadata.displayName}!

There are no \`integrations\` set in your \`astro.config.mjs\` file.
Did you mean to add ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`;
    throw new Error(message);
  }
  const children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
          children[key] = output;
        })
      )
    );
  }
  let renderer;
  if (metadata.hydrate !== "only") {
    if (Component && Component[Renderer]) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && renderers.length === 1) {
      renderer = renderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new Error(`Unable to render ${metadata.displayName}!

Using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.
Did you mean to pass <${metadata.displayName} client:only="${probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")}" />
`);
    } else if (typeof Component !== "string") {
      const matchingRenderers = renderers.filter((r) => probableRendererNames.includes(r.name));
      const plural = renderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new Error(`Unable to render ${metadata.displayName}!

There ${plural ? "are" : "is"} ${renderers.length} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render ${metadata.displayName}.

Did you mean to enable ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`);
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new Error(
      `${metadata.displayName} component has a \`client:${metadata.hydrate}\` directive, but no client entrypoint was provided by ${renderer.name}!`
    );
  }
  if (!html && typeof Component === "string") {
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroComponent(
      await render`<${Component}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Component) ? `/>` : `>${childSlots}</${Component}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
      return html;
    }
    return markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement$1("astro-island", island, false));
  }
  return renderAll();
}
function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value));
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toStyleString(value)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function spreadAttributes(values, name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}
const toIdent = (k) => k.trim().replace(/(?:(?<!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `let ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
async function renderToString(result, componentFactory, props, children) {
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    const response = Component;
    throw response;
  }
  let html = "";
  for await (const chunk of renderAstroComponent(Component)) {
    html += stringifyChunk(result, chunk);
  }
  return html;
}
async function renderToIterable(result, componentFactory, props, children) {
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    console.warn(
      `Returning a Response is only supported inside of page components. Consider refactoring this logic into something like a function that can be used in the page.`
    );
    const response = Component;
    throw response;
  }
  return renderAstroComponent(Component);
}
new TextEncoder();
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      return chunk.toString();
    }
  }
}
const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
const alreadyHeadRenderedResults = /* @__PURE__ */ new WeakSet();
function renderHead(result) {
  alreadyHeadRenderedResults.add(result);
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement$1("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement$1("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement$1("link", link, false));
  return markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
}
async function* maybeRenderHead(result) {
  if (alreadyHeadRenderedResults.has(result)) {
    return;
  }
  yield renderHead(result);
}
async function* renderAstroComponent(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of _render(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}
function renderElement$1(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const skipAstroJSXCheck = /* @__PURE__ */ new WeakSet();
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  if (isVNode(vnode)) {
    switch (true) {
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skipAstroJSXCheck.add(vnode.type);
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function" && !skipAstroJSXCheck.has(vnode.type)) {
        useConsoleFilter();
        try {
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2 && output2[AstroJSX]) {
            return await renderJSX(result, output2);
          } else if (!output2) {
            return await renderJSX(result, output2);
          }
        } catch (e) {
          skipAstroJSXCheck.add(vnode.type);
        } finally {
          finishUsingConsoleFilter();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponent(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponent(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let body = "";
        for await (const chunk of output) {
          let html = stringifyChunk(result, chunk);
          body += html;
        }
        return markHTMLString(body);
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
}

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

const $$metadata$c = createMetadata("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/Dots.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$f = createAstro("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/Dots.astro", "", "file:///Users/berry/Developer/appjeniksaan-site/");
const $$Dots = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
  Astro2.self = $$Dots;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return render`${maybeRenderHead($$result)}<ul class="astro-ZXBCQBNX">
  <li class="astro-ZXBCQBNX">*</li>
  <li class="astro-ZXBCQBNX">*</li>
  <li class="astro-ZXBCQBNX">*</li>
</ul>

`;
});

const $$file$c = "/Users/berry/Developer/appjeniksaan-site/src/components/Dots.astro";
const $$url$c = undefined;

const $$module1$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$c,
	default: $$Dots,
	file: $$file$c,
	url: $$url$c
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$b = createMetadata("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/Footer.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$e = createAstro("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/Footer.astro", "", "file:///Users/berry/Developer/appjeniksaan-site/");
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$Footer;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return render`${maybeRenderHead($$result)}<footer class="astro-DQCRUK2B">
  <div class="astro-DQCRUK2B">
    <ul class="astro-DQCRUK2B">
      <li class="astro-DQCRUK2B"><a href="/archive" class="astro-DQCRUK2B">Archive</a></li>
      <li class="astro-DQCRUK2B"><a href="/privacy" class="astro-DQCRUK2B">Privacy Policy</a></li>
      <li class="astro-DQCRUK2B"><a href="/contact" class="astro-DQCRUK2B">Contact</a></li>
    </ul>
  </div>
  <div class="copy astro-DQCRUK2B">
    Made with <a href="https://astro.build/" class="astro-DQCRUK2B">Astro</a> 🚀 + Hosted by ▲ <a href="https://vercel.com/" class="astro-DQCRUK2B">Vercel
    </a>
  </div>
</footer>

`;
});

const $$file$b = "/Users/berry/Developer/appjeniksaan-site/src/components/Footer.astro";
const $$url$b = undefined;

const $$module2$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$b,
	default: $$Footer,
	file: $$file$b,
	url: $$url$b
}, Symbol.toStringTag, { value: 'Module' }));

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$metadata$a = createMetadata("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/ColorScheme.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: ["./Toggle"], hydrationDirectives: /* @__PURE__ */ new Set(["only"]), hoisted: [] });
const $$Astro$d = createAstro("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/ColorScheme.astro", "", "file:///Users/berry/Developer/appjeniksaan-site/");
const $$ColorScheme = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$ColorScheme;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return render(_a || (_a = __template(["", '<div class="toggle astro-MRJU6F6S">\n  ', "\n</div>\n\n\n\n<script>\n  const setColorSchemeProperties = (colorScheme) => {\n    document.documentElement.style.setProperty(\n      '--text-color',\n      `var(--${colorScheme}-text-color)`\n    )\n    document.documentElement.style.setProperty(\n      '--background-color',\n      `var(--${colorScheme}-background-color)`\n    )\n    document.documentElement.style.setProperty(\n      '--highlight-color',\n      `var(--${colorScheme}-highlight-color)`\n    )\n  }\n\n  const setHeaderColorScheme = (colorScheme) => {\n    const headerElements = document.getElementsByTagName('header')\n\n    for (let headerElement of headerElements) {\n      headerElement.setAttribute('data-color-scheme', colorScheme)\n    }\n  }\n\n  if (\n    typeof localStorage !== 'undefined' &&\n    localStorage.getItem('colorScheme')\n  ) {\n    setColorSchemeProperties(localStorage.getItem('colorScheme'))\n    setHeaderColorScheme(localStorage.getItem('colorScheme'))\n  } else {\n    setHeaderColorScheme(\n      window.matchMedia('(prefers-color-scheme: dark)').matches\n        ? 'dark'\n        : 'light'\n    )\n  }\n<\/script>"], ["", '<div class="toggle astro-MRJU6F6S">\n  ', "\n</div>\n\n\n\n<script>\n  const setColorSchemeProperties = (colorScheme) => {\n    document.documentElement.style.setProperty(\n      '--text-color',\n      \\`var(--\\${colorScheme}-text-color)\\`\n    )\n    document.documentElement.style.setProperty(\n      '--background-color',\n      \\`var(--\\${colorScheme}-background-color)\\`\n    )\n    document.documentElement.style.setProperty(\n      '--highlight-color',\n      \\`var(--\\${colorScheme}-highlight-color)\\`\n    )\n  }\n\n  const setHeaderColorScheme = (colorScheme) => {\n    const headerElements = document.getElementsByTagName('header')\n\n    for (let headerElement of headerElements) {\n      headerElement.setAttribute('data-color-scheme', colorScheme)\n    }\n  }\n\n  if (\n    typeof localStorage !== 'undefined' &&\n    localStorage.getItem('colorScheme')\n  ) {\n    setColorSchemeProperties(localStorage.getItem('colorScheme'))\n    setHeaderColorScheme(localStorage.getItem('colorScheme'))\n  } else {\n    setHeaderColorScheme(\n      window.matchMedia('(prefers-color-scheme: dark)').matches\n        ? 'dark'\n        : 'light'\n    )\n  }\n<\/script>"])), maybeRenderHead($$result), renderComponent($$result, "Toggle", null, { "client:only": "preact", "client:component-hydration": "only", "class": "astro-MRJU6F6S", "client:component-path": $$metadata$a.resolvePath("./Toggle"), "client:component-export": "Toggle" }));
});

const $$file$a = "/Users/berry/Developer/appjeniksaan-site/src/components/ColorScheme.astro";
const $$url$a = undefined;

const $$module1$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$a,
	default: $$ColorScheme,
	file: $$file$a,
	url: $$url$a
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$9 = createMetadata("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/Header.astro", { modules: [{ module: $$module1$2, specifier: "../components/ColorScheme.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: ["./Logo"], hydrationDirectives: /* @__PURE__ */ new Set(["only"]), hoisted: [] });
const $$Astro$c = createAstro("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/Header.astro", "", "file:///Users/berry/Developer/appjeniksaan-site/");
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Header;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return render`${maybeRenderHead($$result)}<header data-color-scheme="light" class="astro-XVWATDPZ">
  <a href="/" class="astro-XVWATDPZ">
    ${renderComponent($$result, "Logo", null, { "client:only": "preact", "title": "Appjeniksaan", "client:component-hydration": "only", "class": "astro-XVWATDPZ", "client:component-path": $$metadata$9.resolvePath("./Logo"), "client:component-export": "Logo" })}
  </a>
  ${renderComponent($$result, "ColorScheme", $$ColorScheme, { "class": "astro-XVWATDPZ" })}
</header>

`;
});

const $$file$9 = "/Users/berry/Developer/appjeniksaan-site/src/components/Header.astro";
const $$url$9 = undefined;

const $$module3$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$9,
	default: $$Header,
	file: $$file$9,
	url: $$url$9
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$8 = createMetadata("/@fs/Users/berry/Developer/appjeniksaan-site/src/layouts/Layout.astro", { modules: [{ module: $$module1$3, specifier: "../components/Dots.astro", assert: {} }, { module: $$module2$5, specifier: "../components/Footer.astro", assert: {} }, { module: $$module3$2, specifier: "../components/Header.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$b = createAstro("/@fs/Users/berry/Developer/appjeniksaan-site/src/layouts/Layout.astro", "", "file:///Users/berry/Developer/appjeniksaan-site/");
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Layout;
  const { description, title, type = "website", url = "" } = Astro2.props;
  const siteTitle = "Appjeniksaan";
  const siteDescription = "My personal software development shop which lets me create sites and apps that I think are delightful or just fun to build";
  const host = "https://appjeniksaan.nl";
  const pageTitle = title ? `${title} - ${siteTitle}` : siteTitle;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return render`<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">

    <title>${pageTitle}</title>
    <meta property="og:title"${addAttribute(title ?? siteTitle, "content")}>

    <meta name="description"${addAttribute(description ?? siteDescription, "content")}>
    <meta property="og:description"${addAttribute(description ?? siteDescription, "content")}>

    <meta property="og:type"${addAttribute(type, "content")}>
    <meta property="og:url"${addAttribute(`${host}${url}`, "content")}>
    <link rel="canonical"${addAttribute(`${host}${url}`, "href")}>

    <meta name="twitter:card" content="summary">
    <meta name="twitter:creator" content="@appjeniksaan">

    <meta name="theme-color" content="#1a2b3b" media="(prefers-color-scheme: dark)">
    <meta name="theme-color" content="#f5f7f9">
  ${renderHead($$result)}</head>

  <body>
    <div class="container">
      ${renderComponent($$result, "Header", $$Header, {})}

      ${renderSlot($$result, $$slots["default"])}

      ${renderComponent($$result, "Dots", $$Dots, {})}
      ${renderComponent($$result, "Footer", $$Footer, {})}
    </div>

    
  </body>
</html>`;
});

const $$file$8 = "/Users/berry/Developer/appjeniksaan-site/src/layouts/Layout.astro";
const $$url$8 = undefined;

const $$module1$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$8,
	default: $$Layout,
	file: $$file$8,
	url: $$url$8
}, Symbol.toStringTag, { value: 'Module' }));

const html$9 = "<p>Appjeniksaan is my personal software development 🛠 shop which lets me create sites and apps that I think are delightful or just fun 🤪 to build 🚀. On this site I will try 🙈 to share the interesting info I bump into on the www 🌍</p>";

				const frontmatter$9 = {"file":"/Users/berry/Developer/appjeniksaan-site/src/snippet/about.md"};
				const file$9 = "/Users/berry/Developer/appjeniksaan-site/src/snippet/about.md";
				const url$9 = undefined;
				function rawContent$9() {
					return "Appjeniksaan is my personal software development 🛠 shop which lets me create sites and apps that I think are delightful or just fun 🤪 to build 🚀. On this site I will try 🙈 to share the interesting info I bump into on the www 🌍\n";
				}
				function compiledContent$9() {
					return html$9;
				}
				function getHeadings$9() {
					return [];
				}
				function getHeaders$9() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$9();
				}				async function Content$9() {
					const { layout, ...content } = frontmatter$9;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$9 });
					return contentFragment;
				}

const $$module2$4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$9,
	file: file$9,
	url: url$9,
	rawContent: rawContent$9,
	compiledContent: compiledContent$9,
	getHeadings: getHeadings$9,
	getHeaders: getHeaders$9,
	Content: Content$9,
	default: Content$9
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$7 = createMetadata("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/About.astro", { modules: [{ module: $$module1$3, specifier: "./Dots.astro", assert: {} }, { module: $$module2$4, specifier: "../snippet/about.md", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$a = createAstro("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/About.astro", "", "file:///Users/berry/Developer/appjeniksaan-site/");
const $$About = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$About;
  return render`${renderComponent($$result, "Dots", $$Dots, {})}

${maybeRenderHead($$result)}<section>
  ${renderComponent($$result, "About", Content$9, {})}
</section>`;
});

const $$file$7 = "/Users/berry/Developer/appjeniksaan-site/src/components/About.astro";
const $$url$7 = undefined;

const $$module2$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$7,
	default: $$About,
	file: $$file$7,
	url: $$url$7
}, Symbol.toStringTag, { value: 'Module' }));

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric"
});
const dayFormatter = new Intl.DateTimeFormat("en-US", { day: "2-digit" });
const monthFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long"
});

const $$module2$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	dateFormatter,
	dayFormatter,
	monthFormatter
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$6 = createMetadata("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/LinkedItem.astro", { modules: [{ module: $$module2$2, specifier: "../dateFormat", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$9 = createAstro("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/LinkedItem.astro", "", "file:///Users/berry/Developer/appjeniksaan-site/");
const $$LinkedItem = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$LinkedItem;
  const { item } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return render`${renderComponent($$result, "Fragment", Fragment, { "class": "astro-JD55QSH7" }, { "default": () => render`${maybeRenderHead($$result)}<h2 class="astro-JD55QSH7"><a${addAttribute(item.frontmatter.href, "href")} class="astro-JD55QSH7">${item.frontmatter.title}</a></h2><h4 class="astro-JD55QSH7">
    <a${addAttribute(item.url, "href")} class="astro-JD55QSH7">
      ${dateFormatter.format(new Date(item.frontmatter.date))}
    </a>
  </h4>${renderComponent($$result, "Fragment", Fragment, {}, { "default": () => render`${markHTMLString(item.compiledContent())}` })}` })}

`;
});

const $$file$6 = "/Users/berry/Developer/appjeniksaan-site/src/components/LinkedItem.astro";
const $$url$6 = undefined;

const $$module1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$6,
	default: $$LinkedItem,
	file: $$file$6,
	url: $$url$6
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$5 = createMetadata("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/PostItem.astro", { modules: [{ module: $$module2$2, specifier: "../dateFormat", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$8 = createAstro("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/PostItem.astro", "", "file:///Users/berry/Developer/appjeniksaan-site/");
const $$PostItem = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$PostItem;
  const { item } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return render`${renderComponent($$result, "Fragment", Fragment, { "class": "astro-NBOX3HEL" }, { "default": () => render`${maybeRenderHead($$result)}<h2 class="astro-NBOX3HEL"><a${addAttribute(item.url, "href")} class="astro-NBOX3HEL">${item.frontmatter.title}</a></h2><h4 class="astro-NBOX3HEL">
    ${dateFormatter.format(new Date(item.frontmatter.date))}
  </h4><p class="astro-NBOX3HEL">${item.frontmatter.description}</p>` })}

`;
});

const $$file$5 = "/Users/berry/Developer/appjeniksaan-site/src/components/PostItem.astro";
const $$url$5 = undefined;

const $$module2$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$5,
	default: $$PostItem,
	file: $$file$5,
	url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$4 = createMetadata("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/Item.astro", { modules: [{ module: $$module1, specifier: "./LinkedItem.astro", assert: {} }, { module: $$module2$1, specifier: "./PostItem.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$7 = createAstro("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/Item.astro", "", "file:///Users/berry/Developer/appjeniksaan-site/");
const $$Item = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Item;
  const { item } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return render`${maybeRenderHead($$result)}<article class="astro-OODSUVT4">
  ${item.type === "linked" ? render`${renderComponent($$result, "LinkedItem", $$LinkedItem, { "item": item, "class": "astro-OODSUVT4" })}` : render`${renderComponent($$result, "PostItem", $$PostItem, { "item": item, "class": "astro-OODSUVT4" })}`}
</article>`;
});

const $$file$4 = "/Users/berry/Developer/appjeniksaan-site/src/components/Item.astro";
const $$url$4 = undefined;

const $$module3$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$4,
	default: $$Item,
	file: $$file$4,
	url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const parseMonth = (date) => date.substring(0, 7);
const sortByDate = (a, b) => a.frontmatter.date.localeCompare(b.frontmatter.date) * -1;
const appendType = (type) => (item) => ({
  type,
  ...item
});
const sortAndLimit = (linked, posts, limit) => {
  return [...linked.map(appendType("linked")), ...posts.map(appendType("post"))].sort(sortByDate).slice(0, limit);
};
const splitByMonth = (items) => {
  return items.reduce((acc, item) => {
    const month = parseMonth(item.frontmatter.date);
    const items2 = acc[month] ?? [];
    return {
      ...acc,
      [month]: [...items2, item]
    };
  }, {});
};

const $$module4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	sortAndLimit,
	splitByMonth
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$3 = createMetadata("/@fs/Users/berry/Developer/appjeniksaan-site/src/pages/index.astro", { modules: [{ module: $$module1$1, specifier: "../layouts/Layout.astro", assert: {} }, { module: $$module2$3, specifier: "../components/About.astro", assert: {} }, { module: $$module3$1, specifier: "../components/Item.astro", assert: {} }, { module: $$module4, specifier: "../sortAndLimit", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$6 = createAstro("/@fs/Users/berry/Developer/appjeniksaan-site/src/pages/index.astro", "", "file:///Users/berry/Developer/appjeniksaan-site/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Index;
  const linked = Astro2.glob(Object.assign({"./linked/breaking-the-web-forward.md": () => Promise.resolve().then(() => _page5),"./linked/stop-reading-the-news.md": () => Promise.resolve().then(() => _page6),"./linked/the-faceless-other.md": () => Promise.resolve().then(() => _page7),"./linked/tracking-scrollview-offset-in-swiftui.md": () => Promise.resolve().then(() => _page4)}), () => "../pages/linked/*.md");
  const posts = Astro2.glob(Object.assign({"./posts/circular-progress-view-style-with-value.md": () => Promise.resolve().then(() => _page8),"./posts/pull-to-refresh.md": () => Promise.resolve().then(() => _page9)}), () => "../pages/posts/*.md");
  const items = sortAndLimit(await linked, await posts, 10);
  return render`${renderComponent($$result, "Layout", $$Layout, {}, { "default": () => render`${maybeRenderHead($$result)}<main>
    ${items.map((item) => render`${renderComponent($$result, "Item", $$Item, { "item": item })}`)}
  </main>${renderComponent($$result, "About", $$About, {})}` })}`;
});

const $$file$3 = "/Users/berry/Developer/appjeniksaan-site/src/pages/index.astro";
const $$url$3 = "";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$3,
	default: $$Index,
	file: $$file$3,
	url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$2 = createMetadata("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/ArchiveItem.astro", { modules: [{ module: $$module2$2, specifier: "../dateFormat", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$5 = createAstro("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/ArchiveItem.astro", "", "file:///Users/berry/Developer/appjeniksaan-site/");
const $$ArchiveItem = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$ArchiveItem;
  const { item } = Astro2.props;
  const day = dayFormatter.format(new Date(item.frontmatter.date));
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return render`${maybeRenderHead($$result)}<li class="astro-5LCHOKAY">
  <h4 class="astro-5LCHOKAY">${day}</h4>
  <span class="astro-5LCHOKAY">${item.type === "linked" ? "\u{1F517}" : "\u{1F4F0}"}</span>
  <h3 class="astro-5LCHOKAY"><a${addAttribute(item.url, "href")} class="astro-5LCHOKAY">${item.frontmatter.title}</a></h3>
</li>

`;
});

const $$file$2 = "/Users/berry/Developer/appjeniksaan-site/src/components/ArchiveItem.astro";
const $$url$2 = undefined;

const $$module2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$2,
	default: $$ArchiveItem,
	file: $$file$2,
	url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$1 = createMetadata("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/MonthHeader.astro", { modules: [{ module: $$module2$2, specifier: "../dateFormat", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$4 = createAstro("/@fs/Users/berry/Developer/appjeniksaan-site/src/components/MonthHeader.astro", "", "file:///Users/berry/Developer/appjeniksaan-site/");
const $$MonthHeader = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$MonthHeader;
  const { month: input } = Astro2.props;
  const [year, month] = input.split("-").map((value) => parseInt(value, 10));
  const date = monthFormatter.format(new Date(Date.UTC(year, month)));
  return render`${maybeRenderHead($$result)}<h2>${date}</h2>`;
});

const $$file$1 = "/Users/berry/Developer/appjeniksaan-site/src/components/MonthHeader.astro";
const $$url$1 = undefined;

const $$module3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$1,
	default: $$MonthHeader,
	file: $$file$1,
	url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata = createMetadata("/@fs/Users/berry/Developer/appjeniksaan-site/src/pages/archive.astro", { modules: [{ module: $$module1$1, specifier: "../layouts/Layout.astro", assert: {} }, { module: $$module2, specifier: "../components/ArchiveItem.astro", assert: {} }, { module: $$module3, specifier: "../components/MonthHeader.astro", assert: {} }, { module: $$module4, specifier: "../sortAndLimit", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$3 = createAstro("/@fs/Users/berry/Developer/appjeniksaan-site/src/pages/archive.astro", "", "file:///Users/berry/Developer/appjeniksaan-site/");
const $$Archive = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Archive;
  const linked = Astro2.glob(Object.assign({"./linked/breaking-the-web-forward.md": () => Promise.resolve().then(() => _page5),"./linked/stop-reading-the-news.md": () => Promise.resolve().then(() => _page6),"./linked/the-faceless-other.md": () => Promise.resolve().then(() => _page7),"./linked/tracking-scrollview-offset-in-swiftui.md": () => Promise.resolve().then(() => _page4)}), () => "../pages/linked/*.md");
  const posts = Astro2.glob(Object.assign({"./posts/circular-progress-view-style-with-value.md": () => Promise.resolve().then(() => _page8),"./posts/pull-to-refresh.md": () => Promise.resolve().then(() => _page9)}), () => "../pages/posts/*.md");
  const items = splitByMonth(sortAndLimit(await linked, await posts));
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return render`${renderComponent($$result, "Layout", $$Layout, { "title": "Archive", "class": "astro-J7232ZGM" }, { "default": () => render`${maybeRenderHead($$result)}<main class="astro-J7232ZGM">
    <h1 class="astro-J7232ZGM">🗄 Archive</h1>
    ${Object.keys(items).map((month) => render`<section class="astro-J7232ZGM">
        ${renderComponent($$result, "MonthHeader", $$MonthHeader, { "month": month, "class": "astro-J7232ZGM" })}
        <ul class="astro-J7232ZGM">
          ${items[month].map((item) => render`${renderComponent($$result, "ArchiveItem", $$ArchiveItem, { "item": item, "class": "astro-J7232ZGM" })}`)}
        </ul>
      </section>`)}
  </main>` })}

`;
});

const $$file = "/Users/berry/Developer/appjeniksaan-site/src/pages/archive.astro";
const $$url = "/archive";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata,
	default: $$Archive,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

createMetadata("/@fs/Users/berry/Developer/appjeniksaan-site/src/layouts/Page.astro", { modules: [{ module: $$module1$1, specifier: "../layouts/Layout.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$2 = createAstro("/@fs/Users/berry/Developer/appjeniksaan-site/src/layouts/Page.astro", "", "file:///Users/berry/Developer/appjeniksaan-site/");
const $$Page = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Page;
  const { content } = Astro2.props;
  return render`${renderComponent($$result, "Layout", $$Layout, { "title": content.title, "url": content.url }, { "default": () => render`${renderSlot($$result, $$slots["default"])}` })}`;
});

const html$8 = "<h1 id=\"contact\">Contact</h1>\n<p><a href=\"https://twitter.com/appjeniksaan\">@appjeniksaan</a> 🐦 or <a href=\"mailto:hello@appjeniksaan.nl\">hello@appjeniksaan.nl</a> 📧</p>";

				const frontmatter$8 = {"title":"Contact","layout":"../layouts/Page.astro","url":"/contact","file":"/Users/berry/Developer/appjeniksaan-site/src/pages/contact.md"};
				const file$8 = "/Users/berry/Developer/appjeniksaan-site/src/pages/contact.md";
				const url$8 = "/contact";
				function rawContent$8() {
					return "\n# Contact\n\n[@appjeniksaan](https://twitter.com/appjeniksaan) 🐦 or [hello@appjeniksaan.nl](mailto:hello@appjeniksaan.nl) 📧\n";
				}
				function compiledContent$8() {
					return html$8;
				}
				function getHeadings$8() {
					return [{"depth":1,"slug":"contact","text":"Contact"}];
				}
				function getHeaders$8() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$8();
				}				async function Content$8() {
					const { layout, ...content } = frontmatter$8;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$8 });
					return createVNode($$Page, { content, frontmatter: content, headings: getHeadings$8(), 'server:root': true, children: contentFragment });
				}

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$8,
	file: file$8,
	url: url$8,
	rawContent: rawContent$8,
	compiledContent: compiledContent$8,
	getHeadings: getHeadings$8,
	getHeaders: getHeaders$8,
	Content: Content$8,
	default: Content$8
}, Symbol.toStringTag, { value: 'Module' }));

const html$7 = "<p>Because I do not like complicated privacy policies, I want to keep this one as simple as I possibly can.</p>\n<h1 id=\"-privacy-policy\">🔏 Privacy Policy</h1>\n<ol>\n<li>This website does not collect any personal data</li>\n<li>This website does not track you</li>\n<li>This website does not use cookies</li>\n<li>This website does not use client-side analytics</li>\n</ol>\n<p>If I change this policy in the future, I will let visitors know on the homepage of this website.</p>\n<p>In case you have any concerns or think I am missing something, please reach out to <a href=\"mailto:hello@appjeniksaan.nl\">hello@appjeniksaan.nl</a>.</p>";

				const frontmatter$7 = {"title":"Privacy Policy","layout":"../layouts/Page.astro","url":"/privacy","file":"/Users/berry/Developer/appjeniksaan-site/src/pages/privacy.md"};
				const file$7 = "/Users/berry/Developer/appjeniksaan-site/src/pages/privacy.md";
				const url$7 = "/privacy";
				function rawContent$7() {
					return "\nBecause I do not like complicated privacy policies, I want to keep this one as simple as I possibly can.\n\n# 🔏 Privacy Policy\n\n1. This website does not collect any personal data\n2. This website does not track you\n3. This website does not use cookies\n4. This website does not use client-side analytics\n\nIf I change this policy in the future, I will let visitors know on the homepage of this website.\n\nIn case you have any concerns or think I am missing something, please reach out to [hello@appjeniksaan.nl](mailto:hello@appjeniksaan.nl).\n";
				}
				function compiledContent$7() {
					return html$7;
				}
				function getHeadings$7() {
					return [{"depth":1,"slug":"-privacy-policy","text":"🔏 Privacy Policy"}];
				}
				function getHeaders$7() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$7();
				}				async function Content$7() {
					const { layout, ...content } = frontmatter$7;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$7 });
					return createVNode($$Page, { content, frontmatter: content, headings: getHeadings$7(), 'server:root': true, children: contentFragment });
				}

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$7,
	file: file$7,
	url: url$7,
	rawContent: rawContent$7,
	compiledContent: compiledContent$7,
	getHeadings: getHeadings$7,
	getHeaders: getHeaders$7,
	Content: Content$7,
	default: Content$7
}, Symbol.toStringTag, { value: 'Module' }));

createMetadata("/@fs/Users/berry/Developer/appjeniksaan-site/src/layouts/Linked.astro", { modules: [{ module: $$module1$1, specifier: "../layouts/Layout.astro", assert: {} }, { module: $$module2$2, specifier: "../dateFormat", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$1 = createAstro("/@fs/Users/berry/Developer/appjeniksaan-site/src/layouts/Linked.astro", "", "file:///Users/berry/Developer/appjeniksaan-site/");
const $$Linked = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Linked;
  const { content } = Astro2.props;
  return render`${renderComponent($$result, "Layout", $$Layout, { "description": `Linked to: ${content.href}`, "title": content.title, "type": "article", "url": content.url }, { "default": () => render`${maybeRenderHead($$result)}<acticle>
    <h1>
      <a${addAttribute(content.href, "href")}>
        <span>${content.title}</span>
      </a>
    </h1>
    <h4>${dateFormatter.format(new Date(content.date))}</h4>
    ${renderSlot($$result, $$slots["default"])}
  </acticle>` })}`;
});

const html$6 = "<p>Adding a <code>ScrollView</code> in SwiftUI is really simple, but that simplicity comes with some limitations. <a href=\"https://swiftwithmajid.com/2020/09/24/mastering-scrollview-in-swiftui/\">This article</a> from <a href=\"https://swiftwithmajid.com\">Swift with Majid</a> helped me understand how you can track the current offset in a <code>ScrollView</code> with a <code>PreferenceKey</code>.</p>\n<p>For more information about using <code>PreferenceKey</code>, <a href=\"https://swiftwithmajid.com\">Swift with Majid</a> has you covered with the article: <a href=\"https://swiftwithmajid.com/2020/01/15/the-magic-of-view-preferences-in-swiftui/\">The magic of view preferences in SwiftUI</a></p>";

				const frontmatter$6 = {"title":"Tracking ScrollView offset in SwiftUI","href":"https://swiftwithmajid.com/2020/09/24/mastering-scrollview-in-swiftui/","date":"2021-05-03 08:46","layout":"../../layouts/Linked.astro","url":"/linked/tracking-scrollview-offset-in-swiftui","file":"/Users/berry/Developer/appjeniksaan-site/src/pages/linked/tracking-scrollview-offset-in-swiftui.md"};
				const file$6 = "/Users/berry/Developer/appjeniksaan-site/src/pages/linked/tracking-scrollview-offset-in-swiftui.md";
				const url$6 = "/linked/tracking-scrollview-offset-in-swiftui";
				function rawContent$6() {
					return "\nAdding a `ScrollView` in SwiftUI is really simple, but that simplicity comes with some limitations. [This article](https://swiftwithmajid.com/2020/09/24/mastering-scrollview-in-swiftui/) from [Swift with Majid](https://swiftwithmajid.com) helped me understand how you can track the current offset in a `ScrollView` with a `PreferenceKey`.\n\nFor more information about using `PreferenceKey`, [Swift with Majid](https://swiftwithmajid.com) has you covered with the article: [The magic of view preferences in SwiftUI](https://swiftwithmajid.com/2020/01/15/the-magic-of-view-preferences-in-swiftui/)\n";
				}
				function compiledContent$6() {
					return html$6;
				}
				function getHeadings$6() {
					return [];
				}
				function getHeaders$6() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$6();
				}				async function Content$6() {
					const { layout, ...content } = frontmatter$6;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$6 });
					return createVNode($$Linked, { content, frontmatter: content, headings: getHeadings$6(), 'server:root': true, children: contentFragment });
				}

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$6,
	file: file$6,
	url: url$6,
	rawContent: rawContent$6,
	compiledContent: compiledContent$6,
	getHeadings: getHeadings$6,
	getHeaders: getHeaders$6,
	Content: Content$6,
	default: Content$6
}, Symbol.toStringTag, { value: 'Module' }));

const html$5 = "<p>In the 2021 battle for the web, who is the bad guy? Google or Apple, both, neither? I really enjoyed this take by <a href=\"https://twitter.com/ppk\">@ppk</a>.</p>\n<p>Personally I am really grateful for everybody at Chrome getting us to this place, but a lot of new features of the recent years haven’t been all that exiting to me. Where will we go, we’ll see 👀.</p>";

				const frontmatter$5 = {"title":"Breaking the web forward","href":"https://www.quirksmode.org/blog/archives/2021/08/breaking_the_we.html","date":"2021-08-14 10:57","layout":"../../layouts/Linked.astro","url":"/linked/breaking-the-web-forward","file":"/Users/berry/Developer/appjeniksaan-site/src/pages/linked/breaking-the-web-forward.md"};
				const file$5 = "/Users/berry/Developer/appjeniksaan-site/src/pages/linked/breaking-the-web-forward.md";
				const url$5 = "/linked/breaking-the-web-forward";
				function rawContent$5() {
					return "\nIn the 2021 battle for the web, who is the bad guy? Google or Apple, both, neither? I really enjoyed this take by [@ppk](https://twitter.com/ppk).\n\nPersonally I am really grateful for everybody at Chrome getting us to this place, but a lot of new features of the recent years haven't been all that exiting to me. Where will we go, we'll see 👀.\n";
				}
				function compiledContent$5() {
					return html$5;
				}
				function getHeadings$5() {
					return [];
				}
				function getHeaders$5() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$5();
				}				async function Content$5() {
					const { layout, ...content } = frontmatter$5;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$5 });
					return createVNode($$Linked, { content, frontmatter: content, headings: getHeadings$5(), 'server:root': true, children: contentFragment });
				}

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$5,
	file: file$5,
	url: url$5,
	rawContent: rawContent$5,
	compiledContent: compiledContent$5,
	getHeadings: getHeadings$5,
	getHeaders: getHeaders$5,
	Content: Content$5,
	default: Content$5
}, Symbol.toStringTag, { value: 'Module' }));

const html$4 = "<p>At moments I am addicted to the news. Sometimes I break free for some time, but I always get sucked back in.</p>\n<p>This article resonates with my relation to the news and shares some good insights and how to deal with what we now call “news”.</p>\n<p>And this is an amazing quote: “Few things are as important to your quality of life as your choices about how to spend the precious resource of your free time.” ― Winifred Gallagher</p>";

				const frontmatter$4 = {"title":"Why You Should Stop Reading News","href":"https://fs.blog/2013/12/stop-reading-news/","date":"2021-09-25 06:47","layout":"../../layouts/Linked.astro","url":"/linked/stop-reading-the-news","file":"/Users/berry/Developer/appjeniksaan-site/src/pages/linked/stop-reading-the-news.md"};
				const file$4 = "/Users/berry/Developer/appjeniksaan-site/src/pages/linked/stop-reading-the-news.md";
				const url$4 = "/linked/stop-reading-the-news";
				function rawContent$4() {
					return "\nAt moments I am addicted to the news. Sometimes I break free for some time, but I always get sucked back in.\n\nThis article resonates with my relation to the news and shares some good insights and how to deal with what we now call \"news\".\n\nAnd this is an amazing quote: \"Few things are as important to your quality of life as your choices about how to spend the precious resource of your free time.\" ― Winifred Gallagher\n";
				}
				function compiledContent$4() {
					return html$4;
				}
				function getHeadings$4() {
					return [];
				}
				function getHeaders$4() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$4();
				}				async function Content$4() {
					const { layout, ...content } = frontmatter$4;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$4 });
					return createVNode($$Linked, { content, frontmatter: content, headings: getHeadings$4(), 'server:root': true, children: contentFragment });
				}

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$4,
	file: file$4,
	url: url$4,
	rawContent: rawContent$4,
	compiledContent: compiledContent$4,
	getHeadings: getHeadings$4,
	getHeaders: getHeaders$4,
	Content: Content$4,
	default: Content$4
}, Symbol.toStringTag, { value: 'Module' }));

const html$3 = "<p>”… pay attention to how you feel about things, not what the voice in your head tells you you’re supposed to care about. And then listen to those feelings. They’re smarter than you’d think.”</p>";

				const frontmatter$3 = {"title":"The Faceless Other","href":"https://sarvasvkulpati.com/blog/the-faceless-other","date":"2021-06-11 14:45","layout":"../../layouts/Linked.astro","url":"/linked/the-faceless-other","file":"/Users/berry/Developer/appjeniksaan-site/src/pages/linked/the-faceless-other.md"};
				const file$3 = "/Users/berry/Developer/appjeniksaan-site/src/pages/linked/the-faceless-other.md";
				const url$3 = "/linked/the-faceless-other";
				function rawContent$3() {
					return "\n\"... pay attention to how you feel about things, not what the voice in your head tells you you’re supposed to care about. And then listen to those feelings. They’re smarter than you’d think.\"\n";
				}
				function compiledContent$3() {
					return html$3;
				}
				function getHeadings$3() {
					return [];
				}
				function getHeaders$3() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$3();
				}				async function Content$3() {
					const { layout, ...content } = frontmatter$3;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$3 });
					return createVNode($$Linked, { content, frontmatter: content, headings: getHeadings$3(), 'server:root': true, children: contentFragment });
				}

const _page7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$3,
	file: file$3,
	url: url$3,
	rawContent: rawContent$3,
	compiledContent: compiledContent$3,
	getHeadings: getHeadings$3,
	getHeaders: getHeaders$3,
	Content: Content$3,
	default: Content$3
}, Symbol.toStringTag, { value: 'Module' }));

createMetadata("/@fs/Users/berry/Developer/appjeniksaan-site/src/layouts/Post.astro", { modules: [{ module: $$module1$1, specifier: "../layouts/Layout.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro = createAstro("/@fs/Users/berry/Developer/appjeniksaan-site/src/layouts/Post.astro", "", "file:///Users/berry/Developer/appjeniksaan-site/");
const $$Post = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Post;
  const { content } = Astro2.props;
  return render`${renderComponent($$result, "Layout", $$Layout, { "description": content.description, "title": content.title, "type": "article", "url": content.url }, { "default": () => render`${maybeRenderHead($$result)}<h1>${content.title}</h1><h2>${content.date}</h2>${renderSlot($$result, $$slots["default"])}` })}`;
});

const html$2 = "<p>The <code>ProgressView</code> in SwiftUI comes in two different distinct view styles (plus a default style):</p>\n<ol>\n<li><code>LinearProgressViewStyle</code></li>\n<li><code>CircularProgressViewStyle</code></li>\n</ol>\n<p>The <code>CircularProgressViewStyle</code> is the well known iOS spinner, but what if we want to use this <code>ProgressView</code> style to indicate progress.</p>\n<p>With SwiftUI view style modifiers, we can implement this ourselves. Here are the two SwiftUI styles and below is the new <code>ProgressViewStyle</code> we are creating, all controlled by a Slider:</p>\n<p><img src=\"/images/circular-progress-view-style-with-value/progress.gif\" alt=\"CircularWithValueProgressViewStyle\"></p>\n<h2 id=\"creating-a-progressviewstyle\">Creating a ProgressViewStyle</h2>\n<p>To create a <code>ProgressViewStyle</code> we have to define a <code>struct</code> that adopts the <code>ProgressViewStyle</code> protocol. Adopting this protocol will require us to implement a <code>makeBody</code> function in which we can build our own view.</p>\n<p>To create the base for our new progress view, we can render petals using multiple <code>Capsule</code> views. For every petal we increase the rotation so we get a flow like effect. To make sure we can place the petals in the right place relative to each other we will place them inside a <code>ZStack</code>.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #282A36; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #F286C4\">struct</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">CircularWithValueProgressViewStyle</span><span style=\"color: #F6F6F4\">: ProgressViewStyle {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">let</span><span style=\"color: #F6F6F4\"> petals </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">8</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">func</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #62E884\">makeBody</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #62E884; font-style: italic\">configuration</span><span style=\"color: #F6F6F4\">: Configuration) </span><span style=\"color: #F286C4\">-></span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">some</span><span style=\"color: #F6F6F4\"> View {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        GeometryReader { geometry </span><span style=\"color: #F286C4\">in</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            ZStack {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                </span><span style=\"color: #97E1F1\">ForEach</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #BF9EEE\">0</span><span style=\"color: #F286C4\">..&#x3C;</span><span style=\"color: #F6F6F4\">petals) { index </span><span style=\"color: #F286C4\">in</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                    VStack {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                        </span><span style=\"color: #97E1F1\">Capsule</span><span style=\"color: #F6F6F4\">()</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                            .</span><span style=\"color: #97E1F1\">fill</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">Color</span><span style=\"color: #F6F6F4\">(.systemGray2))</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                            .</span><span style=\"color: #97E1F1\">frame</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">width</span><span style=\"color: #F6F6F4\">: geometry.</span><span style=\"color: #BF9EEE\">size</span><span style=\"color: #F6F6F4\">.width </span><span style=\"color: #F286C4\">/</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">8</span><span style=\"color: #F6F6F4\">, </span><span style=\"color: #97E1F1\">height</span><span style=\"color: #F6F6F4\">: geometry.</span><span style=\"color: #BF9EEE\">size</span><span style=\"color: #F6F6F4\">.height </span><span style=\"color: #F286C4\">/</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">3</span><span style=\"color: #F6F6F4\">)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                            .</span><span style=\"color: #97E1F1\">offset</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">y</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #F286C4\">-</span><span style=\"color: #F6F6F4\">geometry.</span><span style=\"color: #BF9EEE\">size</span><span style=\"color: #F6F6F4\">.width </span><span style=\"color: #F286C4\">/</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">3</span><span style=\"color: #F6F6F4\">)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                            .</span><span style=\"color: #97E1F1\">rotationEffect</span><span style=\"color: #F6F6F4\">(.</span><span style=\"color: #97E1F1\">degrees</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1; font-style: italic\">Double</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #BF9EEE\">360</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">/</span><span style=\"color: #F6F6F4\"> petals </span><span style=\"color: #F286C4\">*</span><span style=\"color: #F6F6F4\"> index)))</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                    }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                    .</span><span style=\"color: #97E1F1\">frame</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">width</span><span style=\"color: #F6F6F4\">: geometry.</span><span style=\"color: #BF9EEE\">size</span><span style=\"color: #F6F6F4\">.width, </span><span style=\"color: #97E1F1\">height</span><span style=\"color: #F6F6F4\">: geometry.</span><span style=\"color: #BF9EEE\">size</span><span style=\"color: #F6F6F4\">.height)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        .</span><span style=\"color: #97E1F1\">frame</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">width</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #BF9EEE\">20</span><span style=\"color: #F6F6F4\">, </span><span style=\"color: #97E1F1\">height</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #BF9EEE\">20</span><span style=\"color: #F6F6F4\">)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">}</span></span></code></pre>\n<p>To use this new ProgressViewStyle, we would apply it to any ProgressView by adding the modifier <code>.progressViewStyle()</code>.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #282A36; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #97E1F1\">ProgressView</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">value</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #BF9EEE\">0.8</span><span style=\"color: #F6F6F4\">)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    .</span><span style=\"color: #97E1F1\">progressViewStyle</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">CircularWithValueProgressViewStyle</span><span style=\"color: #F6F6F4\">())</span></span></code></pre>\n<p>The above code will render a static view without the progress. The next step will be to add the ability to show the progress.</p>\n<p><img src=\"/images/circular-progress-view-style-with-value/static.png\" alt=\"Static ProgressViewStyle shows rendered petals\"></p>\n<h2 id=\"showing-progress\">Showing progress</h2>\n<p>The <code>ProgressView</code> from SwiftUI allows users to either provide a value from 0 to 1, or provide a value in combination with a total. Inside the View these values will be converted to a fraction completed (from 0 to 1). We can access this completion value in the <code>Configuration</code> provided to the <code>makeBody</code>: <code>configuration.fractionCompleted</code>.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #282A36; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #97E1F1\">ProgressView</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">value</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #BF9EEE\">0.8</span><span style=\"color: #F6F6F4\">) </span><span style=\"color: #7B7F8B\">// fractionCompleted will be 0.8</span></span>\n<span class=\"line\"><span style=\"color: #97E1F1\">ProgressView</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">value</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #BF9EEE\">80</span><span style=\"color: #F6F6F4\">, </span><span style=\"color: #97E1F1\">total</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #BF9EEE\">100</span><span style=\"color: #F6F6F4\">) </span><span style=\"color: #7B7F8B\">// fractionCompleted will also be 0.8</span></span></code></pre>\n<p>With the <code>fractionCompleted</code> we can use the index of each petal to determine whether the petal is visible. Because we have an exact value, we can also use opacity to indicate when the fraction is inbetween two petals. The following function will calculate the opacity based on the index and the completion.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #282A36; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">func</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #62E884\">petalOpacity</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #62E884\">for</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #FFB86C; font-style: italic\">index</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #97E1F1; font-style: italic\">Int</span><span style=\"color: #F6F6F4\">, </span><span style=\"color: #62E884; font-style: italic\">completed</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #97E1F1; font-style: italic\">Double</span><span style=\"color: #F286C4\">?</span><span style=\"color: #F6F6F4\">) </span><span style=\"color: #F286C4\">-></span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">Double</span><span style=\"color: #F6F6F4\"> {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">guard</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">let</span><span style=\"color: #F6F6F4\"> completed </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> completed </span><span style=\"color: #F286C4\">else</span><span style=\"color: #F6F6F4\"> {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #F286C4\">return</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">0.0</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">let</span><span style=\"color: #F6F6F4\"> petalFraction </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">1</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">/</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">Double</span><span style=\"color: #F6F6F4\">(petals)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">let</span><span style=\"color: #F6F6F4\"> petalCompleted </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> completed </span><span style=\"color: #F286C4\">-</span><span style=\"color: #F6F6F4\"> petalFraction </span><span style=\"color: #F286C4\">*</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">Double</span><span style=\"color: #F6F6F4\">(index)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">return</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1\">max</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #BF9EEE\">0</span><span style=\"color: #F6F6F4\">, </span><span style=\"color: #97E1F1\">min</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #BF9EEE\">1</span><span style=\"color: #F6F6F4\">, petalCompleted </span><span style=\"color: #F286C4\">*</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">Double</span><span style=\"color: #F6F6F4\">(petals)))</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">}</span></span></code></pre>\n<p>To avoid returning a value less than 0 or greater than 1, the result is passed into the <code>max</code> and <code>min</code> functions.</p>\n<p>We can now apply this opacity to the <code>Capsule</code> for each petal by adding the <code>.opacity()</code> modifier.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #282A36; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #97E1F1\">Capsule</span><span style=\"color: #F6F6F4\">()</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    .</span><span style=\"color: #97E1F1\">opacity</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">petalOpacity</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">for</span><span style=\"color: #F6F6F4\">: index, </span><span style=\"color: #97E1F1\">completed</span><span style=\"color: #F6F6F4\">: configuration.fractionCompleted))</span></span></code></pre>\n<p>Which will look like this for 80% completion.</p>\n<p><img src=\"/images/circular-progress-view-style-with-value/opacity.png\" alt=\"ProgressViewStyle adds opacity to show completion\"></p>\n<h2 id=\"adding-animation-when-progress-at-100\">Adding animation when progress at 100%</h2>\n<p>To make it extra clear to the user that the <code>ProgressView</code> is at 100%, we can add animation.</p>\n<p>What we could do is add the following modifiers to the <code>GeometryReader</code> view.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #282A36; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #F6F6F4\">.</span><span style=\"color: #97E1F1\">rotationEffect</span><span style=\"color: #F6F6F4\">(.</span><span style=\"color: #97E1F1\">degrees</span><span style=\"color: #F6F6F4\">(configuration.fractionCompleted </span><span style=\"color: #F286C4\">??</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">0</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">>=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">1</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">?</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">360</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">:</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">0</span><span style=\"color: #F6F6F4\">))</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">.</span><span style=\"color: #97E1F1\">animation</span><span style=\"color: #F6F6F4\">(configuration.fractionCompleted </span><span style=\"color: #F286C4\">??</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">0</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">>=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">1</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">?</span><span style=\"color: #F6F6F4\"> .linear.</span><span style=\"color: #97E1F1\">speed</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #BF9EEE\">0.1</span><span style=\"color: #F6F6F4\">).</span><span style=\"color: #97E1F1\">repeatForever</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">autoreverses</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #BF9EEE\">false</span><span style=\"color: #F6F6F4\">) </span><span style=\"color: #F286C4\">:</span><span style=\"color: #F6F6F4\"> .linear)</span></span></code></pre>\n<p>This will work when the progress value is updated from anywhere below <code>1</code> to <code>1</code>. But if our new view style is initialized at <code>1</code>, it would not start rotating. The reason for this behaviour is that the rotation effect will then start at 360 and never change. For SwiftUI to animate these values, the framework will need to have a start and end value to animate between. One value in the above case is not enough.</p>\n<p>To fix this situation, we can store whether we are animating in a <code>@State</code> variable which will always start as false, so we can trigger the animation no matter what the start value is.</p>\n<p>We can add this state value in <code>CircularWithValueProgressViewStyle</code> like any other SwiftUI state:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #282A36; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #F286C4\">@State</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">var</span><span style=\"color: #F6F6F4\"> isAnimating </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">false</span></span></code></pre>\n<p>This <code>isAnimating</code> state needs to be updated when the value of <code>configuration.fractionCompleted</code> changes. And in order to make sure that the view can also start animating when we initialize with value <code>1.0</code>, we will also set the <code>isAnimating</code> variable in the <code>.onAppear()</code> of our <code>ProgressViewStyle</code>.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #282A36; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #F6F6F4\">.onAppear {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    isAnimating </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> configuration.fractionCompleted </span><span style=\"color: #F286C4\">??</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">0</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">>=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">1</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">}</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">.</span><span style=\"color: #97E1F1\">onChange</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">of</span><span style=\"color: #F6F6F4\">: configuration.fractionCompleted, </span><span style=\"color: #97E1F1\">perform</span><span style=\"color: #F6F6F4\">: { value </span><span style=\"color: #F286C4\">in</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    withAnimation {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        isAnimating </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> value </span><span style=\"color: #F286C4\">??</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">0</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">>=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">1</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">})</span></span></code></pre>\n<p>Now we can add the animation like before, but with the <code>isAnimating</code> variable.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #282A36; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #F6F6F4\">.</span><span style=\"color: #97E1F1\">rotationEffect</span><span style=\"color: #F6F6F4\">(.</span><span style=\"color: #97E1F1\">degrees</span><span style=\"color: #F6F6F4\">(isAnimating </span><span style=\"color: #F286C4\">?</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">360</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">:</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">0</span><span style=\"color: #F6F6F4\">))</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">.</span><span style=\"color: #97E1F1\">animation</span><span style=\"color: #F6F6F4\">(isAnimating </span><span style=\"color: #F286C4\">?</span><span style=\"color: #F6F6F4\"> .linear.</span><span style=\"color: #97E1F1\">speed</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #BF9EEE\">0.1</span><span style=\"color: #F6F6F4\">).</span><span style=\"color: #97E1F1\">repeatForever</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">autoreverses</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #BF9EEE\">false</span><span style=\"color: #F6F6F4\">) </span><span style=\"color: #F286C4\">:</span><span style=\"color: #F6F6F4\"> .linear)</span></span></code></pre>\n<h2 id=\"show-the-progressview-label\">Show the ProgressView label</h2>\n<p>The SwiftUI <code>ProgressView</code> also supports providing a label, up till now we have ignored this. But to add it to our new <code>ProgressViewStyle</code> is straightforward.</p>\n<p>By wrapping the <code>GeometryReader</code> inside a <code>VStack</code>, we can put the label in the view by adding <code>configuration.label</code>.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #282A36; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #F6F6F4\">VStack {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    GeometryReader { geometry </span><span style=\"color: #F286C4\">in</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #7B7F8B\">// ...</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    }</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    configuration.label</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        .</span><span style=\"color: #97E1F1\">foregroundColor</span><span style=\"color: #F6F6F4\">(Color.gray)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">}</span></span></code></pre>\n<p>This will look like the image below.</p>\n<p><img src=\"/images/circular-progress-view-style-with-value/label.png\" alt=\"ProgressViewStyle with provided label\"></p>\n<h2 id=\"final-code\">Final code</h2>\n<p>Everything put together gives us the following <code>ProgressViewStyle</code>:</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #282A36; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #F286C4\">struct</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">CircularWithValueProgressViewStyle</span><span style=\"color: #F6F6F4\">: ProgressViewStyle {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">let</span><span style=\"color: #F6F6F4\"> petals </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">8</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">@State</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">var</span><span style=\"color: #F6F6F4\"> isAnimating </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">false</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">func</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #62E884\">makeBody</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #62E884; font-style: italic\">configuration</span><span style=\"color: #F6F6F4\">: Configuration) </span><span style=\"color: #F286C4\">-></span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">some</span><span style=\"color: #F6F6F4\"> View {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        VStack {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            GeometryReader { geometry </span><span style=\"color: #F286C4\">in</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                ZStack {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                    </span><span style=\"color: #97E1F1\">ForEach</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #BF9EEE\">0</span><span style=\"color: #F286C4\">..&#x3C;</span><span style=\"color: #F6F6F4\">petals) { index </span><span style=\"color: #F286C4\">in</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                        VStack {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                            </span><span style=\"color: #97E1F1\">Capsule</span><span style=\"color: #F6F6F4\">()</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                                .</span><span style=\"color: #97E1F1\">fill</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">Color</span><span style=\"color: #F6F6F4\">(.systemGray2))</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                                .</span><span style=\"color: #97E1F1\">opacity</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">petalOpacity</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">for</span><span style=\"color: #F6F6F4\">: index, </span><span style=\"color: #97E1F1\">completed</span><span style=\"color: #F6F6F4\">: configuration.fractionCompleted))</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                                .</span><span style=\"color: #97E1F1\">animation</span><span style=\"color: #F6F6F4\">(isAnimating </span><span style=\"color: #F286C4\">?</span><span style=\"color: #F6F6F4\"> .linear </span><span style=\"color: #F286C4\">:</span><span style=\"color: #F6F6F4\"> .</span><span style=\"color: #BF9EEE\">none</span><span style=\"color: #F6F6F4\">)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                                .</span><span style=\"color: #97E1F1\">frame</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">width</span><span style=\"color: #F6F6F4\">: geometry.</span><span style=\"color: #BF9EEE\">size</span><span style=\"color: #F6F6F4\">.width </span><span style=\"color: #F286C4\">/</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">8</span><span style=\"color: #F6F6F4\">, </span><span style=\"color: #97E1F1\">height</span><span style=\"color: #F6F6F4\">: geometry.</span><span style=\"color: #BF9EEE\">size</span><span style=\"color: #F6F6F4\">.height </span><span style=\"color: #F286C4\">/</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">3</span><span style=\"color: #F6F6F4\">)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                                .</span><span style=\"color: #97E1F1\">offset</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">y</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #F286C4\">-</span><span style=\"color: #F6F6F4\">geometry.</span><span style=\"color: #BF9EEE\">size</span><span style=\"color: #F6F6F4\">.width </span><span style=\"color: #F286C4\">/</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">3</span><span style=\"color: #F6F6F4\">)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                                .</span><span style=\"color: #97E1F1\">rotationEffect</span><span style=\"color: #F6F6F4\">(.</span><span style=\"color: #97E1F1\">degrees</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1; font-style: italic\">Double</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #BF9EEE\">360</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">/</span><span style=\"color: #F6F6F4\"> petals </span><span style=\"color: #F286C4\">*</span><span style=\"color: #F6F6F4\"> index)))</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                        }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                        .</span><span style=\"color: #97E1F1\">frame</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">width</span><span style=\"color: #F6F6F4\">: geometry.</span><span style=\"color: #BF9EEE\">size</span><span style=\"color: #F6F6F4\">.width, </span><span style=\"color: #97E1F1\">height</span><span style=\"color: #F6F6F4\">: geometry.</span><span style=\"color: #BF9EEE\">size</span><span style=\"color: #F6F6F4\">.height)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                    }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            .</span><span style=\"color: #97E1F1\">frame</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">width</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #BF9EEE\">20</span><span style=\"color: #F6F6F4\">, </span><span style=\"color: #97E1F1\">height</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #BF9EEE\">20</span><span style=\"color: #F6F6F4\">)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            .</span><span style=\"color: #97E1F1\">rotationEffect</span><span style=\"color: #F6F6F4\">(.</span><span style=\"color: #97E1F1\">degrees</span><span style=\"color: #F6F6F4\">(isAnimating </span><span style=\"color: #F286C4\">?</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">360</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">:</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">0</span><span style=\"color: #F6F6F4\">))</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            .</span><span style=\"color: #97E1F1\">animation</span><span style=\"color: #F6F6F4\">(isAnimating </span><span style=\"color: #F286C4\">?</span><span style=\"color: #F6F6F4\"> .linear.</span><span style=\"color: #97E1F1\">speed</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #BF9EEE\">0.1</span><span style=\"color: #F6F6F4\">).</span><span style=\"color: #97E1F1\">repeatForever</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">autoreverses</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #BF9EEE\">false</span><span style=\"color: #F6F6F4\">) </span><span style=\"color: #F286C4\">:</span><span style=\"color: #F6F6F4\"> .linear)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            .onAppear {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                isAnimating </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> configuration.fractionCompleted </span><span style=\"color: #F286C4\">??</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">0</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">>=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">1</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            .</span><span style=\"color: #97E1F1\">onChange</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">of</span><span style=\"color: #F6F6F4\">: configuration.fractionCompleted, </span><span style=\"color: #97E1F1\">perform</span><span style=\"color: #F6F6F4\">: { value </span><span style=\"color: #F286C4\">in</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                withAnimation {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                    isAnimating </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> value </span><span style=\"color: #F286C4\">??</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">0</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">>=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">1</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            })</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            configuration.label</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                .</span><span style=\"color: #97E1F1\">foregroundColor</span><span style=\"color: #F6F6F4\">(Color.gray)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    }</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">func</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #62E884\">petalOpacity</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #62E884\">for</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #FFB86C; font-style: italic\">index</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #97E1F1; font-style: italic\">Int</span><span style=\"color: #F6F6F4\">, </span><span style=\"color: #62E884; font-style: italic\">completed</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #97E1F1; font-style: italic\">Double</span><span style=\"color: #F286C4\">?</span><span style=\"color: #F6F6F4\">) </span><span style=\"color: #F286C4\">-></span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">Double</span><span style=\"color: #F6F6F4\"> {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #F286C4\">guard</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">let</span><span style=\"color: #F6F6F4\"> completed </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> completed </span><span style=\"color: #F286C4\">else</span><span style=\"color: #F6F6F4\"> {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            </span><span style=\"color: #F286C4\">return</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">0.0</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #F286C4\">let</span><span style=\"color: #F6F6F4\"> petalFraction </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">1</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">/</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">Double</span><span style=\"color: #F6F6F4\">(petals)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #F286C4\">let</span><span style=\"color: #F6F6F4\"> petalCompleted </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> completed </span><span style=\"color: #F286C4\">-</span><span style=\"color: #F6F6F4\"> petalFraction </span><span style=\"color: #F286C4\">*</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">Double</span><span style=\"color: #F6F6F4\">(index)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #F286C4\">return</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1\">max</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">min</span><span style=\"color: #F6F6F4\">(petalCompleted </span><span style=\"color: #F286C4\">*</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">Double</span><span style=\"color: #F6F6F4\">(petals), </span><span style=\"color: #BF9EEE\">1</span><span style=\"color: #F6F6F4\">), </span><span style=\"color: #BF9EEE\">0</span><span style=\"color: #F6F6F4\">)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">}</span></span></code></pre>";

				const frontmatter$2 = {"title":"Circular ProgressViewStyle with value in SwiftUI","date":"2021-05-03 13:30","description":"Creating a ProgressViewStyle in SwiftUI that shows the progress based on the provided value","layout":"../../layouts/Post.astro","url":"/posts/circular-progress-view-style-with-value","file":"/Users/berry/Developer/appjeniksaan-site/src/pages/posts/circular-progress-view-style-with-value.md"};
				const file$2 = "/Users/berry/Developer/appjeniksaan-site/src/pages/posts/circular-progress-view-style-with-value.md";
				const url$2 = "/posts/circular-progress-view-style-with-value";
				function rawContent$2() {
					return "\nThe `ProgressView` in SwiftUI comes in two different distinct view styles (plus a default style):\n\n1. `LinearProgressViewStyle`\n2. `CircularProgressViewStyle`\n\nThe `CircularProgressViewStyle` is the well known iOS spinner, but what if we want to use this `ProgressView` style to indicate progress.\n\nWith SwiftUI view style modifiers, we can implement this ourselves. Here are the two SwiftUI styles and below is the new `ProgressViewStyle` we are creating, all controlled by a Slider:\n\n![CircularWithValueProgressViewStyle](/images/circular-progress-view-style-with-value/progress.gif)\n\n## Creating a ProgressViewStyle\n\nTo create a `ProgressViewStyle` we have to define a `struct` that adopts the `ProgressViewStyle` protocol. Adopting this protocol will require us to implement a `makeBody` function in which we can build our own view.\n\nTo create the base for our new progress view, we can render petals using multiple `Capsule` views. For every petal we increase the rotation so we get a flow like effect. To make sure we can place the petals in the right place relative to each other we will place them inside a `ZStack`.\n\n```swift\nstruct CircularWithValueProgressViewStyle: ProgressViewStyle {\n    private let petals = 8\n\n    func makeBody(configuration: Configuration) -> some View {\n        GeometryReader { geometry in\n            ZStack {\n                ForEach(0..<petals) { index in\n                    VStack {\n                        Capsule()\n                            .fill(Color(.systemGray2))\n                            .frame(width: geometry.size.width / 8, height: geometry.size.height / 3)\n                            .offset(y: -geometry.size.width / 3)\n                            .rotationEffect(.degrees(Double(360 / petals * index)))\n                    }\n                    .frame(width: geometry.size.width, height: geometry.size.height)\n                }\n            }\n        }\n        .frame(width: 20, height: 20)\n    }\n}\n```\n\nTo use this new ProgressViewStyle, we would apply it to any ProgressView by adding the modifier `.progressViewStyle()`.\n\n```swift\nProgressView(value: 0.8)\n    .progressViewStyle(CircularWithValueProgressViewStyle())\n```\n\nThe above code will render a static view without the progress. The next step will be to add the ability to show the progress.\n\n![Static ProgressViewStyle shows rendered petals](/images/circular-progress-view-style-with-value/static.png)\n\n## Showing progress\n\nThe `ProgressView` from SwiftUI allows users to either provide a value from 0 to 1, or provide a value in combination with a total. Inside the View these values will be converted to a fraction completed (from 0 to 1). We can access this completion value in the `Configuration` provided to the `makeBody`: `configuration.fractionCompleted`.\n\n```swift\nProgressView(value: 0.8) // fractionCompleted will be 0.8\nProgressView(value: 80, total: 100) // fractionCompleted will also be 0.8\n```\n\nWith the `fractionCompleted` we can use the index of each petal to determine whether the petal is visible. Because we have an exact value, we can also use opacity to indicate when the fraction is inbetween two petals. The following function will calculate the opacity based on the index and the completion.\n\n```swift\nprivate func petalOpacity(for index: Int, completed: Double?) -> Double {\n    guard let completed = completed else {\n        return 0.0\n    }\n    let petalFraction = 1 / Double(petals)\n    let petalCompleted = completed - petalFraction * Double(index)\n\n    return max(0, min(1, petalCompleted * Double(petals)))\n}\n```\n\nTo avoid returning a value less than 0 or greater than 1, the result is passed into the `max` and `min` functions.\n\nWe can now apply this opacity to the `Capsule` for each petal by adding the `.opacity()` modifier.\n\n```swift\nCapsule()\n    .opacity(petalOpacity(for: index, completed: configuration.fractionCompleted))\n```\n\nWhich will look like this for 80% completion.\n\n![ProgressViewStyle adds opacity to show completion](/images/circular-progress-view-style-with-value/opacity.png)\n\n## Adding animation when progress at 100%\n\nTo make it extra clear to the user that the `ProgressView` is at 100%, we can add animation.\n\nWhat we could do is add the following modifiers to the `GeometryReader` view.\n\n```swift\n.rotationEffect(.degrees(configuration.fractionCompleted ?? 0 >= 1 ? 360 : 0))\n.animation(configuration.fractionCompleted ?? 0 >= 1 ? .linear.speed(0.1).repeatForever(autoreverses: false) : .linear)\n```\n\nThis will work when the progress value is updated from anywhere below `1` to `1`. But if our new view style is initialized at `1`, it would not start rotating. The reason for this behaviour is that the rotation effect will then start at 360 and never change. For SwiftUI to animate these values, the framework will need to have a start and end value to animate between. One value in the above case is not enough.\n\nTo fix this situation, we can store whether we are animating in a `@State` variable which will always start as false, so we can trigger the animation no matter what the start value is.\n\nWe can add this state value in `CircularWithValueProgressViewStyle` like any other SwiftUI state:\n\n```swift\n@State private var isAnimating = false\n```\n\nThis `isAnimating` state needs to be updated when the value of `configuration.fractionCompleted` changes. And in order to make sure that the view can also start animating when we initialize with value `1.0`, we will also set the `isAnimating` variable in the `.onAppear()` of our `ProgressViewStyle`.\n\n```swift\n.onAppear {\n    isAnimating = configuration.fractionCompleted ?? 0 >= 1\n}\n.onChange(of: configuration.fractionCompleted, perform: { value in\n    withAnimation {\n        isAnimating = value ?? 0 >= 1\n    }\n})\n```\n\nNow we can add the animation like before, but with the `isAnimating` variable.\n\n```swift\n.rotationEffect(.degrees(isAnimating ? 360 : 0))\n.animation(isAnimating ? .linear.speed(0.1).repeatForever(autoreverses: false) : .linear)\n```\n\n## Show the ProgressView label\n\nThe SwiftUI `ProgressView` also supports providing a label, up till now we have ignored this. But to add it to our new `ProgressViewStyle` is straightforward.\n\nBy wrapping the `GeometryReader` inside a `VStack`, we can put the label in the view by adding `configuration.label`.\n\n```swift\nVStack {\n    GeometryReader { geometry in\n        // ...\n    }\n\n    configuration.label\n        .foregroundColor(Color.gray)\n}\n```\n\nThis will look like the image below.\n\n![ProgressViewStyle with provided label](/images/circular-progress-view-style-with-value/label.png)\n\n## Final code\n\nEverything put together gives us the following `ProgressViewStyle`:\n\n```swift\nstruct CircularWithValueProgressViewStyle: ProgressViewStyle {\n    private let petals = 8\n\n    @State private var isAnimating = false\n\n    func makeBody(configuration: Configuration) -> some View {\n        VStack {\n            GeometryReader { geometry in\n                ZStack {\n                    ForEach(0..<petals) { index in\n                        VStack {\n                            Capsule()\n                                .fill(Color(.systemGray2))\n                                .opacity(petalOpacity(for: index, completed: configuration.fractionCompleted))\n                                .animation(isAnimating ? .linear : .none)\n                                .frame(width: geometry.size.width / 8, height: geometry.size.height / 3)\n                                .offset(y: -geometry.size.width / 3)\n                                .rotationEffect(.degrees(Double(360 / petals * index)))\n                        }\n                        .frame(width: geometry.size.width, height: geometry.size.height)\n                    }\n                }\n            }\n            .frame(width: 20, height: 20)\n            .rotationEffect(.degrees(isAnimating ? 360 : 0))\n            .animation(isAnimating ? .linear.speed(0.1).repeatForever(autoreverses: false) : .linear)\n            .onAppear {\n                isAnimating = configuration.fractionCompleted ?? 0 >= 1\n            }\n            .onChange(of: configuration.fractionCompleted, perform: { value in\n                withAnimation {\n                    isAnimating = value ?? 0 >= 1\n                }\n            })\n\n            configuration.label\n                .foregroundColor(Color.gray)\n        }\n    }\n\n    private func petalOpacity(for index: Int, completed: Double?) -> Double {\n        guard let completed = completed else {\n            return 0.0\n        }\n        let petalFraction = 1 / Double(petals)\n        let petalCompleted = completed - petalFraction * Double(index)\n\n        return max(min(petalCompleted * Double(petals), 1), 0)\n    }\n}\n```\n";
				}
				function compiledContent$2() {
					return html$2;
				}
				function getHeadings$2() {
					return [{"depth":2,"slug":"creating-a-progressviewstyle","text":"Creating a ProgressViewStyle"},{"depth":2,"slug":"showing-progress","text":"Showing progress"},{"depth":2,"slug":"adding-animation-when-progress-at-100","text":"Adding animation when progress at 100%"},{"depth":2,"slug":"show-the-progressview-label","text":"Show the ProgressView label"},{"depth":2,"slug":"final-code","text":"Final code"}];
				}
				function getHeaders$2() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$2();
				}				async function Content$2() {
					const { layout, ...content } = frontmatter$2;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$2 });
					return createVNode($$Post, { content, frontmatter: content, headings: getHeadings$2(), 'server:root': true, children: contentFragment });
				}

const _page8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$2,
	file: file$2,
	url: url$2,
	rawContent: rawContent$2,
	compiledContent: compiledContent$2,
	getHeadings: getHeadings$2,
	getHeaders: getHeaders$2,
	Content: Content$2,
	default: Content$2
}, Symbol.toStringTag, { value: 'Module' }));

const html$1 = "<h3 id=\"deprecation-warning\">Deprecation warning</h3>\n<p>2021-06-11: Please be aware that with the introduction of iOS 15 and the SwiftUI additions for 2021, this functionality is build into SwiftUI: <a href=\"https://developer.apple.com/documentation/SwiftUI/View/refreshable(action:)\">refreshable(action:)</a></p>\n<hr>\n<p>Yesterday I wrote an article about creating a <a href=\"/posts/2021/05/03/circular-progress-view-style-with-value\">CircularProgressView which could show the progress</a>. Today I wanted to write about how you could use that <code>ProgressViewStyle</code> in creating a ScrollView with pull to request functionality.</p>\n<p>I wanted to create this pull to refresh functionality after <a href=\"https://swiftwithmajid.com/2020/09/24/mastering-scrollview-in-swiftui/\">reading about tracking the scroll offset</a> in the <code>ScrollView</code>.</p>\n<p><img src=\"/images/pull-to-refresh/pull-to-refresh.gif\" alt=\"CircularWithValueProgressViewStyle\"></p>\n<h2 id=\"using-a-preferencekey-to-track-offset-in-scrollview\">Using a PreferenceKey to track offset in ScrollView</h2>\n<p>To track the offset in the ScrollView we need to introduce a <code>PreferenceKey</code>.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #282A36; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">struct</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">OffsetPreferenceKey</span><span style=\"color: #F6F6F4\">: PreferenceKey {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">static</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">var</span><span style=\"color: #F6F6F4\"> defaultValue: CGFloat </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> .zero</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">static</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">func</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #62E884\">reduce</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #62E884; font-style: italic\">value</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #F286C4\">inout</span><span style=\"color: #F6F6F4\"> CGFloat, </span><span style=\"color: #62E884; font-style: italic\">nextValue</span><span style=\"color: #F6F6F4\">: () </span><span style=\"color: #F286C4\">-></span><span style=\"color: #F6F6F4\"> CGFloat) {}</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">}</span></span></code></pre>\n<p>Which we can then use to track the offset from a <code>GeometryReader</code> in the background of a <code>ScrollView</code>.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #282A36; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #97E1F1\">ScrollView</span><span style=\"color: #F6F6F4\">(.vertical) {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    content</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        .</span><span style=\"color: #97E1F1\">background</span><span style=\"color: #F6F6F4\">(</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            GeometryReader { geometry </span><span style=\"color: #F286C4\">in</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                Color.clear</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                    .</span><span style=\"color: #97E1F1\">preference</span><span style=\"color: #F6F6F4\">(</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                        </span><span style=\"color: #97E1F1\">key</span><span style=\"color: #F6F6F4\">: OffsetPreferenceKey.</span><span style=\"color: #F286C4\">self</span><span style=\"color: #F6F6F4\">,</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                        </span><span style=\"color: #97E1F1\">value</span><span style=\"color: #F6F6F4\">: geometry.</span><span style=\"color: #97E1F1\">frame</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">in</span><span style=\"color: #F6F6F4\">: .</span><span style=\"color: #97E1F1\">named</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #DEE492\">\"</span><span style=\"color: #E7EE98\">pullToRefresh</span><span style=\"color: #DEE492\">\"</span><span style=\"color: #F6F6F4\">)).origin.y</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                    )</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        )</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">}</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">.</span><span style=\"color: #97E1F1\">coordinateSpace</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">name</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #DEE492\">\"</span><span style=\"color: #E7EE98\">pullToRefresh</span><span style=\"color: #DEE492\">\"</span><span style=\"color: #F6F6F4\">)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">.</span><span style=\"color: #97E1F1\">onPreferenceChange</span><span style=\"color: #F6F6F4\">(OffsetPreferenceKey.</span><span style=\"color: #F286C4\">self</span><span style=\"color: #F6F6F4\">, </span><span style=\"color: #97E1F1\">perform</span><span style=\"color: #F6F6F4\">: { </span><span style=\"color: #BF9EEE\">_</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">in</span><span style=\"color: #F6F6F4\"> })</span></span></code></pre>\n<p>The <code>content</code> in the code above comes from a <code>@ViewBuilder</code> that we will initialize our view with. To track the offset, the next step is to implement the function that is triggered by <code>.onPreferenceChange()</code>.</p>\n<h2 id=\"show-indicator-when-refresh-will-be-triggered\">Show indicator when refresh will be triggered</h2>\n<p>To show the user how much further he has to move the <code>ScrollView</code> to trigger a refresh, we can use the <code>ProgressView</code> in an overlay with the <a href=\"/posts/2021/05/03/circular-progress-view-style-with-value\"><code>CircularWithValueProgressViewStyle</code></a>. The value of the <code>ProgressView</code> can be stored in a <code>@State</code> variable. This way we can update the value based on the change in our <code>OffsetPreferenceKey</code>.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #282A36; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #F286C4\">@State</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">var</span><span style=\"color: #F6F6F4\"> progress: </span><span style=\"color: #97E1F1; font-style: italic\">Double</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> .zero</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #97E1F1\">ScrollView</span><span style=\"color: #F6F6F4\">(.vertical) {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #7B7F8B\">// ...</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">}</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">.</span><span style=\"color: #97E1F1\">overlay</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">ProgressView</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">value</span><span style=\"color: #F6F6F4\">: progress).</span><span style=\"color: #97E1F1\">progressViewStyle</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">CircularWithValueProgressViewStyle</span><span style=\"color: #F6F6F4\">()), </span><span style=\"color: #97E1F1\">alignment</span><span style=\"color: #F6F6F4\">: .top)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">.</span><span style=\"color: #97E1F1\">onPreferenceChange</span><span style=\"color: #F6F6F4\">(OffsetPreferenceKey.</span><span style=\"color: #F286C4\">self</span><span style=\"color: #F6F6F4\">, </span><span style=\"color: #97E1F1\">perform</span><span style=\"color: #F6F6F4\">: { offset </span><span style=\"color: #F286C4\">in</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    progress </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #7B7F8B\">// ... Calculate based on offset</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">})</span></span></code></pre>\n<h2 id=\"creating-a-pulltorefeshview\">Creating a PullToRefeshView</h2>\n<p>The new view we are creating should act similar to a <code>ScrollView</code>. We can achieve that by using a <code>@ViewBuilder</code> to provide the content to the view.</p>\n<p>We also want to make sure that the <code>PullToRefeshView</code> does not know about any of the logic to actually refresh. We can do this by adding a callback function to our view. The callback will be called once the user has triggered the refresh. The callback also should provide another function as a parameter that allows the containing view to signal that it is done.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #282A36; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #97E1F1\">PullToRefreshView</span><span style=\"color: #F6F6F4\">() {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #97E1F1\">Text</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #DEE492\">\"</span><span style=\"color: #E7EE98\">Pull to Refresh</span><span style=\"color: #DEE492\">\"</span><span style=\"color: #F6F6F4\">)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">} onRefresh</span><span style=\"color: #F286C4\">:</span><span style=\"color: #F6F6F4\"> { done </span><span style=\"color: #F286C4\">in</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #7B7F8B\">// Here refresh action can be implemented</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #7B7F8B\">// And should call `done()` once it has completed</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">}</span></span></code></pre>\n<p>To implement this in a view introduces a new <code>@State</code> variable to store whether the view is refreshing.</p>\n<p>For the <code>done</code> function we want to return on the <code>onRefresh</code>, we can use a <code>typealias</code> to make it a bit easier to read. Both functions are <a href=\"https://www.donnywals.com/what-is-escaping-in-swift/\"><code>@escaping</code></a> because it can perform asynchronous work.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #282A36; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #F286C4\">struct</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">PullToRefreshView</span><span style=\"color: #F6F6F4\">&#x3C;</span><span style=\"color: #BF9EEE; font-style: italic\">Content</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #97E1F1; font-style: italic\">View</span><span style=\"color: #F6F6F4\">>: View {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">typealias</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">DoneFunction</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> () </span><span style=\"color: #F286C4\">-></span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">Void</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #7B7F8B\">// Make it easier to type the return function</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">let</span><span style=\"color: #F6F6F4\"> onRefresh: (</span><span style=\"color: #F286C4\">@escaping</span><span style=\"color: #F6F6F4\"> DoneFunction) </span><span style=\"color: #F286C4\">-></span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">Void</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">let</span><span style=\"color: #F6F6F4\"> content: Content</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">@State</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">var</span><span style=\"color: #F6F6F4\"> isRefreshing </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">false</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">@State</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">var</span><span style=\"color: #F6F6F4\"> progress: </span><span style=\"color: #97E1F1; font-style: italic\">Double</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> .zero</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">init</span><span style=\"color: #F6F6F4\">(</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        @</span><span style=\"color: #62E884\">ViewBuilder</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #FFB86C; font-style: italic\">content</span><span style=\"color: #F6F6F4\">: () </span><span style=\"color: #F286C4\">-></span><span style=\"color: #F6F6F4\"> Content,</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #62E884; font-style: italic\">onRefresh</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #F286C4\">@escaping</span><span style=\"color: #F6F6F4\"> (</span><span style=\"color: #F286C4\">@escaping</span><span style=\"color: #F6F6F4\"> DoneFunction) </span><span style=\"color: #F286C4\">-></span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">Void</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    ) {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #BF9EEE; font-style: italic\">self</span><span style=\"color: #F6F6F4\">.onRefresh </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> onRefresh</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #BF9EEE; font-style: italic\">self</span><span style=\"color: #F6F6F4\">.content </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1\">content</span><span style=\"color: #F6F6F4\">()</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    }</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">var</span><span style=\"color: #F6F6F4\"> body: </span><span style=\"color: #F286C4\">some</span><span style=\"color: #F6F6F4\"> View {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #97E1F1\">ScrollView</span><span style=\"color: #F6F6F4\">(.vertical) {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            content</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            </span><span style=\"color: #7B7F8B\">// ...</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        .</span><span style=\"color: #97E1F1\">onPreferenceChange</span><span style=\"color: #F6F6F4\">(OffsetPreferenceKey.</span><span style=\"color: #F286C4\">self</span><span style=\"color: #F6F6F4\">, </span><span style=\"color: #97E1F1\">perform</span><span style=\"color: #F6F6F4\">: onOffsetChange)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    }</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">func</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #62E884\">onOffsetChange</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #62E884; font-style: italic\">offset</span><span style=\"color: #F6F6F4\">: CGFloat) {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        progress </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1\">calculateProgress</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">from</span><span style=\"color: #F6F6F4\">: offset)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #F286C4\">if</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">!</span><span style=\"color: #F6F6F4\">isRefreshing </span><span style=\"color: #F286C4\">&#x26;&#x26;</span><span style=\"color: #F6F6F4\"> offset </span><span style=\"color: #F286C4\">></span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">100</span><span style=\"color: #F6F6F4\"> {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            isRefreshing </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">true</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            </span><span style=\"color: #7B7F8B\">// Here we call back to the provided onRefresh function</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            </span><span style=\"color: #7B7F8B\">// The 1 argument we pass is what the done function in `onRefresh: { done in`</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            </span><span style=\"color: #97E1F1\">onRefresh</span><span style=\"color: #F6F6F4\">({</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                isRefreshing </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">false</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    }</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">func</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1\">calculateProgress</span><span style=\"color: #F6F6F4\">(from offset</span><span style=\"color: #F286C4\">:</span><span style=\"color: #F6F6F4\"> CGFloat) </span><span style=\"color: #F286C4\">-></span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">Double</span><span style=\"color: #F6F6F4\"> {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #F286C4\">if</span><span style=\"color: #F6F6F4\"> isRefreshing </span><span style=\"color: #F286C4\">||</span><span style=\"color: #F6F6F4\"> offset </span><span style=\"color: #F286C4\">>=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">100</span><span style=\"color: #F6F6F4\"> {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            </span><span style=\"color: #F286C4\">return</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">1</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        } </span><span style=\"color: #F286C4\">else</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">if</span><span style=\"color: #F6F6F4\"> offset </span><span style=\"color: #F286C4\">&#x3C;=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">0</span><span style=\"color: #F6F6F4\"> {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            </span><span style=\"color: #F286C4\">return</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">0</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        } </span><span style=\"color: #F286C4\">else</span><span style=\"color: #F6F6F4\"> {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            </span><span style=\"color: #F286C4\">return</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">Double</span><span style=\"color: #F6F6F4\">(offset </span><span style=\"color: #F286C4\">/</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">100</span><span style=\"color: #F6F6F4\">)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    }</span></span></code></pre>\n<h2 id=\"finalizing-the-view\">Finalizing the view</h2>\n<p>In the above code most of the functionality is there, but to finish up we can add a a few features:</p>\n<ol>\n<li>Minimum distance: To only show the progress indicator once a certain threshold has been passed</li>\n<li>Haptic feedback: To let the user know that the view has started with refreshing</li>\n<li>Offset the <code>ScrollView</code>: To make sure that the <code>ProgressView</code> does not overlap with the content of the <code>ScrollView</code> we should add some offset to the top</li>\n</ol>\n<h2 id=\"pulltorefreshview\">PullToRefreshView</h2>\n<p>The final code for our <code>PullToRefreshView</code> will then look like this.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #282A36; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">struct</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">OffsetPreferenceKey</span><span style=\"color: #F6F6F4\">: PreferenceKey {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">static</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">var</span><span style=\"color: #F6F6F4\"> defaultValue: CGFloat </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> .zero</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">static</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">func</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #62E884\">reduce</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #62E884; font-style: italic\">value</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #F286C4\">inout</span><span style=\"color: #F6F6F4\"> CGFloat, </span><span style=\"color: #62E884; font-style: italic\">nextValue</span><span style=\"color: #F6F6F4\">: () </span><span style=\"color: #F286C4\">-></span><span style=\"color: #F6F6F4\"> CGFloat) {}</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F286C4\">struct</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">PullToRefreshView</span><span style=\"color: #F6F6F4\">&#x3C;</span><span style=\"color: #BF9EEE; font-style: italic\">Content</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #97E1F1; font-style: italic\">View</span><span style=\"color: #F6F6F4\">>: View {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">typealias</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">DoneFunction</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> () </span><span style=\"color: #F286C4\">-></span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">Void</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #7B7F8B\">// Make it easier to type the return function</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">let</span><span style=\"color: #F6F6F4\"> refreshDistance: CGFloat </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">100</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">let</span><span style=\"color: #F6F6F4\"> offsetWhileLoading: CGFloat </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">36</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">let</span><span style=\"color: #F6F6F4\"> coordinateSpaceName </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #DEE492\">\"</span><span style=\"color: #E7EE98\">pullToRefresh</span><span style=\"color: #DEE492\">\"</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">let</span><span style=\"color: #F6F6F4\"> feedbackGenerator </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1\">UIImpactFeedbackGenerator</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">style</span><span style=\"color: #F6F6F4\">: .medium)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">let</span><span style=\"color: #F6F6F4\"> minimumDistance: CGFloat</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">let</span><span style=\"color: #F6F6F4\"> onRefresh: (</span><span style=\"color: #F286C4\">@escaping</span><span style=\"color: #F6F6F4\"> DoneFunction) </span><span style=\"color: #F286C4\">-></span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">Void</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">let</span><span style=\"color: #F6F6F4\"> content: Content</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">@State</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">var</span><span style=\"color: #F6F6F4\"> isRefreshing </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">false</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">@State</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">var</span><span style=\"color: #F6F6F4\"> progress: </span><span style=\"color: #97E1F1; font-style: italic\">Double</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> .zero</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">init</span><span style=\"color: #F6F6F4\">(</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #62E884; font-style: italic\">minimumDistance</span><span style=\"color: #F6F6F4\">: CGFloat </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">10</span><span style=\"color: #F6F6F4\">,</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        @</span><span style=\"color: #62E884\">ViewBuilder</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #FFB86C; font-style: italic\">content</span><span style=\"color: #F6F6F4\">: () </span><span style=\"color: #F286C4\">-></span><span style=\"color: #F6F6F4\"> Content,</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #62E884; font-style: italic\">onRefresh</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #F286C4\">@escaping</span><span style=\"color: #F6F6F4\"> (</span><span style=\"color: #F286C4\">@escaping</span><span style=\"color: #F6F6F4\"> DoneFunction) </span><span style=\"color: #F286C4\">-></span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">Void</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    ) {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #BF9EEE; font-style: italic\">self</span><span style=\"color: #F6F6F4\">.minimumDistance </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> minimumDistance</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #BF9EEE; font-style: italic\">self</span><span style=\"color: #F6F6F4\">.onRefresh </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> onRefresh</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #BF9EEE; font-style: italic\">self</span><span style=\"color: #F6F6F4\">.content </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1\">content</span><span style=\"color: #F6F6F4\">()</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    }</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">var</span><span style=\"color: #F6F6F4\"> body: </span><span style=\"color: #F286C4\">some</span><span style=\"color: #F6F6F4\"> View {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #97E1F1\">ScrollView</span><span style=\"color: #F6F6F4\">(.vertical) {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            content</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                .</span><span style=\"color: #97E1F1\">background</span><span style=\"color: #F6F6F4\">(</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                    GeometryReader { geometry </span><span style=\"color: #F286C4\">in</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                        Color.clear</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                            .</span><span style=\"color: #97E1F1\">preference</span><span style=\"color: #F6F6F4\">(</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                                </span><span style=\"color: #97E1F1\">key</span><span style=\"color: #F6F6F4\">: OffsetPreferenceKey.</span><span style=\"color: #F286C4\">self</span><span style=\"color: #F6F6F4\">,</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                                </span><span style=\"color: #97E1F1\">value</span><span style=\"color: #F6F6F4\">: geometry.</span><span style=\"color: #97E1F1\">frame</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">in</span><span style=\"color: #F6F6F4\">: .</span><span style=\"color: #97E1F1\">named</span><span style=\"color: #F6F6F4\">(coordinateSpaceName)).origin.y</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                            )</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                    }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                )</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                .</span><span style=\"color: #97E1F1\">offset</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">y</span><span style=\"color: #F6F6F4\">: isRefreshing </span><span style=\"color: #F286C4\">?</span><span style=\"color: #F6F6F4\"> offsetWhileLoading </span><span style=\"color: #F286C4\">:</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">0</span><span style=\"color: #F6F6F4\">)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        .</span><span style=\"color: #97E1F1\">coordinateSpace</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">name</span><span style=\"color: #F6F6F4\">: coordinateSpaceName)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        .</span><span style=\"color: #97E1F1\">overlay</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">ProgressView</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">value</span><span style=\"color: #F6F6F4\">: progress).</span><span style=\"color: #97E1F1\">progressViewStyle</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">CircularWithValueProgressViewStyle</span><span style=\"color: #F6F6F4\">()), </span><span style=\"color: #97E1F1\">alignment</span><span style=\"color: #F6F6F4\">: .top)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        .</span><span style=\"color: #97E1F1\">onPreferenceChange</span><span style=\"color: #F6F6F4\">(OffsetPreferenceKey.</span><span style=\"color: #F286C4\">self</span><span style=\"color: #F6F6F4\">, </span><span style=\"color: #97E1F1\">perform</span><span style=\"color: #F6F6F4\">: onOffsetChange)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    }</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">func</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #62E884\">onOffsetChange</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #62E884; font-style: italic\">offset</span><span style=\"color: #F6F6F4\">: CGFloat) {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        DispatchQueue.main.async {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            progress </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1\">calculateProgress</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">from</span><span style=\"color: #F6F6F4\">: offset)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            </span><span style=\"color: #F286C4\">if</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">!</span><span style=\"color: #F6F6F4\">isRefreshing </span><span style=\"color: #F286C4\">&#x26;&#x26;</span><span style=\"color: #F6F6F4\"> offset </span><span style=\"color: #F286C4\">></span><span style=\"color: #F6F6F4\"> refreshDistance {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                </span><span style=\"color: #97E1F1\">withAnimation</span><span style=\"color: #F6F6F4\">(.easeOut) {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                    isRefreshing </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">true</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                }</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                feedbackGenerator.</span><span style=\"color: #97E1F1\">impactOccurred</span><span style=\"color: #F6F6F4\">()</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                </span><span style=\"color: #97E1F1\">onRefresh</span><span style=\"color: #F6F6F4\">({</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                    withAnimation {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                        isRefreshing </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">false</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                    }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                })</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    }</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">func</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #62E884\">calculateProgress</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #62E884\">from</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #FFB86C; font-style: italic\">offset</span><span style=\"color: #F6F6F4\">: CGFloat) </span><span style=\"color: #F286C4\">-></span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">Double</span><span style=\"color: #F6F6F4\"> {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #F286C4\">if</span><span style=\"color: #F6F6F4\"> isRefreshing </span><span style=\"color: #F286C4\">||</span><span style=\"color: #F6F6F4\"> offset </span><span style=\"color: #F286C4\">>=</span><span style=\"color: #F6F6F4\"> refreshDistance {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            </span><span style=\"color: #F286C4\">return</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">1</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        } </span><span style=\"color: #F286C4\">else</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">if</span><span style=\"color: #F6F6F4\"> offset </span><span style=\"color: #F286C4\">&#x3C;=</span><span style=\"color: #F6F6F4\"> minimumDistance {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            </span><span style=\"color: #F286C4\">return</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">0</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        } </span><span style=\"color: #F286C4\">else</span><span style=\"color: #F6F6F4\"> {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            </span><span style=\"color: #F286C4\">return</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">Double</span><span style=\"color: #F6F6F4\">(offset </span><span style=\"color: #F286C4\">/</span><span style=\"color: #F6F6F4\"> refreshDistance)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">}</span></span></code></pre>\n<p>The following view was used to create the above GIF.</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #282A36; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #F286C4\">struct</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #97E1F1; font-style: italic\">ContentView</span><span style=\"color: #F6F6F4\">: View {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">static</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">private</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">let</span><span style=\"color: #F6F6F4\"> initialNames </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> [</span><span style=\"color: #DEE492\">\"</span><span style=\"color: #E7EE98\">Jarl</span><span style=\"color: #DEE492\">\"</span><span style=\"color: #F6F6F4\">, </span><span style=\"color: #DEE492\">\"</span><span style=\"color: #E7EE98\">Ehecatl</span><span style=\"color: #DEE492\">\"</span><span style=\"color: #F6F6F4\">, </span><span style=\"color: #DEE492\">\"</span><span style=\"color: #E7EE98\">Jayanti</span><span style=\"color: #DEE492\">\"</span><span style=\"color: #F6F6F4\">, </span><span style=\"color: #DEE492\">\"</span><span style=\"color: #E7EE98\">Surendra</span><span style=\"color: #DEE492\">\"</span><span style=\"color: #F6F6F4\">, </span><span style=\"color: #DEE492\">\"</span><span style=\"color: #E7EE98\">Medeia</span><span style=\"color: #DEE492\">\"</span><span style=\"color: #F6F6F4\">]</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">@State</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #F286C4\">var</span><span style=\"color: #F6F6F4\"> names </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> ContentView.initialNames</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    </span><span style=\"color: #F286C4\">var</span><span style=\"color: #F6F6F4\"> body: </span><span style=\"color: #F286C4\">some</span><span style=\"color: #F6F6F4\"> View {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        </span><span style=\"color: #97E1F1\">PullToRefreshView</span><span style=\"color: #F6F6F4\">() {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            </span><span style=\"color: #97E1F1\">Text</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #DEE492\">\"</span><span style=\"color: #E7EE98\">Names</span><span style=\"color: #DEE492\">\"</span><span style=\"color: #F6F6F4\">).</span><span style=\"color: #97E1F1\">font</span><span style=\"color: #F6F6F4\">(.</span><span style=\"color: #97E1F1\">system</span><span style=\"color: #F6F6F4\">(.largeTitle, </span><span style=\"color: #97E1F1\">design</span><span style=\"color: #F6F6F4\">: .rounded))</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                .</span><span style=\"color: #97E1F1\">padding</span><span style=\"color: #F6F6F4\">()</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            </span><span style=\"color: #97E1F1\">Divider</span><span style=\"color: #F6F6F4\">()</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            </span><span style=\"color: #97E1F1\">ForEach</span><span style=\"color: #F6F6F4\">(names, </span><span style=\"color: #97E1F1\">id</span><span style=\"color: #F6F6F4\">: \\.</span><span style=\"color: #F286C4\">self</span><span style=\"color: #F6F6F4\">) { name </span><span style=\"color: #F286C4\">in</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                </span><span style=\"color: #97E1F1\">Text</span><span style=\"color: #F6F6F4\">(name).</span><span style=\"color: #97E1F1\">padding</span><span style=\"color: #F6F6F4\">()</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        } onRefresh</span><span style=\"color: #F286C4\">:</span><span style=\"color: #F6F6F4\"> { done </span><span style=\"color: #F286C4\">in</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            DispatchQueue.main.</span><span style=\"color: #97E1F1\">asyncAfter</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">deadline</span><span style=\"color: #F6F6F4\">: .</span><span style=\"color: #97E1F1\">now</span><span style=\"color: #F6F6F4\">() </span><span style=\"color: #F286C4\">+</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">3.0</span><span style=\"color: #F6F6F4\">, </span><span style=\"color: #97E1F1\">execute</span><span style=\"color: #F6F6F4\">: {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                withAnimation {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                    names.</span><span style=\"color: #97E1F1\">insert</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">contentsOf</span><span style=\"color: #F6F6F4\">: [</span><span style=\"color: #DEE492\">\"</span><span style=\"color: #E7EE98\">Nephele</span><span style=\"color: #DEE492\">\"</span><span style=\"color: #F6F6F4\">, </span><span style=\"color: #DEE492\">\"</span><span style=\"color: #E7EE98\">Vesta</span><span style=\"color: #DEE492\">\"</span><span style=\"color: #F6F6F4\">], </span><span style=\"color: #97E1F1\">at</span><span style=\"color: #F6F6F4\">: </span><span style=\"color: #BF9EEE\">0</span><span style=\"color: #F6F6F4\">)</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                }</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                </span><span style=\"color: #97E1F1\">done</span><span style=\"color: #F6F6F4\">()</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                DispatchQueue.main.</span><span style=\"color: #97E1F1\">asyncAfter</span><span style=\"color: #F6F6F4\">(</span><span style=\"color: #97E1F1\">deadline</span><span style=\"color: #F6F6F4\">: .</span><span style=\"color: #97E1F1\">now</span><span style=\"color: #F6F6F4\">() </span><span style=\"color: #F286C4\">+</span><span style=\"color: #F6F6F4\"> </span><span style=\"color: #BF9EEE\">3.0</span><span style=\"color: #F6F6F4\">, </span><span style=\"color: #97E1F1\">execute</span><span style=\"color: #F6F6F4\">: {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                    withAnimation {</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                        names </span><span style=\"color: #F286C4\">=</span><span style=\"color: #F6F6F4\"> ContentView.initialNames</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                    }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">                })</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">            })</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">        }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">    }</span></span>\n<span class=\"line\"><span style=\"color: #F6F6F4\">}</span></span></code></pre>";

				const frontmatter$1 = {"title":"Pull to Refresh in SwiftUI","date":"2021-05-04 07:00","description":"Creating a Pull to Refresh ScrollView in SwiftUI","layout":"../../layouts/Post.astro","url":"/posts/pull-to-refresh","file":"/Users/berry/Developer/appjeniksaan-site/src/pages/posts/pull-to-refresh.md"};
				const file$1 = "/Users/berry/Developer/appjeniksaan-site/src/pages/posts/pull-to-refresh.md";
				const url$1 = "/posts/pull-to-refresh";
				function rawContent$1() {
					return "\n### Deprecation warning\n\n2021-06-11: Please be aware that with the introduction of iOS 15 and the SwiftUI additions for 2021, this functionality is build into SwiftUI: [refreshable(action:)](<https://developer.apple.com/documentation/SwiftUI/View/refreshable(action:)>)\n\n---\n\nYesterday I wrote an article about creating a [CircularProgressView which could show the progress](/posts/2021/05/03/circular-progress-view-style-with-value). Today I wanted to write about how you could use that `ProgressViewStyle` in creating a ScrollView with pull to request functionality.\n\nI wanted to create this pull to refresh functionality after [reading about tracking the scroll offset](https://swiftwithmajid.com/2020/09/24/mastering-scrollview-in-swiftui/) in the `ScrollView`.\n\n![CircularWithValueProgressViewStyle](/images/pull-to-refresh/pull-to-refresh.gif)\n\n## Using a PreferenceKey to track offset in ScrollView\n\nTo track the offset in the ScrollView we need to introduce a `PreferenceKey`.\n\n```swift\nprivate struct OffsetPreferenceKey: PreferenceKey {\n    static var defaultValue: CGFloat = .zero\n\n    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {}\n}\n```\n\nWhich we can then use to track the offset from a `GeometryReader` in the background of a `ScrollView`.\n\n```swift\nScrollView(.vertical) {\n    content\n        .background(\n            GeometryReader { geometry in\n                Color.clear\n                    .preference(\n                        key: OffsetPreferenceKey.self,\n                        value: geometry.frame(in: .named(\"pullToRefresh\")).origin.y\n                    )\n            }\n        )\n}\n.coordinateSpace(name: \"pullToRefresh\")\n.onPreferenceChange(OffsetPreferenceKey.self, perform: { _ in })\n```\n\nThe `content` in the code above comes from a `@ViewBuilder` that we will initialize our view with. To track the offset, the next step is to implement the function that is triggered by `.onPreferenceChange()`.\n\n## Show indicator when refresh will be triggered\n\nTo show the user how much further he has to move the `ScrollView` to trigger a refresh, we can use the `ProgressView` in an overlay with the [`CircularWithValueProgressViewStyle`](/posts/2021/05/03/circular-progress-view-style-with-value). The value of the `ProgressView` can be stored in a `@State` variable. This way we can update the value based on the change in our `OffsetPreferenceKey`.\n\n```swift\n@State private var progress: Double = .zero\n\nScrollView(.vertical) {\n    // ...\n}\n.overlay(ProgressView(value: progress).progressViewStyle(CircularWithValueProgressViewStyle()), alignment: .top)\n.onPreferenceChange(OffsetPreferenceKey.self, perform: { offset in\n    progress = // ... Calculate based on offset\n})\n```\n\n## Creating a PullToRefeshView\n\nThe new view we are creating should act similar to a `ScrollView`. We can achieve that by using a `@ViewBuilder` to provide the content to the view.\n\nWe also want to make sure that the `PullToRefeshView` does not know about any of the logic to actually refresh. We can do this by adding a callback function to our view. The callback will be called once the user has triggered the refresh. The callback also should provide another function as a parameter that allows the containing view to signal that it is done.\n\n```swift\nPullToRefreshView() {\n    Text(\"Pull to Refresh\")\n} onRefresh: { done in\n    // Here refresh action can be implemented\n    // And should call `done()` once it has completed\n}\n```\n\nTo implement this in a view introduces a new `@State` variable to store whether the view is refreshing.\n\nFor the `done` function we want to return on the `onRefresh`, we can use a `typealias` to make it a bit easier to read. Both functions are [`@escaping`](https://www.donnywals.com/what-is-escaping-in-swift/) because it can perform asynchronous work.\n\n```swift\nstruct PullToRefreshView<Content: View>: View {\n    typealias DoneFunction = () -> Void // Make it easier to type the return function\n\n    private let onRefresh: (@escaping DoneFunction) -> Void\n    private let content: Content\n\n    @State private var isRefreshing = false\n    @State private var progress: Double = .zero\n\n    init(\n        @ViewBuilder content: () -> Content,\n        onRefresh: @escaping (@escaping DoneFunction) -> Void\n    ) {\n        self.onRefresh = onRefresh\n        self.content = content()\n    }\n\n    var body: some View {\n        ScrollView(.vertical) {\n            content\n\n            // ...\n        }\n        .onPreferenceChange(OffsetPreferenceKey.self, perform: onOffsetChange)\n    }\n\n    private func onOffsetChange(offset: CGFloat) {\n        progress = calculateProgress(from: offset)\n\n        if !isRefreshing && offset > 100 {\n            isRefreshing = true\n\n            // Here we call back to the provided onRefresh function\n            // The 1 argument we pass is what the done function in `onRefresh: { done in`\n            onRefresh({\n                isRefreshing = false\n            }\n        }\n    }\n\n    private func calculateProgress(from offset: CGFloat) -> Double {\n        if isRefreshing || offset >= 100 {\n            return 1\n        } else if offset <= 0 {\n            return 0\n        } else {\n            return Double(offset / 100)\n        }\n    }\n```\n\n## Finalizing the view\n\nIn the above code most of the functionality is there, but to finish up we can add a a few features:\n\n1. Minimum distance: To only show the progress indicator once a certain threshold has been passed\n2. Haptic feedback: To let the user know that the view has started with refreshing\n3. Offset the `ScrollView`: To make sure that the `ProgressView` does not overlap with the content of the `ScrollView` we should add some offset to the top\n\n## PullToRefreshView\n\nThe final code for our `PullToRefreshView` will then look like this.\n\n```swift\nprivate struct OffsetPreferenceKey: PreferenceKey {\n    static var defaultValue: CGFloat = .zero\n\n    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {}\n}\n\nstruct PullToRefreshView<Content: View>: View {\n    typealias DoneFunction = () -> Void // Make it easier to type the return function\n\n    private let refreshDistance: CGFloat = 100\n    private let offsetWhileLoading: CGFloat = 36\n    private let coordinateSpaceName = \"pullToRefresh\"\n\n    private let feedbackGenerator = UIImpactFeedbackGenerator(style: .medium)\n\n    private let minimumDistance: CGFloat\n    private let onRefresh: (@escaping DoneFunction) -> Void\n    private let content: Content\n\n    @State private var isRefreshing = false\n    @State private var progress: Double = .zero\n\n    init(\n        minimumDistance: CGFloat = 10,\n        @ViewBuilder content: () -> Content,\n        onRefresh: @escaping (@escaping DoneFunction) -> Void\n    ) {\n        self.minimumDistance = minimumDistance\n        self.onRefresh = onRefresh\n        self.content = content()\n    }\n\n    var body: some View {\n        ScrollView(.vertical) {\n            content\n                .background(\n                    GeometryReader { geometry in\n                        Color.clear\n                            .preference(\n                                key: OffsetPreferenceKey.self,\n                                value: geometry.frame(in: .named(coordinateSpaceName)).origin.y\n                            )\n                    }\n                )\n                .offset(y: isRefreshing ? offsetWhileLoading : 0)\n        }\n        .coordinateSpace(name: coordinateSpaceName)\n        .overlay(ProgressView(value: progress).progressViewStyle(CircularWithValueProgressViewStyle()), alignment: .top)\n        .onPreferenceChange(OffsetPreferenceKey.self, perform: onOffsetChange)\n    }\n\n    private func onOffsetChange(offset: CGFloat) {\n        DispatchQueue.main.async {\n            progress = calculateProgress(from: offset)\n\n            if !isRefreshing && offset > refreshDistance {\n                withAnimation(.easeOut) {\n                    isRefreshing = true\n                }\n\n                feedbackGenerator.impactOccurred()\n\n                onRefresh({\n                    withAnimation {\n                        isRefreshing = false\n                    }\n                })\n            }\n        }\n    }\n\n    private func calculateProgress(from offset: CGFloat) -> Double {\n        if isRefreshing || offset >= refreshDistance {\n            return 1\n        } else if offset <= minimumDistance {\n            return 0\n        } else {\n            return Double(offset / refreshDistance)\n        }\n    }\n}\n```\n\nThe following view was used to create the above GIF.\n\n```swift\nstruct ContentView: View {\n    static private let initialNames = [\"Jarl\", \"Ehecatl\", \"Jayanti\", \"Surendra\", \"Medeia\"]\n\n    @State var names = ContentView.initialNames\n\n    var body: some View {\n        PullToRefreshView() {\n            Text(\"Names\").font(.system(.largeTitle, design: .rounded))\n                .padding()\n            Divider()\n\n            ForEach(names, id: \\.self) { name in\n                Text(name).padding()\n            }\n        } onRefresh: { done in\n            DispatchQueue.main.asyncAfter(deadline: .now() + 3.0, execute: {\n                withAnimation {\n                    names.insert(contentsOf: [\"Nephele\", \"Vesta\"], at: 0)\n                }\n\n                done()\n\n                DispatchQueue.main.asyncAfter(deadline: .now() + 3.0, execute: {\n                    withAnimation {\n                        names = ContentView.initialNames\n                    }\n                })\n            })\n        }\n    }\n}\n```\n";
				}
				function compiledContent$1() {
					return html$1;
				}
				function getHeadings$1() {
					return [{"depth":3,"slug":"deprecation-warning","text":"Deprecation warning"},{"depth":2,"slug":"using-a-preferencekey-to-track-offset-in-scrollview","text":"Using a PreferenceKey to track offset in ScrollView"},{"depth":2,"slug":"show-indicator-when-refresh-will-be-triggered","text":"Show indicator when refresh will be triggered"},{"depth":2,"slug":"creating-a-pulltorefeshview","text":"Creating a PullToRefeshView"},{"depth":2,"slug":"finalizing-the-view","text":"Finalizing the view"},{"depth":2,"slug":"pulltorefreshview","text":"PullToRefreshView"}];
				}
				function getHeaders$1() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$1();
				}				async function Content$1() {
					const { layout, ...content } = frontmatter$1;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$1 });
					return createVNode($$Post, { content, frontmatter: content, headings: getHeadings$1(), 'server:root': true, children: contentFragment });
				}

const _page9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$1,
	file: file$1,
	url: url$1,
	rawContent: rawContent$1,
	compiledContent: compiledContent$1,
	getHeadings: getHeadings$1,
	getHeaders: getHeaders$1,
	Content: Content$1,
	default: Content$1
}, Symbol.toStringTag, { value: 'Module' }));

const html = "<h1 id=\"404-️\">404 🤷‍♂️</h1>";

				const frontmatter = {"title":404,"layout":"../layouts/Page.astro","url":"/404","file":"/Users/berry/Developer/appjeniksaan-site/src/pages/404.md"};
				const file = "/Users/berry/Developer/appjeniksaan-site/src/pages/404.md";
				const url = "/404";
				function rawContent() {
					return "\n# 404 🤷‍♂️\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":1,"slug":"404-️","text":"404 🤷‍♂️"}];
				}
				function getHeaders() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings();
				}				async function Content() {
					const { layout, ...content } = frontmatter;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html });
					return createVNode($$Page, { content, frontmatter: content, headings: getHeadings(), 'server:root': true, children: contentFragment });
				}

const _page10 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter,
	file,
	url,
	rawContent,
	compiledContent,
	getHeadings,
	getHeaders,
	Content,
	default: Content
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([['src/pages/index.astro', _page0],['src/pages/archive.astro', _page1],['src/pages/contact.md', _page2],['src/pages/privacy.md', _page3],['src/pages/linked/tracking-scrollview-offset-in-swiftui.md', _page4],['src/pages/linked/breaking-the-web-forward.md', _page5],['src/pages/linked/stop-reading-the-news.md', _page6],['src/pages/linked/the-faceless-other.md', _page7],['src/pages/posts/circular-progress-view-style-with-value.md', _page8],['src/pages/posts/pull-to-refresh.md', _page9],['src/pages/404.md', _page10],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),Object.assign({"name":"@astrojs/preact","clientEntrypoint":"@astrojs/preact/client.js","serverEntrypoint":"@astrojs/preact/server.js","jsxImportSource":"preact"}, { ssr: _renderer1 }),];

if (typeof process !== "undefined") {
  if (process.argv.includes("--verbose")) ; else if (process.argv.includes("--silent")) ; else ;
}

const SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".ts"]);
new RegExp(
  `\\.(${Array.from(SCRIPT_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

const STYLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".css",
  ".pcss",
  ".postcss",
  ".scss",
  ".sass",
  ".styl",
  ".stylus",
  ".less"
]);
new RegExp(
  `\\.(${Array.from(STYLE_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return segment[0].spread ? `/:${segment[0].content.slice(3)}(.*)?` : "/" + segment.map((part) => {
      if (part)
        return part.dynamic ? `:${part.content}` : part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("");
  }).join("");
  const trailing = addTrailingSlash !== "never" && segments.length ? "/" : "";
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  return {
    ...serializedManifest,
    assets,
    routes
  };
}

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"","links":["assets/index.90ad2c1c.css","assets/69c4a7fb.05a9a1f2.css","assets/4dcd3c9e.49031ab9.css"],"scripts":[],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/archive.43f15f9f.css","assets/69c4a7fb.05a9a1f2.css","assets/4dcd3c9e.49031ab9.css"],"scripts":[],"routeData":{"route":"/archive","type":"page","pattern":"^\\/archive\\/?$","segments":[[{"content":"archive","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/archive.astro","pathname":"/archive","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/69c4a7fb.05a9a1f2.css","assets/4dcd3c9e.49031ab9.css"],"scripts":[],"routeData":{"route":"/contact","type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.md","pathname":"/contact","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/69c4a7fb.05a9a1f2.css","assets/4dcd3c9e.49031ab9.css"],"scripts":[],"routeData":{"route":"/privacy","type":"page","pattern":"^\\/privacy\\/?$","segments":[[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/privacy.md","pathname":"/privacy","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/69c4a7fb.05a9a1f2.css","assets/4dcd3c9e.49031ab9.css"],"scripts":[],"routeData":{"route":"/linked/tracking-scrollview-offset-in-swiftui","type":"page","pattern":"^\\/linked\\/tracking-scrollview-offset-in-swiftui\\/?$","segments":[[{"content":"linked","dynamic":false,"spread":false}],[{"content":"tracking-scrollview-offset-in-swiftui","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/linked/tracking-scrollview-offset-in-swiftui.md","pathname":"/linked/tracking-scrollview-offset-in-swiftui","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/69c4a7fb.05a9a1f2.css","assets/4dcd3c9e.49031ab9.css"],"scripts":[],"routeData":{"route":"/linked/breaking-the-web-forward","type":"page","pattern":"^\\/linked\\/breaking-the-web-forward\\/?$","segments":[[{"content":"linked","dynamic":false,"spread":false}],[{"content":"breaking-the-web-forward","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/linked/breaking-the-web-forward.md","pathname":"/linked/breaking-the-web-forward","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/69c4a7fb.05a9a1f2.css","assets/4dcd3c9e.49031ab9.css"],"scripts":[],"routeData":{"route":"/linked/stop-reading-the-news","type":"page","pattern":"^\\/linked\\/stop-reading-the-news\\/?$","segments":[[{"content":"linked","dynamic":false,"spread":false}],[{"content":"stop-reading-the-news","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/linked/stop-reading-the-news.md","pathname":"/linked/stop-reading-the-news","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/69c4a7fb.05a9a1f2.css","assets/4dcd3c9e.49031ab9.css"],"scripts":[],"routeData":{"route":"/linked/the-faceless-other","type":"page","pattern":"^\\/linked\\/the-faceless-other\\/?$","segments":[[{"content":"linked","dynamic":false,"spread":false}],[{"content":"the-faceless-other","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/linked/the-faceless-other.md","pathname":"/linked/the-faceless-other","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/69c4a7fb.05a9a1f2.css","assets/4dcd3c9e.49031ab9.css"],"scripts":[],"routeData":{"route":"/posts/circular-progress-view-style-with-value","type":"page","pattern":"^\\/posts\\/circular-progress-view-style-with-value\\/?$","segments":[[{"content":"posts","dynamic":false,"spread":false}],[{"content":"circular-progress-view-style-with-value","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/posts/circular-progress-view-style-with-value.md","pathname":"/posts/circular-progress-view-style-with-value","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/69c4a7fb.05a9a1f2.css","assets/4dcd3c9e.49031ab9.css"],"scripts":[],"routeData":{"route":"/posts/pull-to-refresh","type":"page","pattern":"^\\/posts\\/pull-to-refresh\\/?$","segments":[[{"content":"posts","dynamic":false,"spread":false}],[{"content":"pull-to-refresh","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/posts/pull-to-refresh.md","pathname":"/posts/pull-to-refresh","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/69c4a7fb.05a9a1f2.css","assets/4dcd3c9e.49031ab9.css"],"scripts":[],"routeData":{"route":"/404","type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.md","pathname":"/404","_meta":{"trailingSlash":"ignore"}}}],"base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"dracula-soft","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"isAstroFlavoredMd":false},"pageMap":null,"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.js","/@fs/Users/berry/Developer/appjeniksaan-site/src/components/Logo":"Logo.d77ff043.js","/@fs/Users/berry/Developer/appjeniksaan-site/src/components/Toggle":"Toggle.2ff6326c.js","@astrojs/preact/client.js":"client.115698f3.js","astro:scripts/before-hydration.js":"data:text/javascript;charset=utf-8,//[no before-hydration script]"},"assets":["/assets/4dcd3c9e.49031ab9.css","/assets/69c4a7fb.05a9a1f2.css","/assets/archive.43f15f9f.css","/assets/index.90ad2c1c.css","/Logo.d77ff043.js","/Toggle.2ff6326c.js","/client.115698f3.js","/favicon.ico","/robots.txt","/assets/Toggle.6e01ba41.css","/chunks/jsxRuntime.module.e9f7422a.js","/chunks/preact.module.f099146f.js","/images/circular-progress-view-style-with-value/label.png","/images/circular-progress-view-style-with-value/opacity.png","/images/circular-progress-view-style-with-value/progress.gif","/images/circular-progress-view-style-with-value/static.png","/images/pull-to-refresh/pull-to-refresh.gif"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = undefined;

const _exports = adapter.createExports(_manifest, _args);
const _default = _exports['default'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { _default as default };
