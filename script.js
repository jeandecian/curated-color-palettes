function getContrastTextColor(hex) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "text-gray-800" : "text-white";
}

async function loadPalettes() {
  const response = await fetch("palettes.json");
  return await response.json();
}

async function renderPalettes(palettes) {
  const container = document.getElementById("palette-container");

  palettes.forEach((palette) => {
    const paletteRow = document.createElement("div");
    paletteRow.className =
      "palette-row bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-xl";

    const colorCount = palette.colors.length;

    let gridClasses = `grid divide-x divide-gray-100`;
    if (colorCount <= 2) {
      gridClasses += ` grid-cols-1 sm:grid-cols-${colorCount}`;
    } else if (colorCount === 3) {
      gridClasses += ` grid-cols-1 sm:grid-cols-3`;
    } else if (colorCount === 4) {
      gridClasses += ` grid-cols-2 sm:grid-cols-4`;
    } else if (colorCount >= 5) {
      gridClasses += ` grid-cols-2 md:grid-cols-3 lg:grid-cols-${colorCount}`;
    }

    const gridContainer = document.createElement("div");
    gridContainer.className = gridClasses;

    palette.colors.forEach((color) => {
      const colorDiv = document.createElement("div");

      const textColorClass = getContrastTextColor(color.hex);

      colorDiv.className = `flex flex-col items-center justify-center p-6 sm:p-8 h-10 transition duration-150 cursor-pointer hover:scale-[1.03] active:scale-[0.98]`;
      colorDiv.style.backgroundColor = color.hex;

      colorDiv.onclick = () => {
        try {
          const tempInput = document.createElement("input");
          tempInput.value = color.hex;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          document.body.removeChild(tempInput);

          const message = document.createElement("div");
          message.textContent = `Copied ${color.hex}!`;
          message.className =
            "fixed bottom-5 right-5 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-xl text-sm transition-opacity duration-300";
          document.body.appendChild(message);

          setTimeout(() => {
            message.style.opacity = "0";
            setTimeout(() => message.remove(), 300);
          }, 1500);
        } catch (err) {
          console.error("Failed to copy text: ", err);
        }
      };

      colorDiv.innerHTML = `
                        <span class="text-sm font-medium ${textColorClass} tracking-wider">${color.hex}</span>
                        <span class="text-xs ${textColorClass} opacity-75 mt-1">${color.name}</span>
                    `;

      gridContainer.appendChild(colorDiv);
    });

    paletteRow.appendChild(gridContainer);
    container.appendChild(paletteRow);
  });
}

async function init() {
  const palettes = await loadPalettes();
  renderPalettes(palettes);
}

window.onload = init;
