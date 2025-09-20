---
title: "Custom Attack Graph on AttackIQ – Simulating a Full Adversary Workflow"
description: "Chaining existing scenarios into a custom attack graph to emulate a realistic adversary workflow across Execution, Defense Evasion, Privilege Escalation, Credential Access, and Exfiltration."
tags: [AIQ, MITRE ATT&CK, AttackIQ, Adversary Simulation, Attack Graph]
---

## Attack Flow Overview

For this experiment, I built a **custom attack graph** by chaining multiple existing AttackIQ scenarios into a coherent adversary workflow.  The objective was to replicate a realistic attacker kill chain, moving from execution to data exfiltration.

The stages included:
1. **Execution – mshta.exe execution (LOLBins abuse, T1218.005)**  
2. **Defense Evasion – Stop Windows Defender Service (T1562.001)**  
3. **Privilege Escalation – UAC Bypass Attempt (T1548.002)**  
4. **Credential Access – OS Credential Dumping: LSA Secrets (T1003.004)**  
5. **Exfiltration – Simulated HTTP POST exfiltration (T1041)**  

This illustrates how individual adversary techniques can be combined into a repeatable workflow, rather than tested in isolation.

## Why I Designed This Graph

The sequence of techniques in this attack graph was chosen to mirror how an advanced adversary would logically progress through an enterprise environment.  

1. **Execution (T1218.005 – mshta.exe abuse)**  
   Attackers frequently begin with a **LOLBins-based execution** path to bypass application controls and leverage trusted binaries. Using `mshta.exe` as the entry point ensures the workflow starts with a realistic, stealthy execution vector.  

2. **Defense Evasion (T1562.001 – Stop Windows Defender Service)**  
   Once initial code execution is established, adversaries often seek to **disable endpoint defenses** before escalating privileges or persisting. Placing this step early in the chain reflects a common priority: maximizing stealth and reducing detection risk.  

3. **Privilege Escalation (T1548.002 – UAC Bypass Attempt)**  
   With defenses weakened, the next step is to achieve **elevated privileges**. UAC bypass techniques are a natural escalation path after evasion, enabling access to sensitive system resources and paving the way for credential theft.  

4. **Credential Access (T1003.004 – LSA Secrets)**  
   Once administrative-level execution is possible, adversaries often move to **harvest credentials** from memory or secure storage. Dumping LSA secrets provides material for lateral movement and persistence, representing a pivotal inflection point in the kill chain.  

5. **Exfiltration (T1041 – Simulated HTTP POST)**  
   The final stage simulates the **removal of sensitive data** from the environment. Using a standard channel such as HTTP POST reflects realistic attacker behavior, where ordinary protocols are abused to avoid detection.  

By chaining these techniques, the attack graph demonstrates a **cohesive end-to-end intrusion scenario**: stealthy execution → defense evasion → privilege escalation → credential harvesting → data exfiltration. This order reflects both attacker tradecraft and the logical dependencies between techniques.

## Alternative Paths Explored

While designing the graph, I considered including:
- **Lateral Movement (T1021 – Remote Services)** after credential dumping.  
- **Persistence mechanisms** like registry modifications or scheduled tasks.  
- **Alternative exfiltration channels**, such as DNS tunneling or cloud service misuse.  

These will be explored in future iterations to expand the complexity of the graph.

## Blue Team Perspective

From a defensive design standpoint:
- Each stage of the graph maps cleanly to a MITRE ATT&CK technique.  
- This mapping allows defenders to review **detection coverage and response playbooks** against chained techniques.  
- The graph format makes it easier to align security controls with the **full attacker workflow**, rather than isolated events.  

## Closing Thoughts

Even though the scenarios were based on existing modules, combining them into a **custom adversary workflow** provided a meaningful step toward more realistic emulation.  
