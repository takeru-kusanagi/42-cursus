# Born2beRoot - System Administration & Security

**Born2beRoot** is a foundational system administration project in the 42 curriculum.  
The goal is to set up a secure Debian virtual machine from scratch, implementing strict security protocols, user management, and automated monitoring.

This project demonstrates the ability to:

- Manage a server environment  
- Understand disk partitioning (LVM)  
- Enforce best practices for system hardening  

---

## 🛡️ Key Features & Configurations

### 🔐 System Hardening

#### 🔹 Virtualization
- Set up using **VirtualBox**
- Minimal **Debian installation** (no GUI)

#### 🔹 Storage
- Implemented **LVM (Logical Volume Manager)**
- Enabled **full disk encryption**

#### 🔹 Firewall (UFW)
- Strictly configured to block all traffic  
- Only **custom SSH port (4242)** is allowed

#### 🔹 SSH Security
- Root login disabled  
- Switched to a non-standard port for enhanced security  

---

### 👥 User & Access Management

#### 🔹 Sudo Policies
- Enforced strict sudo rules  
- TTY requirements enabled  
- Custom log file paths configured  
- Custom error messages implemented  

#### 🔹 Password Policy
- Robust password aging rules  
- Complexity requirements using `libpam-pwquality`  

#### 🔹 User/Group Logic
- Managed specific users and groups  
- Example: `raaalali` in group `raad`  
- Defined and restricted permissions properly  

---

### 📊 Monitoring & Automation

#### 🔹 Monitoring Script
Developed a **Bash script** to display system metrics:

- CPU load  
- RAM usage  
- Disk usage  
- Network status  

#### 🔹 Task Scheduling
- Configured **Cron**
- Automated monitoring script at fixed intervals  
- Ensures real-time visibility of server health  

---

## 💡 Skills & Competencies

### Linux Administration
- Debian-based system management  
- CLI-only environment proficiency  

###  Infrastructure Security
- Firewall configuration (UFW)  
- SSH hardening  
- Encrypted storage setup  

###  Automation
- Shell scripting  
- Cron job scheduling  

###  Virtualization
- Managing virtual resources  
- Disk partitioning with LVM  

---

## 🚀 How to Verify

###  System Signature

The integrity of the virtual machine is verified using a SHA-1 signature:

```bash
sha1sum Born2beRoot.vdi > signature.txt
```

---

###  Evaluation Commands

During the evaluation, the following commands are used to verify the system state:

```bash
lsblk          # Check LVM and encrypted partitions
ufw status     # Verify firewall rules
ss -tuln       # Check open ports and SSH configuration
sudo -V        # Verify sudo policies and logging
```

---

Developed by **raaalali** as part of the **42 Tokyo curriculum**.
