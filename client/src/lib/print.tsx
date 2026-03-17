import { createRoot } from "react-dom/client";

/**
 * Utility to print a React component by rendering it into a hidden iframe.
 * Avoids polluting the main page's DOM.
 */
export async function printComponent(component: React.ReactNode) {
	// 1. Create a hidden iframe
	const iframe = document.createElement("iframe");
	iframe.style.position = "absolute";
	iframe.style.width = "0";
	iframe.style.height = "0";
	iframe.style.border = "none";
	iframe.style.visibility = "hidden";

	document.body.appendChild(iframe);

	const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
	if (!iframeDoc) {
		console.error("Could not access iframe document");
		return;
	}

	// 2. Prepare iframe content
	iframeDoc.title = "Print";
	const style = iframeDoc.createElement("style");
	style.textContent = `
    @media print {
      @page { 
        size: A5 portrait; 
        margin: 0; 
      }
      body { 
        margin: 0; 
        padding: 9mm; 
        background: #fff;
        -webkit-print-color-adjust: exact; 
        print-color-adjust: exact; 
      }
    }
  `;
	iframeDoc.head.appendChild(style);

	const rootDiv = iframeDoc.createElement("div");
	rootDiv.id = "print-root";
	iframeDoc.body.appendChild(rootDiv);

	// Copy styles from the main document to the iframe
	for (const styleSheet of Array.from(document.styleSheets)) {
		try {
			const newStyle = iframeDoc.createElement("style");
			const cssRules = Array.from(styleSheet.cssRules)
				.map((rule) => rule.cssText)
				.join("\n");
			newStyle.appendChild(iframeDoc.createTextNode(cssRules));
			iframeDoc.head.appendChild(newStyle);
		} catch {
			// Some styles might be cross-origin and inaccessible
			if (styleSheet.href) {
				const link = iframeDoc.createElement("link");
				link.rel = "stylesheet";
				link.href = styleSheet.href;
				iframeDoc.head.appendChild(link);
			}
		}
	}

	// 3. Render component into iframe
	const rootElement = iframeDoc.getElementById("print-root");
	if (!rootElement) return;

	const root = createRoot(rootElement);
	root.render(component);

	// 4. Wait for content to load and then print
	// We use a small timeout to ensure React rendering is completed and fonts/images are loaded
	// In a real app, you might want a more robust way to detect when it's ready
	await new Promise((resolve) => setTimeout(resolve, 500));

	iframe.contentWindow?.focus();
	iframe.contentWindow?.print();

	// 5. Cleanup
	// Remove iframe after short delay to ensure print dialog is finished
	setTimeout(() => {
		root.unmount();
		document.body.removeChild(iframe);
	}, 1000);
}
