"""Conservative football-data.org v4 client.

Free tier is 10 calls per minute. This client:
- waits at least 7 seconds between calls
- reads X-RequestsAvailable and X-RequestCounter-Reset
- sleeps until reset if remaining calls are low
- caches JSON on disk so reruns do not spend quota
"""

from __future__ import annotations

import json
import os
import time
from collections.abc import Mapping
from pathlib import Path
from urllib.parse import urlencode

import requests
from dotenv import load_dotenv

load_dotenv(Path(__file__).with_name(".env"))

BASE_URL = "https://api.football-data.org/v4"
MIN_INTERVAL_SECONDS = 7
LOW_REMAINING_THRESHOLD = 2
CACHE_DIR = Path(__file__).with_name("cache")


class FootballDataClient:
    def __init__(self, token: str | None = None, cache_dir: Path | None = None) -> None:
        self.token = (token or os.getenv("FOOTBALL_DATA_TOKEN") or "").strip()
        if not self.token:
            raise ValueError(
                "Missing FOOTBALL_DATA_TOKEN. Put it in lab-models/.env and do not commit that file."
            )
        self.cache_dir = cache_dir or CACHE_DIR
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self._last_call_at = 0.0
        self.requests_available: int | None = None
        self.request_counter_reset: int | None = None
        self.authenticated_client: str | None = None

    def get(self, path: str, params: dict[str, str] | None = None, use_cache: bool = True) -> dict:
        cache_file = self._cache_file(path, params)
        if use_cache and cache_file.exists():
            return json.loads(cache_file.read_text(encoding="utf-8"))

        self._wait_for_quota()
        response = requests.get(
            f"{BASE_URL}{path}",
            headers={"X-Auth-Token": self.token},
            params=params or {},
            timeout=30,
        )
        self._last_call_at = time.monotonic()
        self._store_headers(response.headers)

        if response.status_code == 429:
            reset_in = self.request_counter_reset or 60
            time.sleep(reset_in + 1)
            return self.get(path, params, use_cache=False)

        response.raise_for_status()
        payload = response.json()
        cache_file.write_text(json.dumps(payload), encoding="utf-8")
        return payload

    def _cache_file(self, path: str, params: dict[str, str] | None) -> Path:
        key = path.strip("/").replace("/", "_") or "root"
        if params:
            key = f"{key}_{urlencode(sorted(params.items()))}"
        safe = "".join(ch if ch.isalnum() or ch in "-_=" else "_" for ch in key)
        return self.cache_dir / f"{safe}.json"

    def _wait_for_quota(self) -> None:
        elapsed = time.monotonic() - self._last_call_at
        if elapsed < MIN_INTERVAL_SECONDS:
            time.sleep(MIN_INTERVAL_SECONDS - elapsed)

        if self.requests_available is not None and self.requests_available <= LOW_REMAINING_THRESHOLD:
            time.sleep((self.request_counter_reset or 60) + 1)

    def _store_headers(self, headers: Mapping[str, str]) -> None:
        self.requests_available = self._parse_int(headers.get("X-RequestsAvailable")) or self.requests_available
        self.request_counter_reset = self._parse_int(headers.get("X-RequestCounter-Reset")) or self.request_counter_reset
        self.authenticated_client = headers.get("X-Authenticated-Client") or self.authenticated_client
        print(
            "football-data.org quota:",
            f"available={self.requests_available}",
            f"reset_in={self.request_counter_reset}s",
            f"client={self.authenticated_client}",
        )

    @staticmethod
    def _parse_int(value: str | None) -> int | None:
        if not value:
            return None
        value = value.strip()
        if value.isdigit():
            return int(value)
        try:
            return int(float(value))
        except ValueError:
            return None
