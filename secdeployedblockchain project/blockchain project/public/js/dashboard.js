document.addEventListener('DOMContentLoaded', function() {
    // Create blockchain nodes and connections
    const blockchainBg = document.getElementById('blockchainBg');
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Create nodes
    for (let i = 0; i < 30; i++) {
        const node = document.createElement('div');
        node.className = 'blockchain-node';
        node.style.left = `${Math.random() * width}px`;
        node.style.top = `${Math.random() * height}px`;
        node.style.animationDelay = `${Math.random() * 15}s`;
        blockchainBg.appendChild(node);
    }
    
    // Create connections
    for (let i = 0; i < 15; i++) {
        const connection = document.createElement('div');
        connection.className = 'blockchain-connection';
        const x1 = Math.random() * width;
        const y1 = Math.random() * height;
        const x2 = x1 + (Math.random() * 200 - 100);
        const y2 = y1 + (Math.random() * 200 - 100);
        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        
        connection.style.width = `${length}px`;
        connection.style.left = `${x1}px`;
        connection.style.top = `${y1}px`;
        connection.style.transform = `rotate(${angle}deg)`;
        blockchainBg.appendChild(connection);
    }
    
    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    const sections = {
        dashboard: document.getElementById('dashboardSection'),
        assets: document.getElementById('assetsSection'),
        history: document.getElementById('historySection'),
        settings: document.getElementById('settingsSection'),
        help: document.getElementById('helpSection')
    };
    
    let deleteBtn = null;
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected section
            Object.values(sections).forEach(sec => sec.style.display = 'none');
            sections[section].style.display = 'block';
            showSection(section); // <-- Ensure section logic (like fetching transactions) runs

            // Show logout and delete buttons in settings
            if (section === 'settings') {
                if (!logoutBtn) {
                    logoutBtn = document.createElement('button');
                    logoutBtn.textContent = 'Logout';
                    logoutBtn.className = 'btn btn-primary';
                    logoutBtn.style.marginTop = '40px';
                    logoutBtn.onclick = function() {
                        alert('Logged out!');
                        // Add your logout logic here
                    };
                }
                if (!sections.settings.contains(logoutBtn)) {
                    sections.settings.appendChild(logoutBtn);
                }
                if (!deleteBtn) {
                    deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Delete Account';
                    deleteBtn.className = 'btn btn-delete';
                    deleteBtn.style.marginTop = '18px';
                    deleteBtn.style.display = 'block';
                    deleteBtn.style.width = '100%';
                    deleteBtn.onclick = function() {
                        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                            alert('Account deleted!');
                            // Add your delete logic here
                        }
                    };
                }
                if (!sections.settings.contains(deleteBtn)) {
                    sections.settings.appendChild(deleteBtn);
                }
            } else {
                if (logoutBtn && sections.settings.contains(logoutBtn)) {
                    sections.settings.removeChild(logoutBtn);
                }
                if (deleteBtn && sections.settings.contains(deleteBtn)) {
                    sections.settings.removeChild(deleteBtn);
                }
            }

            // Show total assets transferred in history
            if (section === 'history') {
                // historySection.innerHTML = ''; // This line is removed as per the edit hint
                // For demo, count assets with status 'transferred'
                // const transferred = sampleAssets.filter(a => a.status === 'transferred'); // This line is removed as per the edit hint
                // if (transferred.length > 0) { // This line is removed as per the edit hint
                //     const totalDiv = document.createElement('div'); // This line is removed as per the edit hint
                //     totalDiv.className = 'card'; // This line is removed as per the edit hint
                //     totalDiv.style.margin = '40px auto'; // This line is removed as per the edit hint
                //     totalDiv.style.maxWidth = '400px'; // This line is removed as per the edit hint
                //     totalDiv.style.textAlign = 'center'; // This line is removed as per the edit hint
                //     totalDiv.innerHTML = `<h2>Total Assets Transferred</h2><div style='font-size:2.5rem;font-weight:700;margin:20px 0;'>${transferred.length}</div>`; // This line is removed as per the edit hint
                //     historySection.appendChild(totalDiv); // This line is removed as per the edit hint
                // }
            }

            // Show company contacts in help section
            if (section === 'help') {
                // helpSection.innerHTML = ''; // This line is removed as per the edit hint
                const contactCard = document.createElement('div');
                contactCard.className = 'card';
                contactCard.innerHTML = `
                    <h2>Contact Us</h2>
                    <div class='contact-list'>
                        <div><i class='fas fa-envelope'></i> <a href='mailto:company@email.com'>company@email.com</a></div>
                        <div><i class='fab fa-instagram'></i> <a href='https://instagram.com/company' target='_blank'>@company</a></div>
                        <div><i class='fab fa-google'></i> <a href='mailto:company@gmail.com'>company@gmail.com</a></div>
                    </div>
                    <div class='contact-icons'>
                        <a href='mailto:company@email.com' title='Email'><i class='fas fa-envelope'></i></a>
                        <a href='https://instagram.com/company' target='_blank' class='instagram' title='Instagram'><i class='fab fa-instagram'></i></a>
                        <a href='mailto:company@gmail.com' title='Gmail'><i class='fab fa-google'></i></a>
                    </div>
                `;
                // helpSection.appendChild(contactCard); // This line is removed as per the edit hint
            }

            // Show settings card for consistency
            if (section === 'settings') {
                // settingsSection.innerHTML = ''; // This line is removed as per the edit hint
                const settingsCard = document.createElement('div');
                settingsCard.className = 'card';
                settingsCard.innerHTML = `
                    <h2>Settings</h2>
                    <div class='settings-list'>
                        <div><i class='fas fa-user'></i> Profile Settings</div>
                        <div><i class='fas fa-cog'></i> Preferences</div>
                    </div>
                `;
                // settingsSection.appendChild(settingsCard); // This line is removed as per the edit hint
                // Add logout and delete buttons below
                if (!logoutBtn) {
                    logoutBtn = document.createElement('button');
                    logoutBtn.textContent = 'Logout';
                    logoutBtn.className = 'btn btn-primary';
                    logoutBtn.style.marginTop = '24px';
                    logoutBtn.onclick = function() {
                        alert('Logged out!');
                    };
                }
                if (!settingsCard.contains(logoutBtn)) {
                    settingsCard.appendChild(logoutBtn);
                }
                if (!deleteBtn) {
                    deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Delete Account';
                    deleteBtn.className = 'btn btn-delete';
                    deleteBtn.style.marginTop = '14px';
                    deleteBtn.style.display = 'block';
                    deleteBtn.style.width = '100%';
                    deleteBtn.onclick = function() {
                        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                            alert('Account deleted!');
                        }
                    };
                }
                if (!settingsCard.contains(deleteBtn)) {
                    settingsCard.appendChild(deleteBtn);
                }
            }
        });
    });
    
    // Time option selection
    const timeOptions = document.querySelectorAll('.time-option');
    timeOptions.forEach(option => {
        option.addEventListener('click', function() {
            timeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const selectedTime = this.getAttribute('data-time');
            document.getElementById('selectedTime').value = selectedTime;
            
            if (selectedTime === 'custom') {
                document.getElementById('customTimeGroup').style.display = 'block';
            } else {
                document.getElementById('customTimeGroup').style.display = 'none';
            }
        });
    });
    
    // Dashboard stats
    async function fetchStats() {
        try {
            const res = await fetch('/user/dashboard/stats');
            if (!res.ok) throw new Error('Failed to fetch stats');
            const stats = await res.json();
            document.getElementById('activeAssetsCount').textContent = stats.active;
            document.getElementById('pendingRecoveryCount').textContent = stats.pending;
            document.getElementById('completedCount').textContent = stats.completed;
            document.getElementById('beneficiariesCount').textContent = stats.beneficiaries;
        } catch (err) {
            console.error('Stats error:', err);
        }
    }

    // Asset CRUD
    async function fetchAssets() {
        try {
            const res = await fetch('/user/assets');
            if (!res.ok) throw new Error('Failed to fetch assets');
            const assets = await res.json();
            renderAssets(assets);
        } catch (err) {
            console.error('Asset fetch error:', err);
        }
    }

    function renderAssets(assets) {
        assetsTableBody.innerHTML = '';
        assets.filter(asset => asset.status === 'pending' || asset.status === 'active').forEach(asset => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${asset.title}</td>
                <td>${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</td>
                <td>${asset.beneficiary}</td>
                <td>${new Date(asset.recoveryTime).toLocaleString()}</td>
                <td><span class="status-badge status-${asset.status}">${asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}</span></td>
                <td>
                    <button class="action-btn btn-edit" data-id="${asset._id}">Edit</button>
                    <button class="action-btn btn-delete" data-id="${asset._id}">Delete</button>
                </td>
            `;
            assetsTableBody.appendChild(row);
        });
    }

    // Asset form submission
    const assetForm = document.getElementById('assetForm');
    const assetsTableBody = document.getElementById('assetsTableBody');
    assetForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const title = document.getElementById('assetTitle').value.trim();
        const type = document.getElementById('assetTypeCustom').value.trim();
        const beneficiary = document.getElementById('beneficiaryEmail').value.trim();
        const credentials = document.getElementById('assetCredentials').value.trim();
        const note = document.getElementById('notes').value.trim();
        let recoveryTime = document.getElementById('selectedTime').value;
        if (recoveryTime === 'custom') {
            recoveryTime = document.getElementById('customTime').value;
        }
        let recoveryDate = new Date();
        if (recoveryTime && recoveryTime !== 'custom') {
            if (recoveryTime.includes('minute')) recoveryDate.setMinutes(recoveryDate.getMinutes() + parseInt(recoveryTime));
            else if (recoveryTime.includes('hour')) recoveryDate.setHours(recoveryDate.getHours() + parseInt(recoveryTime));
            else if (recoveryTime.includes('day')) recoveryDate.setDate(recoveryDate.getDate() + parseInt(recoveryTime));
        } else if (recoveryTime) {
            recoveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
        }

        // Frontend validation
        if (!title || !type || !beneficiary || !recoveryTime) {
            alert('Please fill in all required fields and select an asset type.');
            return;
        }

        try {
            const res = await fetch('/user/assets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, type, beneficiary, credentials, note, recoveryTime: recoveryDate })
            });
            if (!res.ok) {
                let msg = 'Failed to add asset.';
                try {
                    const data = await res.json();
                    if (data && data.error) msg = data.error;
                } catch {}
                alert(msg + ' Please check your input and try again.');
                return;
            }
            assetForm.reset();
            fetchAssets();
            fetchStats();
        } catch (err) {
            alert('Something went wrong. Please check your input and try again.');
        }
    });

    // Edit and delete asset
    assetsTableBody.addEventListener('click', async function(e) {
        if (e.target.classList.contains('btn-delete')) {
            const id = e.target.getAttribute('data-id');
            if (confirm('Delete this asset?')) {
                try {
                    const res = await fetch(`/user/assets/${id}`, { method: 'DELETE' });
                    if (!res.ok) throw new Error('Failed to delete asset');
                    fetchAssets();
                    fetchStats();
                } catch (err) {
                    alert('Failed to delete asset: ' + err.message);
                }
                return;
            }
        }
        if (e.target.classList.contains('btn-edit')) {
            const id = e.target.getAttribute('data-id');
            // Find asset in current table (or fetch from backend if needed)
            const row = e.target.closest('tr');
            document.getElementById('editAssetId').value = id;
            document.getElementById('editAssetTitle').value = row.children[0].textContent;
            document.getElementById('editAssetType').value = row.children[1].textContent.toLowerCase();
            document.getElementById('editBeneficiaryEmail').value = row.children[2].textContent;
            // Parse recovery time to datetime-local format
            const recoveryTimeText = row.children[3].textContent;
            let recoveryDate = new Date(recoveryTimeText);
            if (!isNaN(recoveryDate)) {
                // If the input is valid, format for datetime-local
                document.getElementById('editRecoveryTime').value = recoveryDate.toISOString().slice(0,16);
            } else {
                document.getElementById('editRecoveryTime').value = '';
            }
            // Notes are not shown in table, so leave blank
            document.getElementById('editNotes').value = '';
            document.getElementById('editStatus').value = row.children[4].textContent.toLowerCase();
            // Show the modal (use classList.add('show'))
            document.getElementById('editAssetModal').classList.add('show');
        }
    });

    // Edit asset form submission
    document.getElementById('editAssetForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const id = document.getElementById('editAssetId').value;
        const title = document.getElementById('editAssetTitle').value;
        const type = document.getElementById('editAssetType').value;
        const beneficiary = document.getElementById('editBeneficiaryEmail').value;
        const recoveryTime = document.getElementById('editRecoveryTime').value;
        const note = document.getElementById('editNotes').value;
        const status = document.getElementById('editStatus').value;
        try {
            const res = await fetch(`/user/assets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, type, beneficiary, recoveryTime, note, status })
            });
            if (!res.ok) throw new Error('Failed to update asset');
            document.getElementById('editAssetModal').classList.remove('show');
            fetchAssets();
            fetchStats();
        } catch (err) {
            alert('Failed to update asset: ' + err.message);
        }
    });

    // Close/cancel edit modal
    document.getElementById('closeEditModal').addEventListener('click', function() {
        document.getElementById('editAssetModal').classList.remove('show');
    });
    document.getElementById('cancelEdit').addEventListener('click', function() {
        document.getElementById('editAssetModal').classList.remove('show');
    });

    // Initial load
    fetchStats();
    fetchAssets();
    
    // Modal functionality
    const confirmationModal = document.getElementById('confirmationModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    let closeModal = document.getElementById('closeModal');
    let cancelAction = document.getElementById('cancelAction');
    let confirmAction = document.getElementById('confirmAction');
    const closeEditModal = document.getElementById('closeEditModal');
    const cancelEdit = document.getElementById('cancelEdit');
    
    function showConfirmationModal(title, message, confirmCallback, successTitle) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        
        if (successTitle) {
            confirmAction.style.display = 'none';
            cancelAction.textContent = 'OK';
        } else {
            confirmAction.style.display = 'block';
            cancelAction.textContent = 'Cancel';
        }
        
        confirmationModal.classList.add('show');
        
        // Remove previous event listeners
        const newConfirmAction = confirmAction.cloneNode(true);
        confirmAction.parentNode.replaceChild(newConfirmAction, confirmAction);
        confirmAction = newConfirmAction;
        
        const newCancelAction = cancelAction.cloneNode(true);
        cancelAction.parentNode.replaceChild(newCancelAction, cancelAction);
        cancelAction = newCancelAction;
        
        if (confirmCallback) {
            confirmAction.addEventListener('click', function handler() {
                confirmCallback();
                confirmationModal.classList.remove('show');
                confirmAction.removeEventListener('click', handler);
            });
        } else {
            confirmAction.addEventListener('click', function handler() {
                confirmationModal.classList.remove('show');
                confirmAction.removeEventListener('click', handler);
            });
        }
        
        cancelAction.addEventListener('click', function handler() {
            confirmationModal.classList.remove('show');
            cancelAction.removeEventListener('click', handler);
        });
    }
    
    closeModal.addEventListener('click', () => {
        confirmationModal.classList.remove('show');
    });
    
    closeEditModal.addEventListener('click', () => {
        document.getElementById('editAssetModal').classList.remove('show');
    });
    
    cancelEdit.addEventListener('click', () => {
        document.getElementById('editAssetModal').classList.remove('show');
    });
    
    // Quick add button - behave exactly like clicking "My Assets"
    const quickAddBtn = document.getElementById('quickAddBtn');
    quickAddBtn.addEventListener('click', () => {
        const assetsNav = document.querySelector('.nav-item[data-section="assets"]');
        if (assetsNav) {
            // Reuse the same logic as clicking on "My Assets"
            assetsNav.click();
        }
        // Scroll to the top of the page/section so layout matches navbar click
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Crypto particles for decoration
    const cryptoIcons = ['₿', 'Ξ', 'Ł', 'Ƀ', '¤', '₮', '₳'];
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'crypto-particle';
        particle.textContent = cryptoIcons[Math.floor(Math.random() * cryptoIcons.length)];
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particle.style.animationDuration = `${15 + Math.random() * 20}s`;
        document.body.appendChild(particle);
    }

    // Mobile navbar logic — handled by inline toggleDashNav/closeDashNav in EJS
    // No additional mobile JS needed

    // Remove dummy transactions array
    // const transactions = [ ... ];

    async function fetchTransactions() {
      try {
        const res = await fetch('/user/transactions');
        if (!res.ok) throw new Error('Failed to fetch transactions');
        const transactions = await res.json();
        renderTransactionHistory(transactions);
      } catch (err) {
        console.error('Transaction fetch error:', err);
        renderTransactionHistory([]);
      }
    }

    function renderTransactionHistory(transactions) {
      const table = document.getElementById('transactionTable');
      const tbody = document.getElementById('transactionTableBody');
      const emptyState = document.getElementById('transactionHistoryEmpty');
      if (!tbody || !emptyState || !table) return;
      tbody.innerHTML = '';
      if (!transactions || transactions.length === 0) {
        table.style.display = 'none';
        emptyState.style.display = 'flex';
      } else {
        table.style.display = '';
        emptyState.style.display = 'none';
        transactions.forEach(tx => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td data-label="Transaction ID">${tx._id}</td>
            <td data-label="Date">${new Date(tx.transferTime).toLocaleString()}</td>
            <td data-label="Asset Title">${tx.assetTitle}</td>
            <td data-label="Status"><span class="status-badge status-success">Done</span></td>
            <td data-label="Beneficiary">${tx.beneficiary}</td>
          `;
          tbody.appendChild(tr);
        });
      }
    }

    // Call fetchTransactions when showing the history section
    function showSection(section) {
        if (section === 'history') {
            fetchTransactions();
        }
    }

    // Settings: Delete Account and Logout
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    let logoutBtn = document.getElementById('logoutBtn');
    if (deleteAccountBtn) {
      deleteAccountBtn.addEventListener('click', async function() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
          try {
            const res = await fetch('/user/delete-account', { method: 'DELETE' });
            if (res.ok) {
              window.location.href = '/';
            } else {
              alert('Failed to delete account.');
            }
          } catch (err) {
            alert('Error deleting account.');
          }
        }
      });
    }
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async function() {
        try {
          const res = await fetch('/user/logout', { method: 'POST' });
          if (res.ok) {
            window.location.href = '/';
          } else {
            alert('Failed to log out.');
          }
        } catch (err) {
          alert('Error logging out.');
        }
      });
    }

    // Key Backup
    const keyBackupBtn = document.getElementById('keyBackupBtn');
    if (keyBackupBtn) {
      keyBackupBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        keyBackupBtn.disabled = true;
        keyBackupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        try {
          const res = await fetch('/user/key-backup');
          const contentType = res.headers.get('content-type') || '';
          if (!res.ok || !contentType.includes('application/json')) {
            throw new Error('Server did not return backup data. Please make sure you are logged in.');
          }
          const data = await res.json();
          if (!data || !data.assets) {
            throw new Error('Invalid backup data received.');
          }
          const jsonStr = JSON.stringify(data, null, 2);
          const blob = new Blob([jsonStr], { type: 'application/octet-stream' });
          const fileName = 'securechain-key-backup-' + new Date().toISOString().slice(0, 10) + '.json';

          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
          } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = fileName;
            a.setAttribute('download', fileName);
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }, 250);
          }
        } catch (err) {
          alert('Failed to download key backup: ' + err.message);
        } finally {
          keyBackupBtn.disabled = false;
          keyBackupBtn.innerHTML = '<i class="fas fa-download"></i> Download Key Backup';
        }
      });
    }
});
