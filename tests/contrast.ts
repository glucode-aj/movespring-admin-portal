export function contrastFailures() {
  const rgb = (color: string) => (color.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
  const luminance = (color: number[]) => color.map(value => { const s = value / 255; return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4; }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
  const failures: string[] = [];
  for (const element of document.querySelectorAll('.md-root *, .ms-root *')) {
    const style = getComputedStyle(element);
    const text = [...element.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join('').trim();
    if (!text || !element.getBoundingClientRect().width || !element.getBoundingClientRect().height || ['SCRIPT', 'STYLE', 'OPTION'].includes(element.tagName)) continue;
    let current: Element | null = element; let background = '';
    while (current) {
      const css = getComputedStyle(current);
      const gradient = css.backgroundImage.match(/rgba?\([^)]+\)/);
      if (gradient) { background = gradient[0]; break; }
      if (css.backgroundColor !== 'rgba(0, 0, 0, 0)' && css.backgroundColor !== 'transparent') { background = css.backgroundColor; break; }
      current = current.parentElement;
    }
    if (!background) continue;
    const l1 = luminance(rgb(style.color)), l2 = luminance(rgb(background));
    const ratio = (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05);
    const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.66 && Number(style.fontWeight) >= 700);
    if (ratio < (large ? 3 : 4.5)) failures.push(`${element.className}: ${text.slice(0, 35)} (${ratio.toFixed(2)}:1)`);
  }
  return failures;
}
