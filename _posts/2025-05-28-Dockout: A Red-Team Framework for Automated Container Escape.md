---
title: "Dockout: A Red-Team Framework for Automated Container Escape"
date: 2025-05-28
categories: PROJECTS
description: "Dockout is a structured and safety-conscious framework for automating container escape techniques. This post outlines the rationale, design, and implementation of a red-team–oriented PoC system."
tags: [Docker Security, Red Teaming, Exploit Framework, Secure PoC Automation]
featured: true
---

## Introduction

Container escape remains a critical area in offensive security, particularly as containerized infrastructure becomes more common in production environments.  

While several public proof-of-concept (PoC) scripts and research articles exist for known escape techniques, many are designed for isolated testing and are not intended for broader operational use or integration into red-team workflows.

[Dockout](https://github.com/schoi1337/dockout) was developed to address this gap by providing:

- A modular and extensible PoC framework
- Safe simulation capabilities to support learning and CI integration
- Structured logging and reporting for traceability and audit

This post outlines the design and implementation of Dockout, including the trade-offs made to balance functionality, safety, and usability.

## Project Objectives

From the outset, the framework was designed with three priorities:

1. **Support for real exploit execution** in controlled environments  
2. **Simulation mode** to validate logic without modifying the host  
3. **Consistency and safety** through CLI prompts and structured output

The goal was to provide a system suitable for both individual testing and operational use within red-team workflows.

## Architecture

Dockout uses a modular approach where each PoC is implemented as a standalone plugin.  
Each module follows a simple interface contract:

```python
def simulate():
    # Print dry-run steps

def exploit():
    # Launch real exploit (requires --unsafe and confirmation)
```

The CLI parser in core.py handles all mode routing (`--simulate`, `--auto`, `--attack`, etc).

The directory structure:

```plaintext
dockout/
├── attacks/                        # All exploit modules (real/simulated)
│   ├── cap_abuse.py
│   ├── cve_2019_5736.py
│   ├── cve_2020_13409.py
│   ├── cve_2020_15257.py
│   ├── dirty_pipe_escalation.py
│   ├── docker_socket_abuse.py
│   ├── overlayfs.py
│   ├── sudoedit.py
│   └── writable_cgroup_escape.py
│
├── dev_targets/                   # Test Dockerfiles for safe sandboxing
│   └── ...                        # (e.g., Dockerfile.cve_2019_5736, etc.)
│
├── src/                           # Core logic and CLI entry point
│   ├── core.py                   # CLI dispatcher
│   ├── env_check.py              # Runtime/container validations
│   ├── plugin_loader.py          # Dynamic exploit loader
│   └── report_generator.py       # HTML + JSON report generation
│
├── requirements.txt               # Python dependencies
└── README.md
```

## Exploit Coverage

The following PoC modules are implemented in Dockout:

| Technique / CVE               | Module                     | Description                                              | Execution Mode | Simulation Support |
|-------------------------------|-----------------------------|----------------------------------------------------------|----------------|---------------------|
| CVE-2019-5736                 | `cve_2019_5736.py`          | runc overwrite via `/proc/self/exe`                      | 🟢 Real        | ✅ Supported         |
| Docker Socket Abuse           | `docker_socket_abuse.py`    | Host takeover via mounted Docker socket                  | 🟢 Real        | ✅ Supported         |
| CAP_SYS_PTRACE Abuse          | `cap_abuse.py`              | Strace host PID from inside container                    | 🟢 Real        | ✅ Supported         |
| OverlayFS (CVE-2023-0386)     | `overlayfs.py`              | OverlayFS mount exploit for write access                 | 🟡 Simulated   | ✅ Supported         |
| CVE-2021-3156 (sudoedit)      | `sudoedit.py`               | Heap overflow via sudoedit                               | 🟡 Simulated   | ✅ Supported         |
| CVE-2020-13409                | `cve_2020_13409.py`         | docker.sock mount attack via volume injection            | 🟡 Simulated   | ✅ Supported         |
| CVE-2020-15257                | `cve_2020_15257.py`         | Overwrite `/root` via privileged container mount         | 🟡 Simulated   | ✅ Supported         |
| Writable Cgroup Escape        | `writable_cgroup_escape.py` | Escalation via notify_on_release trigger                 | 🟡 Simulated   | ✅ Supported         |
| Dirty Pipe (CVE-2022-0847)    | `dirty_pipe_escalation.py`  | Overwrite read-only files using Dirty Pipe technique      | 🟡 Simulated   | ✅ Supported         |

## Report Generation

To ensure the tool remains usable in operational and educational settings, Dockout includes:
- HTML reports with time-stamped actions and results
- JSON reports for integration with external pipelines
- Risk levels and execution recommendations per exploit

This enables users to review results safely, share internally, or store artifacts for audit purposes.

## Development Considerations

Key decisions during development included:
- Each module supports both simulation and real execution paths with logging.
- Implementing interactive confirmation prompts for all real exploits
- Separating simulation logic to support CI-based validation
- Using modular file structure to simplify maintenance and future extensions
- Avoiding hardcoded assumptions about the container runtime or host OS

## Lessons Learned

- Designing with safety and reproducibility in mind leads to better tooling
- Plugin-based systems improve clarity, scalability, and maintainability
- Structured reporting is essential not only for documentation, but also for security validation and collaboration
- Simulation can be a powerful method to learn and test offensive concepts without causing unintended side effects

## Conclusion

Dockout is a continuing effort to bridge the gap between research-grade PoCs and production-grade security tooling.
While the framework is already capable of executing several well-known container escapes, the real value lies in its extensibility and safe-by-default design.

The project is available publicly:

> → GitHub: [Dockout](https://github.com/schoi1337/dockout)

