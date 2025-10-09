# parsing/classification_parser.py
from __future__ import annotations
import re, datetime as dt
from dataclasses import dataclass
from typing import Dict, List, Tuple, Optional
import pandas as pd
from core.errors import ParseError

@dataclass
class ParsedContext:
    df: pd.DataFrame
    colA: str
    pairs: List[Tuple[str, str, Optional[str]]]  # (week_label, OUT_col, GP_col or None)
    top_total_row: int
    top_par_row: int
    officer_blocks: List[Tuple[str, int, int]]   # (name, start_idx, end_idx)

WEEK_RX = re.compile(r"(31st|30th|29th|[0-3]?\d(?:st|nd|rd|th)?)\s*(Aug|Sept|Sep|Oct)\.?", re.I)
GP_RX   = re.compile(r"\b(GP|G\.P\.|Gross\s*Provision)\b", re.I)
MONTH_FIX = {"Sept": "Sep"}

def _norm_week_label(raw: str) -> str:
    s = str(raw or "").strip().replace("  ", " ")
    m = WEEK_RX.search(s)
    if not m:
        s = s.replace("August", "Aug")
        s = s.replace("Sept.", "Sep").replace("Sept", "Sep")
        m = WEEK_RX.search(s)
    if not m:
        return s
    day, mon = m.group(1), m.group(2)
    day_num = re.sub(r"\D", "", day)
    mon = MONTH_FIX.get(mon, mon)
    try:
        d = dt.datetime.strptime(f"{day_num} {mon} 2025", "%d %b %Y")
        return d.strftime("%Y-%m-%d")
    except Exception:
        return s

def _find_gp_for(idx: int, cols: List[str]) -> Optional[int]:
    for j in range(idx + 1, min(idx + 4, len(cols))):
        if GP_RX.search(str(cols[j]) or ""):
            return j
    return None

def _discover_pairs(df: pd.DataFrame) -> List[Tuple[str, str, Optional[str]]]:
    cols = list(df.columns)
    stop = cols.index("TARGET / VARIANCE ") if "TARGET / VARIANCE " in cols else len(cols)
    left = cols[:stop]

    pairs: List[Tuple[str, str, Optional[str]]] = []
    for i, c in enumerate(left):
        cs = str(c or "")
        looks_week = bool(WEEK_RX.search(cs)) or any(m in cs for m in ("Aug", "Sept", "Sep", "Oct"))
        if looks_week and not GP_RX.search(cs) and "Unnamed" not in cs:
            gp_idx = _find_gp_for(i, left)
            week = _norm_week_label(cs)
            if gp_idx is None:
                alt = f"{cs}.1"
                if alt in left:
                    pairs.append((week, c, alt))
                else:
                    pairs.append((week, c, None))
            else:
                pairs.append((week, c, left[gp_idx]))

    # de-dupe by week (keep first full pair)
    clean, seen = [], set()
    for wk, out_c, gp_c in pairs:
        if wk not in seen:
            seen.add(wk)
            clean.append((wk, out_c, gp_c))
    if not clean:
        raise ParseError("Could not infer any week/outstanding/GP pairs from sheet headers")
    return clean

def _find_blocks(df: pd.DataFrame, colA: str) -> List[Tuple[str, int, int]]:
    marks = df[df[colA].astype(str).str.contains("Collection Officer", case=False, na=False)].index.tolist()
    blocks: List[Tuple[str, int, int]] = []
    for i, r in enumerate(marks):
        name = str(df.loc[r+1, colA]).strip()
        end  = marks[i+1] if i + 1 < len(marks) else len(df)
        blocks.append((name, r+1, end))
    return blocks

def _choose_total_and_par_indices(section: pd.DataFrame, colA: str) -> Tuple[Optional[int], Optional[int]]:
    # Find PAR row by explicit phrase, else any line starting with PAR
    par_idx_list = section[section[colA].astype(str).str.contains("Portfolio At Risk", case=False, na=False)].index.tolist()
    if not par_idx_list:
        par_idx_list = section[section[colA].astype(str).str.match(r"(?i)^PAR\b")].index.tolist()
    if not par_idx_list:
        return None, None
    par_idx = min(par_idx_list)

    # Pick the last TOTAL BEFORE the PAR row (avoids sub-totals above)
    total_idxs = section[section[colA].astype(str).str.strip().str.upper().eq("TOTAL")].index.tolist()
    if not total_idxs:
        return None, None
    before_par = [x for x in total_idxs if x < par_idx]
    total_idx = max(before_par) if before_par else max(total_idxs)
    return int(total_idx), int(par_idx)

