"""Main dashboard layout using Rich library."""

from datetime import datetime
from typing import List

from rich.console import Console
from rich.layout import Layout
from rich.live import Live
from rich.panel import Panel
from rich.table import Table
from rich.text import Text
from rich.bar import Bar
from rich.columns import Columns
from rich.progress_bar import ProgressBar

from .collectors import (
    SystemCollector,
    CpuInfo,
    MemoryInfo,
    DiskInfo,
    NetworkInfo,
    ProcessInfo,
    format_bytes,
    format_speed,
)


class Dashboard:
    """System monitoring dashboard."""

    def __init__(self, refresh_rate: float = 1.0):
        self.console = Console()
        self.collector = SystemCollector()
        self.refresh_rate = refresh_rate

    def create_cpu_section(self, cpu_info: CpuInfo) -> Panel:
        """Create CPU usage panel."""
        table = Table(show_header=False, expand=True, padding=(0, 1))
        table.add_column("Core", width=8)
        table.add_column("Bar", ratio=1)
        table.add_column("Percent", width=8, justify="right")

        for i, usage in enumerate(cpu_info.per_core):
            color = self._get_color(usage)
            bar = Bar(size=20, begin=0, end=100, color=color)
            bar.position = usage
            table.add_row(
                f"Core {i}",
                bar,
                f"{usage:.1f}%"
            )

        freq_str = f" @ {cpu_info.frequency:.0f}MHz" if cpu_info.frequency else ""
        title = f"CPU ({cpu_info.count} cores{freq_str}) - Total: {cpu_info.overall:.1f}%"
        return Panel(table, title=title, border_style="cyan")

    def create_memory_section(self, mem_info: MemoryInfo) -> Panel:
        """Create memory usage panel."""
        table = Table(show_header=False, expand=True, padding=(0, 1))
        table.add_column("Type", width=10)
        table.add_column("Bar", ratio=1)
        table.add_column("Info", width=20, justify="right")

        ram_color = self._get_color(mem_info.ram_percent)
        ram_bar = Bar(size=20, begin=0, end=100, color=ram_color)
        ram_bar.position = mem_info.ram_percent
        ram_used = format_bytes(mem_info.ram_used)
        ram_total = format_bytes(mem_info.ram_total)
        table.add_row(
            "RAM",
            ram_bar,
            f"{ram_used} / {ram_total} ({mem_info.ram_percent:.1f}%)"
        )

        if mem_info.swap_total > 0:
            swap_color = self._get_color(mem_info.swap_percent)
            swap_bar = Bar(size=20, begin=0, end=100, color=swap_color)
            swap_bar.position = mem_info.swap_percent
            swap_used = format_bytes(mem_info.swap_used)
            swap_total = format_bytes(mem_info.swap_total)
            table.add_row(
                "Swap",
                swap_bar,
                f"{swap_used} / {swap_total} ({mem_info.swap_percent:.1f}%)"
            )
        else:
            table.add_row("Swap", Text("No swap configured", style="dim"), "")

        return Panel(table, title="Memory Usage", border_style="green")

    def create_disk_section(self, disks: List[DiskInfo]) -> Panel:
        """Create disk usage panel."""
        table = Table(show_header=True, expand=True, padding=(0, 1))
        table.add_column("Device", width=20)
        table.add_column("Mount", width=15)
        table.add_column("Bar", ratio=1)
        table.add_column("Usage", width=20, justify="right")

        for disk in disks:
            color = self._get_color(disk.percent)
            bar = Bar(size=15, begin=0, end=100, color=color)
            bar.position = disk.percent
            used = format_bytes(disk.used)
            total = format_bytes(disk.total)
            table.add_row(
                disk.device[:20],
                disk.mountpoint[:15],
                bar,
                f"{used} / {total} ({disk.percent:.1f}%)"
            )

        return Panel(table, title="Disk Usage", border_style="yellow")

    def create_network_section(self, net_info: NetworkInfo) -> Panel:
        """Create network I/O panel."""
        table = Table(show_header=False, expand=True, padding=(0, 1))
        table.add_column("Metric", width=15)
        table.add_column("Value", width=20)

        table.add_row("Upload Speed", f"▲ {format_speed(net_info.speed_up)}")
        table.add_row("Download Speed", f"▼ {format_speed(net_info.speed_down)}")
        table.add_row("Total Sent", format_bytes(net_info.bytes_sent))
        table.add_row("Total Received", format_bytes(net_info.bytes_recv))
        table.add_row("Packets Sent", f"{net_info.packets_sent:,}")
        table.add_row("Packets Received", f"{net_info.packets_recv:,}")

        return Panel(table, title="Network I/O", border_style="magenta")

    def create_process_section(self, processes: List[ProcessInfo]) -> Panel:
        """Create top processes panel."""
        table = Table(show_header=True, expand=True, padding=(0, 1))
        table.add_column("PID", width=8, style="dim")
        table.add_column("Name", width=20)
        table.add_column("Status", width=10)
        table.add_column("CPU %", width=10, justify="right")
        table.add_column("MEM %", width=10, justify="right")
        table.add_column("Memory", width=12, justify="right")

        for proc in processes:
            cpu_color = self._get_color(proc.cpu_percent)
            mem_color = self._get_color(proc.memory_percent)
            table.add_row(
                str(proc.pid),
                proc.name,
                proc.status,
                f"[{cpu_color}]{proc.cpu_percent:.1f}%[/{cpu_color}]",
                f"[{mem_color}]{proc.memory_percent:.1f}%[/{mem_color}]",
                f"{proc.memory_mb:.1f} MB"
            )

        return Panel(table, title="Top Processes", border_style="red")

    def create_layout(self) -> Layout:
        """Create the dashboard layout."""
        layout = Layout()

        layout.split(
            Layout(name="header", size=3),
            Layout(name="body"),
            Layout(name="footer", size=3),
        )

        layout["body"].split_row(
            Layout(name="left", ratio=1),
            Layout(name="right", ratio=1),
        )

        layout["left"].split(
            Layout(name="cpu"),
            Layout(name="memory"),
        )

        layout["right"].split(
            Layout(name="network"),
            Layout(name="disk"),
        )

        return layout

    def update_layout(self, layout: Layout):
        """Update layout with current system data."""
        cpu_info = self.collector.get_cpu_info()
        mem_info = self.collector.get_memory_info()
        disk_info = self.collector.get_disk_info()
        net_info = self.collector.get_network_info()
        processes = self.collector.get_top_processes(8)

        header_text = Text()
        header_text.append("  ⚡ System Monitor ", style="bold cyan")
        header_text.append(f"│ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ", style="white")
        header_text.append("│ Press Ctrl+C to exit", style="dim")

        layout["header"].update(Panel(header_text, style="on dark_blue"))
        layout["cpu"].update(self.create_cpu_section(cpu_info))
        layout["memory"].update(self.create_memory_section(mem_info))
        layout["network"].update(self.create_network_section(net_info))
        layout["disk"].update(self.create_disk_section(disk_info))

        process_panel = self.create_process_section(processes)
        layout["footer"].update(process_panel)

    def _get_color(self, percent: float) -> str:
        """Get color based on percentage."""
        if percent < 50:
            return "green"
        elif percent < 80:
            return "yellow"
        else:
            return "red"

    def run(self):
        """Run the live dashboard."""
        layout = self.create_layout()

        try:
            with Live(layout, console=self.console, refresh_per_second=1/self.refresh_rate, screen=True):
                while True:
                    self.update_layout(layout)
                    import time
                    time.sleep(self.refresh_rate)
        except KeyboardInterrupt:
            self.console.print("\n[yellow]Dashboard stopped.[/yellow]")
