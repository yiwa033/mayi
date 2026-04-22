export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatCurrency(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `￥${safe.toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const RMB_DIGITS = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
const RMB_UNITS = ["", "拾", "佰", "仟"];
const RMB_BIG_UNITS = ["", "万", "亿", "兆"];

function integerToChinese(num: number): string {
  if (num === 0) return RMB_DIGITS[0];
  const parts: string[] = [];
  let unitIndex = 0;
  let n = num;

  while (n > 0) {
    const section = n % 10000;
    if (section !== 0) {
      let sectionStr = "";
      let digitPos = 0;
      let sec = section;
      let zeroFlag = false;
      while (sec > 0) {
        const digit = sec % 10;
        if (digit === 0) {
          if (!zeroFlag && sectionStr !== "") {
            sectionStr = RMB_DIGITS[0] + sectionStr;
          }
          zeroFlag = true;
        } else {
          sectionStr = RMB_DIGITS[digit] + RMB_UNITS[digitPos] + sectionStr;
          zeroFlag = false;
        }
        digitPos += 1;
        sec = Math.floor(sec / 10);
      }
      parts.unshift(sectionStr + RMB_BIG_UNITS[unitIndex]);
    } else if (parts[0] && !parts[0].startsWith(RMB_DIGITS[0])) {
      parts.unshift(RMB_DIGITS[0]);
    }
    unitIndex += 1;
    n = Math.floor(n / 10000);
  }

  return parts.join("").replace(/零+/g, "零").replace(/零$/g, "");
}

export function numberToChineseUppercaseRMB(value: number): string {
  const safe = round2(Math.max(0, value));
  const integer = Math.floor(safe);
  const decimal = Math.round((safe - integer) * 100);
  const jiao = Math.floor(decimal / 10);
  const fen = decimal % 10;

  let result = `${integerToChinese(integer)}元`;
  if (jiao === 0 && fen === 0) {
    return `${result}整`;
  }
  if (jiao > 0) {
    result += `${RMB_DIGITS[jiao]}角`;
  }
  if (fen > 0) {
    result += `${RMB_DIGITS[fen]}分`;
  }
  return result;
}
