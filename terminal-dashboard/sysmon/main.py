"""Entry point for Terminal Dashboard - System Monitor."""

import argparse
import sys

from rich.console import Console

from .dashboard import Dashboard


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Terminal-based system monitoring dashboard"
    )
    parser.add_argument(
        "--refresh", "-r",
        type=float,
        default=1.0,
        help="Refresh rate in seconds (default: 1.0)"
    )
    parser.add_argument(
        "--once", "-1",
        action="store_true",
        help="Print stats once and exit"
    )

    args = parser.parse_args()

    if args.once:
        from .collectors import SystemCollector, format_bytes, format_speed
        console = Console()
        collector = SystemCollector()

        import time
        time.sleep(0.2)

        cpu = collector.get_cpu_info()
        mem = collector.get_memory_info()
        disks = collector.get_disk_info()
        net = collector.get_network_info()
        procs = collector.get_top_processes(5)

        console.print("\n[bold cyan]System Monitor - Snapshot[/bold cyan]\n")

        console.print(f"[bold]CPU:[/bold] {cpu.overall:.1f}% ({cpu.count} cores)")
        console.print(f"[bold]RAM:[/bold] {format_bytes(mem.ram_used)} / {format_bytes(mem.ram_total)} ({mem.ram_percent:.1f}%)")
        if mem.swap_total > 0:
            console.print(f"[bold]Swap:[/bold] {format_bytes(mem.swap_used)} / {format_bytes(mem.swap_total)} ({mem.swap_percent:.1f}%)")

        console.print(f"\n[bold]Network:[/bold]")
        console.print(f"  Sent: {format_bytes(net.bytes_sent)} | Received: {format_bytes(net.bytes_recv)}")

        console.print(f"\n[bold]Disks:[/bold]")
        for disk in disks:
            console.print(f"  {disk.mountpoint}: {format_bytes(disk.used)} / {format_bytes(disk.total)} ({disk.percent:.1f}%)")

        console.print(f"\n[bold]Top Processes:[/bold]")
        for p in procs:
            console.print(f"  {p.name:<20} CPU: {p.cpu_percent:.1f}%  MEM: {p.memory_percent:.1f}%")
        return

    dashboard = Dashboard(refresh_rate=args.refresh)
    dashboard.run()


if __name__ == "__main__":
    main()
