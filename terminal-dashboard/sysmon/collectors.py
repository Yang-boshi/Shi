"""System data collection utilities."""

import time
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple

import psutil


@dataclass
class CpuInfo:
    """CPU usage information."""
    overall: float
    per_core: List[float]
    count: int
    frequency: Optional[float]


@dataclass
class MemoryInfo:
    """Memory usage information."""
    ram_total: int
    ram_used: int
    ram_percent: float
    swap_total: int
    swap_used: int
    swap_percent: float


@dataclass
class DiskInfo:
    """Disk usage information."""
    device: str
    mountpoint: str
    total: int
    used: int
    free: int
    percent: float


@dataclass
class NetworkInfo:
    """Network I/O information."""
    bytes_sent: int
    bytes_recv: int
    packets_sent: int
    packets_recv: int
    speed_up: float
    speed_down: float


@dataclass
class ProcessInfo:
    """Process information."""
    pid: int
    name: str
    cpu_percent: float
    memory_percent: float
    memory_mb: float
    status: str


class SystemCollector:
    """Collects system information."""

    def __init__(self):
        self._last_net_io = None
        self._last_net_time = None
        psutil.cpu_percent(interval=None, percpu=True)

    def get_cpu_info(self) -> CpuInfo:
        """Get CPU usage information."""
        per_core = psutil.cpu_percent(interval=0.1, percpu=True)
        overall = sum(per_core) / len(per_core) if per_core else 0.0
        freq = psutil.cpu_freq()
        return CpuInfo(
            overall=overall,
            per_core=per_core,
            count=psutil.cpu_count(),
            frequency=freq.current if freq else None
        )

    def get_memory_info(self) -> MemoryInfo:
        """Get memory usage information."""
        ram = psutil.virtual_memory()
        swap = psutil.swap_memory()
        return MemoryInfo(
            ram_total=ram.total,
            ram_used=ram.used,
            ram_percent=ram.percent,
            swap_total=swap.total,
            swap_used=swap.used,
            swap_percent=swap.percent
        )

    def get_disk_info(self) -> List[DiskInfo]:
        """Get disk usage information."""
        disks = []
        for partition in psutil.disk_partitions():
            try:
                usage = psutil.disk_usage(partition.mountpoint)
                disks.append(DiskInfo(
                    device=partition.device,
                    mountpoint=partition.mountpoint,
                    total=usage.total,
                    used=usage.used,
                    free=usage.free,
                    percent=usage.percent
                ))
            except (PermissionError, OSError):
                continue
        return disks

    def get_network_info(self) -> NetworkInfo:
        """Get network I/O information."""
        net_io = psutil.net_io_counters()
        current_time = time.time()

        speed_up = 0.0
        speed_down = 0.0

        if self._last_net_io and self._last_net_time:
            time_diff = current_time - self._last_net_time
            if time_diff > 0:
                speed_up = (net_io.bytes_sent - self._last_net_io.bytes_sent) / time_diff
                speed_down = (net_io.bytes_recv - self._last_net_io.bytes_recv) / time_diff

        self._last_net_io = net_io
        self._last_net_time = current_time

        return NetworkInfo(
            bytes_sent=net_io.bytes_sent,
            bytes_recv=net_io.bytes_recv,
            packets_sent=net_io.packets_sent,
            packets_recv=net_io.packets_recv,
            speed_up=speed_up,
            speed_down=speed_down
        )

    def get_top_processes(self, count: int = 10) -> List[ProcessInfo]:
        """Get top processes by CPU usage."""
        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'memory_info', 'status']):
            try:
                info = proc.info
                if info['cpu_percent'] is not None:
                    processes.append(ProcessInfo(
                        pid=info['pid'],
                        name=info['name'][:20],
                        cpu_percent=info['cpu_percent'] or 0.0,
                        memory_percent=info['memory_percent'] or 0.0,
                        memory_mb=(info['memory_info'].rss / 1024 / 1024) if info['memory_info'] else 0.0,
                        status=info['status']
                    ))
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue

        processes.sort(key=lambda p: p.cpu_percent, reverse=True)
        return processes[:count]


def format_bytes(bytes_val: int) -> str:
    """Format bytes to human readable string."""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if bytes_val < 1024.0:
            return f"{bytes_val:.1f} {unit}"
        bytes_val /= 1024.0
    return f"{bytes_val:.1f} PB"


def format_speed(bytes_per_sec: float) -> str:
    """Format bytes per second to human readable string."""
    return format_bytes(int(bytes_per_sec)) + "/s"
