import { test, expect } from "bun:test";

// Test imports for different versions
test("Node.js version should import correctly", async () => {
	const { NotooflyAuthClient } = await import("../index");
	expect(NotooflyAuthClient).toBeDefined();
	expect(typeof NotooflyAuthClient).toBe("function");
});

test("React version should import correctly", async () => {
	const { useNotooflyAuth } = await import("../react/index");
	expect(useNotooflyAuth).toBeDefined();
	expect(typeof useNotooflyAuth).toBe("function");
});

test("Browser version should import correctly", async () => {
	const { NotooflyAuthClient: BrowserAuthClient } = await import("../browser/index");
	expect(BrowserAuthClient).toBeDefined();
	expect(typeof BrowserAuthClient).toBe("function");
});

test("All versions should have different constructors", async () => {
	const { NotooflyAuthClient: NodeClient } = await import("../index");
	const { useNotooflyAuth } = await import("../react/index");
	const { NotooflyAuthClient: BrowserClient } = await import("../browser/index");

	// Node.js version - class constructor
	expect(NodeClient.name).toBe("NotooflyAuthClient");
	
	// React version - hook function
	expect(typeof useNotooflyAuth).toBe("function");
	
	// Browser version - class constructor
	expect(BrowserClient.name).toBe("NotooflyAuthClient");
});

test("Package.json exports should be configured correctly", async () => {
	const pkgFile = await Bun.file("./package.json").text();
	const pkg = JSON.parse(pkgFile);
	
	expect(pkg.exports).toBeDefined();
	expect(pkg.exports["."]).toBeDefined();
	expect(pkg.exports["./react"]).toBeDefined();
	expect(pkg.exports["./browser"]).toBeDefined();
	
	expect(pkg.exports["."].import).toBe("./index.ts");
	expect(pkg.exports["./react"].import).toBe("./react/index.ts");
	expect(pkg.exports["./browser"].import).toBe("./browser/index.ts");
});
