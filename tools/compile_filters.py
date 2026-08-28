#!/usr/bin/env python3
"""Compile the shared hostname list into Chrome declarativeNetRequest rules."""

import json
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]
SOURCE = PROJECT / "filters" / "core-domains.txt"
TARGET = PROJECT / "extension" / "rules" / "core-rules.json"
RESOURCE_TYPES = ["script", "image", "stylesheet", "xmlhttprequest", "media", "font", "ping", "other", "sub_frame", "websocket"]

def collect_domains() -> list[str]:
    domains: list[str] = []
    for raw in SOURCE.read_text(encoding="utf-8").splitlines():
        line = raw.strip().lower()
        if not line or line.startswith("#"):
            continue
        if "/" in line:
            line = line.split("/", 1)[0]
        if line not in domains:
            domains.append(line)
    return domains

def main() -> None:
    rules = [{"id": index, "priority": 1, "action": {"type": "block"}, "condition": {"urlFilter": f"||{domain}^", "resourceTypes": RESOURCE_TYPES, "domainType": "thirdParty"}} for index, domain in enumerate(collect_domains(), start=1)]
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    TARGET.write_text(json.dumps(rules, indent=2) + "\n", encoding="utf-8")
    print(f"Compiled {len(rules)} static network filters to {TARGET.relative_to(PROJECT)}")

if __name__ == "__main__":
    main()