def load_ctx(df: pd.DataFrame) -> ParsedContext:
    colA = df.columns[0]
    pairs = _discover_pairs(df)

    # overall section: before first officer block
    coll_rows = df[df[colA].astype(str).str.contains("Collection Officer", case=False, na=False)].index
    first_coll = int(coll_rows.min()) if len(coll_rows) else len(df)
    overall = df.iloc[:first_coll]
    total_idx, par_idx = _choose_total_and_par_indices(overall, colA)
    if total_idx is None or par_idx is None:
        raise ParseError("Could not find overall TOTAL / PAR rows above the first Collection Officer")

    return ParsedContext(
        df=df,
        colA=colA,
        pairs=pairs,
        top_total_row=total_idx,
        top_par_row=par_idx,
        officer_blocks=_find_blocks(df, colA)
    )
def _safe_float(v) -> float:
    """
    Safely parse numeric values from Excel cells, normalize commas/percent symbols,
    handle negatives like (1,234.56), and intelligently scale fractional percentages.
    """
    try:
        s = str(v).replace(",", "").replace("%", "").strip()
        if s == "" or s.lower() == "nan":
            return 0.0

        # Detect negative parentheses e.g. (1,234.56)
        neg = s.startswith("(") and s.endswith(")")
        num = float(s.strip("()"))

        # Intelligent normalization:
        # If 0 < num < 1 (e.g. 0.04), treat as fractional percent => multiply by 100
        if 0 < num < 1:
            num *= 100

        return -num if neg else num
    except Exception:
        return 0.0

def _normalize_par(x) -> float:
    val = _safe_float(x)
    # If stored as a fraction (0.04), turn into percent; if already percent (4.0), keep it.
    if 0 < val <= 1:
        val *= 100.0
    return round(val, 2)

def overall_weeks(ctx: ParsedContext) -> List[Dict]:
    out: List[Dict] = []
    for week, out_c, gp_c in ctx.pairs:
        outstanding = _safe_float(ctx.df.loc[ctx.top_total_row, out_c])
        provision   = _safe_float(ctx.df.loc[ctx.top_total_row, gp_c]) if gp_c else 0.0
        par         = _normalize_par(ctx.df.loc[ctx.top_par_row, gp_c]) if gp_c else 0.0
        out.append({
            "week": week,
            "outstanding": round(outstanding, 2),
            "provision": round(provision, 2),
            "par": par
        })
    return out

def officers(ctx: ParsedContext) -> List[str]:
    seen, out = set(), []
    for (name, _, _) in ctx.officer_blocks:
        n = (name or "").strip().title()
        if n and n not in seen:
            seen.add(n)
            out.append(n)
    return out

def officer_weeks(ctx: ParsedContext, name: str) -> List[Dict]:
    blk = next((b for b in ctx.officer_blocks if (b[0] or "").strip().title() == (name or "").strip().title()), None)
    if not blk:
        return []
    _, start, end = blk
    section = ctx.df.iloc[start:end]
    total_idx, par_idx = _choose_total_and_par_indices(section, ctx.colA)
    if total_idx is None or par_idx is None:
        return []

    out: List[Dict] = []
    for week, out_c, gp_c in ctx.pairs:
        outstanding = _safe_float(ctx.df.loc[total_idx, out_c])
        provision   = _safe_float(ctx.df.loc[total_idx, gp_c]) if gp_c else 0.0
        par         = _normalize_par(ctx.df.loc[par_idx, gp_c]) if gp_c else 0.0
        out.append({
            "week": week,
            "outstanding": round(outstanding, 2),
            "provision": round(provision, 2),
            "par": par
        })
    return out

def latest_snapshot(ctx: ParsedContext, name: Optional[str] = None) -> Dict:
    weeks = officer_weeks(ctx, name) if name else overall_weeks(ctx)
    if not weeks:
        return {"week": None, "totalOutstanding": 0, "totalGrossProvision": 0, "overallPAR": 0}
    w = weeks[-1]
    return {
        "week": w["week"],
        "totalOutstanding": w["outstanding"],
        "totalGrossProvision": w["provision"],
        "overallPAR": w["par"],
    }
